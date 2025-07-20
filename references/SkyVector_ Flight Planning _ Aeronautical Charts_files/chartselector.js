"use strict;";

var chartselectorstuff = [
    {
      tag: "div",
      attributes: { id: "ChartSelector" },
      children: [
        {
          tag: "img",
          attributes: { id: "imgChartSelbase", src: "/images/chartsel/base.jpg" },
        },
        {
          tag: "img",
          attributes: {
            id: "imgChartSelover",
            src: "/images/chartsel/layer_sectional.gif",
          },
        },
        {
          tag: "img",
          attributes: { id: "imgChartSelHighlight", src: "/images/clear.gif" },
        },
        { tag: "div", attributes: { id: "divChartSelLabelBack" } },
        { tag: "div", attributes: { id: "divChartSelLabel" } },
        {
          tag: "img",
          attributes: {
            id: "imgChartSelMap",
            src: "/images/clear.gif",
            usemap: "#sectionalmap",
          },
        },
        {
          tag: "div",
          attributes: { id: "cs_bsel0" },
          children: [
            { tag: "div", attributes: { id: "cs_bsel1" } },
            { tag: "div", attributes: { id: "cs_bsel2" } },
            { tag: "div", attributes: { id: "cs_bhl" } },
            {
              tag: "img",
              attributes: {
                id: "cs_bselmap",
                src: "/images/clear.gif",
                usemap: "#buttonmap",
              },
            },
          ],
        },
        {
          tag: "map",
          attributes: { name: "buttonmap", id: "buttonmap" },
          children: [
            {
              tag: "area",
              attributes: {
                shape: "rect",
                coords: "0,0,92,18",
                alt: "United States",
                onmouseover: "cs.bon(0,92)",
                onmouseout: "cs.boff()",
                href: "javascript:cs.bsel('US',0,92)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "rect",
                coords: "92,0,145,18",
                alt: "Alaska",
                onmouseover: "cs.bon(92,53)",
                onmouseout: "cs.boff()",
                href: "javascript:cs.bsel('AK',92,53)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "rect",
                coords: "186,0,256,18",
                alt: "VFR Sectional Charts",
                onmouseover: "cs.bon(186,70)",
                onmouseout: "cs.boff()",
                href: "javascript:cs.bsel('Sectional',186,70)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "rect",
                coords: "256,0,291,18",
                alt: "VFR Terminal Area Charts",
                onmouseover: "cs.bon(256,35)",
                onmouseout: "cs.boff()",
                href: "javascript:cs.bsel('TAC',256,35)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "rect",
                coords: "291,0,363,18",
                alt: "Helicopter Route Charts",
                onmouseover: "cs.bon(291,72)",
                onmouseout: "cs.boff()",
                href: "javascript:cs.bsel('Heli',291,72)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "rect",
                coords: "363,0,447,18",
                alt: "IFR Enroute High Charts",
                onmouseover: "cs.bon(363,84)",
                onmouseout: "cs.boff()",
                href: "javascript:cs.bsel('ENH',363,84)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "rect",
                coords: "447,0,529,18",
                alt: "IFR Enroute Low Charts",
                onmouseover: "cs.bon(447,82)",
                onmouseout: "cs.boff()",
                href: "javascript:cs.bsel('ENL',447,82)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "rect",
                coords: "529,0,591,18",
                alt: "IFR Area Charts",
                onmouseover: "cs.bon(529,62)",
                onmouseout: "cs.boff()",
                href: "javascript:cs.bsel('Area',529,62)",
              },
            },
          ],
        },
        {
          tag: "map",
          attributes: { name: "sectionalmap", id: "sectionalmap" },
          children: [
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "82,15,156,36,140,98,61,75",
                alt: "Seattle Sectional Chart",
                onmouseover: "cs.on(1,'Seattle Sectional Chart')",
                onmouseout: "cs.off(1)",
                href: "javascript:cs.sel(1)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "156,36,228,50,217,114,140,98",
                alt: "Great Falls Sectional Chart",
                onmouseover: "cs.on(2,'Great Falls Sectional Chart')",
                onmouseout: "cs.off(2)",
                href: "javascript:cs.sel(2)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "228,50,301,58,296,121,217,114",
                alt: "Billings Sectional Chart",
                onmouseover: "cs.on(3,'Billings Sectional Chart')",
                onmouseout: "cs.off(3)",
                href: "javascript:cs.sel(3)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "301,58,379,60,377,123,296,121",
                alt: "Twin Cities Sectional Chart",
                onmouseover: "cs.on(4,'Twin Cities Sectional Chart')",
                onmouseout: "cs.off(4)",
                href: "javascript:cs.sel(4)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "378,68,450,65,455,123,375,128,377,123",
                alt: "Green Bay Sectional Chart",
                onmouseover: "cs.on(5,'Green Bay Sectional Chart')",
                onmouseout: "cs.off(5)",
                href: "javascript:cs.sel(5)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "450,65,524,54,534,111,455,123",
                alt: "Lake Huron Sectional Chart",
                onmouseover: "cs.on(6,'Lake Huron Sectional Chart')",
                onmouseout: "cs.off(6)",
                href: "javascript:cs.sel(6)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "524,54,596,36,611,91,534,111",
                alt: "Montreal Sectional Chart",
                onmouseover: "cs.on(7,'Montreal Sectional Chart')",
                onmouseout: "cs.off(7)",
                href: "javascript:cs.sel(7)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "596,36,667,11,687,68,611,91",
                alt: "Halifax Sectional Chart",
                onmouseover: "cs.on(8,'Halifax Sectional Chart')",
                onmouseout: "cs.off(8)",
                href: "javascript:cs.sel(8)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "61,75,140,98,123,157,42,132",
                alt: "Klamath Falls Sectional Chart",
                onmouseover: "cs.on(9,'Klamath Falls Sectional Chart')",
                onmouseout: "cs.off(9)",
                href: "javascript:cs.sel(9)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "140,98,217,114,207,174,123,157",
                alt: "Salt Lake City Sectional Chart",
                onmouseover: "cs.on(10,'Salt Lake City Sectional Chart')",
                onmouseout: "cs.off(10)",
                href: "javascript:cs.sel(10)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "217,114,296,121,291,182,207,174",
                alt: "Cheyenne Sectional Chart",
                onmouseover: "cs.on(11,'Cheyenne Sectional Chart')",
                onmouseout: "cs.off(11)",
                href: "javascript:cs.sel(11)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "296,121,377,123,375,128,375,183,291,182",
                alt: "Omaha Sectional Chart",
                onmouseover: "cs.on(12,'Omaha Sectional Chart')",
                onmouseout: "cs.off(12)",
                href: "javascript:cs.sel(12)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "375,128,455,123,460,179,375,183",
                alt: "Chicago Sectional Chart",
                onmouseover: "cs.on(13,'Chicago Sectional Chart')",
                onmouseout: "cs.off(13)",
                href: "javascript:cs.sel(13)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "455,123,534,111,544,166,460,179",
                alt: "Detroit Sectional Chart",
                onmouseover: "cs.on(14,'Detroit Sectional Chart')",
                onmouseout: "cs.off(14)",
                href: "javascript:cs.sel(14)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "534,111,611,91,626,147,544,166",
                alt: "New York Sectional Chart",
                onmouseover: "cs.on(15,'New York Sectional Chart')",
                onmouseout: "cs.off(15)",
                href: "javascript:cs.sel(15)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "42,132,115,154,100,208,24,186",
                alt: "San Francisco Sectional Chart",
                onmouseover: "cs.on(16,'San Francisco Sectional Chart')",
                onmouseout: "cs.off(16)",
                href: "javascript:cs.sel(16)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "115,155,187,170,175,231,98,215",
                alt: "Las Vegas Sectional Chart",
                onmouseover: "cs.on(17,'Las Vegas Sectional Chart')",
                onmouseout: "cs.off(17)",
                href: "javascript:cs.sel(17)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "187,170,207,174,260,179,253,236,253,242,197,234,175,231",
                alt: "Denver Sectional Chart",
                onmouseover: "cs.on(18,'Denver Sectional Chart')",
                onmouseout: "cs.off(18)",
                href: "javascript:cs.sel(18)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "260,179,291,182,334,183,332,239,253,236",
                alt: "Wichita Sectional Chart",
                onmouseover: "cs.on(19,'Wichita Sectional Chart')",
                onmouseout: "cs.off(19)",
                href: "javascript:cs.sel(19)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "334,183,375,183,397,182,398,238,332,239",
                alt: "Kansas City Sectional Chart",
                onmouseover: "cs.on(20,'Kansas City Sectional Chart')",
                onmouseout: "cs.off(20)",
                href: "javascript:cs.sel(20)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "397,182,460,179,465,233,398,238",
                alt: "St. Louis Sectional Chart",
                onmouseover: "cs.on(21,'St. Louis Sectional Chart')",
                onmouseout: "cs.off(21)",
                href: "javascript:cs.sel(21)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "460,179,522,169,532,224,465,233",
                alt: "Cincinnati Sectional Chart",
                onmouseover: "cs.on(22,'Cincinnati Sectional Chart')",
                onmouseout: "cs.off(22)",
                href: "javascript:cs.sel(22)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "522,169,543,166,598,153,609,208,532,224",
                alt: "Washington Sectional Chart",
                onmouseover: "cs.on(23,'Washington Sectional Chart')",
                onmouseout: "cs.off(23)",
                href: "javascript:cs.sel(23)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "60,196,100,208,98,215,119,219,108,268,61,255,66,235,46,230,48,219,54,220",
                alt: "Los Angeles Sectional Chart",
                onmouseover: "cs.on(24,'Los Angeles Sectional Chart')",
                onmouseout: "cs.off(24)",
                href: "javascript:cs.sel(24)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "119,219,175,231,197,234,188,294,106,278",
                alt: "Phoenix Sectional Chart",
                onmouseover: "cs.on(25,'Phoenix Sectional Chart')",
                onmouseout: "cs.off(25)",
                href: "javascript:cs.sel(25)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "197,234,253,242,253,236,277,237,271,292,190,282",
                alt: "Albuquerque Sectional Chart",
                onmouseover: "cs.on(26,'Albuquerque Sectional Chart')",
                onmouseout: "cs.off(26)",
                href: "javascript:cs.sel(26)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "277,237,332,239,355,239,354,295,271,292",
                alt: "Dallas - Ft Worth Sectional Chart",
                onmouseover: "cs.on(27,'Dallas - Ft Worth Sectional Chart')",
                onmouseout: "cs.off(27)",
                href: "javascript:cs.sel(27)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "355,239,398,238,433,235,436,292,354,295",
                alt: "Memphis Sectional Chart",
                onmouseover: "cs.on(28,'Memphis Sectional Chart')",
                onmouseout: "cs.off(28)",
                href: "javascript:cs.sel(28)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "433,235,465,233,499,228,506,284,436,292",
                alt: "Atlanta Sectional Chart",
                onmouseover: "cs.on(29,'Atlanta Sectional Chart')",
                onmouseout: "cs.off(29)",
                href: "javascript:cs.sel(29)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "499,228,532,224,577,215,587,271,506,284",
                alt: "Charlotte Sectional Chart",
                onmouseover: "cs.on(30,'Charlotte Sectional Chart')",
                onmouseout: "cs.off(30)",
                href: "javascript:cs.sel(30)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "190,282,262,291,257,347,181,339",
                alt: "El Paso Sectional Chart",
                onmouseover: "cs.on(31,'El Paso Sectional Chart')",
                onmouseout: "cs.off(31)",
                href: "javascript:cs.sel(31)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "262,291,271,292,334,294,332,351,257,347",
                alt: "San Antonio Sectional Chart",
                onmouseover: "cs.on(32,'San Antonio Sectional Chart')",
                onmouseout: "cs.off(32)",
                href: "javascript:cs.sel(32)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "334,294,353,295,401,293,403,351,332,351",
                alt: "Houston Sectional Chart",
                onmouseover: "cs.on(33,'Houston Sectional Chart')",
                onmouseout: "cs.off(33)",
                href: "javascript:cs.sel(33)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "401,293,436,292,472,288,477,345,403,351",
                alt: "New Orleans Sectional Chart",
                onmouseover: "cs.on(34,'New Orleans Sectional Chart')",
                onmouseout: "cs.off(34)",
                href: "javascript:cs.sel(34)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "472,288,506,284,532,280,535,296,550,294,556,332,514,340,513,334,501,336,502,342,477,345",
                alt: "Jacksonville Sectional Chart",
                onmouseover: "cs.on(35,'Jacksonville Sectional Chart')",
                onmouseout: "cs.off(35)",
                href: "javascript:cs.sel(35)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "254,347,257,347,332,351,337,351,335,409,250,405,249,405",
                alt: "Brownsville Sectional Chart",
                onmouseover: "cs.on(36,'Brownsville Sectional Chart')",
                onmouseout: "cs.off(36)",
                href: "javascript:cs.sel(36)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "502,342,501,336,513,334,514,340,556,332,583,328,593,385,509,399",
                alt: "Miami Sectional Chart",
                onmouseover: "cs.on(37,'Miami Sectional Chart')",
                onmouseout: "cs.off(37)",
                href: "javascript:cs.sel(37)",
              },
            },
          ],
        },
        {
          tag: "map",
          attributes: { name: "tacmap", id: "tacmap" },
          children: [
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "462,256,486,254,488,277,464,279",
                alt: "Atlanta Terminal Area Chart",
                onmouseover: "cs.on(101,'Atlanta Terminal Area Chart')",
                onmouseout: "cs.off(101)",
                href: "javascript:cs.sel(101)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "526,170,552,165,561,174,564,191,531,197",
                alt: "Baltimore - Washington Terminal Area Chart",
                onmouseover:
                  "cs.on(102,'Baltimore - Washington Terminal Area Chart')",
                onmouseout: "cs.off(102)",
                href: "javascript:cs.sel(102)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "583,114,610,107,617,134,589,141",
                alt: "Boston Terminal Area Chart",
                onmouseover: "cs.on(103,'Boston Terminal Area Chart')",
                onmouseout: "cs.off(103)",
                href: "javascript:cs.sel(103)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "498,229,523,225,526,250,500,254",
                alt: "Charlotte Terminal Area Chart",
                onmouseover: "cs.on(104,'Charlotte Terminal Area Chart')",
                onmouseout: "cs.off(104)",
                href: "javascript:cs.sel(104)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "414,146,436,145,437,165,415,166",
                alt: "Chicago Terminal Area Chart",
                onmouseover: "cs.on(105,'Chicago Terminal Area Chart')",
                onmouseout: "cs.off(105)",
                href: "javascript:cs.sel(105)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "450,177,477,174,479,204,452,206",
                alt: "Cincinnati Terminal Area Chart",
                onmouseover: "cs.on(106,'Cincinnati Terminal Area Chart')",
                onmouseout: "cs.off(106)",
                href: "javascript:cs.sel(106)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "483,146,500,144,502,157,496,168,480,169,479,158",
                alt: "Cleveland Terminal Area Chart",
                onmouseover: "cs.on(107,'Cleveland Terminal Area Chart')",
                onmouseout: "cs.off(107)",
                href: "javascript:cs.sel(107)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "313,270,347,270,346,299,313,299",
                alt: "Dallas - Ft Worth Terminal Area Chart",
                onmouseover: "cs.on(108,'Dallas - Ft Worth Terminal Area Chart')",
                onmouseout: "cs.off(108)",
                href: "javascript:cs.sel(108)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "239,168,265,170,265,191,238,190",
                alt: "Denver Terminal Area Chart",
                onmouseover: "cs.on(109,'Denver Terminal Area Chart')",
                onmouseout: "cs.off(109)",
                href: "javascript:cs.sel(109)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "460,137,482,136,483,146,479,158,461,159",
                alt: "Detroit Terminal Area Chart",
                onmouseover: "cs.on(110,'Detroit Terminal Area Chart')",
                onmouseout: "cs.off(110)",
                href: "javascript:cs.sel(110)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "337,314,363,314,363,341,337,341",
                alt: "Houston Terminal Area Chart",
                onmouseover: "cs.on(111,'Houston Terminal Area Chart')",
                onmouseout: "cs.off(111)",
                href: "javascript:cs.sel(111)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "342,183,366,183,366,205,342,205",
                alt: "Kansas City Terminal Area Chart",
                onmouseover: "cs.on(112,'Kansas City Terminal Area Chart')",
                onmouseout: "cs.off(112)",
                href: "javascript:cs.sel(112)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "124,202,147,207,142,228,120,221",
                alt: "Las Vegas Terminal Area Chart",
                onmouseover: "cs.on(113,'Las Vegas Terminal Area Chart')",
                onmouseout: "cs.off(113)",
                href: "javascript:cs.sel(113)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "79,222,111,230,108,242,103,245,90,242,85,247,72,243",
                alt: "Los Angeles Terminal Area Chart",
                onmouseover: "cs.on(114,'Los Angeles Terminal Area Chart')",
                onmouseout: "cs.off(114)",
                href: "javascript:cs.sel(114)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "397,241,422,240,423,264,398,264",
                alt: "Memphis Terminal Area Chart",
                onmouseover: "cs.on(115,'Memphis Terminal Area Chart')",
                onmouseout: "cs.off(115)",
                href: "javascript:cs.sel(115)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "524,354,553,349,557,378,529,382",
                alt: "Miami Terminal Area Chart",
                onmouseover: "cs.on(116,'Miami Terminal Area Chart')",
                onmouseout: "cs.off(116)",
                href: "javascript:cs.sel(116)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "360,108,382,108,382,128,360,128",
                alt: "Minneapolis - St Paul Terminal Area Chart",
                onmouseover:
                  "cs.on(117,'Minneapolis - St Paul Terminal Area Chart')",
                onmouseout: "cs.off(117)",
                href: "javascript:cs.sel(117)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "395,311,421,310,422,332,395,333",
                alt: "New Orleans Terminal Area Chart",
                onmouseover: "cs.on(118,'New Orleans Terminal Area Chart')",
                onmouseout: "cs.off(118)",
                href: "javascript:cs.sel(118)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "558,143,587,137,591,157,571,161,559,152",
                alt: "New York Terminal Area Chart",
                onmouseover: "cs.on(119,'New York Terminal Area Chart')",
                onmouseout: "cs.off(119)",
                href: "javascript:cs.sel(119)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "549,155,559,152,571,161,573,163,574,172,561,174,552,165,549,162",
                alt: "Philadelphia Terminal Area Chart",
                onmouseover: "cs.on(120,'Philadelphia Terminal Area Chart')",
                onmouseout: "cs.off(120)",
                href: "javascript:cs.sel(120)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "147,243,173,249,169,272,142,267",
                alt: "Phoenix Terminal Area Chart",
                onmouseover: "cs.on(121,'Phoenix Terminal Area Chart')",
                onmouseout: "cs.off(121)",
                href: "javascript:cs.sel(121)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "502,157,517,155,519,174,499,177,496,168",
                alt: "Pittsburgh Terminal Area Chart",
                onmouseover: "cs.on(122,'Pittsburgh Terminal Area Chart')",
                onmouseout: "cs.off(122)",
                href: "javascript:cs.sel(122)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "393,192,414,192,414,211,395,212",
                alt: "St. Louis Terminal Area Chart",
                onmouseover: "cs.on(124,'St. Louis Terminal Area Chart')",
                onmouseout: "cs.off(124)",
                href: "javascript:cs.sel(124)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "166,144,193,149,188,173,162,168",
                alt: "Salt Lake City Terminal Area Chart",
                onmouseover: "cs.on(125,'Salt Lake City Terminal Area Chart')",
                onmouseout: "cs.off(125)",
                href: "javascript:cs.sel(125)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "90,242,103,245,108,242,113,244,108,264,82,258,85,247",
                alt: "San Diego Terminal Area Chart",
                onmouseover: "cs.on(126,'San Diego Terminal Area Chart')",
                onmouseout: "cs.off(126)",
                href: "javascript:cs.sel(126)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "50,160,75,167,68,189,43,181",
                alt: "San Francisco Terminal Area Chart",
                onmouseover: "cs.on(127,'San Francisco Terminal Area Chart')",
                onmouseout: "cs.off(127)",
                href: "javascript:cs.sel(127)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "92,30,113,36,106,59,84,53",
                alt: "Seattle Terminal Area Chart",
                onmouseover: "cs.on(128,'Seattle Terminal Area Chart')",
                onmouseout: "cs.off(128)",
                href: "javascript:cs.sel(128)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "498,332,511,331,515,334,515,342,520,344,520,353,500,355",
                alt: "Tampa Terminal Area Chart",
                onmouseover: "cs.on(129,'Tampa Terminal Area Chart')",
                onmouseout: "cs.off(129)",
                href: "javascript:cs.sel(129)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "510,322,537,319,539,341,520,344,515,342,515,334,511,331",
                alt: "Orlando Terminal Area Chart",
                onmouseover: "cs.on(131,'Orlando Terminal Area Chart')",
                onmouseout: "cs.off(131)",
                href: "javascript:cs.sel(131)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "238,190,265,191,264,213,237,212",
                alt: "Colorado Springs Terminal Area Chart",
                onmouseover: "cs.on(132,'Colorado Springs Terminal Area Chart')",
                onmouseout: "cs.off(132)",
                href: "javascript:cs.sel(132)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "147,207,171,213,174,219,172,232,142,228",
                alt: "Grand Canyon VFR Chart",
                onmouseover: "cs.on(230,'Grand Canyon VFR Chart')",
                onmouseout: "cs.off(230)",
                href: "javascript:cs.sel(230)",
              },
            },
          ],
        },
        {
          tag: "map",
          attributes: { name: "enroutelowmap", id: "enroutelowmap" },
          children: [
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "83,10,117,21,90,107,55,98",
                alt: "Enroute L-1",
                onmouseover: "cs.on(401,'Enroute L-1')",
                onmouseout: "cs.off(401)",
                href: "javascript:cs.sel(401)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "55,98,90,107,79,163,51,168,53,179,40,178",
                alt: "Enroute L-2",
                onmouseover: "cs.on(402,'Enroute L-2')",
                onmouseout: "cs.off(402)",
                href: "javascript:cs.sel(402)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "81,151,85,151,85,205,62,234,53,179,51,168,79,163",
                alt: "Enroute L-3",
                onmouseover: "cs.on(403,'Enroute L-3')",
                onmouseout: "cs.off(403)",
                href: "javascript:cs.sel(403)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "69,225,126,238,119,267,55,243,60,228,62,234",
                alt: "Enroute L-4",
                onmouseover: "cs.on(404,'Enroute L-4')",
                onmouseout: "cs.off(404)",
                href: "javascript:cs.sel(404)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "126,238,139,239,140,247,207,253,201,298,112,278,115,265,119,267",
                alt: "Enroute L-5",
                onmouseover: "cs.on(405,'Enroute L-5')",
                onmouseout: "cs.off(405)",
                href: "javascript:cs.sel(405)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "207,253,281,253,281,296,258,296,258,339,214,339,214,298,201,298",
                alt: "Enroute L-6",
                onmouseover: "cs.on(406,'Enroute L-6')",
                onmouseout: "cs.off(406)",
                href: "javascript:cs.sel(406)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "85,205,141,209,139,239,125,238,69,225",
                alt: "Enroute L-7",
                onmouseover: "cs.on(407,'Enroute L-7')",
                onmouseout: "cs.off(407)",
                href: "javascript:cs.sel(407)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "141,209,241,210,242,253,207,253,140,247,139,239",
                alt: "Enroute L-8",
                onmouseover: "cs.on(408,'Enroute L-8')",
                onmouseout: "cs.off(408)",
                href: "javascript:cs.sel(408)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "85,151,89,149,240,167,238,210,141,209,85,205",
                alt: "Enroute L-9",
                onmouseover: "cs.on(409,'Enroute L-9')",
                onmouseout: "cs.off(409)",
                href: "javascript:cs.sel(409)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "240,167,361,170,361,209,358,214,241,214,241,210,238,210",
                alt: "Enroute L-10",
                onmouseover: "cs.on(410,'Enroute L-10')",
                onmouseout: "cs.off(410)",
                href: "javascript:cs.sel(410)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "94,93,241,120,236,167,89,149,85,151,81,151,90,107",
                alt: "Enroute L-11",
                onmouseover: "cs.on(411,'Enroute L-11')",
                onmouseout: "cs.off(411)",
                href: "javascript:cs.sel(411)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "241,120,275,112,371,118,378,122,377,166,372,170,360,170,240,167,236,167",
                alt: "Enroute L-12",
                onmouseover: "cs.on(412,'Enroute L-12')",
                onmouseout: "cs.off(412)",
                href: "javascript:cs.sel(412)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "115,26,281,56,275,112,241,120,94,93",
                alt: "Enroute L-13",
                onmouseover: "cs.on(413,'Enroute L-13')",
                onmouseout: "cs.off(413)",
                href: "javascript:cs.sel(413)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "281,56,419,63,415,123,378,122,371,118,275,112",
                alt: "Enroute L-14",
                onmouseover: "cs.on(414,'Enroute L-14')",
                onmouseout: "cs.off(414)",
                href: "javascript:cs.sel(414)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "241,214,355,214,355,253,281,253,242,253",
                alt: "Enroute L-15",
                onmouseover: "cs.on(415,'Enroute L-15')",
                onmouseout: "cs.off(415)",
                href: "javascript:cs.sel(415)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "361,209,456,209,456,253,355,253,355,214,358,214",
                alt: "Enroute L-16",
                onmouseover: "cs.on(416,'Enroute L-16')",
                onmouseout: "cs.off(416)",
                href: "javascript:cs.sel(416)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "281,253,383,253,383,296,281,296",
                alt: "Enroute L-17",
                onmouseover: "cs.on(417,'Enroute L-17')",
                onmouseout: "cs.off(417)",
                href: "javascript:cs.sel(417)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "383,253,496,253,496,296,383,296",
                alt: "Enroute L-18",
                onmouseover: "cs.on(418,'Enroute L-18')",
                onmouseout: "cs.off(418)",
                href: "javascript:cs.sel(418)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "258,296,371,296,370,328,350,339,258,339",
                alt: "Enroute L-19",
                onmouseover: "cs.on(419,'Enroute L-19')",
                onmouseout: "cs.off(419)",
                href: "javascript:cs.sel(419)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "269,339,350,339,333,350,326,361,326,383,269,383",
                alt: "Enroute L-20",
                onmouseover: "cs.on(420,'Enroute L-20')",
                onmouseout: "cs.off(420)",
                href: "javascript:cs.sel(420)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "370,328,419,331,427,319,461,317,471,325,487,318,501,328,501,346,525,375,525,403,317,403,317,383,326,383,326,361,333,350,350,339",
                alt: "Enroute L-21",
                onmouseover: "cs.on(421,'Enroute L-21')",
                onmouseout: "cs.off(421)",
                href: "javascript:cs.sel(421)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "371,296,496,296,496,325,487,318,471,325,461,317,427,319,419,331,370,328",
                alt: "Enroute L-22",
                onmouseover: "cs.on(422,'Enroute L-22')",
                onmouseout: "cs.off(422)",
                href: "javascript:cs.sel(422)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "501,346,593,346,593,390,525,390,525,375",
                alt: "Enroute L-23",
                onmouseover: "cs.on(423,'Enroute L-23')",
                onmouseout: "cs.off(423)",
                href: "javascript:cs.sel(423)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "496,253,528,253,540,260,540,346,501,346,501,328,496,325",
                alt: "Enroute L-24",
                onmouseover: "cs.on(424,'Enroute L-24')",
                onmouseout: "cs.off(424)",
                href: "javascript:cs.sel(424)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "456,222,528,222,528,253,456,253",
                alt: "Enroute L-25",
                onmouseover: "cs.on(425,'Enroute L-25')",
                onmouseout: "cs.off(425)",
                href: "javascript:cs.sel(425)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "456,192,534,192,528,222,456,222",
                alt: "Enroute L-26",
                onmouseover: "cs.on(426,'Enroute L-26')",
                onmouseout: "cs.off(426)",
                href: "javascript:cs.sel(426)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "377,166,474,166,474,192,456,192,456,209,361,209,361,170,372,170",
                alt: "Enroute L-27",
                onmouseover: "cs.on(427,'Enroute L-27')",
                onmouseout: "cs.off(427)",
                href: "javascript:cs.sel(427)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "378,122,415,123,478,123,478,161,474,166,377,166",
                alt: "Enroute L-28",
                onmouseover: "cs.on(428,'Enroute L-28')",
                onmouseout: "cs.off(428)",
                href: "javascript:cs.sel(428)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "478,161,549,162,546,182,534,192,474,192,474,166",
                alt: "Enroute L-29",
                onmouseover: "cs.on(429,'Enroute L-29')",
                onmouseout: "cs.off(429)",
                href: "javascript:cs.sel(429)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "478,131,551,131,552,148,549,162,478,161",
                alt: "Enroute L-30",
                onmouseover: "cs.on(430,'Enroute L-30')",
                onmouseout: "cs.off(430)",
                href: "javascript:cs.sel(430)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "418,71,523,85,528,131,478,131,478,123,415,123",
                alt: "Enroute L-31",
                onmouseover: "cs.on(431,'Enroute L-31')",
                onmouseout: "cs.off(431)",
                href: "javascript:cs.sel(431)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "514,84,647,23,673,79,604,109,602,105,574,118,566,122,546,131,528,131,523,85",
                alt: "Enroute L-32",
                onmouseover: "cs.on(432,'Enroute L-32')",
                onmouseout: "cs.off(432)",
                href: "javascript:cs.sel(432)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "546,131,566,122,602,105,604,109,615,133,557,161,552,149,551,131",
                alt: "Enroute L-33",
                onmouseover: "cs.on(433,'Enroute L-33')",
                onmouseout: "cs.off(433)",
                href: "javascript:cs.sel(433)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "552,149,557,161,588,146,571,180,560,189,546,182,549,162",
                alt: "Enroute L-34",
                onmouseover: "cs.on(434,'Enroute L-34')",
                onmouseout: "cs.off(434)",
                href: "javascript:cs.sel(434)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "586,216,544,264,540,260,528,253,563,198",
                alt: "Enroute L-35",
                onmouseover: "cs.on(435,'Enroute L-35')",
                onmouseout: "cs.off(435)",
                href: "javascript:cs.sel(435)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "571,180,574,182,566,200,563,198,528,253,528,222,534,192,546,182,560,189",
                alt: "Enroute L-36",
                onmouseover: "cs.on(436,'Enroute L-36')",
                onmouseout: "cs.off(436)",
                href: "javascript:cs.sel(436)",
              },
            },
          ],
        },
        {
          tag: "map",
          attributes: { name: "enroutehimap", id: "enroutehimap" },
          children: [
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "553,83,615,117,516,301,453,268",
                alt: "Enroute H-12",
                onmouseover: "cs.on(452,'Enroute H-12')",
                onmouseout: "cs.off(452)",
                href: "javascript:cs.sel(452)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "47,9,272,41,271,46,253,63,250,113,233,125,34,97",
                alt: "Enroute H-1",
                onmouseover: "cs.on(441,'Enroute H-1')",
                onmouseout: "cs.off(441)",
                href: "javascript:cs.sel(441)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "271,46,461,46,461,51,458,55,459,131,437,132,435,135,238,134,233,125,250,113,253,63",
                alt: "Enroute H-2",
                onmouseover: "cs.on(442,'Enroute H-2')",
                onmouseout: "cs.off(442)",
                href: "javascript:cs.sel(442)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "34,97,233,125,238,134,238,216,22,185",
                alt: "Enroute H-3",
                onmouseover: "cs.on(443,'Enroute H-3')",
                onmouseout: "cs.off(443)",
                href: "javascript:cs.sel(443)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "22,185,238,216,232,300,228,304,9,273",
                alt: "Enroute H-4",
                onmouseover: "cs.on(444,'Enroute H-4')",
                onmouseout: "cs.off(444)",
                href: "javascript:cs.sel(444)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "238,134,435,135,448,144,451,212,442,224,237,223,238,216",
                alt: "Enroute H-5",
                onmouseover: "cs.on(445,'Enroute H-5')",
                onmouseout: "cs.off(445)",
                href: "javascript:cs.sel(445)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "237,223,442,224,446,310,412,313,227,313,228,304,232,300",
                alt: "Enroute H-6",
                onmouseover: "cs.on(446,'Enroute H-6')",
                onmouseout: "cs.off(446)",
                href: "javascript:cs.sel(446)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "227,313,413,313,434,311,435,385,455,397,455,403,227,402",
                alt: "Enroute H-7",
                onmouseover: "cs.on(447,'Enroute H-7')",
                onmouseout: "cs.off(447)",
                href: "javascript:cs.sel(447)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "446,308,640,297,645,387,455,397,435,385,434,311,446,310",
                alt: "Enroute H-8",
                onmouseover: "cs.on(448,'Enroute H-8')",
                onmouseout: "cs.off(448)",
                href: "javascript:cs.sel(448)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "442,224,447,218,659,207,664,295,640,297,446,308",
                alt: "Enroute H-9",
                onmouseover: "cs.on(449,'Enroute H-9')",
                onmouseout: "cs.off(449)",
                href: "javascript:cs.sel(449)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "459,131,662,123,667,206,659,207,447,218,451,212,448,144,435,135,437,132",
                alt: "Enroute H-10",
                onmouseover: "cs.on(450,'Enroute H-10')",
                onmouseout: "cs.off(450)",
                href: "javascript:cs.sel(450)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "461,51,657,41,662,123,459,131,458,55",
                alt: "Enroute H-11",
                onmouseover: "cs.on(451,'Enroute H-11')",
                onmouseout: "cs.off(451)",
                href: "javascript:cs.sel(451)",
              },
            },
          ],
        },
        {
          tag: "map",
          attributes: { name: "areamap", id: "areamap" },
          children: [
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "467,259,483,258,484,274,469,275",
                alt: "Atlanta Area Chart",
                onmouseover: "cs.on(460,'Atlanta Area Chart')",
                onmouseout: "cs.off(460)",
                href: "javascript:cs.sel(460)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "416,137,433,136,435,165,419,166",
                alt: "Chicago Area Chart",
                onmouseover: "cs.on(461,'Chicago Area Chart')",
                onmouseout: "cs.off(461)",
                href: "javascript:cs.sel(461)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "242,173,261,174,260,192,242,191",
                alt: "Denver Area Chart",
                onmouseover: "cs.on(462,'Denver Area Chart')",
                onmouseout: "cs.off(462)",
                href: "javascript:cs.sel(462)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "465,139,480,138,481,152,466,152",
                alt: "Detroit Area Chart",
                onmouseover: "cs.on(463,'Detroit Area Chart')",
                onmouseout: "cs.off(463)",
                href: "javascript:cs.sel(463)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "315,270,343,270,342,305,315,305",
                alt: "Dallas - Ft. Worth Area Chart",
                onmouseover: "cs.on(464,'Dallas - Ft. Worth Area Chart')",
                onmouseout: "cs.off(464)",
                href: "javascript:cs.sel(464)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "505,299,522,297,524,313,508,315",
                alt: "Jacksonville Area Chart",
                onmouseover: "cs.on(466,'Jacksonville Area Chart')",
                onmouseout: "cs.off(466)",
                href: "javascript:cs.sel(466)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "350,189,367,189,367,205,350,205",
                alt: "Kansas City Area Chart",
                onmouseover: "cs.on(468,'Kansas City Area Chart')",
                onmouseout: "cs.off(468)",
                href: "javascript:cs.sel(468)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "81,222,106,233,101,246,77,236",
                alt: "Los Angeles Area Chart",
                onmouseover: "cs.on(469,'Los Angeles Area Chart')",
                onmouseout: "cs.off(469)",
                href: "javascript:cs.sel(469)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "531,360,547,358,549,375,533,376",
                alt: "Miami Area Chart",
                onmouseover: "cs.on(470,'Miami Area Chart')",
                onmouseout: "cs.off(470)",
                href: "javascript:cs.sel(470)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "361,109,382,109,382,129,361,129",
                alt: "Minneapolis - St. Paul Area Chart",
                onmouseover: "cs.on(471,'Minneapolis - St. Paul Area Chart')",
                onmouseout: "cs.off(471)",
                href: "javascript:cs.sel(471)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "148,245,171,249,167,271,145,267",
                alt: "Phoenix Area Chart",
                onmouseover: "cs.on(473,'Phoenix Area Chart')",
                onmouseout: "cs.off(473)",
                href: "javascript:cs.sel(473)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "54,161,70,166,65,182,49,176",
                alt: "San Francisco Area Chart",
                onmouseover: "cs.on(474,'San Francisco Area Chart')",
                onmouseout: "cs.off(474)",
                href: "javascript:cs.sel(474)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "395,194,412,194,412,210,395,210",
                alt: "St. Louis Area Chart",
                onmouseover: "cs.on(475,'St. Louis Area Chart')",
                onmouseout: "cs.off(475)",
                href: "javascript:cs.sel(475)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "526,161,568,154,574,188,532,196",
                alt: "D.C. Area Chart",
                onmouseover: "cs.on(477,'D.C. Area Chart')",
                onmouseout: "cs.off(477)",
                href: "javascript:cs.sel(477)",
              },
            },
          ],
        },
        {
          tag: "map",
          attributes: { name: "helimap", id: "helimap" },
          children: [
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "570,149,574,149,574,152,570,152",
                alt: "New York Helicopter Chart Inset",
                onmouseover: "cs.on(206,'New York Helicopter Chart Inset')",
                onmouseout: "cs.off(206)",
                href: "javascript:cs.sel(206)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "594,118,599,118,599,124,594,124",
                alt: "Boston Helicopter Chart Inset",
                onmouseover: "cs.on(216,'Boston Helicopter Chart Inset')",
                onmouseout: "cs.off(216)",
                href: "javascript:cs.sel(216)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "544,181,548,181,548,184,544,184",
                alt: "D.C. Helicopter Chart Inset",
                onmouseover: "cs.on(215,'D.C. Helicopter Chart Inset')",
                onmouseout: "cs.off(215)",
                href: "javascript:cs.sel(215)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "328,282,334,282,334,288,328,288",
                alt: "Dallas Helicopter Chart Inset",
                onmouseover: "cs.on(210,'Dallas Helicopter Chart Inset')",
                onmouseout: "cs.off(210)",
                href: "javascript:cs.sel(210)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "176,157,180,157,180,162,176,162",
                alt: "Salt Lake City Helicopter Chart Inset",
                onmouseover: "cs.on(212,'Salt Lake City Helicopter Chart Inset')",
                onmouseout: "cs.off(212)",
                href: "javascript:cs.sel(212)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "177,151,181,151,181,156,177,156",
                alt: "Ogden Helicopter Chart Inset",
                onmouseover: "cs.on(214,'Ogden Helicopter Chart Inset')",
                onmouseout: "cs.off(214)",
                href: "javascript:cs.sel(214)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "564,146,575,141,579,156,568,157,563,152",
                alt: "New York Helicopter Chart",
                onmouseover: "cs.on(200,'New York Helicopter Chart')",
                onmouseout: "cs.off(200)",
                href: "javascript:cs.sel(200)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "575,141,593,136,597,150,579,156",
                alt: "Long Island Helicopter Chart",
                onmouseover: "cs.on(218,'Long Island Helicopter Chart')",
                onmouseout: "cs.off(218)",
                href: "javascript:cs.sel(218)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "588,115,602,112,605,127,591,130",
                alt: "Boston Helicopter Chart",
                onmouseover: "cs.on(205,'Boston Helicopter Chart')",
                onmouseout: "cs.off(205)",
                href: "javascript:cs.sel(205)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "536,178,543,178,556,180,556,188,537,189",
                alt: "D.C. Helicopter Chart",
                onmouseover: "cs.on(203,'D.C. Helicopter Chart')",
                onmouseout: "cs.off(203)",
                href: "javascript:cs.sel(203)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "543,178,542,171,554,170,556,180",
                alt: "Baltimore Helicopter Chart",
                onmouseover: "cs.on(204,'Baltimore Helicopter Chart')",
                onmouseout: "cs.off(204)",
                href: "javascript:cs.sel(204)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "462,139,480,137,481,153,463,154",
                alt: "Detroit Helicopter Chart",
                onmouseover: "cs.on(208,'Detroit Helicopter Chart')",
                onmouseout: "cs.off(208)",
                href: "javascript:cs.sel(208)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "418,147,435,147,435,164,418,164",
                alt: "Chicago Helicopter Chart",
                onmouseover: "cs.on(207,'Chicago Helicopter Chart')",
                onmouseout: "cs.off(207)",
                href: "javascript:cs.sel(207)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "320,276,341,276,341,293,320,293",
                alt: "Dallas Helicopter Chart",
                onmouseover: "cs.on(209,'Dallas Helicopter Chart')",
                onmouseout: "cs.off(209)",
                href: "javascript:cs.sel(209)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "342,317,359,317,359,332,342,332",
                alt: "Houston Helicopter Chart",
                onmouseover: "cs.on(217,'Houston Helicopter Chart')",
                onmouseout: "cs.off(217)",
                href: "javascript:cs.sel(217)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "79,223,95,227,93,232,90,240,86,243,74,238",
                alt: "Los Angeles Helicopter Chart West",
                onmouseover: "cs.on(201,'Los Angeles Helicopter Chart West')",
                onmouseout: "cs.off(201)",
                href: "javascript:cs.sel(201)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "95,227,107,232,104,250,86,243,90,240",
                alt: "Los Angeles Helicopter Chart East",
                onmouseover: "cs.on(202,'Los Angeles Helicopter Chart East')",
                onmouseout: "cs.off(202)",
                href: "javascript:cs.sel(202)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "171,157,186,158,185,170,170,169",
                alt: "Salt Lake City Helicopter Chart",
                onmouseover: "cs.on(211,'Salt Lake City Helicopter Chart')",
                onmouseout: "cs.off(211)",
                href: "javascript:cs.sel(211)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "172,147,188,148,186,158,171,157",
                alt: "Ogden Helicopter Chart",
                onmouseover: "cs.on(213,'Ogden Helicopter Chart')",
                onmouseout: "cs.off(213)",
                href: "javascript:cs.sel(213)",
              },
            },
          ],
        },
        {
          tag: "map",
          attributes: { name: "sectionalmap_ak", id: "sectionalmap_akmap" },
          children: [
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "364,175,406,171,442,166,451,233,365,243",
                alt: "Anchorage Sectional Chart",
                onmouseover: "cs.on(39,'Anchorage Sectional Chart')",
                onmouseout: "cs.off(39)",
                href: "javascript:cs.sel(39)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "202,156,288,174,277,245,274,248,182,232",
                alt: "Bethel Sectional Chart",
                onmouseover: "cs.on(40,'Bethel Sectional Chart')",
                onmouseout: "cs.off(40)",
                href: "javascript:cs.sel(40)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "245,24,330,38,323,108,229,95",
                alt: "Cape Lisburne Sectional Chart",
                onmouseover: "cs.on(41,'Cape Lisburne Sectional Chart')",
                onmouseout: "cs.off(41)",
                href: "javascript:cs.sel(41)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "252,302,339,310,337,346,247,340",
                alt: "Cold Bay Sectional Chart",
                onmouseover: "cs.on(42,'Cold Bay Sectional Chart')",
                onmouseout: "cs.off(42)",
                href: "javascript:cs.sel(42)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "402,104,424,99,487,84,501,151,442,166,406,171",
                alt: "Dawson Sectional Chart",
                onmouseover: "cs.on(43,'Dawson Sectional Chart')",
                onmouseout: "cs.off(43)",
                href: "javascript:cs.sel(43)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "167,285,252,302,247,340,244,370,156,353,155,333",
                alt: "Dutch Harbor Sectional Chart",
                onmouseover: "cs.on(44,'Dutch Harbor Sectional Chart')",
                onmouseout: "cs.off(44)",
                href: "javascript:cs.sel(44)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "323,108,402,104,406,171,364,175,312,175,319,111",
                alt: "Fairbanks Sectional Chart",
                onmouseover: "cs.on(45,'Fairbanks Sectional Chart')",
                onmouseout: "cs.off(45)",
                href: "javascript:cs.sel(45)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "451,233,538,210,555,274,459,300,451,248,453,243",
                alt: "Juneau Sectional Chart",
                onmouseover: "cs.on(46,'Juneau Sectional Chart')",
                onmouseout: "cs.off(46)",
                href: "javascript:cs.sel(46)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "555,274,564,271,582,336,491,362,478,295",
                alt: "Ketchikan Sectional Chart",
                onmouseover: "cs.on(47,'Ketchikan Sectional Chart')",
                onmouseout: "cs.off(47)",
                href: "javascript:cs.sel(47)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "274,248,277,245,278,239,365,243,365,295,348,295,347,311,339,310,267,303",
                alt: "Kodiak Sectional Chart",
                onmouseover: "cs.on(48,'Kodiak Sectional Chart')",
                onmouseout: "cs.off(48)",
                href: "javascript:cs.sel(48)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "288,174,312,175,364,175,365,243,278,239",
                alt: "McGrath Sectional Chart",
                onmouseover: "cs.on(49,'McGrath Sectional Chart')",
                onmouseout: "cs.off(49)",
                href: "javascript:cs.sel(49)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "229,95,323,108,319,111,312,175,288,174,214,159",
                alt: "Nome Sectional Chart",
                onmouseover: "cs.on(50,'Nome Sectional Chart')",
                onmouseout: "cs.off(50)",
                href: "javascript:cs.sel(50)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "330,38,422,30,425,100,402,104,323,108",
                alt: "Point Barrow Sectional Chart",
                onmouseover: "cs.on(51,'Point Barrow Sectional Chart')",
                onmouseout: "cs.off(51)",
                href: "javascript:cs.sel(51)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "361,240,453,231,455,248,363,258",
                alt: "Seward Sectional Chart",
                onmouseover: "cs.on(52,'Seward Sectional Chart')",
                onmouseout: "cs.off(52)",
                href: "javascript:cs.sel(52)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "74,306,60,339,0,311,0,272",
                alt: "Western Aleutian Islands Sectional Chart West",
                onmouseover:
                  "cs.on(53,'Western Aleutian Islands Sectional Chart West')",
                onmouseout: "cs.off(53)",
                href: "javascript:cs.sel(53)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "74,306,155,333,156,353,151,369,60,339",
                alt: "Western Aleutian Islands Sectional Chart East",
                onmouseover:
                  "cs.on(54,'Western Aleutian Islands Sectional Chart East')",
                onmouseout: "cs.off(54)",
                href: "javascript:cs.sel(54)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "442,166,501,151,522,145,538,210,451,233",
                alt: "Whitehorse Sectional Chart",
                onmouseover: "cs.on(55,'Whitehorse Sectional Chart')",
                onmouseout: "cs.off(55)",
                href: "javascript:cs.sel(55)",
              },
            },
          ],
        },
        {
          tag: "map",
          attributes: { name: "tacmap_ak", id: "tacmap_ak" },
          children: [
            {
              tag: "area",
              attributes: {
                shape: "rect",
                coords: "366,149,409,180",
                alt: "Fairbanks Terminal Area Chart",
                onmouseover: "cs.on(130,'Fairbanks Terminal Area Chart')",
                onmouseout: "cs.off(130)",
                href: "javascript:cs.sel(130)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "rect",
                coords: "352,210,394,241",
                alt: "Anchorage Terminal Area Chart",
                onmouseover: "cs.on(100,'Anchorage Terminal Area Chart')",
                onmouseout: "cs.off(100)",
                href: "javascript:cs.sel(100)",
              },
            },
          ],
        },
        {
          tag: "map",
          attributes: { name: "enroutelowmap_ak", id: "enroutelowmap_ak" },
          children: [
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "217,157,468,157,469,289,192,288,192,225,216,223",
                alt: "Alaska Enroute L-3",
                onmouseover: "cs.on(439,'Alaska Enroute L-3')",
                onmouseout: "cs.off(439)",
                href: "javascript:cs.sel(439)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "252,40,456,41,457,171,190,171,189,163,231,103,252,103",
                alt: "Alaska Enroute L-4",
                onmouseover: "cs.on(440,'Alaska Enroute L-4')",
                onmouseout: "cs.off(440)",
                href: "javascript:cs.sel(440)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "421,151,684,363,641,418,558,350,518,399,476,364,516,314,457,266,415,315,340,252",
                alt: "Alaska Enroute L-1",
                onmouseover: "cs.on(437,'Alaska Enroute L-1')",
                onmouseout: "cs.off(437)",
                href: "javascript:cs.sel(437)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "278,258,408,240,420,317,289,337",
                alt: "Alaska Enroute L-2 East",
                onmouseover: "cs.on(456,'Alaska Enroute L-2 East')",
                onmouseout: "cs.off(456)",
                href: "javascript:cs.sel(456)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "149,277,278,258,289,337,159,355",
                alt: "Alaska Enroute L-2 Central",
                onmouseover: "cs.on(457,'Alaska Enroute L-2 Central')",
                onmouseout: "cs.off(457)",
                href: "javascript:cs.sel(457)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "22,287,86,283,87,303,157,298,162,354,28,366",
                alt: "Alaska Enroute L-2 West",
                onmouseover: "cs.on(458,'Alaska Enroute L-2 West')",
                onmouseout: "cs.off(458)",
                href: "javascript:cs.sel(458)",
              },
            },
          ],
        },
        {
          tag: "map",
          attributes: { name: "enroutehimap_ak", id: "enroutehimap_ak" },
          children: [
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords:
                  "342,197,210,166,189,147,339,0,699,363,699,419,595,419,469,294,400,360",
                alt: "Alaska Enroute H-1",
                onmouseover: "cs.on(453,'Alaska Enroute H-1')",
                onmouseout: "cs.off(453)",
                href: "javascript:cs.sel(453)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "0,186,214,167,342,197,400,360,0,397",
                alt: "Alaska Enroute H-2",
                onmouseover: "cs.on(454,'Alaska Enroute H-2')",
                onmouseout: "cs.off(454)",
                href: "javascript:cs.sel(454)",
              },
            },
          ],
        },
        {
          tag: "map",
          attributes: { name: "areamap_ak", id: "areamap_ak" },
          children: [
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "244,140,282,145,276,183,238,176",
                alt: "Nome Area Chart",
                onmouseover: "cs.on(472,'Nome Area Chart')",
                onmouseout: "cs.off(472)",
                href: "javascript:cs.sel(472)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "359,150,410,146,414,184,363,187",
                alt: "Fairbanks Area Chart",
                onmouseover: "cs.on(465,'Fairbanks Area Chart')",
                onmouseout: "cs.off(465)",
                href: "javascript:cs.sel(465)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "357,190,429,206,421,242,383,271,340,261",
                alt: "Anchorage Area Chart",
                onmouseover: "cs.on(459,'Anchorage Area Chart')",
                onmouseout: "cs.off(459)",
                href: "javascript:cs.sel(459)",
              },
            },
            {
              tag: "area",
              attributes: {
                shape: "poly",
                coords: "488,216,533,245,506,286,463,257",
                alt: "Juneau Area Chart",
                onmouseover: "cs.on(467,'Juneau Area Chart')",
                onmouseout: "cs.off(467)",
                href: "javascript:cs.sel(467)",
              },
            },
          ],
        },
      ],
    },
  ];

function addChildren(parent, children) {
    children.forEach(child => {
        const {tag, attributes, children} = child;
        const e = document.createElement(tag);
        parent.appendChild(e);
        for(attribute in attributes) {
            e.setAttribute(attribute, attributes[attribute]);
        }
        if (children) {
            addChildren(e, children);
        }
    });
}

function createChartSelector() {
    var chartSelector = document.getElementById('ChartSelector');

    addChildren(chartSelector, chartselectorstuff[0].children);
}

function chartSel() {
  var _cache = new Object();
  var _on = 0;
  var ak = 0;
  var mY = 0;
  var mX = 0;
  var isIE = false;
  var isIE8 = navigator.userAgent.indexOf("MSIE 8") > 0 ? true : false;
  if (window.ActiveXObject) {
    isIE = true;
  }
  var imgcache = new Array();
  var dims = {
    US: [0, 92],
    AK: [92, 53],
    Sectional: [186, 70],
    TAC: [256, 35],
    Heli: [291, 72],
    ENH: [363, 84],
    ENL: [447, 82],
    Area: [529, 62],
  };
  var sel1 = "US";
  var sel2 = "Sectional";
  function ge(e) {
    if (_cache && _cache[e]) {
      return _cache[e];
    }
    _cache[e] = document.getElementById(e);
    return _cache[e];
  }

  createChartSelector();
  
  this.on = function (id, name) {
    _on = id;
    ge("divChartSelLabel").innerHTML = name;
    ge("divChartSelLabelBack").style.visibility = "visible";
    ge("imgChartSelHighlight").src = "/images/chartsel/hl/hl-" + id + ".gif";
  };
  this.off = function () {
    _on = 0;
    setTimeout("cs._off()", 200);
  };
  this._off = function () {
    if (_on == 0) {
      ge("divChartSelLabel").innerHTML = "";
      ge("divChartSelLabelBack").style.visibility = "hidden";
      ge("imgChartSelHighlight").src = "/images/clear.gif";
    }
  };
  this.sel = function (id) {
    var a = ak == 0 ? 0 : 1;
    if (typeof SkyVector == "object") {
      SkyVector.chartSel(id, mX, mY, a);
      m_mhide("ChartSelector");
      ge("divChartSelLabelBack").style.visibility = "hidden";
    } else {
      window.location =
        "/api/chartSel?id=" + id + "&x=" + mX + "&y=" + mY + "&a=" + a;
    }
  };
  this.bon = function (l, w) {
    ge("cs_bhl").style.backgroundPosition = -1 * l + "px " + (-54 + ak) + "px";
    ge("cs_bhl").style.width = w + "px";
    ge("cs_bhl").style.marginLeft = l + "px";
  };
  this.boff = function () {
    ge("cs_bhl").style.width = "0px";
  };
  this.bsel = function (a, l, w) {
    this.boff();
    if (a == "US" || a == "AK") {
      sel1 = a;
      if (a == "AK") {
        ak = 18;
        ge("imgChartSelbase").src = "/images/chartsel/base_ak.jpg";
        ge("cs_bsel0").style.backgroundPosition = "0px 0px";
        this.bsel(sel2, dims[sel2][0], dims[sel2][1]);
      } else {
        ak = 0;
        ge("imgChartSelbase").src = "/images/chartsel/base.jpg";
        ge("cs_bsel0").style.backgroundPosition = "0px -18px";
        this.bsel(sel2, dims[sel2][0], dims[sel2][1]);
      }
    } else {
        sel2 = a;
        var srcroot = {
            Sectional: 'sectional',
            TAC: 'tac',
            Heli: 'heli',
            ENL: 'loenr',
            ENH: 'hienr',
            Area: 'area',
        }[a]
        
        if (srcroot) {
            var maproot = {
                Sectional: '#sectionalmap',
                TAC: '#tacmap',
                Heli: '#helimap',
                ENL: '#enroutelowmap',
                ENH: '#enroutehimap',
                Area: '#areamap'
            }[a];

            if (ak) {
                srcroot += '_ak';
                maproot += '_ak';
            }

            ge("imgChartSelover").src = "/images/chartsel/layer_" + srcroot + ".gif";
            ge("imgChartSelMap").setAttribute("usemap", maproot);
            ge("imgChartSelMap").useMap = maproot;
        }
    }
    ge("cs_bsel1").style.backgroundPosition =
      -1 * dims[sel1][0] + "px " + (-90 + ak) + "px";
    ge("cs_bsel1").style.width = dims[sel1][1] + "px";
    ge("cs_bsel1").style.marginLeft = dims[sel1][0] + "px";
    ge("cs_bsel2").style.backgroundPosition =
      -1 * dims[sel2][0] + "px " + (-90 + ak) + "px";
    ge("cs_bsel2").style.width = dims[sel2][1] + "px";
    ge("cs_bsel2").style.marginLeft = dims[sel2][0] + "px";
  };
  this.preload = function () {
    if (imgcache.length == 0) {
      for (var i = 1; i < 10; i++) {
        imgcache[i] = new Image();
        imgcache[i].src = "/images/chartsel/hl/hl-" + i + ".gif";
      }
      var map = ge("ChartSelector");
      var mousemove = function (e) {
        if (!e) {
          e = window.event;
        }
        mX = e.clientX - (map.offsetLeft + 2);
        mY = e.clientY - (map.offsetTop + 2);
        //ge('divChartSelLabel').innerHTML="xy="+mX+","+mY;
      };
      if (map.addEventListener) {
        map.addEventListener("mousemove", mousemove);
      } else {
        map.attachEvent("onmousemove", mousemove);
      }
    }
  };
  function getScroll() {
    var sX = 0,
      sY = 0;
    if (typeof window.pageYOffset == "number") {
      sX = window.pageXOffset;
      sY = window.pageYOffset;
    } else if (
      document.body &&
      (document.body.scrollLeft || document.body.scrollTop)
    ) {
      sX = document.body.scrollLeft;
      sY = document.body.scrollTop;
    } else if (
      document.documentElement &&
      (document.documentElement.scrollLeft ||
        document.documentElement.scrollTop)
    ) {
      sX = document.documentElement.scrollLeft;
      sY = document.documentElement.scrollTop;
    }
    return [sX, sY];
  }
}

var cs;
window.onload = function () {
    cs = new chartSel();
};

var m_data = {};

function initMenu(tabid, divid, click) {
  var tdiv = document.getElementById(tabid);
  var mdiv = document.getElementById(divid);
  if (click) {
    m_data[divid] = { mdiv: mdiv, displayon: false, to: false };
    tdiv.onclick = function () {
      var d = divid;
      m_mover(d);
    };
    tdiv.onmouseout = function () {
      var d = divid;
      m_mout(d);
    };
  } else {
    if (tdiv && mdiv) {
      m_data[divid] = { mdiv: mdiv, displayon: false, to: false };
      tdiv.onmouseover = function () {
        var d = divid;
        m_mover(d);
      };
      tdiv.onmouseout = function () {
        var d = divid;
        m_mout(d);
      };
    }
  }
}

function m_mover(divid) {
  cs.preload();
  if (m_data[divid].to) {
    clearTimeout(m_data[divid].to);
    m_data[divid].to = false;
  }
  if (!m_data[divid].displayon) {
    var mdiv = m_data[divid].mdiv;
    if (mdiv) {
      mdiv.style.visibility = "visible";
      m_data[divid].displayon = true;
      mdiv.onmouseover = function () {
        var d = divid;
        m_mover(d);
      };
      mdiv.onmouseout = function () {
        var d = divid;
        m_mout(d);
      };
      //mdiv.onclick=function () { var d=divid; m_mhide(d) };
    } else {
    }
  }
}

function m_mout(divid) {
  if (m_data[divid] && m_data[divid].to) {
    clearTimeout(m_data[divid].to);
    m_data[divid].to = false;
  }
  if (!m_data[divid]) {
    m_data[divid] = {};
  }
  m_data[divid].to = setTimeout('m_mhide("' + divid + '");', 200);
}

function m_mhide(divid) {
  mdiv = m_data[divid].mdiv;
  if (m_data[divid].to) {
    clearTimeout(m_data[divid].to);
    m_data[divid].to = false;
  }
  if (mdiv) {
    mdiv.onmouseover = null;
    mdiv.onmouseout = null;
    mdiv.style.visibility = "hidden";
    m_data[divid].displayon = false;
  }
}
