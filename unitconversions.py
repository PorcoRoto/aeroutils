import numpy as np


def FtoC(tempF):
    tempC = 5 / 9 * (tempF - 32)
    return tempC


def CtoF(tempC):
    tempF = 9 / 5 * tempC + 32
    return tempF


def CtoK(tempC):
    tempK = tempC + 273.15
    return tempK


def inHgtomb(pressureinHg):
    pressuremb = pressureinHg * 33.8639
    return pressuremb


def test_unitconversions():
    assert np.round(FtoC(69), 2) == 20.56
    assert np.round(CtoF(69), 2) == 156.2
    assert np.round(CtoK(69), 2) == 342.15
    assert np.round(inHgtomb(30.69), 2) == 1039.28
