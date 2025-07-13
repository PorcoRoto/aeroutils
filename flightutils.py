import unitconversions as uc
import numpy as np


def calcdensityaltitude(airtempC, dewpointC, altimetersetting, altitudeft):
    altitudemeters = uc.feettometers(altitudeft)
    airtempK = uc.CtoK(airtempC)
    dewpointK = uc.CtoK(dewpointC)
    stationpressureinHg = stationpressurem(altimetersetting, altitudemeters)
    stationpressuremb = uc.inHgtomb(stationpressureinHg)
    print(f'stationpressure is {stationpressureinHg} inHg ({stationpressuremb} mb)')
    e_vaporpressuremb = 6.1078 * np.exp((17.269 * dewpointC) / (237.3 + dewpointC))
    print(f'vapor pressure is {e_vaporpressuremb} mb (?)')
    TvK_virtualTemp = airtempK /\
        (1 - (e_vaporpressuremb / stationpressuremb) * (1 - .622))
    TvR_virtualTemp = uc.KtoR(TvK_virtualTemp)
    densityaltitudem = 145366 *\
        (1 - ((17.326 * stationpressureinHg) / TvR_virtualTemp) ** .235)
    densityaltitudeft = uc.meterstofeet(densityaltitudem)
    return densityaltitudeft


def stationpressurem(altimetersettinginHg, elevationmeters):
    stationpressureinHg = altimetersettinginHg *\
        ((288 - 0.0065 * elevationmeters) / 288) ** 5.2561
    return stationpressureinHg


def stationpressureft(altimetersettinginHg, elevationfeet):
    elevationmeters = uc.feettometers(elevationfeet)
    stationpressureinHg = altimetersettinginHg *\
        ((288 - 0.0065 * elevationmeters) / 288) ** 5.2561
    return stationpressureinHg
