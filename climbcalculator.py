import pandas as pd


class TopOfClimbCalculator:
    def __init__(self):
        self.timefueldistancetable = pd.DataFrame

    def ingesttimefueldistancetable(self, filename):
        self.timefueldistancetable = pd.read_csv(filename)


def test_topofclimbcalculator():
    practictoc = TopOfClimbCalculator()
    practictoc.ingesttimefueldistancetable('c172_climbtfdtable5-6.csv')
    assert len(practictoc.timefueldistancetable) == 13
