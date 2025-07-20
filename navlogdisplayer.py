import matplotlib.pyplot as plt
import flightutils as fu
from climbcalculator import TopOfClimbCalculator


class navlogshower:
    def __init__(self, templateimage='delsolnavlog.png'):
        self.image = plt.imread(templateimage)
        self.tailnumber = input('Please enter tail number: ')
        self.requestusertocinput()
        self.calctopofclimb()
        self.generatenavlog()

    def requestusertocinput(self):
        self.barosetting = input('Please enter baro setting: ')
        self.fieldalt = input('Please enter field elevation: ')
        self.cruisealt = input('Please enter cruise altitude: ')

    def calctopofclimb(self):
        self.toc = TopOfClimbCalculator()
        self.toc.toccalc(self.fieldalt, self.cruisealt, self.barosetting)

    def generatenavlog(self):
        plt.imshow(self.image)
        plt.ion()
        plt.figure(1)
        plt.show()
        plt.figure(1).set_figwidth(22)
        plt.figure(1).set_figheight(17)
        plt.text(350, 189, self.tailnumber, fontsize=13)


def __main__():
    render = navlogshower()
