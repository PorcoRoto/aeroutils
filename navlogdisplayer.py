import matplotlib.pyplot as plt


class navlogshower:
    def __init__(self, templateimage='delsolnavlog.png'):
        image = plt.imread(templateimage)
        self.callsign = '301DP'
        plt.imshow(image)
        plt.ion()
        plt.figure(1)
        plt.show()
        plt.figure(1).set_figwidth(22)
        plt.figure(1).set_figheight(17)
        plt.text(350, 189, self.callsign, fontsize=13)


def __main__():
    render = navlogshower()
