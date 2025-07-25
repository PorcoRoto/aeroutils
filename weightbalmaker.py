class weightbalance:
    def __init__(self):
        pass
    
    
def test_weightbalance():
    basicemptyweight = 875.6
    emptylongarm = 103.87
    emptylatarm = -.02
    inputs = [basicemptyweight, emptyarm]
    testwb = weightbalance(inputs)
    assert testwb.emptylongmoment == 90948
    assert testwb.emptylatmoment == -17.51