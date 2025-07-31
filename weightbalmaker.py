import numpy as np


class weightbalance:
    def __init__(self, inputs):
        self.inputs = inputs
        self.loadarmdata()
        self.zerofuelwgtlist = self.buildzerofuelwgtlist()
        self.zerofuelwgt = self.calczerofuelwgt()
        self.mainfuelwgt, self.auxfuelwgt = self.calcfuelwgts()
        self.totalfuelwgtlist = self.buildtotalwgtlist()
        self.totalwgt = self.calctotalwgt()
        self.zerolongarmlist, self.totallongarmlist, \
            self.zerolatarmlist, self.totallatarmlist = \
            self.buildarmlists()
        self.zerolongmoment, self.zerolatmoment = self.calczerofuelmoments()
        self.zerolongarm, self.zerolatarm = self.calczerofuelarms()
        self.totallongmoment, self.totallatmoment = self.calctotalmoments()
        self.totallongarm, self.totallatarm = self.calctotalarms()

    def calczerofuelwgt(self):
        zerofuelwgt = np.round(np.sum(self.zerofuelwgtlist), 1)
        return zerofuelwgt

    def calcfuelwgts(self):
        mainfuelwgt = self.inputs.mainfuelgal * 6
        auxfuelwgt = self.inputs.auxfuelgal * 6
        return mainfuelwgt, auxfuelwgt

    def calctotalwgt(self):
        totalwgt = np.sum(self.totalfuelwgtlist)
        return totalwgt

    def buildzerofuelwgtlist(self):
        zerofuelweightlist =\
            [self.inputs.basicemptyweight,
             self.inputs.pilotwgt + self.inputs.pilotbags,
             self.inputs.passengerwgt + self.inputs.passengerbags,
             (self.inputs.leftdoor + self.inputs.rightdoor) * self.doorwgt]
        return zerofuelweightlist

    def buildarmlists(self):
        zerolongarmlist = [
            self.inputs.emptylongarm,
            self.pilotlongarm,
            self.passengerlongarm,
            self.doorlongarm
        ]
        totallongarmlist = [
            0,
            self.mainfuellongarm,
            self.auxfuellongarm
        ]
        zerolatarmlist = [
            self.inputs.emptylatarm,
            self.pilotlatarm,
            self.passengerlatarm,
            self.doorlatarm
        ]
        totallatarmlist = [
            0,
            self.mainfuellatarm,
            self.auxfuellatarm
        ]
        return zerolongarmlist, totallongarmlist, \
            zerolatarmlist, totallatarmlist

    def calczerofuelmoments(self):
        zerolongmoment = np.sum(np.multiply(self.zerofuelwgtlist,
                                            self.zerolongarmlist))
        zerolatmoment = np.sum(np.multiply(self.zerofuelwgtlist,
                                           self.zerolatarmlist))
        return np.round(zerolongmoment, 1), np.round(zerolatmoment, 1)

    def calctotalmoments(self):
        totallongmoment = \
            np.sum(np.multiply(self.totalfuelwgtlist,
                               self.totallongarmlist)) + \
            self.zerolongmoment
        totallatmoment = \
            np.sum(np.multiply(self.totalfuelwgtlist,
                               self.totallatarmlist)) + \
            self.zerolatmoment
        return np.round(totallongmoment, 1), np.round(totallatmoment, 1)

    def calczerofuelarms(self):
        zerolongarm = self.zerolongmoment / self.zerofuelwgt
        zerolatarm = self.zerolatmoment / self.zerofuelwgt
        return np.round(zerolongarm, 2), np.round(zerolatarm, 2)

    def calctotalarms(self):
        totallongarm = self.totallongmoment / self.totalwgt
        totallatarm = self.totallatmoment / self.totalwgt
        return np.round(totallongarm, 2), np.round(totallatarm, 2)

    def buildtotalwgtlist(self):
        totalweightlist = [self.zerofuelwgt,
                           self.mainfuelwgt,
                           self.auxfuelwgt]
        return totalweightlist

    def loadarmdata(self):
        if self.inputs.airframe == 'R22':
            self.pilotlongarm = 78
            self.pilotlatarm = 10.7
            self.passengerlongarm = 78
            self.passengerlatarm = -9.3
            self.doorwgt = 5.2
            self.doorlongarm = 77.5
            self.doorlatarm = 21.0
            self.mainfuellongarm = 108.6
            self.auxfuellongarm = 103.8
            self.mainfuellatarm = -11.0
            self.auxfuellatarm = 11.2

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
        elif key == 'main fuel gal':
            self.mainfuelgal = float(value)
        elif key == 'aux fuel gal':
            self.auxfuelgal = float(value)
        elif key == 'left door':
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
            return key, value

    def collectlines(self):
        self.lines = self.file.readlines()


def test_weightbalance():
    inputs = inputreader('wbtestinput.i')
    assert inputs.basicemptyweight == 875.6
    testwb = weightbalance(inputs)
    assert testwb.inputs.pilotbags == 2
    assert testwb.zerofuelwgt == 1244.4
    assert testwb.mainfuelwgt == 60
    assert testwb.auxfuelwgt == 36
    assert testwb.totalwgt == 1340.4
    assert testwb.zerolongmoment == 119717.6
    assert testwb.zerolongarm == 96.21
    assert testwb.totallongmoment == 129970.4
    assert testwb.totallongarm == 96.96
    assert testwb.zerolatmoment == 235.1
    assert testwb.zerolatarm == .19
    assert testwb.totallatmoment == -21.7
    assert testwb.totallatarm == -.02
