

def getpa(altsetting=30.09, fieldelev=5355):
    pa = (29.92 - altsetting) * 1000 + fieldelev
    print(f'PA = {pa:.0f}')
    return pa
