"""
app.py — Enhanced Flask API with mode control, manual brightness, service
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
from simulation import Simulation

app = Flask(__name__)
CORS(app)

sim = Simulation()
sim.start()

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "nodes": len(sim.lights), "clock": sim.clock_string()})

@app.route("/api/state")
def get_state():
    return jsonify(sim.snapshot())

@app.route("/api/history")
def get_history():
    return jsonify(sim.get_history())

@app.route("/api/lights", methods=["POST"])
def add_light():
    data = request.get_json(silent=True) or {}
    location = (data.get("location") or "New Location").strip() or "New Location"
    light = sim.add_light(location)
    return jsonify(light.to_dict()), 201

@app.route("/api/lights/<int:light_id>", methods=["DELETE"])
def delete_light(light_id):
    sim.remove_light(light_id)
    return jsonify({"deleted": light_id})

@app.route("/api/lights/<int:light_id>/mode", methods=["POST"])
def set_mode(light_id):
    data = request.get_json(silent=True) or {}
    mode = data.get("mode", "AUTO")
    sim.set_mode(light_id, mode)
    return jsonify({"light_id": light_id, "mode": mode})

@app.route("/api/lights/<int:light_id>/brightness", methods=["POST"])
def set_brightness(light_id):
    data = request.get_json(silent=True) or {}
    brightness = data.get("brightness", 50)
    sim.set_manual_brightness(light_id, brightness)
    return jsonify({"light_id": light_id, "brightness": brightness})

@app.route("/api/lights/<int:light_id>/service", methods=["POST"])
def service_light(light_id):
    sim.service_light(light_id)
    return jsonify({"light_id": light_id, "serviced": True})

@app.route("/api/control/speed", methods=["POST"])
def set_speed():
    data = request.get_json(silent=True) or {}
    minutes = data.get("minutes_per_tick", 6)
    sim.set_speed(minutes)
    return jsonify({"minutes_per_tick": sim.minutes_per_tick})

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)