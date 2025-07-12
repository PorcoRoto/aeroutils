import unitconversions as uc


def calcdensityaltitude(airtempC, stationpressureinHg, dewpoint):
    airtempK = uc.convertCtoK(airtempC)
    return airtempK
