import unitconversions as uc
import numpy as np


def calcdensityaltitude(airtempC, dewpointC, altimetersetting, altitudeft):
    altitudemeters = uc.feettometers(altitudeft)
    airtempK = uc.CtoK(airtempC)
    stationpressureinHg, stationpressuremb = \
        calcstationpressurem(altimetersetting, altitudemeters)
    e_vaporpressuremb = calcvaporpressure(dewpointC)
    print(f'vapor pressure is {e_vaporpressuremb} mb')
    TvK_virtualTemp = airtempK /\
        (1 - (e_vaporpressuremb / stationpressuremb) * (1 - .625))
    TvR_virtualTemp = uc.KtoR(TvK_virtualTemp)
    densityaltitudeft = 145366 *\
        (1 - ((17.326 * stationpressureinHg) / TvR_virtualTemp) ** .235)
    densityaltitudem = uc.feettometers(densityaltitudeft)
    print(f'da = {densityaltitudeft:.0f} ft ({densityaltitudem:.0f} m)')
    return densityaltitudeft


def calcvaporpressure(dewpointC):
    e_mb = 6.1078 * np.exp((17.269 * dewpointC) / (237.15 + dewpointC))
    return e_mb


def calcstationpressurem(altimetersettinginHg, elevationmeters):
    p_inHg = altimetersettinginHg * \
        ((288 - 0.0065 * elevationmeters) / 288) ** 5.2561
    p_mb = uc.inHgtomb(p_inHg)
    print(f'stationpressure is {p_inHg:.1f} inHg ({p_mb:.1f} mb)')
    return p_inHg, p_mb


def stationpressureft(altimetersettinginHg, elevationfeet):
    elevationmeters = uc.feettometers(elevationfeet)
    stationpressureinHg = altimetersettinginHg *\
        ((288 - 0.0065 * elevationmeters) / 288) ** 5.2561
    return stationpressureinHg


def test_flightutils():
    da = calcdensityaltitude(27, 12, 30.23, 5355)
    controlda = 7795.3
    assert np.abs(controlda - da) / controlda <= .01
