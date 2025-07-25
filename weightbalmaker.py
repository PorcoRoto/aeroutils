import numpy as np


class weightbalance:
    def __init__(self, inputs):
        self.basicemptyweight = inputs[0]
        self.emptylongarm = inputs[1]
        self.emptylatarm = inputs[2]
        self.emptylongmoment = self.calcmoment(self.basicemptyweight, self.emptylongarm)
        self.emptylatmoment = self.calcmoment(self.basicemptyweight, self.emptylatarm)

    def calcmoment(self, weight, arm):
        moment = np.round(weight * arm, 1)
        return moment


def test_weightbalance():
    basicemptyweight = 875.6
    emptylongarm = 103.87
    emptylatarm = -.02
    inputs = [basicemptyweight, emptylongarm, emptylatarm]
    testwb = weightbalance(inputs)
    assert testwb.emptylongmoment == 90948.6
    assert testwb.emptylatmoment == -17.5
