import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import matplotlib.transforms as transforms
import numpy as np

def get_oge_hover_ceiling(gross_weight_lb, oat_c):
    """
    Calculates the OGE hover ceiling (Pressure Altitude in feet) based on 
    gross weight and Outside Air Temperature (OAT).
    
    Parameters:
    gross_weight_lb (float): Gross weight in pounds.
    oat_c (float): Outside Air Temperature in Celsius.
    
    Returns:
    float: Pressure altitude in feet. Returns None if inputs are out of bounds.
    """
    
    # Digitized data from the chart: {OAT_C: [(Weight_LB, Pressure_Alt_Ft), ...]}
    # Note: These points represent the curves as accurately as possible from the image.
    chart_data = {
        -30: [(1984, 14000), (2094, 13000), (2205, 11800), (2315, 10200), (2425, 8000)],
        -20: [(1984, 13000), (2094, 12000), (2205, 10800), (2315, 9200),  (2403, 7300)],
        -10: [(1984, 12000), (2094, 11000), (2205, 9800),  (2315, 8200),  (2359, 7000)],
          0: [(1940, 11500), (2094, 10000), (2205, 8800),  (2315, 7000),  (2315, 5500)],
         10: [(1918, 10800), (2094, 9000),  (2205, 7800),  (2271, 6500),  (2293, 4800)],
         20: [(1896, 10000), (2094, 8000),  (2205, 6800),  (2227, 5800),  (2249, 4200)],
         30: [(1874, 9200),  (2094, 7000),  (2161, 6000),  (2205, 4800),  (2205, 3800)],
         40: [(1852, 8000),  (2028, 6000),  (2094, 4800),  (2116, 3500),  (2161, 2000)]
    }

    temps = sorted(chart_data.keys())

    # Check bounds for temperature
    if oat_c < temps[0] or oat_c > temps[-1]:
        print(f"Error: Temperature {oat_c}°C is outside the chart's range ({temps[0]} to {temps[-1]}°C).")
        return None

    # Find the two temperature curves that bracket the input OAT
    if oat_c in chart_data:
        t_low = t_high = oat_c
    else:
        for i in range(len(temps) - 1):
            if temps[i] <= oat_c <= temps[i+1]:
                t_low = temps[i]
                t_high = temps[i+1]
                break

    # Helper function to interpolate altitude for a specific temperature curve
    def interp_alt_for_temp(temp, weight):
        points = chart_data[temp]
        weights = [p[0] for p in points]
        alts = [p[1] for p in points]
        
        # Check weight bounds for this specific curve
        if weight < weights[0] or weight > weights[-1]:
            # Allow slight extrapolation or return None depending on strictness
            # Here we clip to the curve's max/min weight to prevent wild extrapolation
            weight = max(min(weight, weights[-1]), weights[0])
            
        # Note: Weights are increasing, but Altitudes are decreasing. 
        # np.interp expects x to be increasing. So we reverse the arrays.
        return np.interp(weight, weights[::-1], alts[::-1])

    # Calculate altitudes at the bounding temperatures
    if t_low == t_high:
        final_alt = interp_alt_for_temp(t_low, gross_weight_lb)
    else:
        alt_low = interp_alt_for_temp(t_low, gross_weight_lb)
        alt_high = interp_alt_for_temp(t_high, gross_weight_lb)
        
        # Interpolate between the two temperature curves
        temp_fraction = (oat_c - t_low) / (t_high - t_low)
        final_alt = alt_low + temp_fraction * (alt_high - alt_low)

    return round(final_alt, -1) # Round to nearest 10 ft for realistic precision

# # --- Example Usage ---

# # 1. The example from the previous prompt: 25°C and 2350 lbs
# weight_input = 2350
# temp_input = 25
# limit = get_oge_hover_ceiling(weight_input, temp_input)
# print(f"OGE Hover Limit for {weight_input} lbs at {temp_input}°C: {limit} ft")

# # 2. Test a point directly on a known curve: 0°C and 2205 lbs (should be ~8800 ft)
# print(f"OGE Hover Limit for 2205 lbs at 0°C: {get_oge_hover_ceiling(2205, 0)} ft")

# # 3. Test a cold day: -25°C and 2100 lbs
# print(f"OGE Hover Limit for 2100 lbs at -25°C: {get_oge_hover_ceiling(2100, -25)} ft")



def plot_digitized_chart():
    # Digitized data from the previous response: {OAT_C: [(Weight_LB, Pressure_Alt_Ft), ...]}
    chart_data = {
        -30: [(1984, 14000), (2094, 13000), (2205, 11800), (2315, 10200), (2425, 8000)],
        -20: [(1984, 13000), (2094, 12000), (2205, 10800), (2315, 9200),  (2403, 7300)],
        -10: [(1984, 12000), (2094, 11000), (2205, 9800),  (2315, 8200),  (2359, 7000)],
          0: [(1940, 11500), (2094, 10000), (2205, 8800),  (2315, 7000),  (2315, 5500)],
         10: [(1918, 10800), (2094, 9000),  (2205, 7800),  (2271, 6500),  (2293, 4800)],
         20: [(1896, 10000), (2094, 8000),  (2205, 6800),  (2227, 5800),  (2249, 4200)],
         30: [(1874, 9200),  (2094, 7000),  (2161, 6000),  (2205, 4800),  (2205, 3800)],
         40: [(1852, 8000),  (2028, 6000),  (2094, 4800),  (2116, 3500),  (2161, 2000)]
    }

    fig, ax = plt.subplots(figsize=(8, 10))
    
    # Plot each temperature line
    for temp, points in chart_data.items():
        weights = [p[0] for p in points]
        alts = [p[1] for p in points]
        
        # Plot the line
        ax.plot(weights, alts, marker='o', label=f'{temp}°C')
        
        # Add label at the end of the line (or near the start)
        ax.text(weights[-1] + 10, alts[-1], f'{temp}°C', fontsize=9, va='center')

    # Formatting the plot to match the original chart's layout
    ax.set_title("OGE HOVER CEILING VS. GROSS WEIGHT\n(Digitized Verification)", fontsize=12)
    
    # X-axis
    ax.set_xlabel("GROSS WEIGHT - LB", fontsize=10)
    ax.set_xlim(1700, 2500)
    
    # Y-axis
    ax.set_ylabel("PRESSURE ALTITUDE - FT x 1000", fontsize=10)
    ax.set_ylim(0, 14000)
    
    # Grid
    ax.grid(True, which='both', linestyle='-', linewidth=0.5)
    
    # Secondary X-axis for KG (Top) - approximation: 1 kg = 2.20462 lb
    # Note: The original chart's top axis is not perfectly linear with the bottom, 
    # but we can approximate it for visual comparison.
    def lb_to_kg(lb):
        return lb / 2.20462
    
    def kg_to_lb(kg):
        return kg * 2.20462

    secax = ax.secondary_xaxis('top', functions=(lb_to_kg, kg_to_lb))
    secax.set_xlabel('GROSS WEIGHT - KG', fontsize=10)

    plt.tight_layout()
    plt.show()

def plot_over_image(image_path):
    # --- 1. Load the Image ---
    try:
        img = mpimg.imread(image_path)
    except FileNotFoundError:
        print(f"Error: Could not find the image at '{image_path}'. Please ensure the file is in the same directory.")
        return

    fig, ax = plt.subplots(figsize=(10, 14))
    ax.imshow(img, cmap='gray')

    # --- 2. Define the Data Space ---
    # Based on the chart's axes:
    # X-axis: 1700 to 2500 (LB)
    # Y-axis: 0 to 14000 (FT)
    data_xlim = [1700, 2500]
    data_ylim = [0, 14000]

    # --- 3. Define the Pixel Space ---
    # These are the pixel coordinates of the INNER corners of the graph box.
    # (0,0) is top-left. x increases right, y increases down.
    # NOTE: If these don't align perfectly, you can tweak these numbers.
    # Format: [x_left, x_right], [y_top, y_bottom]
    pixel_xlim = [93, 585]   # Left edge of graph box, Right edge of graph box
    pixel_ylim = [155, 1018]  # Top edge of graph box, Bottom edge of graph box

    # --- 4. Create the Transformation ---
    # We need to map:
    # Data X (1700 -> 2500) to Pixel X (145 -> 925)
    # Data Y (0 -> 14000)   to Pixel Y (1245 -> 185)  <-- Note Y is inverted for images!

    def data_to_pixel(x, y):
        # Map X
        px = np.interp(x, data_xlim, pixel_xlim)
        # Map Y (0 is at the bottom of the graph, which is a higher pixel number)
        py = np.interp(y, data_ylim, [pixel_ylim[1], pixel_ylim[0]]) 
        return px, py

    # --- 5. Plot the Digitized Data ---
    chart_data = {
        -30: [(1900, 14000), (1990, 13000), (2070, 12000), (2150, 11000), (2245, 10000), (2340, 9000), (2425, 8000), (2500, 7200)],
        -20: [(1935, 13000), (2010, 12000), (2100, 11000), (2190, 10000),  (2275, 9000), (2360, 8000), (2455, 7000), (2500, 6600)],
        -10: [(1965, 12020), (2050, 11000), (2135, 10000),  (2215, 9000),  (2302, 8000), (2397, 7000), (2500, 5950)],
          0: [(1990, 11050), (2094, 10000), (2205, 8800),  (2315, 7000),  (2315, 5500), (2500, 4950)],
         10: [(2020, 10100), (2094, 9000),  (2205, 7800),  (2271, 6500),  (2293, 4800), (2500, 3900)],
         20: [(2045, 9150), (2094, 8000),  (2205, 6800),  (2227, 5800),  (2249, 4200), (2500, 2800)],
         30: [(2080, 8200),  (2094, 7000),  (2161, 6000),  (2205, 4800),  (2205, 3800), (2500, 1900)],
         40: [(2100, 7350),  (2028, 6000),  (2094, 4800),  (2116, 3500),  (2161, 2000), (2500, 950)]
    }

    colors = plt.cm.jet(np.linspace(0, 1, len(chart_data)))

    for i, (temp, points) in enumerate(chart_data.items()):
        pixel_points = [data_to_pixel(w, a) for w, a in points]
        px_vals = [p[0] for p in pixel_points]
        py_vals = [p[1] for p in pixel_points]
        
        # Plot the digitized line on top of the image
        ax.plot(px_vals, py_vals, color='red', linewidth=2, marker='o', markersize=5, label=f'Digitized {temp}°C')
        
        # Add a small label
        ax.text(px_vals[-1] + 5, py_vals[-1], f'{temp}°C', color='red', fontsize=10, fontweight='bold')

    # --- 6. Draw a Test Grid to verify alignment ---
    # Let's draw vertical lines every 100 lbs and horizontal lines every 1000 ft
    for weight in range(1700, 2600, 100):
        px, _ = data_to_pixel(weight, 0)
        ax.axvline(px, color='cyan', linestyle='--', alpha=0.5, linewidth=1)

    for alt in range(0, 15000, 1000):
        _, py = data_to_pixel(0, alt)
        ax.axhline(py, color='cyan', linestyle='--', alpha=0.5, linewidth=1)

    ax.set_title("Overlay Verification: Digitized Data vs Original Image", fontsize=14)
    ax.legend(loc='upper right')
    ax.axis('off') # Hide the matplotlib axes since we are using the image's axes
    
    plt.tight_layout()
    plt.show()

# # Run the function
# # IMPORTANT: Save the image you provided to your computer as 'chart.png' 
# # and put it in the same folder as this script, or update the path below.
# plot_over_image('chart.png')

if __name__ == "__main__":
    plot_digitized_chart()