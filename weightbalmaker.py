import numpy as np


class weightbalance:
    def __init__(self, inputs):
        self.inputs = inputs
        self.loadarmdata()
        self.setbasicemptymoments()
        self.setpilotmoments()
        self.setpassengermoments()
        self.doorlongmoment = self.calcmoment(
            (self.inputs.leftdoor + self.inputs.rightdoor) * self.doorwgt,
            self.doorlongarm)
        self.doorlatmoment = self.calcmoment(
            (self.inputs.leftdoor + self.inputs.rightdoor) * self.doorwgt,
            (self.inputs.leftdoor + -1 * self.inputs.rightdoor) *
            self.doorlatarm
        )

    def setbasicemptymoments(self):
        self.emptylongmoment = self.calcmoment(self.inputs.basicemptyweight,
                                               self.inputs.emptylongarm)
        self.emptylatmoment = self.calcmoment(self.inputs.basicemptyweight,
                                              self.inputs.emptylatarm)

    def setpilotmoments(self):
        self.pilotlongmoment = self.calcmoment(
            (self.inputs.pilotwgt + self.inputs.pilotbags),
            self.pilotlongarm)
        self.pilotlatmoment = self.calcmoment(
            (self.inputs.pilotwgt + self.inputs.pilotbags),
            self.pilotlatarm)

    def setpassengermoments(self):
        self.passengerlongmoment = self.calcmoment(
            (self.inputs.passengerwgt + self.inputs.passengerbags),
            self.passengerlongarm)
        self.passengerlatmoment = self.calcmoment(
            (self.inputs.passengerwgt + self.inputs.passengerbags),
            self.passengerlatarm)

    def loadarmdata(self):
        if self.inputs.airframe == 'R22':
            self.pilotlongarm = 78
            self.pilotlatarm = 10.7
            self.passengerlongarm = 78
            self.passengerlatarm = -9.3
            self.doorwgt = 5.2
            self.doorlongarm = 77.5
            self.doorlatarm = 21.0

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
        elif key == 'passenger weight':
            self.passengerwgt = float(value)
        elif key == 'passenger baggage':
            self.passengerbags = float(value)
        elif key == 'left door':
            # print(f'leftdoor value: {value}')
            if value == 'on':
                self.leftdoor = 0
            elif value == 'off':
                self.leftdoor = -1
        elif key == 'right door':
            if value == 'on':
                self.rightdoor = 0
            elif value == 'off':
                self.rightdoor = -1

    def getkeyandvaluefromline(self, line):
        if ':' in line:
            key = line.split(':')[0].strip()
            value = line.split(':')[-1].strip()
            # print(f'key: {key}, value: {value}')
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
    assert testwb.passengerlongmoment == 14196
    assert testwb.passengerlatmoment == -1692.6
    assert testwb.doorlongmoment == -403
    assert testwb.doorlatmoment == -109.2
