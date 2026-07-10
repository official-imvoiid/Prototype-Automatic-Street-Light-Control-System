"""
simulation.py — Enhanced simulation with weather, traffic, modes
"""
import threading
import time

from models import StreetLight
from sensor_simulator import SensorSimulator
from decision_engine import decide
from energy_tracker import EnergyTracker

DEFAULT_LOCATIONS = [
    "Main Street & 1st Ave", "Park Avenue Bridge", "Highway Exit 4 North", 
    "Campus Gate West", "Downtown Plaza", "Riverside Walk", 
    "Industrial Zone B", "Hospital Drive"
]

class Simulation:
    def __init__(self):
        self.lock = threading.RLock()
        self.sensor = SensorSimulator()

        self.lights = {}
        self._next_id = 1

        self.sim_minutes = 6 * 60
        self.minutes_per_tick = 6
        self.tick_interval_seconds = 1.0
        self.day_count = 0

        self.history = []
        self.max_history = 180
        self.weather_log = []
        self.max_weather_log = 50

        self._running = False
        self._thread = None

        for loc in DEFAULT_LOCATIONS:
            self.add_light(loc)

    def add_light(self, location, **kwargs):
        with self.lock:
            light_id = self._next_id
            self._next_id += 1
            light = StreetLight(light_id, location, **kwargs)
            self.lights[light_id] = light
            return light

    def remove_light(self, light_id):
        with self.lock:
            self.lights.pop(light_id, None)

    def set_speed(self, minutes_per_tick):
        with self.lock:
            self.minutes_per_tick = max(1, min(120, int(minutes_per_tick)))

    def set_mode(self, light_id, mode):
        with self.lock:
            if light_id in self.lights:
                self.lights[light_id].mode = mode

    def set_manual_brightness(self, light_id, brightness):
        with self.lock:
            if light_id in self.lights:
                self.lights[light_id].manual_brightness = max(0, min(100, int(brightness)))

    def service_light(self, light_id):
        with self.lock:
            if light_id in self.lights:
                l = self.lights[light_id]
                l.health = 100
                l.fault_count = 0
                l.operational = True
                l.last_service_days = 0

    def _hour_of_day(self):
        return (self.sim_minutes % 1440) / 60

    def clock_string(self):
        hour = int(self.sim_minutes // 60) % 24
        minute = int(self.sim_minutes % 60)
        return f"{hour:02d}:{minute:02d}"

    def tick(self):
        with self.lock:
            hour = self._hour_of_day()
            hours_elapsed = self.minutes_per_tick / 60
            light_level = self.sensor.light_level(hour)
            weather = self.sensor.weather(hour)
            temp = self.sensor.temperature(hour)

            for light in self.lights.values():
                motion = self.sensor.motion(hour)
                pedestrian = self.sensor.pedestrian(hour)
                traffic = self.sensor.traffic_density(hour)
                light.humidity = self.sensor.humidity(hour, weather)

                _, _, is_active = decide(light, light_level, motion, traffic, weather, temp, pedestrian)
                EnergyTracker.apply(light, is_active, hours_elapsed)
                light.last_service_days += hours_elapsed / 24

            summary = EnergyTracker.summary(self.lights.values())
            avg_brightness = 0
            if self.lights:
                avg_brightness = sum(l.brightness for l in self.lights.values()) / len(self.lights)

            self.history.append({
                "clock": self.clock_string(),
                "day": self.day_count,
                "total_actual_kwh": summary["total_actual_kwh"],
                "total_baseline_kwh": summary["total_baseline_kwh"],
                "avg_brightness": round(avg_brightness, 1),
            })
            if len(self.history) > self.max_history:
                self.history.pop(0)

            self.weather_log.append({
                "clock": self.clock_string(),
                "weather": weather,
                "temperature": round(temp, 1),
            })
            if len(self.weather_log) > self.max_weather_log:
                self.weather_log.pop(0)

            self.sim_minutes += self.minutes_per_tick
            if self.sim_minutes >= 1440:
                self.sim_minutes %= 1440
                self.day_count += 1

    def snapshot(self):
        with self.lock:
            weather = self.sensor.weather(self._hour_of_day())
            return {
                "clock": self.clock_string(),
                "day_count": self.day_count,
                "is_day": self.sensor.light_level(self._hour_of_day()) >= 30,
                "weather": weather,
                "temperature": round(self.sensor.temperature(self._hour_of_day()), 1),
                "minutes_per_tick": self.minutes_per_tick,
                "lights": [l.to_dict() for l in self.lights.values()],
                "energy": EnergyTracker.summary(self.lights.values()),
                "weather_log": list(self.weather_log),
            }

    def get_history(self):
        with self.lock:
            return list(self.history)

    def start(self):
        if self._running:
            return
        self._running = True
        def loop():
            while self._running:
                self.tick()
                time.sleep(self.tick_interval_seconds)
        self._thread = threading.Thread(target=loop, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False