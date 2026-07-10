"""
decision_engine.py — Smart decision logic with weather, traffic, modes
"""
from models import StreetLight

def decide(light: StreetLight, light_level: float, motion: bool, 
           traffic: str, weather: str, temp: float, pedestrian: bool):
    """
    Enhanced decision engine supporting:
    - Weather conditions (fog, storm, rain)
    - Traffic density (low/medium/high)
    - Pedestrian zones
    - Multiple control modes (AUTO, MANUAL, ECO, EMERGENCY)
    - Maintenance degradation
    """
    light.light_level = light_level
    light.motion_detected = motion
    light.traffic_density = traffic
    light.weather = weather
    light.temperature = temp
    light.pedestrian_zone_active = pedestrian

    # Health degradation
    if light.health > 0:
        light.health -= 0.001
    light.uptime_hours += 0.1

    # Fault simulation
    if light.health < 30 and light.fault_count == 0:
        light.fault_count = 1
        light.operational = False
    elif light.health > 50:
        light.operational = True

    # EMERGENCY mode — force full brightness regardless
    if light.mode == StreetLight.MODE_EMERGENCY:
        light.status = StreetLight.STATUS_EMERGENCY
        light.brightness = 100
        return light.status, light.brightness, True

    # MANUAL mode — use manual brightness
    if light.mode == StreetLight.MODE_MANUAL:
        light.status = StreetLight.STATUS_NIGHT_ACTIVE if light.manual_brightness > 0 else StreetLight.STATUS_DAY
        light.brightness = light.manual_brightness
        return light.status, light.brightness, light.manual_brightness > 0

    # Weather-based overrides (even in daytime)
    if weather == "STORM":
        light.status = StreetLight.STATUS_STORM
        light.brightness = 85
        return light.status, light.brightness, True
    
    if weather == "FOGGY":
        is_dark = light_level < 50  # fog lowers visibility threshold
    else:
        is_dark = light_level < light.dark_threshold

    if not is_dark and weather not in ["FOGGY", "RAIN"]:
        light.status = StreetLight.STATUS_DAY
        light.brightness = 0
        return light.status, light.brightness, False

    # Night / low-light logic
    base_brightness = light.idle_brightness

    # Weather adjustments
    if weather == "FOGGY":
        base_brightness = max(base_brightness, 40)
        light.status = StreetLight.STATUS_FOGGY
    elif weather == "RAIN":
        base_brightness = max(base_brightness, 35)
        light.status = StreetLight.STATUS_NIGHT_IDLE
    else:
        light.status = StreetLight.STATUS_NIGHT_IDLE

    # Traffic density boost
    traffic_boost = {"LOW": 0, "MEDIUM": 20, "HIGH": 45}
    base_brightness += traffic_boost.get(traffic, 0)

    # Motion / pedestrian boost
    if motion or pedestrian:
        light.status = StreetLight.STATUS_NIGHT_ACTIVE
        base_brightness = 100

    # ECO mode caps brightness
    if light.mode == StreetLight.MODE_ECO:
        base_brightness = min(base_brightness, 60)
        if light.status == StreetLight.STATUS_NIGHT_ACTIVE:
            light.status = StreetLight.STATUS_NIGHT_IDLE

    light.brightness = min(100, max(0, int(base_brightness)))
    
    # Maintenance penalty
    if not light.operational:
        light.brightness = int(light.brightness * 0.3)
        light.status = StreetLight.STATUS_MAINTENANCE

    return light.status, light.brightness, is_dark or weather in ["FOGGY", "RAIN", "STORM"]