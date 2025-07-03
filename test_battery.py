import wbutils


def test_getpa():
    pa = wbutils.getpa(30.09, 7258)
    assert int(pa) == 7088
