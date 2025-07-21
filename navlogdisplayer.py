import matplotlib.pyplot as plt
import flightutils as fu
from climbcalculator import TopOfClimbCalculator


class navlogshower:
    def __init__(self, templateimage='delsolnavlog.png', test=False):
        self.image = plt.imread(templateimage)
        if not test:
            self.requestmetadata()
            self.requestusertocinput()
        else:
            self.setinputsfromtest()
        self.calctopofclimb()
        self.generatepressurealttext()
        self.generatenavlog()

    def setinputsfromtest(self):
        inputs = testinputs()
        self.barosetting = inputs.barosetting
        self.tailnumber = inputs.tailnumber
        self.fieldalt = inputs.fieldalt
        self.cruisealt = inputs.cruisealt

    def requestmetadata(self):
        self.tailnumber = input('Please enter tail number: ')

    def requestusertocinput(self):
        self.barosetting = float(input('Please enter baro setting: '))
        self.fieldalt = float(input('Please enter field elevation: '))
        self.cruisealt = float(input('Please enter cruise altitude: '))

    def calctopofclimb(self):
        self.toc = TopOfClimbCalculator()
        self.toc.toccalc(self.fieldalt, self.cruisealt, self.barosetting)

    def generatepressurealttext(self):
        self.paline1 = f'PA: baro setting = {self.toc.baro:.2f}'
        self.paline2 = f'Cruise: {self.toc.cruisealtitude} --> PA: {self.toc.cruisepressurealt:.0f}'
        self.paline3 = f'Field:     {self.toc.fieldaltitude} --> PA: {self.toc.fieldpressurealt:.0f} '

    def generatenavlog(self):
        plt.imshow(self.image)
        plt.ion()
        plt.figure(1)
        plt.show()
        plt.figure(1).set_figwidth(22)
        plt.figure(1).set_figheight(17)
        plt.text(350, 189, self.tailnumber, fontsize=13)
        pablockx = 180
        line1y = 228
        line2y = 262
        line3y = 298
        plt.text(pablockx, line1y, self.paline1, fontsize=13)
        plt.text(pablockx, line2y, self.paline2, fontsize=13)
        plt.text(pablockx, line3y, self.paline3, fontsize=13)
        plt.plot([440, 440], [203, 317], color='black')


class testinputs:
    def __init__(self):
        self.tailnumber = '8286E'
        self.barosetting = 30.21
        self.fieldalt = 5355
        self.cruisealt = 10500

def __main__():
    render = navlogshower()
