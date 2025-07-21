import pandas as pd
import numpy as np
import flightutils as fu


class TopOfClimbCalculator:
    def __init__(self, tfdfilename='c172_climbtfdtable5-6.csv'):
        self.tfdtable = pd.DataFrame
        self.ingesttimefueldistancetable(tfdfilename)

    def ingesttimefueldistancetable(self, filename):
        self.tfdtable = pd.read_csv(filename)

    def toccalc(self, fieldalt, cruisealt, baro):
        self.setbaro(baro)
        self.setfieldaltitude(fieldalt)
        self.setcruisealtitude(cruisealt)
        self.calculateclimb()

    def setfieldaltitude(self, altitude):
        self.fieldaltitude = altitude
        self.setfieldpressurealtitude()

    def setcruisealtitude(self, altitude):
        self.cruisealtitude = altitude
        self.setcruisepressurealtitude()

    def setbaro(self, baro):
        self.baro = baro

    def setfieldpressurealtitude(self):
        pa = fu.calculatepafrombaro(self.fieldaltitude, self.baro)
        self.fieldpressurealt = pa
        print(f'field pressure altitude is {self.fieldpressurealt:.0f}')
        self.interpolatefieldaltvalues()

    def setcruisepressurealtitude(self):
        pa = fu.calculatepafrombaro(self.cruisealtitude, self.baro)
        self.cruisepressurealt = pa
        print(f'cruise pressure altitude is {self.cruisepressurealt:.0f}')
        self.interpolatecruisealtvalues()

    def calculateclimb(self):
        self.climbtime = np.round(self.cruisetime - self.fieldtime, 3)
        self.climbfuel = np.round(self.cruisefuel - self.fieldfuel, 2)
        self.climbdistance = np.round(self.cruisedistance -
                                      self.fielddistance, 2)
        self.climbmaxrate = np.round(np.average([self.cruiseclimbrate,
                                                 self.fieldclimbrate]), 0)
        self.climbmaxratespeed = np.round(np.average([self.cruiseclimbspeed,
                                                      self.fieldclimbspeed]),
                                          1)
        print(f'Climb values: \n'
              f'Time: {self.climbtime:.1f} min\n'
              f'Fuel: {self.climbfuel:.1f} gal\n'
              f'Distance: {self.climbdistance:.1f} NM\n'
              f'Max rate of climb is {self.climbmaxrate:.1f} at '
              f'{self.climbmaxratespeed:.1f} KIAS')

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
        self.fieldclimbrate = \
            np.round(self.interpolatefrompressurealt(self.fieldpressurealt,
                                                     'Rateofclimb_fpm'), 3)
        self.fieldclimbspeed = \
            np.round(self.interpolatefrompressurealt(self.fieldpressurealt,
                                                     'Climbspeed_KIAS'), 3)
        print(f'Field values: \n'
              f'Time: {self.fieldtime:.1f} min\n'
              f'Fuel: {self.fieldfuel:.1f} gal\n'
              f'Distance: {self.fielddistance:.1f} NM\n'
              f'Max rate of climb is {self.fieldclimbrate:.1f} at '
              f'{self.fieldclimbspeed:.1f} KIAS')

    def interpolatecruisealtvalues(self):
        self.cruisetime = \
            np.round(self.interpolatefrompressurealt(self.cruisepressurealt,
                                                     'timefromSL_min'), 3)
        self.cruisefuel = \
            np.round(self.interpolatefrompressurealt(self.cruisepressurealt,
                                                     'fuelfromSL_gal'), 3)
        self.cruisedistance = \
            np.round(self.interpolatefrompressurealt(self.cruisepressurealt,
                                                     'distancefromSL_NM'), 3)
        self.cruiseclimbrate = \
            np.round(self.interpolatefrompressurealt(self.cruisepressurealt,
                                                     'Rateofclimb_fpm'), 3)
        self.cruiseclimbspeed = \
            np.round(self.interpolatefrompressurealt(self.cruisepressurealt,
                                                     'Climbspeed_KIAS'), 3)
        print(f'Cruise values: \n'
              f'Time: {self.cruisetime:.1f} min\n'
              f'Fuel: {self.cruisefuel:.1f} gal\n'
              f'Distance: {self.cruisedistance:.1f} NM\n'
              f'Max rate of climb is {self.cruiseclimbrate:.1f} at '
              f'{self.cruiseclimbspeed:.1f} KIAS')

    def interpolatefrompressurealt(self, altitude, tableparameter):
        interpolatedvalue = np.interp(altitude,
                                      list(self.tfdtable['PressureAlt_feet']),
                                      list(self.tfdtable[tableparameter]))
        return interpolatedvalue


def test_topofclimbcalculator():
    practicetoc = TopOfClimbCalculator()

    assert len(practicetoc.tfdtable) == 13
    practicetoc.toccalc(5355, 8500, 30.09)
    assert practicetoc.fieldtime == 8.398
    assert practicetoc.fieldfuel == 1.66
    assert practicetoc.fielddistance == 10.398
    assert practicetoc.cruisetime == 15.688
    assert practicetoc.cruisefuel == 2.872
    assert practicetoc.cruisedistance == 20.032
    assert practicetoc.climbtime == 7.29
    assert practicetoc.climbfuel == 1.21
    assert practicetoc.climbdistance == 9.63
