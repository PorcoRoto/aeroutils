import pandas as pd
import numpy as np


class TopOfClimbCalculator:
    def __init__(self):
        self.tfdtable = pd.DataFrame

    def ingesttimefueldistancetable(self, filename):
        self.tfdtable = pd.read_csv(filename)

    def setfieldpressurealtitude(self, altitude):
        self.fieldpressurealt = altitude
        self.interpolatefieldaltvalues()

    def setcruisepressurealtitude(self, altitude):
        self.cruisepressurealt = altitude
        
    def interpolatefieldaltvalues(self):
        self.fieldtime = \
            np.round(self.interpolatefrompressurealt(self.fieldpressurealt,
                                            'timefromSL_min'), 3)
        self.fieldfuel = \
            np.round(self.interpolatefrompressurealt(self.fieldpressurealt,
                                            'fuelfromSL_gal'), 3)
        self.fielddistance = \
            np.round(self.interpolatefrompressurealt(self.fieldpressurealt,
                                            'distancefromSL_NM'), 3)
        
        
    def interpolatefrompressurealt(self, altitude, tableparameter):
        interpolatedvalue = np.interp(altitude, list(self.tfdtable['PressureAlt_feet']),
                                      list(self.tfdtable[tableparameter]))
        return interpolatedvalue
        


def test_topofclimbcalculator():
    practicetoc = TopOfClimbCalculator()
    practicetoc.ingesttimefueldistancetable('c172_climbtfdtable5-6.csv')
    assert len(practicetoc.tfdtable) == 13
    fieldpa = 5355
    practicetoc.setfieldpressurealtitude(fieldpa)
    assert practicetoc.fieldpressurealt == fieldpa
    cruisepa = 8500
    practicetoc.setcruisepressurealtitude(cruisepa)
    assert practicetoc.cruisepressurealt == cruisepa
    practicetoc.interpolatefieldaltvalues()
    assert practicetoc.fieldtime == 8.71
    assert practicetoc.fieldfuel == 1.707
    assert practicetoc.fielddistance == 10.71
