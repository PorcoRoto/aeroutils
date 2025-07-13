import unitconversions as uc
import numpy as np


def densityaltcalculator(airtempC, dewpointC, altimetersetting, altitudeft):
    altitudemeters = uc.feettometers(altitudeft)
    airtempK = uc.CtoK(airtempC)
    stationpressureinHg, stationpressuremb = \
        calcstationpressurem(altimetersetting, altitudemeters)
    e_vaporpressuremb = calcvaporpressure(dewpointC)
    t_virtualtemperatureR = \
        calcvirtualtemp(airtempK, e_vaporpressuremb, stationpressuremb)
    densityaltitudeft, densityaltitudem = \
        calcdensityaltitude(stationpressureinHg, t_virtualtemperatureR)
    densityaltitudem = uc.feettometers(densityaltitudeft)
    return densityaltitudeft


def calcvaporpressure(dewpointC):
    e_mb = 6.1078 * np.exp((17.269 * dewpointC) / (237.15 + dewpointC))
    print(f'vapor pressure is {e_mb:.1f} mb')
    return e_mb


def calcstationpressurem(altimetersettinginHg, elevationmeters):
    p_inHg = altimetersettinginHg * \
        ((288 - 0.0065 * elevationmeters) / 288) ** 5.2561
    p_mb = uc.inHgtomb(p_inHg)
    print(f'stationpressure is {p_inHg:.1f} inHg ({p_mb:.1f} mb)')
    return p_inHg, p_mb


def calcvirtualtemp(t_airtempK, e_vaporpressuremb, p_stationpressuremb):
    t_virtualK = t_airtempK /\
        (1 - (e_vaporpressuremb / p_stationpressuremb) * (1 - .625))
    t_virtualR = uc.KtoR(t_virtualK)
    print(f'virtual temperature is {t_virtualR:.1f} R ({t_airtempK:.1f} K)')
    return t_virtualR


def calcdensityaltitude(pressure_inHg, t_virtualR):
    da_ft = 145366 * (1 - ((17.326 * pressure_inHg) / t_virtualR) ** .235)
    da_m = uc.feettometers(da_ft)
    print(f'da = {da_ft:.0f} ft ({da_m:.0f} m)')
    return da_ft, da_m


def stationpressureft(altimetersettinginHg, elevationfeet):
    elevationmeters = uc.feettometers(elevationfeet)
    stationpressureinHg = altimetersettinginHg *\
        ((288 - 0.0065 * elevationmeters) / 288) ** 5.2561
    return stationpressureinHg


def test_flightutils():
    da = densityaltcalculator(27, 12, 30.23, 5355)
    controlda = 7795.3
    assert np.abs(controlda - da) / controlda <= .01
