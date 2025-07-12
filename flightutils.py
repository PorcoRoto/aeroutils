import unitconversions as uc


def calcdensityaltitude(airtempC, dewpointC, altimetersetting, altitudeft):
    altitudemeters = uc.feettometers(altitudeft)
    airtempK = uc.CtoK(airtempC)
    stationpressureinHg = stationpressure(altimetersetting, altitudemeters)
    stationpressuremb = uc.inHgtomb(stationpressureinHg)
    e_vaporpressure = 6.11 * 10 ** ((7.5 * dewpointC) / (273.3 + dewpointC))
    TvK_virtualTemp = airtempK /\
        (1 - (e_vaporpressure / stationpressuremb) * (1 - .622))
    TvR_virtualTemp = uc.KtoR(TvK_virtualTemp)
    densityaltitudem = 145366 *\
        (1 - ((17.326 * altimetersetting) / TvR_virtualTemp) ** .235)
    densityaltitudeft = uc.meterstofeet(densityaltitudem)
    return densityaltitudeft


def stationpressure(altimetersetting, altitudemeters):
    stationpressure = altimetersetting *\
        ((288 - 0.0065 * altitudemeters) / 288) ** 5.2561
    return stationpressure
