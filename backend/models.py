"""
models.py — Enhanced StreetLight with maintenance, weather, traffic, modes
"""
import time

class StreetLight:
    STATUS_DAY = "DAY"
    STATUS_NIGHT_IDLE = "NIGHT_IDLE"
    STATUS_NIGHT_ACTIVE = "NIGHT_ACTIVE"
    STATUS_FOGGY = "FOGGY"
    STATUS_STORM = "STORM"
    STATUS_MAINTENANCE = "MAINTENANCE"
    STATUS_EMERGENCY = "EMERGENCY"

    MODE_AUTO = "AUTO"
    MODE_MANUAL = "MANUAL"
    MODE_ECO = "ECO"
    MODE_EMERGENCY = "EMERGENCY"

    def __init__(self, light_id, location, dark_threshold=30, idle_brightness=18, 
                 power_watts=150, health=100, last_service_days=0):
        self.id = light_id
        self.location = location
        self.dark_threshold = dark_threshold
        self.idle_brightness = idle_brightness
        self.power_watts = power_watts

        # Live sensors
        self.light_level = 100.0
        self.motion_detected = False
        self.traffic_density = "LOW"  # LOW, MEDIUM, HIGH
        self.pedestrian_zone_active = False
        self.weather = "CLEAR"  # CLEAR, FOGGY, RAIN, STORM
        self.temperature = 22.0
        self.humidity = 60.0

        # State
        self.status = self.STATUS_DAY
        self.brightness = 0
        self.mode = self.MODE_AUTO
        self.manual_brightness = 50  # for manual mode

        # Maintenance
        self.health = health  # 0-100%
        self.uptime_hours = 0.0
        self.last_service_days = last_service_days
        self.fault_count = 0
        self.operational = True

        # Energy
        self.actual_kwh = 0.0
        self.baseline_kwh = 0.0
        self.eco_kwh = 0.0  # what pure eco mode would use

    def to_dict(self):
        return {
            "id": self.id,
            "location": self.location,
            "status": self.status,
            "brightness": self.brightness,
            "mode": self.mode,
            "manual_brightness": self.manual_brightness,
            "light_level": round(self.light_level, 1),
            "motion_detected": self.motion_detected,
            "traffic_density": self.traffic_density,
            "pedestrian_zone_active": self.pedestrian_zone_active,
            "weather": self.weather,
            "temperature": round(self.temperature, 1),
            "humidity": round(self.humidity, 1),
            "dark_threshold": self.dark_threshold,
            "idle_brightness": self.idle_brightness,
            "power_watts": self.power_watts,
            "health": round(self.health, 1),
            "uptime_hours": round(self.uptime_hours, 1),
            "last_service_days": self.last_service_days,
            "fault_count": self.fault_count,
            "operational": self.operational,
            "actual_kwh": round(self.actual_kwh, 4),
            "baseline_kwh": round(self.baseline_kwh, 4),
            "eco_kwh": round(self.eco_kwh, 4),
        }