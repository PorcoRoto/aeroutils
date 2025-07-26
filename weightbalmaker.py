import numpy as np


class weightbalance:
    def __init__(self, inputs):
        self.inputs = inputs
        self.emptylongmoment = self.calcmoment(self.inputs.basicemptyweight, self.inputs.emptylongarm)
        self.emptylatmoment = self.calcmoment(self.inputs.basicemptyweight, self.inputs.emptylatarm)
        self.pilotlongmoment = self.calcmoment(
            (self.inputs.pilotwgt + self.inputs.pilotbags),
            self.inputs.pilotlongarm)
        self.pilotlatmoment = self.calcmoment(
            (self.inputs.pilotwgt + self.inputs.pilotbags),
            self.inputs.pilotlatarm)

    def calcmoment(self, weight, arm):
        moment = np.round(weight * arm, 1)
        return moment


class inputreader:
    def __init__(self, inputfilename):
        self.inputfilename = inputfilename
        self.file = open(self.inputfilename, 'r')
        self.collectlines()
        self.sortlines()
        self.file.close()
        if self.airframe == 'R22':
            self.pilotlongarm = 78
            self.pilotlatarm = 10.7
            

    def sortlines(self):
        for line in self.lines:
            key, value = self.getkeyandvaluefromline(line)
            self.sortvaluesbykey(key, value)

    def sortvaluesbykey(self, key, value):
        if key == 'basic empty weight':
            self.basicemptyweight = float(value)
        elif key == 'empty longitudinal arm':
            self.emptylongarm = float(value)
        elif key == 'empty lateral arm':
            self.emptylatarm = float(value)
        elif key == 'tail number':
            self.tailnumber = value
        elif key == 'airframe':
            self.airframe = value
        elif key == 'pilot weight':
            self.pilotwgt = float(value)
        elif key == 'pilot baggage':
            self.pilotbags = float(value)

    def getkeyandvaluefromline(self, line):
        if ':' in line:
            key = line.split(':')[0].strip()
            value = line.split(':')[-1].strip()
            print(f'key: {key}, value: {value}')
            return key, value

    def collectlines(self):
        self.lines = self.file.readlines()

        


def test_weightbalance():
    inputs = inputreader('wbtestinput.i')
    assert inputs.basicemptyweight == 875.6
    testwb = weightbalance(inputs)
    assert testwb.inputs.pilotbags == 2
    assert testwb.emptylongmoment == 90948.6
    assert testwb.emptylatmoment == -17.5
    assert testwb.pilotlongmoment == 14976
    assert testwb.pilotlatmoment == 2054.4
