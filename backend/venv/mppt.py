def enhanced_po_mppt(voltage, current):
    if len(voltage) != len(current):
        raise ValueError("Voltage and current lists must be the same length.")

    power = [v * i for v, i in zip(voltage, current)]
    duty_cycle = [0.5]
    step_sizes = [0.01]

    for i in range(1, len(voltage)):
        delta_p = power[i] - power[i - 1]
        delta_v = voltage[i] - voltage[i - 1]

        if delta_p * delta_v > 0:
            step = step_sizes[-1] * 1.05
        else:
            step = step_sizes[-1] * 0.5

        new_duty = duty_cycle[-1] + step if delta_p > 0 else duty_cycle[-1] - step
        new_duty = max(0, min(1, new_duty))

        duty_cycle.append(new_duty)
        step_sizes.append(step)

    # --- Analysis Metrics ---
    max_power = max(power)
    avg_power = sum(power) / len(power)
    overshoot = max(power) - avg_power

    # Settling time: find first point where power stays within 2% of max
    epsilon = 0.02 * max_power
    settling_time = next((i for i, p in enumerate(power) if abs(p - max_power) < epsilon), len(power) - 1)

    efficiency = round((avg_power / max_power) * 100, 2)

    return {
        "voltage": voltage,
        "current": current,
        "power": power,
        "duty_cycle": duty_cycle,
        "step_size": step_sizes,
        "pv_curve": power,
        "iv_curve": list(zip(voltage, current)),
        "overshoot_trace": [p - avg_power for p in power],
        "efficiency_trace": [((p / max_power) * 100) for p in power],
        "settling_time_trace": [1 if abs(p - max_power) < epsilon else 0 for p in power],
        "metrics": {
            "efficiency_percent": efficiency,
            "settling_time_index": settling_time,
            "overshoot_watt": round(overshoot, 2)
        }
    }
