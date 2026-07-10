"""
energy_tracker.py — Enhanced with eco tracking
"""

class EnergyTracker:
    @staticmethod
    def apply(light, is_active, hours_elapsed):
        actual_kw = (light.power_watts * (light.brightness / 100)) / 1000
        light.actual_kwh += actual_kw * hours_elapsed

        # Baseline = always on at 100% when dark
        if is_active:
            baseline_kw = light.power_watts / 1000
            light.baseline_kwh += baseline_kw * hours_elapsed

        # Eco baseline = always on at 40% when dark
        if is_active:
            eco_kw = (light.power_watts * 0.4) / 1000
            light.eco_kwh += eco_kw * hours_elapsed

    @staticmethod
    def summary(lights):
        lights = list(lights)
        total_actual = sum(l.actual_kwh for l in lights)
        total_baseline = sum(l.baseline_kwh for l in lights)
        total_eco = sum(l.eco_kwh for l in lights)

        savings_vs_baseline = 0.0
        savings_vs_eco = 0.0
        if total_baseline > 0:
            savings_vs_baseline = ((total_baseline - total_actual) / total_baseline) * 100
        if total_eco > 0:
            savings_vs_eco = ((total_eco - total_actual) / total_eco) * 100

        return {
            "total_actual_kwh": round(total_actual, 4),
            "total_baseline_kwh": round(total_baseline, 4),
            "total_eco_kwh": round(total_eco, 4),
            "savings_vs_baseline": round(savings_vs_baseline, 2),
            "savings_vs_eco": round(savings_vs_eco, 2),
            "avg_health": round(sum(l.health for l in lights) / len(lights), 1) if lights else 0,
            "faulty_nodes": sum(1 for l in lights if not l.operational),
        }