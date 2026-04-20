import flightutils
from cruisecalculator import CruiseCalculator
import pandas as pd
import pytest

file_for_test = 'C172N_cruise_performance_table_fig5_7.csv'
cpt = pd.read_csv(file_for_test)

cruise = CruiseCalculator(file_for_test, 3500)

@pytest.mark.filterwarnings('ignore: Boolean Series')
def test_file_import():
    assert cruise.table[cruise.table['Pressure Alt'] == 2000]\
        [cruise.table['RPM'] == 2100]['p20 ktas'].to_numpy()[0] == 93
    assert cruise.table[cruise.table['Pressure Alt'] == 4000]\
        [cruise.table['RPM'] == 2300]['stp pct bhp'].to_numpy()[0] == 57

def test_altitude_interp():
    assert cruise.altitude_lower == 2000
    assert cruise.altitude_upper == 4000
    assert cruise.altitude_interp_pct == .75