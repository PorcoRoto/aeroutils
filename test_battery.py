import wbutils
from climbcalculator import TopOfClimbCalculator
import unitconversions as uc
import numpy as np

def test_getpa():
    pa = wbutils.getpa(30.09, 7258)
    assert int(pa) == 7088


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


def test_unitconversions():
    assert np.round(uc.FtoC(69), 2) == 20.56
    assert np.round(uc.CtoF(69), 2) == 156.2
    assert np.round(uc.CtoK(69), 2) == 342.15
    assert np.round(uc.inHgtomb(30.69), 2) == 1039.28
    assert np.round(uc.mbtoinHg(1069), 2) == 31.57
    assert np.round(uc.KtoR(69), 2) == 124.2
    assert np.round(uc.feettometers(69), 2) == 21.03
    assert np.round(uc.meterstofeet(69), 2) == 226.38
