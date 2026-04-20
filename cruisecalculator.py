import pandas as pd
import numpy as np


class CruiseCalculator:
    def __init__(self, table_file, pressure_alt):
        self.table = pd.read_csv(table_file)
        self.pa = pressure_alt
        self.calc_pa_interp()
        
    def calc_pa_interp(self):
        table_alts = self.table['Pressure Alt'].unique()
        upper_idx = np.searchsorted(table_alts, self.pa, side='right')
        self.altitude_lower = table_alts[upper_idx - 1]
        self.altitude_upper = table_alts[upper_idx]
        self.altitude_interp_pct = (self.pa - self.altitude_lower) / (self.altitude_upper - self.altitude_lower)
        