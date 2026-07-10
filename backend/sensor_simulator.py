"""
sensor_simulator.py — Enhanced with weather, traffic, pedestrian, temperature
"""
import math
import random

class SensorSimulator:
    def __init__(self, seed=None):
        self._rng = random.Random(seed)
        self._weather_state = "CLEAR"
        self._weather_timer = 0
        self._traffic_pattern = []

    def light_level(self, hour_of_day):
        value = 50 * (1 + math.cos(2 * math.pi * (hour_of_day - 12) / 24))
        return max(0.0, min(100.0, value))

    def weather(self, hour_of_day):
        """Weather transitions with persistence"""
        self._weather_timer -= 1
        if self._weather_timer <= 0:
            # Pick new weather with weighted probabilities
            weights = [("CLEAR", 0.55), ("FOGGY", 0.15), ("RAIN", 0.20), ("STORM", 0.10)]
            self._weather_state = self._rng.choices([w[0] for w in weights], weights=[w[1] for w in weights])[0]
            self._weather_timer = self._rng.randint(10, 40)  # ticks of weather persistence
        return self._weather_state

    def temperature(self, hour_of_day):
        base = 20 + 8 * math.sin(2 * math.pi * (hour_of_day - 14) / 24)
        noise = self._rng.gauss(0, 2)
        return base + noise

    def humidity(self, hour_of_day, weather):
        base = 50
        if weather == "RAIN": base = 85
        elif weather == "FOGGY": base = 90
        elif weather == "STORM": base = 80
        elif weather == "CLEAR": base = 45
        return base + self._rng.gauss(0, 5)

    def motion(self, hour_of_day):
        if 18 <= hour_of_day <= 23 or 5 <= hour_of_day <= 8:
            probability = 0.35
        elif hour_of_day > 23 or hour_of_day < 5:
            probability = 0.08
        else:
            probability = 0.20
        return self._rng.random() < probability

    def pedestrian(self, hour_of_day):
        """Pedestrian zone activity (sidewalks, crossings)"""
        if 7 <= hour_of_day <= 9 or 17 <= hour_of_day <= 21:
            return self._rng.random() < 0.5
        elif 22 <= hour_of_day <= 6:
            return self._rng.random() < 0.05
        return self._rng.random() < 0.25

    def traffic_density(self, hour_of_day):
        """Traffic density: LOW, MEDIUM, HIGH"""
        if 7 <= hour_of_day <= 9 or 17 <= hour_of_day <= 20:
            weights = [("LOW", 0.1), ("MEDIUM", 0.3), ("HIGH", 0.6)]
        elif 22 <= hour_of_day <= 5:
            weights = [("LOW", 0.8), ("MEDIUM", 0.15), ("HIGH", 0.05)]
        else:
            weights = [("LOW", 0.3), ("MEDIUM", 0.5), ("HIGH", 0.2)]
        return self._rng.choices([w[0] for w in weights], weights=[w[1] for w in weights])[0]