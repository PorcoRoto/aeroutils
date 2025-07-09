import pandas as pd
import numpy as np


class TopOfClimbCalculator:
    def __init__(self):
        self.timefueldistancetable = pd.DataFrame

    def ingesttimefueldistancetable(self, filename):
        self.timefueldistancetable = pd.read_csv(filename)

    def setfieldpressurealtitude(self, altitude):
        self.fieldpressurealt = altitude
        self.interpolatefieldaltvalues()

    def setcruisepressurealtitude(self, altitude):
        self.cruisepressurealt = altitude
        
    def interpolatefieldaltvalues(self):
        self.fieldtimefromSL = \
            self.interpolatefrompressurealt(self.fieldpressurealt,
                                            'timefromSL_min')
        
    def interpolatefrompressurealt(self, altitude, tableparameter):
        interpolatedvalue = np.interp(altitude, list(self.timefueldistancetable['PressureAlt_feet']),
                                      list(self.timefueldistancetable[tableparameter]))
        return interpolatedvalue
        


def test_topofclimbcalculator():
    practicetoc = TopOfClimbCalculator()
    practicetoc.ingesttimefueldistancetable('c172_climbtfdtable5-6.csv')
    assert len(practicetoc.timefueldistancetable) == 13
    fieldpa = 5355
    practicetoc.setfieldpressurealtitude(fieldpa)
    assert practicetoc.fieldpressurealt == fieldpa
    cruisepa = 8500
    practicetoc.setcruisepressurealtitude(cruisepa)
    assert practicetoc.cruisepressurealt == cruisepa
    practicetoc.interpolatefieldaltvalues()
    assert practicetoc.fieldtimefromSL == 8.71
