/*##############################################################################
#                                                                              #
#                 This file is Copyright SkyVector.com 2005-2016               #
#                             ALL RIGHTS RESERVED.                             #
#                                                                              #
# You may not use this file or any part thereof for any purpose other than its #
# original intended use.                                                       #
#                                                                              #
# Specifically, permission is granted ONLY TO EXECUTE the code contained       #
# herein.                                                                      #
#                                                                              #
# Any disassembly, study, reverse engineering, or other activity intended to   #
# educate or illuminate the reader is not permitted. Any attempt to reproduce  #
# the functionality provided by the code in this file by any knowledge gained  #
# through the study of this file is expressly prohibited.                      #
#                                                                              #
# Inventions contained in this file and portions thereof may be protected by   #
# one or more patents, pending and/or issued. Any infringement will be         #
# vigorously prosecuted to the fullest extent of the law.                      #
#                                                                              #
# This file, portions thereof, and any inventions or methods detailed within   #
# it are TRADE SECRETS owned by SkyVector.com. Any misappropriation or         #
# theft of the TRADE SECRETS contained herein is a                             #
#                                                                              #
#                   FEDERAL CRIME under 18 U.S.C. 1832-1839.                   #
#                                                                              #
##############################################################################*/
"use strict";
var SkyVectorCodePresent = true;

var SkyVector = {
    data: {
        protoid: 0,
        edition: 0,
        scale: 10,
        width: 0,
        height: 0,
        chartwidth: 0,
        chartheight: 0,
        p: {x: 0,y: 0},
        plan: {ver: 0},
        png: '.png',
        mouse: {x: 0,y: 0,ox: 0,oy: 0},
        whilemove: false,
        afterwheel: false,
        datalayer: false,
        datalayerver: 1,
        nowheel: false,
        wheelDelta: 0,
        chartName: '',
        chartType: '',
        chartSubtype: '',
        expires: '',
        rasterKey: '',
        proj: {
            srs: {},
            pi: 3.1415926535897932384626433832795028841971693993751,
            deg2rad: 0.01745329251994329576923690768488612713442871888541,
            rad2deg: 57.29577951308232087679815481410517033240547246656442,
            wgs_a: 6378137.0,
            wgs_e: 0.0818191908429643,
            mkM: function(lat) {
                return Math.cos(lat) / Math.sqrt(1.0 - Math.pow(this.wgs_e * Math.sin(lat), 2));
            },
            mkT: function(lat) {
                var a = this.wgs_e * Math.sin(lat);
                var b = Math.pow(((1.0 - a) / (1.0 + a)), this.wgs_e / 2);
                return (Math.tan((this.pi / 2 - lat) / 2) / b);
            },
            wrap: function(lon) {
                if (Math.abs(lon) > this.pi) {
                    if (lon < 0.0) {
                        lon += 2 * this.pi;
                    } else {
                        lon -= 2 * this.pi;
                    }
                }
                return lon;
            }
        },
        canvas: false,
        canvasTargets: {hover: [],click: []},
        isIE: (window.ActiveXObject ? true : false),
        IEVersion: /MSIE\s+(\d+)/.exec(navigator.userAgent),
        isIE6: (navigator.userAgent.indexOf("MSIE 6") > 0 ? true : false),
        isIE7: (navigator.userAgent.indexOf("MSIE 7") > 0 ? true : false),
        isIE8: (navigator.userAgent.indexOf("MSIE 8") > 0 ? true : false),
        isIE9: (navigator.userAgent.indexOf("MSIE 9") > 0 ? true : false),
        isFF: (navigator.userAgent.indexOf("Firefox") > 0 ? true : false),
        isSafari: (navigator.userAgent.indexOf("Safari") > 0 ? true : false),
        isMobile: (navigator.userAgent.indexOf("Mobile") > 0 ? true : false),
        isWebkit: (navigator.userAgent.indexOf("WebKit") > 0 ? true : false),
        isWebkit3D: (navigator.userAgent.indexOf("iPad") > 0 || navigator.userAgent.indexOf("iPhone") > 0 ? true : false),
        scalors1: [.75, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048],
        scalors2: [2 / 3, 1, 4 / 3, 2, 8 / 3, 4, 16 / 3, 8, 32 / 3, 16, 64 / 3, 32, 128 / 3, 64, 256 / 3, 128, 512 / 3, 256, 1024 / 3, 512, 2048 / 3, 1024, 4096 / 3, 2048],
        overzoom: 0,
        // scale never goes below 1, but overzoom allows for effective scaling to be less than 1:
        // scale   overzoom    effective scale
        //   3        0        3
        //   2        0        2
        //   1        0        1
        //   1        1        0
        //   1        2       -1
        //   1        3       -2
        maxoverzoom: 10,
        overzoomFn: function (overzoom) {
            if (!this.scalors) { // might not be defined yet
                return 1;
            }
            
            return this.scalors[overzoom + 1];
        },
        scalorFn: function (scale, overzoom) {
            return this.scalors[scale] / this.overzoomFn(overzoom);
        },
        devicePixelRatioFn: function() {
            var s = 1 / this.overzoomFn(this.overzoom);
            return s * this.devicePixelRatio;
        },
        tilesize: 0,
        tileurl: 'https://t.skyvector.com/',
        tileservers: false,
        perldir: '/api',
        images: '/images/chart',
        cookie: false,
        param: false,
        div: {planlines: [],planpoints: [],planpointsie: [],settingsLabels: {}},
        ztiles: [],
        zztiles: [],
        tiles: [],
        htiles: 0,
        vtiles: 0,
        imgCache: {},
        cacheCount: 0,
        cacheLimit: 100,
        lat: false,
        lon: false,
        wx: 1,
        gesture: {},
        rLayers: [],
        sDraw: false,
        vReady: (window.ActiveXObject ? false : true),
        vectorCache: false,
        addNSTO: false,
        shapeclickon: false,
        settings: {
            topbar: true,
            zoomer: true,
            switchers: true,
            ch: true,
            href: false,
            bb: '',
            plandata: true,
            allowed_charts: false,
            layers_raster: ['nexrad', 'sat','cloudtop','cloudtopfilter'],
            layers_vector: ['tfr', 'metar', 'am-z', 'am-tt', 'am-si', 'am-sm', 'am-tw', 'am-unk', 'sm-co', 'sm-cv,sm-int,sm-unk', 'sm-int', 'jeta', 'avgas', 'mogas', 
                'aff_fuelbrand_uvair_net', 
                'aff_fuelbrand_epic', 'aff_fuelbrand_avfuel', 'aff_fuelbrand_phillips', 'aff_fuelbrand_shell', 'aff_dca',
                'aff_epiccard', 'aff_aircard','aff_usgcf', 'aff_alliance', 'aff_avcard', 'aff_colt', 'aff_multiservice', 'aff_uvair', 'aff_tailwins', 'aff_avtrip', 'aff_bravo', 'aff_flybuys', 'aff_wingpoints', 'aff_safety1st', 'aff_wsi', 'aff_tsa','aff_customs', 'aff_caa', 'aff_snacks', 'aff_crewcar', 'aff_titan_contractfuel','aff_titan_rewards', 
                'aff_alamo', 'aff_avis', 'aff_budget', 'aff_enterprise', 'aff_hertz', 'aff_national','aff_gorentals', 'natw', 'nate', 'patw', 'pate', 'ausots-a', 'ausots-b', 'ausots-e', 'winds', 'cadiz', 'drotam','drotam200','pirep','saf'],
            layers_on: ['tfr', 'metar'],
            departure: '',
            destination: '',
            enabled: {},
            routes: [],
            tpp: [],
            etops: [],
            avoidFirs: [],
            colormap: {},
            labels: true
        },
        throbber: {},
        initArgs: false,
        initDivID: false,
        isPlanDragging: false,
        planver: -1,
        selectlist: {
            currency: [
                ['USD', 'US Dollar', '.'], 
                ['EUR', 'Euro', ','], 
                ['JPY', 'Japanese Yen', '.'], 
                ['GBP', 'British Pound Sterling', '.'], 
                ['CHF', 'Swiss Franc', '.'], 
                ['AUD', 'Australian Dollar', '.'], 
                ['CAD', 'Canadian Dollar', '.'], 
                ['', '', '.'], 
                ['AED', 'UAE Dirham', ','], 
                ['ANG', 'Netherlands Antillean Guilder', ','], 
                ['ARS', 'Argentine Peso', ','], 
                ['AUD', 'Australian Dollar', '.'], 
                ['BDT', 'Bangladeshi Taka', '.'], 
                ['BGN', 'Bulgarian Lev', ','], 
                ['BHD', 'Bahraini Dinar', ','], 
                ['BND', 'Brunei Dollar', '.'], 
                ['BOB', 'Bolivian Boliviano', ','], 
                ['BRL', 'Brazilian Real', ','], 
                ['BWP', 'Botswanan Pula', '.'], 
                ['CAD', 'Canadian Dollar', '.'], 
                ['CHF', 'Swiss Franc', '.'], 
                ['CLP', 'Chilean Peso', ','], 
                ['CNY', 'Chinese Yuan', '.'], 
                ['COP', 'Colombian Peso', ','], 
                ['CRC', 'Costa Rican Colón', ','], 
                ['CZK', 'Czech Republic Koruna', ','], 
                ['DKK', 'Danish Krone', ','], 
                ['DOP', 'Dominican Peso', '.'], 
                ['DZD', 'Algerian Dinar', '.'], 
                ['EGP', 'Egyptian Pound', '.'], 
                ['EUR', 'Euro', ','], 
                ['FJD', 'Fijian Dollar', '.'], 
                ['GBP', 'British Pound Sterling', '.'], 
                ['HKD', 'Hong Kong Dollar', '.'], 
                ['HNL', 'Honduran Lempira', ','], 
                ['HRK', 'Croatian Kuna', ','], 
                ['HUF', 'Hungarian Forint', ','], 
                ['IDR', 'Indonesian Rupiah', ','], 
                ['ILS', 'Israeli New Sheqel', ','], 
                ['INR', 'Indian Rupee', '.'], 
                ['ISK', 'Icelandic Kroner', '.'], 
                ['JMD', 'Jamaican Dollar', ','], 
                ['JOD', 'Jordanian Dinar', ','], 
                ['JPY', 'Japanese Yen', '.'], 
                ['KES', 'Kenyan Shilling', '.'], 
                ['KRW', 'South Korean Won', '.'], 
                ['KWD', 'Kuwaiti Dinar', ','], 
                ['KYD', 'Cayman Islands Dollar', ','], 
                ['KZT', 'Kazakhstani Tenge', ','], 
                ['LBP', 'Lebanese Pound', ','], 
                ['LKR', 'Sri Lankan Rupee', '.'], 
                ['MAD', 'Moroccan Dirham', ','], 
                ['MDL', 'Moldovan Leu', ','], 
                ['MKD', 'Macedonian Denar', ','], 
                ['MUR', 'Mauritian Rupee', ','], 
                ['MVR', 'Maldivian Rufiyaa', '.'], 
                ['MXN', 'Mexican Peso', '.'], 
                ['MYR', 'Malaysian Ringgit', '.'], 
                ['NAD', 'Namibian Dollar', '.'], 
                ['NGN', 'Nigerian Naira', '.'], 
                ['NIO', 'Nicaraguan Córdoba', '.'], 
                ['NOK', 'Norwegian Krone', ','], 
                ['NPR', 'Nepalese Rupee', '.'], 
                ['NZD', 'New Zealand Dollar', '.'], 
                ['OMR', 'Omani Rial', ','], 
                ['PEN', 'Peruvian Nuevo Sol', ','], 
                ['PGK', 'Papua New Guinean Kina', ','], 
                ['PHP', 'Philippine Peso', '.'], 
                ['PKR', 'Pakistani Rupee', '.'], 
                ['PLN', 'Polish Zloty', ','], 
                ['PYG', 'Paraguayan Guarani', ','], 
                ['QAR', 'Qatari Rial', ','], 
                ['RON', 'Romanian Leu', ','], 
                ['RSD', 'Serbian Dinar', ','], 
                ['RUB', 'Russian Ruble', ','], 
                ['SAR', 'Saudi Riyal', ','], 
                ['SCR', 'Seychellois Rupee', '.'], 
                ['SEK', 'Swedish Krona', ','], 
                ['SGD', 'Singapore Dollar', '.'], 
                ['SLL', 'Sierra Leonean Leone', '.'], 
                ['SVC', 'Salvadoran Colón', ','], 
                ['THB', 'Thai Baht', '.'], 
                ['TND', 'Tunisian Dinar', ','], 
                ['TRY', 'Turkish Lira', ','], 
                ['TTD', 'Trinidad and Tobago Dollar', ','], 
                ['TWD', 'New Taiwan Dollar', '.'], 
                ['TZS', 'Tanzanian Shilling', '.'], 
                ['UAH', 'Ukrainian Hryvnia', ','], 
                ['UGX', 'Ugandan Shilling', '.'], 
                ['USD', 'US Dollar', '.'], 
                ['UYU', 'Uruguayan Peso', ','], 
                ['UZS', 'Uzbekistan Som', '.'], 
                ['VES', 'Venezuelan Sovereign Bolívar', ','], 
                ['VND', 'Vietnamese Dong', ','], 
                ['XOF', 'CFA Franc BCEAO', '.'], 
                ['YER', 'Yemeni Rial', ','], 
                ['ZAR', 'South African Rand', ','], 
                ['ZMW', 'Zambian Kwacha', '.']
            ],
            units: [['GAL', 'US Gallon', 1.0], ['L', 'Liter', 3.78541], ['lb', 'Pound', 6.79]]
        },
        fuel: {
            curr: 'USD',
            currValue: 1.0,
            cval: 1.0,
            qty: 1,
            unit: 'GAL'
        },
        windLevels: [[0, false, 0], 
            [1000, '360 ft', 360],
            [975, '1100 ft', 1100],
            [950, '1800 ft', 1800],
            [925, '2500 ft', 2500],
            [900, '3200 ft', 3200],
            [850, '4800 ft', 4800],
            [800, '6400 ft', 6400],
            [750, '8100 ft', 8100],
            [700, '10000 ft', 10000],
            [650, '12000 ft', 12000],
            [600, '14000 ft', 14000],
            [550, '16000 ft', 16000],
            [500, 'FL 180', 18000],
            [450, 'FL 210', 21000],
            [400, 'FL 240', 24000],
            [350, 'FL 270', 27000],
            [300, 'FL 300', 30000],
            [250, 'FL 340', 34000],
            [200, 'FL 390', 39000],
            [150, 'FL 440', 44000],
            [100, 'FL 520', 52000],
            [70, 'FL 580', 58000],
            [50, 'FL 630', 63000]],
        prefs: {windMB: 300,windZulu: 1},
        canvasHoverOff: false,
        routeData: {
            orig: undefined,
            dest: undefined,
            eddz: undefined,
            etdz: undefined,
            alt: undefined,
            spd: undefined,
            tail: undefined
        },
        maxframes: 1
    },
    init: function(divID, initArgs) {
        this.data.devicePixelRatio = 1.0;
        if (window.devicePixelRatio) {
            this.data.devicePixelRatio = window.devicePixelRatio > 2.0 ? 2.0 : window.devicePixelRatio;
            this.data.realPixelRatio = window.devicePixelRatio;
        }
        if (this.data.devicePixelRatio > 1.1) {
            this.data.images = this.data.images + "2";
        }
        
        if (this.data.IEVersion) {
            var ieVer = parseInt(this.data.IEVersion[1]);
            if (ieVer > 8) {
                this.data.isIE = false;
                this.data.vReady = true;
                this.data.isIE9plus = true;
            }
        }
        var canvastest = document.createElement('canvas');
        if (canvastest && canvastest.getContext && canvastest.getContext('2d')) {
            this.data.canvas = true;
        }
        this.data.div.chart = document.getElementById(divID);
        if (this.data.div.chart) {
            if (this.data.div.chart.style.height) {
                this.data.noResize = true;
                this.init3(divID, initArgs);
                return;
            }
        }
        this.data.initDivID = divID;
        this.data.initArgs = initArgs;
        if (this.data.isIE){
            window.setTimeout(SkyVector.init2, 400);
        }else{
            window.setTimeout(SkyVector.init2, 20);
        }
    },
    init2: function() {
        var sv = SkyVector;
        sv.init3(sv.data.initDivID, sv.data.initArgs);
    },
    init3: function(divID, initArgs) {
        var sv = this;
        sv.data.forImage = this.param('forImage');
        if (initArgs) {
            for (var i in initArgs) {
                if (i == 'scale') {
                    this.data.scale = parseInt(initArgs[i]);
                } else if (i == 'protoid') {
                    this.data.protoid = parseInt(initArgs[i]);
                } else if (i == 'topbar') {
                    this.data.settings.topbar = initArgs[i];
                } else if (i == 'zoomer') {
                    this.data.settings.zoomer = initArgs[i];
                } else if (i == 'switchers') {
                    this.data.settings.switchers = initArgs[i];
                } else if (i == 'href') {
                    this.data.settings.href = initArgs[i];
                } else if (i == 'ch') {
                    this.data.settings.ch = initArgs[i];
                } else if (i == 'wx') {
                    this.data.wx = initArgs[i] ? 1 : 0;
                } else if (i == 'plandata') {
                    this.data.settings.plandata = initArgs[i];
                } else if (i == 'll') {
                    this.param('ll', initArgs[i]);
                } else if (i == 'bb') {
                    this.data.settings.bb = initArgs[i];
                } else if (i == 'allowed_charts') {
                    this.data.settings.allowed_charts = initArgs[i];
                } else if (i == 'layers_raster') {
                    this.data.settings.layers_raster = initArgs[i];
                } else if (i == 'layers_vector') {
                    this.data.settings.layers_vector = initArgs[i];
                } else if (i == 'layers_on') {
                    if (this.param('layers_on')) {
                        this.data.settings.layers_on = this.param('layers_on').split(',');
                    } else {
                        this.data.settings.layers_on = initArgs[i];
                    }
                } else if (i == 'departure') {
                    this.data.settings.departure = initArgs[i];
                } else if (i == 'destination') {
                    this.data.settings.destination = initArgs[i];
                } else if (i == 'routes') {
                    this.data.settings.routes = initArgs[i];
                } else if (i == 'tpp') {
                    this.data.settings.tpp = initArgs[i];
                } else if (i == 'etops') {
                    this.data.settings.etops = initArgs[i];
                } else if (i == 'avoidFirs') {
                    this.data.settings.avoidFirs = initArgs[i];
                } else if (i == 'tas') {
                    this.data.settings.tas = initArgs[i];
                } else if (i == 'mach') {
                    this.data.settings.mach = initArgs[i];
                } else if (i == 'etd') {
                    this.data.settings.etd = initArgs[i];
                } else if (i == 'FL') {
                    this.data.settings.windFL = initArgs[i];
                } else if (i == 'MSL') {
                    this.data.settings.windMSL = initArgs[i];
                } else if (i == 'fuelstoprwy') {
                    this.data.settings.fuelStopRwy = initArgs[i];
                } else if (i == 'fuelstopdist') {
                    this.data.settings.fuelStopDist = initArgs[i];
                } else if (i == 'labels') {
                    this.data.settings.labels = initArgs[i];
                } else if (i == 'routesToFront') {
                    this.data.settings.routesToFront = initArgs[i];
                }
            
            }
        }
        this.fixCss();
        
        if (this.data.div.chart) {
            this.data.width = this.data.div.chart.clientWidth;
            this.data.height = this.data.div.chart.clientHeight;
            if (this.data.isIE6 && !this.data.noResize) {
                //this.data.width=document.documentElement.clientWidth -170;
                this.data.width = document.documentElement.clientWidth - 8;
                this.data.height = document.documentElement.clientHeight - 90;
                this.data.png = '.gif';
                this.data.div.chart.style.width = this.data.width + "px";
                this.data.div.chart.style.height = this.data.height + "px";
            }
            this.data.div.chart.innerHTML = '';
            var co = this.getPos(this.data.div.chart);
            if (false && this.data.isIE7) {
                co.x += 2;
                co.y += 2;
            }
            this.data.mouse.ox = co.x;
            this.data.mouse.oy = co.y;
            this.data.div.chart.className = "sv sv_chart sv_chartholder";
            if (!this.data.settings.topbar)
                this.data.div.chart.style.border = "1px solid #808080";
            this.data.div.switcher = this.ce("div");
            this.data.div.switcher.className = "sv sv_switcher";
            this.data.div.chart.appendChild(this.data.div.switcher)
            this.data.div.zc = this.ce("img");
            this.data.div.zc.src = this.data.images + "/zc" + this.data.png;
            this.data.div.zc.className = "sv sv_zc hideSmall";
            if (this.data.settings.zoomer)
                this.data.div.chart.appendChild(this.data.div.zc);
            this.data.div.zs = this.ce("img");
            this.data.div.zs.src = this.data.images + "/zs" + this.data.png;
            this.data.div.zs.className = "sv sv_zs hideSmall";
            // zoom fo fpl:
            this.data.div.zfpl = this.ce("img");
            this.data.div.zfpl.style.right = '-666px';
            this.data.div.zfpl.src = this.data.images + "/zfpl" + this.data.png;
            this.data.div.zfpl.className = "sv sv_zfpl hideSmall";
            var sv = this;
            this.data.div.zfpl.onclick = function () {
                if (!sv.data.FPL || !sv.data.FPL.route) {
                    return;
                }
                var minx = Infinity;
                var maxx = -Infinity;
                var miny = Infinity;
                var maxy = -Infinity;
                var lon0 = sv.data.FPL.route[0].lon;

                function noteThisPoint(lat, lon) {
                    while (lon0 - 180 > lon) {
                        lon += 360;
                    }
                    while (lon0 + 180 <= lon) {
                        lon -= 360;
                    }
                    var xy = sv.ll2xy(lat, lon);
                    minx = Math.min(minx, xy.x);
                    maxx = Math.max(maxx, xy.x);
                    miny = Math.min(miny, xy.y);
                    maxy = Math.max(maxy, xy.y);
                }

                for (var i = 0; i < sv.data.FPL.route.length; ++i) {
                    var route = sv.data.FPL.route[i];

                    noteThisPoint(route.lat, route.lon);
                    if (!route.route) {
                        continue;
                    }
                    for (var j = 0; j < route.route.length; ++j) {
                        noteThisPoint(route.route[j].lat, route.route[j].lon);
                    }
                }
                var center = sv.xy2ll((minx + maxx) / 2, (miny + maxy) / 2);
                sv.data.lat = center.lat;
                sv.data.lon = center.lon;
                if (maxx !== minx || maxy !== miny) {
                    var r1 = (maxx - minx) / sv.data.width;
                    var r2 = (maxy - miny) / sv.data.height;
                    var r = Math.max(r1, r2);
                    var scale = Math.ceil(Math.LOG2E * Math.log(r) * 2 + sv.data.scale - sv.data.overzoom + 0.5);
                    var oldoverzoom = sv.data.overzoom;
                    sv.data.scale = scale;
                    sv.data.overzoom = 0;
                    if (sv.data.scale < 1) {
                        sv.data.overzoom = Math.min(1 - sv.data.scale, sv.data.maxoverzoom);
                        sv.data.scale = 1;
                    } else if (sv.data.scale > sv.data.maxzoom) {
                        sv.data.scale = sv.data.maxzoom;
                    }
                    if (sv.data.overzoom !== oldoverzoom) {
                        sv.buildTiles(true);
                    }
                }
                sv.reset();
            };
            if (this.data.settings.zoomer) {
                this.data.div.chart.appendChild(this.data.div.zs);
                this.data.div.chart.appendChild(this.data.div.zfpl);
            }
            this.data.div.slider = this.ce("div");
            this.data.div.slider.className = "sv sv_slider";
            this.data.div.bigeditbtn = this.ce("div");
            var editbtn = this.data.div.bigeditbtn;
            editbtn.className = "sv_bigeditbtn";
            editbtn.style.visibility = 'hidden';
            this.data.div.chart.appendChild(editbtn);
            editbtn.onmouseover = function() {
                editbtn.style.backgroundPosition = "0px -38px";
            }
            editbtn.onmouseout = function() {
                editbtn.style.backgroundPosition = "0px 0px";
            }
            editbtn.onclick = function(e) {
                for (var i = 0; i < sv.data.settings.routes.length; i++) {
                    if (sv.data.settings.routes[i].on) {
                        if (sv.data.settings.routes[i].editBtn.onclick) {
                            sv.data.settings.routes[i].editBtn.onclick(e);
                            break;
                        } else if (sv.data.settings.routes[0].editBtn.click) {
                            sv.data.settings.routes[i].editBtn.click(e);
                            break;
                        }
                    }
                }
            }
            
            
            this.data.div.windForecast = this.ce("div");
            this.data.div.windForecast.className = "sv svwfcast";
            this.data.div.windForecast.style.zIndex = '4';
            this.data.div.windForecast.style.display = 'none';
            
            this.data.div.weather = this.ce("div");
            this.data.div.weather.className = "sv sv_weather";
            this.data.div.slider.appendChild(this.data.div.weather)
            this.shape.svg(true);
            if (this.data.settings.routesToFront)
                this.showSettings(2);
            this.data.div.cross = this.ce("img");
            this.data.div.cross.src = this.data.images + "/crosshairs.gif";
            this.data.div.cross.style.position = 'absolute';
            this.data.div.cross.style.zIndex = '5';
            this.data.div.cross.style.width = "11px";
            this.data.div.cross.style.height = "11px";
            this.data.div.cross.style.left = Math.round((this.data.width / 2) - 5) + "px";
            this.data.div.cross.style.top = Math.round((this.data.height / 2) - 5) + "px";
            
            var glass = this.ce("div");
            this.data.div.glass = glass;
            glass.className = "sv sv_glass";
            glass.style.width = this.data.width + "px";
            glass.style.height = this.data.height + "px";
            this.data.div.chart.appendChild(glass);
            glass.appendChild(this.data.div.slider);
            glass.appendChild(this.data.div.windForecast);
            if (true || this.data.isWebkit3D) {
                this.data.div.zoomer = this.ce("div");
                this.data.div.zoomer.className = "sv sv_zoomer";
                glass.appendChild(this.data.div.zoomer);
            }
            if (!isNaN(window.orientation)) {
                document.body.onorientationchange = this.orient;
                this.data.orientation = window.orientation;
                this.data.origorientation = window.orientation;
                this.data.origheight = this.data.height;
                this.data.origwidth = this.data.width;
            }
            if (!this.data.isMobile && !this.data.noResize) {
                window.onresize = function() {
                    if (sv.data.resizeTO) {
                        window.clearTimeout(sv.data.resizeTO);
                    }
                    sv.data.resizeTO = window.setTimeout(sv.resize, 500);
                    sv.showHideTimeLocation();
                }
            }
            if (this.data.settings.ch)
                glass.appendChild(this.data.div.cross);
            this.data.div.throbber = this.ce("img");
            this.data.div.throbber.id = "sv_throbber";
            this.data.div.throbber.src = this.data.images + "/track.gif";
            this.data.div.throbber.style.left = Math.round((this.data.width / 2) + 1) + "px";
            this.data.div.throbber.style.top = Math.round((this.data.height / 2) + 1) + "px";
            glass.appendChild(this.data.div.throbber);
            // Zoomer Map
            var m = this.ce("map");
            this.data.div.zoomerMap = m;
            m.id = "sv_zcmap";
            m.setAttribute("name", "sv_zcmap");
            var area = this.ce("area");
            area.shape = "rect";
            area.coords = "0,0,30,35";
            area.href = "clickto:Zoom";
            area.onclick = function() {
                sv.zoom('out');
                return false;
            };
            m.appendChild(area);
            area = this.ce("area");
            area.shape = "rect";
            area.coords = "30,0,130,35";
            area.href = "clickto:Zoom";
            area.onclick = function(e) {
                var sp = sv.getPos(sv.data.div.zc)
                var x = sv.data.mouse.x - sp.x;
                var z = Math.round(sv.data.maxzoom * (115 - x) / 72) + 1;
                if (z < 1)
                    z = 1;
                if (z > sv.data.maxzoom)
                    z = sv.data.maxzoom;
                sv.zoom(z);
                return false;
            }
            m.appendChild(area);
            area = this.ce("area");
            area.shape = "rect";
            area.coords = "130,0,160,35";
            area.href = "clickto:Zoom";
            area.onclick = function() {
                sv.zoom('in');
                return false;
            };
            m.appendChild(area);
            this.data.div.chart.appendChild(m);
            this.data.div.zc.useMap = "#sv_zcmap";
            this.data.div.zs.ondrag = function() {
                return false;
            }
            this.data.div.zs.onselectstart = function() {
                return false;
            }
            var pointers = {};
            var drag = {"on": false};
            var event_mouse = function(event){
                //console.log(event.type);
            }
            var event_touch = function(event){
                if (sv.data.settings.href) return;
                event.preventDefault();
                var x = event.changedTouches[0].pageX - sv.data.mouse.ox;
                var y = event.changedTouches[0].pageY - sv.data.mouse.oy;
                if (event.type == 'touchstart'){
                        
                    sv.hideLink();
                    sv.hidesrLink();
                    sv.wxHide();
                    sv.rMenuHide();
                    sv.confirmSnapHide();
                    sv.confirmDeleteHide();
                    sv.hideDeleteDialog();
                    sv.hoveroff();
                    sv.tppMenuHide();
                    sv.data.nowheel = false;
                    if (event.touches.length == 1){
                        event.clientX = x + sv.data.mouse.ox;
                        event.clientY = y + sv.data.mouse.oy - 85;
                        if (event.srcElement.onmouseover) {
                            sv.data.shapeclickon = {"x":x,"y":y};   
                            event.srcElement.onmouseover(event);
                        }else if (event.srcElement.onmousedown) {
                            event.srcElement.onmousedown(event);
                            return;
                        }
                    }
                    if (event.touches.length == event.changedTouches.length){ // first touch
                        var touch = event.changedTouches.item(0);
                        sv.canvasHover(touch);
                        drag.touchid = touch.identifier;
                        drag.x = touch.pageX - sv.data.mouse.ox;
                        drag.y = touch.pageY - sv.data.mouse.oy;
                        drag.startx = sv.data.p.x;
                        drag.starty = sv.data.p.y;
                        drag.on = true;
                        drag.zoom = false;
                    }
                    if (event.touches.length > 1){
                        var touch2 = event.touches.item(1);
                        if (touch2.identifier != drag.touchid){
                            sv.data.shapeclickon = false;
                            drag.x2 = touch2.pageX - sv.data.mouse.ox;
                            drag.y2 = touch2.pageY - sv.data.mouse.oy;
                            drag.touchid2 = touch2.identifier;
                            drag.scaleDistance = Math.sqrt(Math.pow(drag.x2-drag.x,2) + Math.pow(drag.y2-drag.y,2));
                            drag.zoom = true;

                            drag.maxscale = sv.data.scalorFn(sv.data.scale, sv.data.overzoom) / sv.data.scalorFn(1, sv.data.maxoverzoom);
                            var p = sv.ll2xy(sv.data.lat, sv.data.lon);
                            sv.data.slideroffsetx = Math.round(p.x - (sv.data.width / 2)) - 1000;
                            sv.data.slideroffsety = Math.round(p.y - (sv.data.height / 2)) - 1000;
                            for (var i = 0; i < sv.data.vtiles; i++) {
                                for (var j = 0; j < sv.data.htiles; j++) {
                                    sv.data.zztiles[i][j].set();
                                }
                            }
                            drag.ox = (sv.data.slideroffsetx - (sv.data.p.x - sv.data.width/2));
                            drag.oy = (sv.data.slideroffsety - (sv.data.p.y - sv.data.height/2));
                            sv.data.div.zoomer.style.transformOrigin = (drag.x - drag.ox) + "px " + (drag.y - drag.oy) + "px";
                            sv.data.div.zoomer.style.transform = "matrix(1,0,0,1,"+drag.ox+","+drag.oy+")";
                            sv.data.div.zoomer.style.visibility = "visible";
                            //sv.data.div.slider.style.visibility = "hidden";
                            sv.data.div.zoomer.style.zIndex = 5;
                        }
                    }
                }else if (event.type == 'touchmove'){
                    if (drag.on){
                        var touch, touch2;
                        for (var i=0; i < event.touches.length; i++){
                            var t = event.touches.item(i);
                            if  (t.identifier == drag.touchid){
                                touch = t;
                            }else if (t.identifier == drag.touchid2){
                                touch2 = t;
                            }
                        }
                        if (!touch){
                            drag.on = false;
                            drag.zoom = false;
                            return;
                        }
                        if (event.touches.length > 1 && drag.zoom){
                            var scale = event.scale || 1.0;
                            if (!event.scale && touch2){
                                scale = Math.sqrt(Math.pow(touch.clientX-touch2.clientX,2) + Math.pow(touch.clientY-touch2.clientY,2)) / drag.scaleDistance;
                            }
                            if (scale > drag.maxscale) scale = drag.maxscale;
                            drag.scale = scale;
                            drag.t1x = touch.pageX - sv.data.mouse.ox;
                            drag.t1y = touch.pageY - sv.data.mouse.oy;
                            var matrix = "matrix(" + scale + ",0,0," + scale + "," +
                                ((drag.t1x - drag.x) + drag.ox) + "," +
                                ((drag.t1y - drag.y) + drag.oy) + ")";
                            sv.data.div.zoomer.style.transform = matrix;

                        }else{
                            drag.zoom = false;
                            sv.data.p.x = drag.startx - ((touch.pageX - sv.data.mouse.ox) - drag.x);
                            sv.data.p.y = drag.starty - ((touch.pageY - sv.data.mouse.oy) - drag.y);
                            sv.pan();
                        }

                    }
                }else if (event.type == 'touchend'){
                    var touch, touch2;
                    for (var i=0; i < event.changedTouches.length; i++){
                        var t = event.changedTouches.item(i);
                        if  (t.identifier == drag.touchid){
                            touch = t;
                            delete drag.touchid;
                        }else if (t.identifier == drag.touchid2){
                            touch2 = t;
                            delete drag.touchid2;
                        }
                    }
                    if (touch && drag.on){
                        drag.on = false;
                    }
                    if (drag.zoom && (touch || touch2)){
                        drag.zoom = false;
                        drag.on = false;
                        var s = 1;
                        var r = drag.scale;
                        var r2 = r;
                        if (r < 1){
                            r = 1/r;
                            s = -1;
                        }
                        var zoomSteps = Math.round(s * Math.log(r) * Math.LOG2E * 2);
                        var newScale = sv.data.scale - sv.data.overzoom - zoomSteps;
                        var newOverzoom = 0;
                        if (newScale < 1) {
                            newOverzoom = 1 - newScale;
                            newScale = 1;
                        }
                        if (newScale > sv.data.maxzoom) newScale = sv.data.maxzoom;

                        var r3 = sv.data.scalorFn(sv.data.scale, sv.data.overzoom) / sv.data.scalorFn(newScale, newOverzoom);
                        var x = drag.ox + (drag.t1x - drag.x);
                        var y = drag.oy + (drag.t1y - drag.y);
                        var ox = drag.x - drag.ox;
                        var oy = drag.y - drag.oy;
                        var cx = drag.t1x - sv.data.width/2;
                        var cy = drag.t1y - sv.data.height/2;
                        ox -= cx/r2;
                        oy -= cy/r2;
                        x -= cx * ((r2/r3) -1);
                        y -= cy * ((r2/r3) -1);

                        sv.data.div.zoomer.style.transition = "transform 600ms";
                        var matrix = "matrix(" + r3 + ",0,0," + r3 + "," +
                                x + "," +
                                y + ")";

                        sv.data.div.zoomer.style.transform = matrix;

                        var ll = sv.xy2ll(ox + sv.data.slideroffsetx , oy + sv.data.slideroffsety);
                        sv.data.scale = newScale;
                        var oldOverzoom = sv.data.overzoom;
                        sv.data.overzoom = newOverzoom;
                        sv.data.lat = ll.lat;
                        sv.data.lon = ll.lon;
                        if (oldOverzoom === newOverzoom) {
                            sv.reset();
                        }
                        window.setTimeout(function () {
                            if (oldOverzoom !== newOverzoom) {
                                sv.buildTiles(true);
                                sv.resetZoomer();
                                sv.reset();
                            } else {
                                sv.resetZoomer();
                            }
                        },650);
                    }else{
                        if (touch){
                            sv.hoveroff();
                            var x = touch.pageX - sv.data.mouse.ox;
                            var y = touch.pageY - sv.data.mouse.oy; 
                            event.clientX = touch.pageX;
                            event.clientY = touch.pageY;
                            if (sv.data.shapeclickon &&
                                Math.abs(x - sv.data.shapeclickon.x) < 2 && 
                                Math.abs(y - sv.data.shapeclickon.y) < 2){
                                event.srcElement.onclick(event);        
                                
                            }else{
                                if (Math.abs(x - drag.x) < 2 && Math.abs(y - drag.y) < 2){
                                    if (sv.data.canvasUrl && !sv.data.nowheel) {
                                        window.location = sv.data.canvasUrl;                            
                                    }else{
                                        sv.rightClick(event);
                                    }
                                }else{
                                    sv.data.canvasUrl = undefined;
                                }
                                
                            }
                        }

                    }
              
                }
            }
            glass.ondrag = function() {
                return false;
            }
            glass.onselectstart = function() {
                return false;
            }
            

            var mouseup = function(e) {
                if (!e)
                    e = window.event;
                if (sv.data.zs_on) {
                    sv.data.zs_on = false;
                    var z = Math.round(sv.data.scale - ((e.clientX - sv.data.zs_x) / (80 / (sv.data.maxzoom))));
                    if (z < 1)
                        z = 1;
                    if (z > sv.data.maxzoom)
                        z = sv.data.maxzoom;
                    sv.zoom(z);
                } else if (sv.data.move_on) {
                    //sv.data.div.chart.style.cursor='crosshair';
                    sv.data.move_on = false;
                    if (e.touches && sv.data.move_x == sv.data.touchX && sv.data.move_y == sv.data.touchY) {
                        if (e.srcElement.onclick) {
                            e.srcElement.onclick();
                        }else{
                            e.clientX = sv.data.touchX;
                            e.clientY = sv.data.touchY;
                            sv.rightClick(e);
                        }
                    }
                }
                if (sv.data.canvasUrl && !sv.data.nowheel) {
                    if (e.button == 2 || e.ctrlKey) {
                    // do nothing
                    } else {
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        } else {
                            e.cancelBubble = "true";
                        }
                        if (sv.data.canvasUrl.match(/^http/)){
                            window.open(sv.data.canvasUrl,'_blank');
                        }else{
                            window.location = sv.data.canvasUrl;
                        }
                    }
                }
                if (sv.data.canvasInfoBox && !sv.data.nowheel) {
                    sv.hoveroff();
                    sv.showInfoBox(sv.data.canvasInfoBox);
                    sv.data.canvasHoverId = undefined;
                    sv.data.canvasInfoBox = undefined;
                }
                if (e.touches) {
                    if (e.srcElement.onmouseout) {
                        e.srcElement.onmouseout();
                    }
                }
            }
            this.data.div.zs.onmousedown = function(e) {
                if (!e)
                    e = window.event;
                sv.data.zs_on = true;
                sv.data.zs_x = e.clientX;
                return false;
            }
            this.data.div.zs.onmouseup = mouseup;
            var mousedown = function(e) {
                if (!e)
                    e = window.event;
                if (sv.data.settings.href) {
                    return;
                }
                if (sv.data.isIE) {
                    e.cancelBubble = 'true';
                } else {
                    e.stopPropagation();
                }
                sv.hideLink();
                sv.hidesrLink();
                sv.wxHide();
                sv.rMenuHide();
                sv.confirmSnapHide();
                sv.confirmDeleteHide();
                sv.hideDeleteDialog();
                sv.hoveroff();
                if (e.touches) {
                    if (e.srcElement.onmouseover) {
                        sv.data.shapeclickon = {"x": e.pageX,"y": e.pageY};
                        e.srcElement.onmouseover();
                    } else if (e.srcElement.onmousedown) {
                        e.srcElement.onmousedown();
                        return false;
                    }
                }
                if (e.button == 2 || e.ctrlKey) {
                    sv.rightClick(e);
                    return false;
                }
                if (e.touches) {
                    if (sv.data.isWebkit) {
                        sv.data.div.slider.style.webkitTransition = '';
                    }
                    sv.data.touchX = e.touches[0].clientX;
                    sv.data.touchY = e.touches[0].clientY;
                    if (e.touches.length == 1) {
                        sv.data.move_x = e.touches[0].clientX;
                        sv.data.move_y = e.touches[0].clientY;
                    }
                } else {
                    sv.data.move_x = e.clientX;
                    sv.data.move_y = e.clientY;
                }
                sv.data.move_p = new Object;
                sv.data.move_p.x = sv.data.p.x;
                sv.data.move_p.y = sv.data.p.y;
                sv.data.move_on = true;
                //sv.data.div.chart.style.cursor='all-scroll';
                return false;
            }
            glass.onmousedown = mousedown;
            //glass.ontouchstart = mousedown;
            //glass.ontouchend = mouseup;
            document.onmouseup = mouseup;
            glass.onmouseup = mouseup;
            this.data.div.chart.onmouseup = mouseup;
            window.onbeforeunload = function() {
                if (sv.data.dontClose) {
                    return "You have edited your route, but you have not saved.\nAre you sure you want to leave this page?";
                }
            }
            var mousemove = function(e) {
                if (!e)
                    e = window.event;
                if (e.pointerType == 'touch'){
                    return;
                }
                if (e.preventDefault)
                    e.preventDefault();
                if (sv.data.zs_on) {
                    var x = sv.data.zs_x - e.clientX;
                    var minx = Math.round((sv.data.scale - 1) * (-72 / (sv.data.maxzoom - 1)));
                    var maxx = Math.round((sv.data.maxzoom - sv.data.scale) * (72 / (sv.data.maxzoom - 1)));
                    if (x < minx)
                        x = minx;
                    if (x > maxx)
                        x = maxx;
                    sv.data.div.zs.style.right = (x + 38 + ((sv.data.scale - 1) * (72 / (sv.data.maxzoom - 1)))) + "px";
                } else if (sv.data.move_on) {
                    if (sv.data.canvasUrl && (Math.abs(e.clientX - sv.data.move_x) > 2 || Math.abs(e.clientY - sv.data.move_y) > 2)) {
                        sv.data.canvasUrl = undefined;
                    }
                    if (e.touches) {
                        sv.data.touchX = e.touches[0].clientX;
                        sv.data.touchY = e.touches[0].clientY;
                        if (e.touches.length == 1) {
                            sv.data.p.x = sv.data.move_p.x - (e.touches[0].clientX - sv.data.move_x);
                            sv.data.p.y = sv.data.move_p.y - (e.touches[0].clientY - sv.data.move_y);
                            sv.pan();
                        }
                    } else {
                        sv.data.p.x = sv.data.move_p.x - (e.clientX - sv.data.move_x);
                        sv.data.p.y = sv.data.move_p.y - (e.clientY - sv.data.move_y);
                        sv.pan();
                    }
                } else if (sv.data.linedragging) {
                // pass
                } else if (sv.data.canvasHoverOff) {
                // pass
                } else {
                    // not dragging - test for canvas hover
                    var x = sv.data.p.x + (e.pageX - sv.data.mouse.ox) - sv.data.width / 2;
                    var y = sv.data.p.y + (e.pageY - sv.data.mouse.oy) - sv.data.height / 2;
                    if (sv.data.canvasHoverId) {
                        var t = sv.data.canvasTargets.hover[sv.data.canvasHoverId - 1];
                        if (t && !sv.data.nowheel) {
                            if (x < t[0] || y < t[1] || x > t[0] + t[2] || y > t[1] + t[3]) {
                                sv.data.canvasHoverId = undefined;
                                t[5](e);
                            }
                        } else {
                            sv.hoveroff();
                            sv.data.canvasHoverId = undefined;
                        }
                    }
                    if (!sv.data.canvasHoverId) {
                        for (var i = 0; i < sv.data.canvasTargets.hover.length; i++) {
                            var t = sv.data.canvasTargets.hover[i];
                            if (x >= t[0] && y >= t[1] && x <= t[0] + t[2] && y <= t[1] + t[3]) {
                                sv.data.canvasHoverId = i + 1;
                                t[4](e);
                                break;
                            }
                        }
                    }
                }
                sv.data.mouse.x = e.pageX || e.pageY ? 
                e.pageX - sv.data.mouse.ox : 
                e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - sv.data.mouse.ox;
                sv.data.mouse.y = e.pageX || e.pageY ? 
                e.pageY - sv.data.mouse.oy : 
                e.clientY + document.body.scrollTop + document.documentElement.scrollTop - sv.data.mouse.oy;
                //sv.status(sv.data.mouse.x + "," +sv.data.mouse.y);
                /*
                if(e.shiftKey){
                    sv.showSnap(true);
                }else{
                    sv.showSnap(false);
                }
                */
                if (sv.data.shapeclickon && (Math.abs(sv.data.shapeclickon.x - e.clientX) > 2 || Math.abs(sv.data.shapeclickon.y - e.clientY) > 2)) {
                    sv.data.shapeclickon = false;
                }
            }

            var event_pointer = function(event){
                if (event.pointerType == 'touch'){
                    if (event.srcElement && 
                        event.srcElement.parentElement === sv.data.div.plan){
                        return;
                    }
                    event.preventDefault();
                    event.stopPropagation();
                    var numPointers;
                    var x = event.pageX - sv.data.mouse.ox;
                    var y = event.pageY - sv.data.mouse.oy;
                    if (event.type == 'pointerdown'){
                        sv.hideLink();
                        sv.hidesrLink();
                        sv.wxHide();
                        sv.rMenuHide();
                        sv.confirmSnapHide();
                        sv.confirmDeleteHide();
                        sv.hideDeleteDialog();
                        pointers[event.pointerId] = {
                            "startx": x,
                            "starty": y,
                            "x": x,
                            "y": y
                        };
                        numPointers = sv.countKeys(pointers);
                        if (numPointers == 1){
                            if (event.srcElement.onmouseover) {
                                sv.data.shapeclickon = {"x":x,"y":y};   
                                event.srcElement.onmouseover(event);
                            }else if (event.srcElement.onmousedown) {
                                event.srcElement.onmousedown(event);
                                return;
                            }
                            sv.canvasHover(event);
                            drag.touchid = event.pointerId;
                            drag.x = x;
                            drag.y = y;
                            drag.startx = sv.data.p.x;
                            drag.starty = sv.data.p.y;
                            drag.on = true;
                            drag.zoom = false;
                        }
                        if (numPointers == 2){
                            if (event.pointerId != drag.touchid){
                                sv.hoveroff();
                                drag.x2 = x;
                                drag.y2 = y;
                                drag.touchid2 = event.pointerId;
                                drag.scaleDistance = Math.sqrt(Math.pow(drag.x2-drag.x,2) + Math.pow(drag.y2-drag.y,2));
                                drag.zoom = true;

                                drag.maxscale = sv.data.scalorFn(sv.data.scale, sv.data.overzoom) / sv.data.scalorFn(1, sv.data.maxoverzoom);
                                var p = sv.ll2xy(sv.data.lat, sv.data.lon);
                                sv.data.slideroffsetx = Math.round(p.x - (sv.data.width / 2)) - 1000;
                                sv.data.slideroffsety = Math.round(p.y - (sv.data.height / 2)) - 1000;
                                for (var i = 0; i < sv.data.vtiles; i++) {
                                    for (var j = 0; j < sv.data.htiles; j++) {
                                        sv.data.zztiles[i][j].set();
                                    }
                                }
                                drag.ox = (sv.data.slideroffsetx - (sv.data.p.x - sv.data.width/2));
                                drag.oy = (sv.data.slideroffsety - (sv.data.p.y - sv.data.height/2));
                                sv.data.div.zoomer.style.transformOrigin = (drag.x - drag.ox) + "px " + (drag.y - drag.oy) + "px";
                                sv.data.div.zoomer.style.transform = "matrix(1,0,0,1,"+drag.ox+","+drag.oy+")";
                                sv.data.div.zoomer.style.visibility = "visible";
                                sv.data.div.zoomer.style.zIndex = 5;
                                
                            }
                        }

                    }else if (event.type == 'pointermove'){
                        if (pointers[event.pointerId]){
                            pointers[event.pointerId].x = x;
                            pointers[event.pointerId].y = y;
                        }
                        if (drag.on){
                            var touch, touch2;
                            if (pointers[drag.touchid]){
                                touch = pointers[drag.touchid];
                            }else{
                                drag.on = false;
                                return;
                            }
                            var scale = 1.0;
                            if (pointers[drag.touchid2] && drag.zoom){
                                touch2 = pointers[drag.touchid2];
                                scale = Math.sqrt(Math.pow(touch.x-touch2.x,2) + Math.pow(touch.y-touch2.y,2)) / drag.scaleDistance;
                                if (scale > drag.maxscale) scale = drag.maxscale;
                                drag.scale = scale;
                                drag.t1x = touch.x;
                                drag.t1y = touch.y;
                                var matrix = "matrix(" + scale + ",0,0," + scale + "," +
                                    ((drag.t1x - drag.x) + drag.ox) + "," +
                                    ((drag.t1y - drag.y) + drag.oy) + ")";
                                sv.data.div.zoomer.style.transform = matrix;
                            }else{
                                drag.zoom = false;
                                sv.data.p.x = drag.startx - ((touch.x) - drag.x);
                                sv.data.p.y = drag.starty - ((touch.y) - drag.y);
                                sv.pan();
                            }
                        }

                    }else if (event.type == 'pointerup' ||
                              event.type == 'pointercancel'){
                        delete pointers[event.pointerId];
                        var touch,touch2;
                        if (drag.touchid == event.pointerId){
                            delete drag.touchid;
                            touch = event;
                        }
                        if (drag.touchid2 == event.pointerId){
                            delete drag.touchid2;
                            touch2 = event;
                        }
                        if (touch && drag.on){
                            drag.on = false;
                        }
                        if (drag.zoom && (touch || touch2)){
                            drag.zoom = false;
                            drag.on = false;
                            var s = 1;
                            var r = drag.scale;
                            var r2 = r;
                            if (r < 1){
                                r = 1/r;
                                s = -1;
                            }
                            var zoomSteps = Math.round(s * Math.log(r) * Math.LOG2E * 2);
                            var newScale = sv.data.scale - sv.data.overzoom - zoomSteps;
                            var newOverzoom = 0;
                            if (newScale < 1) {
                                newOverzoom = 1 - newScale;
                                newScale = 1;
                            }
                            if (newScale > sv.data.maxzoom) newScale = sv.data.maxzoom;
                            
                            var r3 = sv.data.scalorFn(sv.data.scale, sv.data.overzoom) / sv.data.scalorFn(newScale, newOverzoom);
                            var x = drag.ox + (drag.t1x - drag.x);
                            var y = drag.oy + (drag.t1y - drag.y);
                            var ox = drag.x - drag.ox;
                            var oy = drag.y - drag.oy;
                            var cx = drag.t1x - sv.data.width/2;
                            var cy = drag.t1y - sv.data.height/2;
                            ox -= cx/r2;
                            oy -= cy/r2;
                            x -= cx * ((r2/r3) -1);
                            y -= cy * ((r2/r3) -1);

                            sv.data.div.zoomer.style.transition = "transform 600ms";
                            var matrix = "matrix(" + r3 + ",0,0," + r3 + "," +
                                    x + "," +
                                    y + ")";

                            sv.data.div.zoomer.style.transform = matrix;

                            var ll = sv.xy2ll(ox + sv.data.slideroffsetx , oy + sv.data.slideroffsety);
                            sv.data.scale = newScale;
                            var oldOverzoom = sv.data.overzoom;
                            sv.data.overzoom = newOverzoom;
                            sv.data.lat = ll.lat;
                            sv.data.lon = ll.lon;
                            if (oldOverzoom === newOverzoom) {
                                sv.reset();
                            }
                            window.setTimeout(function () {
                                if (oldOverzoom !== newOverzoom) {
                                    sv.buildTiles(true);
                                    sv.resetZoomer();
                                    sv.reset();
                                } else {
                                    sv.resetZoomer();
                                }
                            }, 650);
                        }else{
                            if (touch){
                                sv.hoveroff();
                                var x = touch.pageX - sv.data.mouse.ox;
                                var y = touch.pageY - sv.data.mouse.oy; 
                                if (sv.data.shapeclickon &&
                                    Math.abs(x - sv.data.shapeclickon.x) < 2 && 
                                    Math.abs(y - sv.data.shapeclickon.y) < 2){
                                    event.srcElement.onclick(event);        
                                    
                                }else{
                                    if (Math.abs(x - drag.x) < 2 && Math.abs(y - drag.y) < 2){
                                        if (sv.data.canvasUrl && !sv.data.nowheel) {
                                            window.location = sv.data.canvasUrl;                            
                                        }else{
                                            sv.rightClick(event);
                                        }
                                    }else{
                                        sv.data.canvasUrl = undefined;
                                    }
                                    
                                }

                            }
                        }
                    }
                }
            }

            this.data.div.slider.onmousemove = mousemove;
            this.data.div.zs.onmousemove = mousemove;
            this.data.div.zoomerMap.onmousemove = mousemove;

            if (window.PointerEvent){
                sv.data.div.slider.addEventListener("pointerdown",event_pointer,true);
                glass.addEventListener("pointerup",    event_pointer, true);
                glass.addEventListener("pointermove",  event_pointer, true);
                glass.addEventListener("pointercancel",event_pointer, true);
            }else{
                sv.data.div.slider.addEventListener("touchstart",event_touch,true);
                glass.addEventListener("touchmove",event_touch,true);
                glass.addEventListener("touchend",event_touch,true);
            }

            this.data.div.slider.onmouseout = function() {
                sv.hoveroff();
                sv.data.canvasUrl = undefined;
            };

            if (this.data.div.chart.addEventListener) {
                glass.addEventListener('DOMMouseScroll', sv.wheel, false);
                this.data.div.chart.addEventListener('mousewheel', sv.wheel, false);
            } else {
                glass.onmousewheel = sv.wheel;
            }
            glass.ondblclick = function(e) {
                if (!e)
                    e = window.event;
                sv.data.mouse.x = e.pageX || e.pageY ? 
                e.pageX - sv.data.mouse.ox : 
                e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - sv.data.mouse.ox;
                sv.data.mouse.y = e.pageX || e.pageY ? 
                e.pageY - sv.data.mouse.oy : 
                e.clientY + document.body.scrollTop + document.documentElement.scrollTop - sv.data.mouse.oy;
                var p = sv.xy2ll(sv.data.p.x + sv.data.mouse.x - sv.data.width / 2, sv.data.p.y + sv.data.mouse.y - sv.data.height / 2);
                var dir = false;
                if (sv.data.scale > 1) {
                    sv.data.scale -= 1;
                    dir = 'in';
                } else if (sv.data.overzoom < sv.data.maxoverzoom) {
                    sv.data.overzoom += 1;
                    dir= 'in';
                    sv.buildTiles(true);
                }
                sv.data.lat = p.lat;
                sv.data.lon = p.lon;
                sv.reset(dir);
            }
            glass.oncontextmenu = function(e) {
                return false;
            }
            // Top Bar
            var tbul = this.ce("ul");
            this.data.div.tbul = tbul;
            tbul.id = "sv_topbarul";
            tbul.className = "sv";
            var loginli = this.ce("li");
            this.data.div.login_link = this.ce("a");
            this.data.div.login_link.onclick = function(){
                if (sv.data.uid){
                    sv.userDialog();
                }else{
                    sv.login();
                }
            }
            this.data.div.login_link_icon = this.ce("span","fa fa-key");
            this.data.div.login_link_icon.style.paddingRight = "4px";
            this.data.div.login_link.appendChild(this.data.div.login_link_icon);
            this.data.div.login_link_text = this.ct("Sign In");
            this.data.div.login_link.appendChild(this.data.div.login_link_text);
            loginli.appendChild(this.data.div.login_link);
            tbul.appendChild(loginli);

            var li1 = this.ce("li");
            this.data.div.tb_link = this.ce("a");
            this.data.div.tb_link.onclick = function() {
                sv.showLink();
            //alert(sv.genlink());
            }
            this.data.div.tb_link.innerHTML = "<img style=\"width: 20px; height: 15px;\" src=\"" + this.data.images + "/linkicon" + this.data.png + "\"/>Link";
            li1.appendChild(this.data.div.tb_link);
            tbul.appendChild(li1);
            //var li2 = this.ce("li");
            //this.data.div.tb_print = this.ce("a");
            //this.data.div.tb_print.innerHTML = "<img style=\"width: 16px; height: 16px;\" src=\"" + this.data.images + "/printicon.png\"/>Print";
            //this.data.div.tb_print.onclick = function() {
            //    sv.showPrint();
            //}
            //li2.appendChild(this.data.div.tb_print);
            //tbul.appendChild(li2);
            //var li3=this.ce("li");
            //this.data.div.tb_nexrad=this.ce("a");
            //this.data.div.tb_nexrad.innerHTML="<img src=\""+this.data.images+"/nexradicon.png\"/>NexRad";
            //li3.appendChild(this.data.div.tb_nexrad);
            if (false && "https:" != document.location.protocol) {
                var imgbug = this.ce("img");
                imgbug.src = "http://test.skyvector.net/clear.gif";
            }
            //tbul.appendChild(li3);
            var li4 = this.ce("li");
            var cklabels = this.ce("input");
            cklabels.type = "checkbox";
            cklabels.id = "sv_cklabels";
            li4.appendChild(cklabels);
            li4.appendChild(document.createTextNode("Labels"));
            if (this.data.settings.labels) {
                cklabels.checked = true;
            }
            li4.onclick = function() {
                if (sv.data.settings.labels) {
                    sv.data.settings.labels = false;
                    cklabels.checked = false;
                } else {
                    sv.data.settings.labels = true;
                    cklabels.checked = true;
                }
                sv.datalayer();
            }
            //tbul.appendChild(li4);
            var metar = this.ce("li");
            var wxcb = this.ce("input");
            metar.className = "ul";
            wxcb.type = "checkbox";
            //wxcb.style.verticalAlign='top';
            metar.onclick = function() {
                if (sv.data.wx == 1) {
                    sv.data.wx = 0;
                    wxcb.checked = false;
                } else {
                    sv.data.wx = 1;
                    wxcb.checked = true;
                }
                sv.datalayer();
            }
            metar.appendChild(wxcb);
            metar.appendChild(document.createTextNode("Show Weather"));
            //tbul.appendChild(metar);
            wxcb.checked = this.data.wx == 1 ? true : false;
            this.data.div.tbsettings = this.ce("li");
            this.data.div.tbsettings.className = "ul";
            this.data.div.tbsettings.innerHTML = '<img style="width: 20px; height: 14px;" src="' + this.data.images + '/layersicon.png" />Layers';
            this.data.div.tbsettings.onclick = function() {
                if (sv.data.div.settings && sv.data.div.settings.div.style.visibility == 'visible') {
                    sv.data.div.settings.div.style.visibility = 'hidden';
                } else {
                    sv.showSettings();
                }
            }
            tbul.appendChild(this.data.div.tbsettings);
            
            this.data.div.tbll = this.ce("li");
            this.data.div.tbll.id = "bsv_tbll";
            tbul.appendChild(this.data.div.tbll);
            this.showHideTimeLocation();
            var f = this.ce("form");
            var sbox = this.ce("input");
            sbox.className = "sv_search";
            sbox.setAttribute("autocorrect", "off");
            var ckey = '';
            sbox.onkeydown = function(e) {
                if (!e)
                    e = window.event;
                if (e.shiftKey || e.ctrlKey) {
                    ckey = 1;
                } else {
                    ckey = '';
                }
            }
            f.onsubmit = function() {
                sv.hidesrLink();
                var r = sv.request(sv.data.perldir + "/search" + sv.mkQS({q: sbox.value,i: sv.data.protoid,z: sv.data.scale,ck: ckey,lat: sv.data.lat,lon: sv.data.lon}));
                r.onload = function(data) {
                    sv.sResult(data);
                }
                sbox.select();
                try {
                    ga_event('send', 'event', 'Map', 'Search', sbox.value);
                } catch (e) {
                }
                ;
                return false;
            }
            var btn = this.ce("input");
            btn.type = "submit";
            btn.className = "sv_searchbtn";
            btn.textContent = "Go";
            btn.value = "Go";
            f.appendChild(sbox);
            f.appendChild(btn);
            
            var topbarbg = this.ce("div");
            topbarbg.className = "sv sv_topbarbg xlucent50";
            if (this.data.settings.topbar)
                this.data.div.chart.appendChild(topbarbg);
            var topbar = this.ce("div");
            topbar.className = "sv sv_topbar";
            topbar.appendChild(tbul);
            topbar.appendChild(f);
            var planlink = this.ce("span");
            planlink.className = "sv sv_topbarlink";
            planlink.appendChild(document.createTextNode("Flight Plan"));
            planlink.onclick = function() {
                //sv.showPanel();
                sv.showPlanEdit();
                sv.data.div.planEdit.div.style.visibility = "visible";
                return false;
            }
            planlink.href = "clickto:ShowPlan";
            topbar.appendChild(planlink);

            if (this.data.settings.topbar)
                this.data.div.chart.appendChild(topbar);
            this.data.div.za = this.ce("img");
            this.data.div.za.className = "sv_za";
            this.data.div.za.src = this.data.images + "/clear.gif";
            this.data.div.chart.appendChild(this.data.div.za);
            this.data.div.preload = [];
            var a = [1, 2, 3, 4];
            for (var i = 0; i < a.length; i++) {
                (function(){
                    var b = sv.ce("img");
                    b.src = sv.data.images + "/za" + a[i] + sv.data.png;
                    sv.data.div.preload.push(b);
                })();
            }
            // Tiles
            this.buildTiles();
            this.addNS();
            this.start();
            this.showSettings(false, true);
            this.disablePrint();
        }
    },
    buildTiles: function(noreset) {
        // Tiles
        var sv = SkyVector;
        sv.data.width = sv.data.div.chart.clientWidth;
        sv.data.height = sv.data.div.chart.clientHeight;
        var tilesize = 256 / sv.data.devicePixelRatioFn();
        if (sv.data.tilesize === tilesize) {
            return;
        }
        sv.data.tilesize = tilesize;
        sv.data.htiles = Math.ceil(sv.data.width / sv.data.tilesize) + 1;
        sv.data.vtiles = Math.ceil(sv.data.height / sv.data.tilesize) + 1;
        if (sv.data.isMobile) {
            sv.data.div.chart.style.width = sv.data.width + "px";
            sv.data.div.chart.style.height = sv.data.height + "px";
        }
        sv.data.div.glass.style.width = sv.data.width + "px";
        sv.data.div.glass.style.height = sv.data.height + "px";
        sv.data.div.cross.style.left = Math.round((sv.data.width / 2) - 5) + "px";
        sv.data.div.cross.style.top = Math.round((sv.data.height / 2) - 5) + "px";
        if (sv.data.tiles.length) {
            for (var i = 0; i < sv.data.tiles.length; i++) {
                for (var j = 0; j < sv.data.tiles[i].length; j++) {
                    try {
                        sv.data.div.slider.removeChild(sv.data.tiles[i][j].img);
                    } catch (err) {
                    }
                    try {
                        sv.data.div.slider.removeChild(sv.data.ztiles[i][j].img);
                    } catch (err) {
                    }
                    try {
                        sv.data.div.zoomer.removeChild(sv.data.zztiles[i][j].img);
                    } catch (err) {
                    }
                }
            }
        }
        for (var i = 0; i < sv.data.vtiles; i++) {
            sv.data.tiles[i] = [];
            sv.data.ztiles[i] = [];
            if (true || sv.data.isWebkit3D) {
                sv.data.zztiles[i] = [];
            }
            for (var j = 0; j < sv.data.htiles; j++) {
                sv.data.tiles[i][j] = sv.mkTile(true);
                sv.data.ztiles[i][j] = sv.mkTile(false);
                sv.data.div.slider.appendChild(sv.data.tiles[i][j].img);
                sv.data.div.slider.appendChild(sv.data.ztiles[i][j].img);
                    sv.data.zztiles[i][j] = sv.mkTile(true);
                    sv.data.div.zoomer.appendChild(sv.data.zztiles[i][j].img);
                    //sv.data.zztiles[i][j].img.style.visibility = "hidden";
            }
        }
        if (sv.data.chartwidth) {
            document.body.scrollLeft = 0;
            document.body.scrollTop = 0;
            if (!noreset)
                sv.reset();
        }
    },
    rightClick: function(e, i, modify) {
        var sv = this;
        sv.rMenuHide();
        this.data.mouse.x = e.pageX || e.pageY ? 
        e.pageX - this.data.mouse.ox : 
        e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - this.data.mouse.ox;
        this.data.mouse.y = e.pageX || e.pageY ? 
        e.pageY - this.data.mouse.oy : 
        e.clientY + document.body.scrollTop + document.documentElement.scrollTop - this.data.mouse.oy;
        var x = this.data.p.x + this.data.mouse.x - this.data.width / 2;
        var y = this.data.p.y + this.data.mouse.y - this.data.height / 2;
        var p = this.xy2ll(x, y);
        p.lon = this.lmod(p.lon);
        var mx = e.clientX;
        var my = e.clientY;
        var qs = {ll: p.lat + "," + p.lon,"q": ''};
        if (typeof i !== 'undefined')
            qs.pos = i;
        if (typeof modify !== 'undefined')
            qs.mod = 1;
        var r = this.request(this.data.perldir + "/rightClick" + this.mkQS(qs));
        r.onload = function(data) {
            sv.rMenu(data, mx, my);
        }
        try {
            ga_event('send', 'event', 'Map', 'rClick');
        } catch (e) {
        }
        ;
    },
    rMenu: function(data, x, y) {
        this.wxHide();
        var sv = this;
        if (!this.data.div.rmenu) {
            this.data.div.rmenu = this.ce("div");
            this.data.div.rmenu.id = "sv_rmenu";
            this.data.div.rmenu.className = "sv sv_rmenu";
            var title = this.ce("div");
            title.className = "sv sv_rmenutitle";
            title.innerHTML = "Location Information";
            this.data.div.rmenu.appendChild(title);
            var table = this.ce("table");
            this.data.div.rmenutb = this.ce("tbody");
            table.appendChild(this.data.div.rmenutb);
            this.data.div.rmenu.appendChild(table);
            this.data.div.rmenulines = [];
        }
        for (var i = 0; i < data.near.length; i++) {
            if (data.near[i].t == 'delete') {
                if (!this.data.div.rmenudel) {
                    this.data.div.rmenudel = this.rMenuDel();
                }
                this.data.div.rmenudel.setData(data.near[i]);
                this.data.div.rmenutb.appendChild(this.data.div.rmenudel.tr);
            } else {
                if (!this.data.div.rmenulines[i]) {
                    this.data.div.rmenulines[i] = this.rMenuRow();
                }
                this.data.div.rmenulines[i].setData(data.near[i]);
                this.data.div.rmenutb.appendChild(this.data.div.rmenulines[i].tr);
            }
        }
        document.body.insertBefore(this.data.div.rmenu, document.body.firstChild);
        var w = this.data.div.rmenu.scrollWidth;
        var h = this.data.div.rmenu.scrollHeight;
        if (x + w + 10 > document.documentElement.clientWidth) {
            x -= w + 10;
        } else {
            x += 6;
        }
        if (y + h + 10 > document.documentElement.clientHeight) {
            y -= h + 10;
        } else {
            y += 6;
        }
        this.data.div.rmenu.style.top = y + "px";
        this.data.div.rmenu.style.left = x + "px";
        this.data.div.rmenu.style.visibility = "visible";
    },
    rMenu_ADC: function(data, x, y) {
        this.wxHide();
        if (!this.data.div.rmenu) {
            this.data.div.rmenu = this.ce("div");
            this.data.div.rmenu.id = "sv_rmenu";
            this.data.div.rmenu.className = "sv sv_rmenu";
            var title = this.ce("div");
            title.className = "sv sv_rmenutitle";
            title.innerHTML = "Location Information";
            this.data.div.rmenu.appendChild(title);
            var table = this.ce("table");
            this.data.div.rmenutb = this.ce("tbody");
            table.appendChild(this.data.div.rmenutb);
            this.data.div.rmenu.appendChild(table);
            this.data.div.rmenulines = [];
        }
        if (data.near.length > 0) {
            for (var i = 0; i < data.near.length; i++) {
                if (data.near[i].t == 'delete') {
                    if (!this.data.div.rmenudel) {
                        this.data.div.rmenudel = this.rMenuDel();
                    }
                    this.data.div.rmenudel.setData(data[i]);
                    this.data.div.rmenutb.appendChild(this.data.div.rmenudel.tr);
                } else {
                    if (!this.data.div.rmenulines[i]) {
                        this.data.div.rmenulines[i] = this.rMenuRow();
                    }
                    this.data.div.rmenulines[i].setData(data.near[i]);
                    this.data.div.rmenutb.appendChild(this.data.div.rmenulines[i].tr);
                }
            }
        } else {
            this.data.div.rmenutb.innerHTML = "<td>No Point Found</td>";
        }
        document.body.insertBefore(this.data.div.rmenu, document.body.firstChild);
        var w = this.data.div.rmenu.scrollWidth;
        var h = this.data.div.rmenu.scrollHeight;
        if (x + w + 10 > document.documentElement.clientWidth) {
            x -= w + 10;
        } else {
            x += 6;
        }
        if (y + h + 10 > document.documentElement.clientHeight) {
            y -= h + 10;
        } else {
            y += 6;
        }
        this.data.div.rmenu.style.top = y + "px";
        this.data.div.rmenu.style.left = x + "px";
        this.data.div.rmenu.style.visibility = "visible";
    },
    rMenuHide: function() {
        try {
            while (this.data.div.rmenutb && this.data.div.rmenutb.firstChild) {
                this.data.div.rmenutb.removeChild(this.data.div.rmenutb.firstChild);
            }
        } catch (e) {
        }
        ;
        try {
            document.body.removeChild(this.data.div.rmenu);
            this.data.div.rmenu.style.visibility = "hidden";
            this.data.div.rmenu.style.top = "0px";
            this.data.div.rmenu.style.left = "0px";
        } catch (e) {
        }
        ;
    },
    rMenuDel: function() {
        var sv = this;
        var row = new Object;
        row.tr = this.ce("tr");
        row.td1 = this.ce("td");
        row.td2 = this.ce("td");
        row.btn = this.ce("img");
        row.icon = this.ce("img");
        row.icon.src = this.data.images + "/delete.png";
        row.btn.src = this.data.images + "/deloff.png";
        row.btn.style.width = "33px";
        row.btn.style.height = "14px";
        row.icon.style.width = "16px";
        row.icon.style.height = "13px";
        row.btn.style.cursor = "pointer";
        row.btn.onmouseover = function() {
            row.btn.src = sv.data.images + "/delon.png";
        }
        row.btn.onmouseout = function() {
            row.btn.src = sv.data.images + "/deloff.png";
        }
        row.btn.onclick = function() {
            row.btn.src = sv.data.images + "/deloff.png";
            sv.planDel(row.data);
        }
        row.setData = function(data) {
            row.data = data;
        }
        row.tr.appendChild(row.td1);
        row.tr.appendChild(row.td2);
        row.td1.appendChild(row.btn);
        row.td1.appendChild(row.icon);
        row.td2.innerHTML = "Delete Waypoint";
        return row;
    },
    rMenuRow: function() {
        var sv = this;
        var row = new Object;
        row.tr = this.ce("tr");
        row.td1 = this.ce("td");
        row.td2 = this.ce("td");
        row.btn = this.ce("img");
        row.icon = this.ce("img");
        row.icon.src = this.data.images + "/APT.png";
        row.btn.src = this.data.images + "/plan.png";
        row.btn.style.cursor = "pointer";
        row.btn.style.width = "33px";
        row.btn.style.height = "14px";
        row.icon.style.width = "16px";
        row.icon.style.height = "13px";
        row.btn.onmouseover = function() {
            row.btn.src = sv.data.images + "/planon.png";
        }
        row.btn.onmouseout = function() {
            row.btn.src = sv.data.images + "/plan.png";
        }
        row.btn.onclick = function() {
            row.btn.src = sv.data.images + "/plan.png";
            sv.planAdd(row.data);
        }
        row.setData = function(data) {
            row.data = data;
            row.icon.src = sv.data.images + "/" + data.t + ".png";
            var name;
            if (data.t == 'APT' || data.t == 'APH') {
                name = data.n + " (" + data.id + ")";
            } else if (data.t == 'FIX') {
                name = data.id;
            } else if (data.t == 'GPS') {
                var rllf = sv.llf(data.lat, data.lon);
                name = 'GPS ' + rllf.lat + " " + rllf.lon;
            } else if (data.f) {
                name = data.n + " (" + data.f + " " + data.id + ")";
            }
            if (data.u) {
                row.td2.innerHTML = "<a href=\"" + data.u + "\">" + name + "</a>";
            } else {
                row.td2.innerHTML = name;
            }
            if (data.tpp) {
                var tpphover = function(event){
                    var pos = sv.getPos(row.td2);
                    sv.tppMenu(data.id,data.tpp,pos.x + 60, pos.y);
                }
                
                row.td2.ontouchstart = tpphover;
                row.td2.onmouseover = tpphover;
                row.td2.onmouseout = function(){ sv.tppMenuHide(); };
            }else{
                row.td2.onmouseover = undefined;
                row.td2.ontouchstart = undefined;
                row.td2.onmouseout = undefined;

            }
        }
        row.tr.appendChild(row.td1);
        row.tr.appendChild(row.td2);
        row.td1.appendChild(row.btn);
        row.td1.appendChild(row.icon);
        return row;
    },
    rMenuRow_ADC: function() {
        var sv = this;
        var row = new Object;
        row.tr = this.ce("tr");
        row.td1 = this.ce("td");
        row.td2 = this.ce("td");
        row.btn = this.ce("img");
        row.icon = this.ce("img");
        row.icon.src = this.data.images + "/APT.png";
        row.btn.src = this.data.images + "/plan.png";
        row.btn.style.cursor = "pointer";
        row.btn.style.width = "33px";
        row.btn.style.height = "14px";
        row.icon.style.width = "16px";
        row.icon.style.height = "13px";
        row.btn.onmouseover = function() {
            row.btn.src = sv.data.images + "/planon.png";
        }
        row.btn.onmouseout = function() {
            row.btn.src = sv.data.images + "/plan.png";
        }
        row.btn.onclick = function() {
            row.btn.src = sv.data.images + "/plan.png";
            sv.planAdd(row.data);
        }
        row.setData = function(data) {
            row.data = data;
            row.icon.src = sv.data.images + "/" + data.t + ".png";
            var name;
            if (data.type == 'APT' || data.t == 'APH') {
                row.icon.src = sv.data.images + "/APT.png";
                name = data.name + " (" + data.id + ")";
            } else if (data.type == 'fir') {
                row.icon.src = sv.data.images + "/FIR.png";
                name = data.id;
            } else if (data.type == 'wp') {
                row.icon.src = sv.data.images + "/WPT.png";
                name = data.id;
            } else if (data.type == 'nav') {
                row.icon.src = sv.data.images + "/VOR.png";
                name = data.name + " (" + data.id + ")";
            } else if (data.type == 'nav_d') {
                row.icon.src = sv.data.images + "/VOD.png";
                name = data.name + " (" + data.id + ")";
            } else if (data.type == 'nav_t') {
                row.icon.src = sv.data.images + "/VOT.png";
                name = data.name + " (" + data.id + ")";
            } else if (data.type == 'nav_n') {
                row.icon.src = sv.data.images + "/NDB.png";
                name = data.name + " (" + data.id + ")";
            } else if (data.type == 'aw') {
                row.icon.src = sv.data.images + "/ATS.png";
                name = data.name;
            } else {
                name = data.name;
            }
            if (data.url) {
                row.td2.innerHTML = "<a class=\"sv_rmenu\" target=\"_blank\" href=\"" + data.url + "\">" + name + "</a>";
            } else {
                row.td2.innerHTML = name;
            }
        }
        row.tr.appendChild(row.td1);
        row.tr.appendChild(row.td2);
        //row.td1.appendChild(row.btn);
        row.td1.appendChild(row.icon);
        return row;
    },
    planAdd: function(data) {
        this.rMenuHide();
        var d = {'cmd': 'ppt',t: data.t,id: data.id,ic: data.ic,lat: data.lat,lon: data.lon};
        if (typeof data.pos !== 'undefined')
            d.p = data.pos;
        if (typeof data.mod !== 'undefined')
            d.m = data.mod;
        this.fpl(d);
    },
    planDel: function(data) {
        this.rMenuHide();
        var d = {'cmd': 'dpt','p': data.pos};
        this.fpl(d);
    },
    start: function() {
        var args = {
            z: (this.param('zoom') ? this.param('zoom') : this.data.scale),
            c: (this.param('chart') ? this.param('chart') : this.data.protoid),
            e: this.param('edition'),
            f: this.param('force'),
            i: this.param('id'),
            t: this.param('type'),
            p: this.param('plan'),
            fpl: this.param('fpl'),
            ll: this.param('ll'),
            bb: this.data.settings.bb,
            w: this.data.width,
            h: this.data.height,
            sl: this.cookie('startLoc2'),
            r: (document.referrer.indexOf(location.href.host) > 0 ? '' : document.referrer)
        };
        if (args.sl) {
            this.restoreLayers(args.sl);
        }
        this.getChart(args);
    },
    getChart: function(args) {
        var sv = this;
        if (!args)
            args = {};
        if (!args.oc)
            args.oc = this.data.protoid;
        var r = this.request(this.data.perldir + "/chartDataFPL" + this.mkQS(args));
        //var r=this.request(this.data.perldir + "/chartData" + this.mkQS(args));
        r.onload = function(data) {
            if (data && data.protoid)
                sv.loadMap(data);
        }
    },
    loadMap: function(data, noreset) {
        if (data.redirect) {
            window.location = data.redirect;
            return;
        }
        if (data.r_name && data.r_name != '') {
            this.srLink(data);
        }
        if (data.prefs) {
            var p = data.prefs;
            if (p.tas)
                this.data.prefs.tas = p.tas;
            if (p.etd)
                this.data.prefs.etd = p.etd;
            if (p.windMB)
                this.data.prefs.windMB = p.windMB;
            if (p.windZulu)
                this.data.prefs.windZulu = p.windZulu;
            if (p.mach)
                this.data.prefs.mach = p.mach;
            if (p.tail)
                this.data.prefs.tail = p.tail;
            if (p.ifrvfr)
                this.data.prefs.ifrvfr = p.ifrvfr;
        
        }
        this.data.userpref = data.userpref;
        if (data.rasterMaxFrames){
            this.data.maxframes = data.rasterMaxFrames;
        }
        if (data.rasterMaxSize){
            this.data.rasterMaxSize = data.rasterMaxSize;
        }
            
        if (data.rasterKey){
            this.data.rasterKey = data.rasterKey;
        }
        if (!data.protoid)
            return;
        this.data.protoid = data.protoid;
        this.data.edition = data.edition;
        this.data.maxzoom = data.maxzoom ? parseInt(data.maxzoom) : 10;
        if (this.data.scale && !data.scale) {
            var r = this.data.proj.data.xr / parseFloat(data.srs.xr);
            var s = 1;
            if (r < 1) {
                s = -1;
                r = 1 / r;
            }
            var d = (s * Math.LOG2E * Math.log(r)) * 2;
            this.data.scale = Math.round(this.data.scale - this.data.overzoom + d);
            if (this.data.scale < 1) {
                this.data.overzoom = Math.min(1 - this.data.scale, this.data.maxoverzoom);
                this.data.scale = 1;
            } else {
                this.data.overzoom = 0;
            }
        }
        this.setProj(data.srs);

        this.data.chartName = data.name;
        this.data.chartType = data.type;
        this.data.chartSubtype = data.subtype;
        this.data.expires = data.expires;
        data.width = parseInt(data.width);
        data.height = parseInt(data.height);
        this.data.chartwidth = data.width > 0 ? data.width : 10000;
        this.data.chartheight = data.height > 0 ? data.height : 10000;
        if (data.lat)
            this.data.lat = parseFloat(data.lat);
        if (data.lon)
            this.data.lon = parseFloat(data.lon);
        
        if (data.scale) {
            this.data.scale = parseInt(data.scale);
            this.data.overzoom = 0;
        }
        if (this.data.scale && this.data.scale > this.data.maxzoom) {
            this.data.scale = this.data.maxzoom;
        }

        this.buildTiles(noreset);

        if (data.environ) {
            this.data.environ = data.environ;
        }
        if (data.tileservers) {
            this.data.tileurl = data.tileservers;
            this.data.tileservers = data.tileservers.split(',');
        } else {
            this.data.tileservers = false;
        }
        if (data.protoid == '301') {
            var now = new Date();
            var year = now.getFullYear().toFixed();
            this.setMapCredit("Map Data &copy;"+year+" SkyVector, ARINC, OpenStreetMap");
        } else if (data.protoid == '302') {
            var now = new Date();
            var year = now.getFullYear().toFixed();
            this.setMapCredit("Map Data &copy;"+year+" SkyVector, ARINC");
        } else if (data.protoid == '304') {
            var now = new Date();
            var year = now.getFullYear().toFixed();
            this.setMapCredit("Map Data &copy;"+year+" SkyVector, ARINC");
        } else {
            this.setMapCredit(false);
        }
        if (data.currTime) {
            var now = new Date();
            this.data.timeDelta = now.getTime() - (data.currTime * 1000);
            if (!this.data.timeTimer) {
                var sv = this;
                var updateTime = function() {
                    if (!sv.data.div.tbtime) {
                        sv.data.div.tbtime = sv.ce("li");
                        sv.data.div.tbtime.id = "sv_tbtime";
                        sv.showHideTimeLocation();
                        //sv.data.div.tbul.insertBefore(sv.data.div.tbtime,sv.data.div.tbll);
                        sv.data.div.tbul.appendChild(sv.data.div.tbtime);
                    }
                    var now = new Date();
                    var utcms = now.getTime() - sv.data.timeDelta;
                    if (sv.data.prefs.windZulu && sv.data.prefs.windZulu * 1000 < utcms - 5400000) {
                        sv.data.prefs.windZulu = Math.round(utcms / 10800000) * 10800;
                    }
                    var utc = new Date(utcms);
                    var hours = utc.getUTCHours().toFixed(0);
                    var mins = utc.getUTCMinutes().toFixed(0);
                    var secs = utc.getUTCSeconds().toFixed(0);
                    if (hours.length == 1)
                        hours = "0" + hours;
                    if (mins.length == 1)
                        mins = "0" + mins;
                    if (secs.length == 1)
                        secs = "0" + secs;
                    sv.data.div.tbtime.innerHTML = hours + ":" + mins + ":" + secs + " Z";
                }
                this.data.timeTimer = window.setInterval(updateTime, 1000);
            }
        }
        if (!noreset) this.reset();
        if(cs && cs.bsel){
            if(data.alaska==1){
                cs.bsel('AK');
            }else{
                cs.bsel('US');
            }
            if(data.type == 'heli'){
                cs.bsel('Heli');
            }else if (data.subtype == 'Low'){
                cs.bsel('ENL');
            }else if (data.subtype == 'High'){
                cs.bsel('ENH');
            }else if (data.subtype == 'Area'){
                cs.bsel('Area');
            }else if (data.subtype == 'TAC'){
                cs.bsel('TAC');
            }else{
                cs.bsel('Sectional');
            }
        }
    },
    sResult: function(data) {
        if (data) {
            this.loadMap(data[0].chart);
            this.showSR(data);
        }
    },
    showSR: function(data) {
        var sv = this;
        if (this.data.div.searchResults) {
            var sr = this.data.div.searchResults;
            sr.div.style.visibility = 'visible';
        } else {
            this.data.div.searchResults = new Object;
            var sr = this.data.div.searchResults;
            sr.div = this.ce("div");
            sr.div.id = "sv_searchResults";
            sr.div.className = "sv_xlback";
            sr.div.onmouseover = function() {
                sv.data.nowheel = true;
            }
            sr.div.onmouseout = function() {
                sv.data.nowheel = false;
            }
            sr.div.onmousewheel = function(e) {
                if (!e)
                    e = window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = "true";
                }
            }
            sr.table = this.ce("table");
            sr.tbody = this.ce("tbody");
            sr.table.appendChild(sr.tbody);
            sr.table.id = "sv_srTable";
            sr.div.appendChild(sr.table);
            this.data.div.chart.appendChild(sr.div);
            sr.mkLine = function(r) {
                var row = new Object;
                row.tr = sv.ce("tr");
                var td1 = sv.ce("td");
                var td2 = sv.ce("td");
                var td3 = sv.ce("td");
                row.tr.appendChild(td1);
                row.tr.appendChild(td2);
                row.tr.appendChild(td3);
                td1.style.width = "20px";
                var icon = sv.ce("img");
                icon.style.width = "16px";
                icon.style.height = "13px";
                if (r.type == 'nav') {
                    icon.src = sv.data.images + "/VOR.png";
                } else if (r.type == 'wp') {
                    icon.src = sv.data.images + "/WPT.png";
                } else if (r.type == 'nav_t') {
                    icon.src = sv.data.images + "/VOT.png";
                } else if (r.type == 'nav_d') {
                    icon.src = sv.data.images + "/VOD.png";
                } else if (r.type == 'nav_n') {
                    icon.src = sv.data.images + "/NDB.png";
                } else if (r.type == 'ap') {
                    icon.src = sv.data.images + "/APT.png";
                } else {
                    icon.src = sv.data.images + "/" + r.type + ".png";
                }
                
                td1.appendChild(icon);
                if (r.url) {
                    row.link = sv.ce("a");
                    row.linkimg = sv.ce("img");
                    row.linkimg.className = "sv_srlinkimg";
                    row.linkimg.src = sv.data.images + "/info.png";
                    row.linkimg.style.width = "16px";
                    row.linkimg.style.height = "16px";
                    row.link.href = r.url;
                    row.link.appendChild(row.linkimg);
                    td3.appendChild(row.link);
                }
                //row.d.appendChild(document.createTextNode(r.name + "(" + r.type + ")"));
                td2.appendChild(document.createTextNode(r.name));
                td2.style.cursor = "pointer";
                
                var lat = r.geom[1];
                var lon = r.geom[0];
                td2.onclick = function() {
                    //var pos=sv.ll2xy(lat,lon);
                    //sv.data.p.x=pos.x;
                    //sv.data.p.y=pos.y;
                    //sv.pan();
                    //sv.getChart({"z":sv.data.scale,"ll":lat+","+lon});
                    sv.loadMap(r.chart);
                }
                return row.tr;
            }
        }
        while (sr.tbody.firstChild) {
            sr.tbody.removeChild(sr.tbody.firstChild);
        }
        for (var i = 0; i < data.length; i++) {
            sr.tbody.appendChild(sr.mkLine(data[i]));
        }
    },
    mkTile: function(type) {
        var sv = this;
        var tile = new Object;
        tile.img = this.ce("img");
        var i = tile.img;
        tile.src = '';
        tile.top = '';
        tile.left = '';
        i.style.position = 'absolute';
        i.style.border = 'none';
        i.style.padding = '0px';
        i.style.width = this.data.tilesize + "px";
        i.style.height = this.data.tilesize + "px";
        i.style.visibility = "hidden";
        i.style.width = this.data.tilesize + "px";
        i.style.height = this.data.tilesize + "px";
        if (type) {
            i.onload = function() {
                i.style.visibility = "visible";
                if (i.src) {
                    sv.data.cacheCount++;
                    sv.data.imgCache[tile.src] = sv.data.cacheCount;
                }
            }
            tile.set = function(s, x, y) {
                if (!s) {
                    if (tile.toargs.length) {
                        s = tile.toargs[0];
                        x = tile.toargs[1];
                        y = tile.toargs[2];
                        tile.toargs = [];
                    } else {
                        return false;
                    }
                }
                var xp = Math.round(sv.data.tilesize * x - sv.data.slideroffsetx) + "px";
                var yp = Math.round(sv.data.tilesize * y - sv.data.slideroffsety) + "px";
                if (tile.left != xp) {
                    tile.left = xp;
                    i.style.left = xp;
                }
                if (tile.top != yp) {
                    tile.top = yp;
                    i.style.top = yp;
                }
                //if (i.src != s || i.style.visibility != 'visible'){
                if (tile.src != s) {
                    tile.src = s;
                    if (sv.data.imgCache[s] > sv.data.cacheCount - sv.data.cacheLimit) {
                        i.src = s;
                        i.style.visibility = "visible";
                    } else {
                        i.style.visibility = "hidden";
                        i.src = s;
                    }
                } else if (i.style.visibility != 'visible' && i.complete) {
                    i.style.visibility = 'visible';
                }
            }
            i.style.zIndex = 1;
        } else {
            i.onload = function() {
                i.style.visibility = "visible";
                if (i.src) {
                    sv.data.cacheCount++;
                    sv.data.imgCache[i.src] = sv.data.cacheCount;
                }
            }
            tile.set = function(f, s, x, y) {
                var xp = Math.floor(sv.data.tilesize * x / f - sv.data.slideroffsetx) + "px";
                var yp = Math.floor(sv.data.tilesize * y / f - sv.data.slideroffsety) + "px";
                i.style.width = Math.ceil(sv.data.tilesize / f) + "px";
                i.style.height = i.style.width;
                if (tile.left != xp) {
                    tile.left = xp;
                    i.style.left = xp;
                }
                if (tile.top != yp) {
                    tile.top = yp;
                    i.style.top = yp;
                }
                if (tile.src != s) {
                    tile.src = s;
                    if (sv.data.imgCache[s] > sv.data.cacheCount - sv.data.cacheLimit) {
                        i.src = s;
                        i.style.visibility = "visible";
                    } else {
                        i.style.visibility = "hidden";
                    }
                }
            }
            i.style.zIndex = 0;
        }
        return tile;
    },
    mkVisible: function(i) {
        i.style.visibility = 'visible';
    },
    pan: function(firstTime) {
        this.data.div.slider.style.top = Math.round(this.data.slideroffsety - (this.data.p.y - this.data.height / 2)) + "px";
        this.data.div.slider.style.left = Math.round(this.data.slideroffsetx - (this.data.p.x - this.data.width / 2)) + "px";
        if (firstTime) {
            this.whilemove();
        } else {
            if (this.data.isIE) {
                if (!this.data.whilemove)
                    this.data.whilemove = window.setTimeout("SkyVector.whilemove()", 300);
            } else {
                if (!this.data.whilemove)
                    this.data.whilemove = window.setTimeout(SkyVector.whilemove, 300);
            }
            this.resetZoomer(true);
        }
        //if (!this.data.isPlanDragging){
        this.datalayerTimeout();
    //}
    },
    retile: function() {
        this.data.div.zs.style.right = Math.round(38 + ((this.data.scale - 1) * (72 / (this.data.maxzoom - 1)))) + "px";
        if (this.data.overzoom) {
            this.data.div.zs.style.right = '-666px';
        }
        var tx = Math.floor((this.data.p.x - (this.data.width / 2)) / this.data.tilesize);
        var ty = Math.floor((this.data.p.y - (this.data.height / 2)) / this.data.tilesize);
        var wrap = this.data.proj.srs.proj == 'sm' ? true : false;
        if (!wrap && tx < 0)
            tx = 0;
        if (ty < 0)
            ty = 0;
        
        var cx = Math.floor(this.data.p.x / this.data.tilesize);
        var cy = Math.floor(this.data.p.y / this.data.tilesize);
        var minx = Math.floor((this.data.p.x - (this.data.width / 2)) / this.data.tilesize);
        var miny = Math.floor((this.data.p.y - (this.data.height / 2)) / this.data.tilesize);
        var maxx = minx + this.data.htiles;
        var maxy = miny + this.data.vtiles;

        var rings = this.data.htiles;
        if (this.data.vtiles > this.data.htiles) {
            rings = this.data.vtiles;
        }
        rings = Math.ceil(rings / 2);
        for (var ring = 0; ring <= rings; ring++) {
            if (ring == 0) {
                this.tileurl(cx, cy);
            } else {
                for (var x = cx - ring; x <= cx + ring; x++) {
                    if ( x >= minx && x < maxx){
                        if (cy - ring >= miny) {
                            this.tileurl(x, cy - ring);
                        }
                        if (cy + ring < maxy) {
                            this.tileurl(x, cy + ring);
                        }
                    }
                }
                for (var y = cy + 1 - ring; y < cy + ring; y++) {
                    if (y >= miny && y < maxy) {
                        if (cx - ring >= minx) {
                            this.tileurl(cx - ring, y);
                        }
                        if (cx + ring < maxx) {
                            this.tileurl(cx + ring, y);
                        }
                    }
                }
            }
        }
    },
    tileurl: function(x, y, noset) {
        var ix = this.mod(x, this.data.htiles);
        var iy = this.mod(y, this.data.vtiles);
        var wrap = this.data.proj.srs.proj == 'sm' ? true : false;
        if (wrap) {
            var x2 = this.mod(x, this.data.xmax);
        } else {
            var x2 = x;
        }
        if (((x >= 0 && 
        x < this.data.xmax) || wrap) && 
        y >= 0 && 
        y < this.data.ymax) {
            if (this.data.tileservers) {
                var smi = (x2 + y) % this.data.tileservers.length;
                var tileurl = this.data.tileservers[smi];
            } else {
                var tileurl = "https://t.skyvector.com/tiles";
            }
            var filename = tileurl + 
            "/" + this.data.protoid + 
            "/" + this.data.edition + 
            "/" + this.data.scale + 
            "/" + x2 + "/" + y + ".jpg";
        } else {
            var filename = this.data.images + "/clear.gif";
        }
        if (this.data.zztiles && 
            this.data.zztiles[iy] && 
            this.data.zztiles[iy][ix]) {
            this.data.zztiles[iy][ix].toargs = [filename, x, y];
        }
        if (noset) {
            return filename;
        } else {
            this.data.tiles[iy][ix].set(filename, x, y);
        }
    },
    datalayerIdleTimeout: function(idleTime){
        var sv = this;
        if (sv.data.datalayer) {
            window.clearTimeout(sv.data.datalayer);
        }
        if (idleTime){
            sv.data.datalayer = window.setTimeout(function(){
                sv.datalayer(null,true);
            }, idleTime);
        }
    },
    datalayerTimeout: function() {
        if (this.data.datalayer) {
            window.clearTimeout(this.data.datalayer);
        }
        var datalayertimeout = 200;
        this.data.datalayer = window.setTimeout(SkyVector.datalayer, datalayertimeout);
    },
    underpan: function(zoomdir) {
        var factor = 1;
        var zoom = zoomdir == "in" ? this.data.scale + 1 : this.data.scale - 1;
        factor = this.data.scalorFn(this.data.scale, this.data.overzoom) / this.data.scalorFn(zoom, this.data.overzoom);
        var tx = Math.floor((this.data.p.x * factor - (this.data.width / 2)) / (this.data.tilesize));
        var ty = Math.floor((this.data.p.y * factor - (this.data.height / 2)) / (this.data.tilesize));
        if (tx < 0)
            tx = 0;
        if (ty < 0)
            ty = 0;
        for (var i = ty; i < ty + Math.ceil(this.data.vtiles * 1); i++) {
            for (var j = tx; j < tx + Math.ceil(this.data.htiles * 1); j++) {
                var ix = j % this.data.htiles;
                var iy = i % this.data.vtiles;
                var filename = this.tileurl(j, i, true);
                this.data.ztiles[iy][ix].set(factor, filename, j, i);
            }
        }
    },
    wheel: function(e) {
        var sv = SkyVector;
        //if (sv.data.nowheel) return;
        if (!e)
            e = window.event;
        sv.rMenuHide();
        sv.wxHide();
        if (e.preventDefault)
            e.preventDefault();
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = "true";
        }
        if (sv.data.settings.href) {
            return false;
        }
        var delta = 0;
        if (e.detail) {
            delta = e.detail * -40;
        } else {
            delta = e.wheelDelta;
        }
        sv.data.wheelDelta += delta;
        if (Math.abs(sv.data.wheelDelta) >= 120) {
            sv.doWheel(sv.data.wheelDelta);
            sv.data.wheelDelta = 0;
        }
    },
    doWheel: function(e) {
        var sv = SkyVector;
        var dir = sv.data.wheelDelta < 0 ? 'out' : 'in';
        if (dir == 'in') {
            if (sv.data.overzoom >= sv.data.maxoverzoom)
                return false;
            var newscale = sv.data.scale - sv.data.overzoom - 1;
            var newoverzoom = 0;
            if (newscale < 1) {
                newoverzoom = 1 - newscale;
                newscale = 1;
            }
            var factor = sv.data.scalorFn(newscale, newoverzoom) / sv.data.scalorFn(sv.data.scale, sv.data.overzoom)
        } else {
            if (sv.data.scale == sv.data.maxzoom)
                return false;
            var newscale = sv.data.scale - sv.data.overzoom + 1;
            var newoverzoom = 0;
            if (newscale < 1) {
                newoverzoom = 1 - newscale;
                newscale = 1;
            }
            var factor = sv.data.scalorFn(newscale, newoverzoom) / sv.data.scalorFn(sv.data.scale, sv.data.overzoom)
        }
        var cx = (sv.data.p.x - (sv.data.width / 2)) + (sv.data.mouse.x - factor * (sv.data.mouse.x - (sv.data.width / 2)));
        var cy = (sv.data.p.y - (sv.data.height / 2)) + (sv.data.mouse.y - factor * (sv.data.mouse.y - (sv.data.height / 2)));
        sv.za(dir);
        sv.data.p = {x: cx / factor,y: cy / factor};
        var p = sv.xy2ll(cx, cy);
        sv.data.lat = p.lat;
        sv.data.lon = p.lon;
        sv.data.scale = newscale;
        var oldoverzoom = sv.data.overzoom;
        sv.data.overzoom = newoverzoom;
        sv.data.div.zs.style.right = Math.round(38 + ((sv.data.scale - 1) * (72 / (sv.data.maxzoom - 1)))) + "px";
        if (sv.data.overzoom) {
            sv.data.div.zs.style.right = '-666px';
        }
        if (oldoverzoom !== newoverzoom) {
            sv.buildTiles(false);
        }
        if (sv.data.afterwheel) {
            window.clearTimeout(sv.data.afterwheel);
            dir = '';
        }
        if (sv.data.isIE) {
            sv.data.afterwheel = window.setTimeout("SkyVector.afterwheel('" + dir + "');", 100);
        } else {
            sv.data.afterwheel = window.setTimeout(sv.afterwheel, 100, dir);
        }
        return false;
    },
    za: function(dir, x, y) {
        var x = this.data.mouse.x - 37;
        var y = this.data.mouse.y - 37;
        this.data.div.za.style.top = y + "px";
        this.data.div.za.style.left = x + "px";
        if (dir == 'in') {
            var a = [1, 2, 3, 4];
        } else {
            var a = [4, 3, 2, 1];
        }
        //this.data.div.za.src=this.data.images+"/clear.gif";
        this.data.div.za.style.display = 'block';
        window.setTimeout("SkyVector.data.div.za.src='" + this.data.images + "/za" + a[0] + this.data.png + "'", 100);
        window.setTimeout("SkyVector.data.div.za.src='" + this.data.images + "/za" + a[1] + this.data.png + "'", 200);
        window.setTimeout("SkyVector.data.div.za.src='" + this.data.images + "/za" + a[2] + this.data.png + "'", 300);
        window.setTimeout("SkyVector.data.div.za.src='" + this.data.images + "/za" + a[3] + this.data.png + "'", 400);
        window.setTimeout("SkyVector.data.div.za.style.display='none'; SkyVector.data.div.za.src='" + this.data.images + "/clear.gif'", 500);
    },
    whilemove: function() {
        var sv = SkyVector;
        var ll = sv.xy2ll(sv.data.p.x, sv.data.p.y);
        sv.data.lat = ll.lat;
        sv.data.lon = ll.lon;
        var a = sv.llf(ll.lat, ll.lon);
        sv.data.div.tbll.innerHTML = a.lat + " " + a.lon;
        sv.retile()
        if (!sv.data.isIE && !sv.data.isPlanDragging) {
            sv.drawPlan();
        }
        sv.data.whilemove = false;
    },
    status: function(msg) {
        this.data.div.tbll.innerHTML = msg;
    },
    throbber: function(on, key, message) {
    //
    },
    throbber_ADC: function(on, key, message) {
        if (on) {
            this.data.throbber[key] = true;
        } else {
            this.data.throbber[key] = false;
        }
        imgon = false;
        for (var k in this.data.throbber) {
            if (this.data.throbber[k]) {
                imgon = true;
            }
        }
        if (imgon) {
            if (this.data.div.throbber) {
                this.data.div.throbber.style.display = "block";
            }
        } else {
            if (this.data.div.throbber) {
                this.data.div.throbber.style.display = "none";
            }
        }
    },
    afterwheel: function(dir) {
        var sv = SkyVector;
        sv.reset(dir);
        sv.data.afterwheel = false;
        try {
            ga_event('send', 'event', 'Map', 'ZoomWheel');
        } catch (e) {
        };
    },
    setPref: function(key,value) {
        var sv = this;
        var qs = sv.mkQS({"key":key,"value":value});
        var r = sv.request(sv.data.perldir + "/userpref" + qs);
    },
    fpl: function(p) {
        var sv = this;
        p.w = sv.data.width;
        p.h = sv.data.height;
        p.cid = sv.data.protoid;

        var qs = sv.mkQS(p);
        var r = sv.request(sv.data.perldir + "/fpl" + qs);
        r.onload = function(data) {
            if (data.zoom){
                if (data.zoom.c){
                    //load new chart
                    sv.loadMap(data.zoom.c,1);
                }
                if (data.zoom.r){
                    var scale = Math.LOG2E*Math.log(data.zoom.r/sv.data.proj.data.xr) * 2;
                    var oldoverzoom = sv.data.overzoom;
                    sv.data.overzoom = 0;
                    sv.data.scale = Math.ceil(scale + 1);
                    if (sv.data.scale < 1) {
                        sv.data.overzoom = Math.min(1 - sv.data.scale, sv.data.maxoverzoom);
                        sv.data.scale = 1;
                    }
                    if (sv.data.scale > sv.data.maxzoom) sv.data.scale = sv.data.maxzoom;
                    if (oldoverzoom !== sv.data.overzoom) {
                        sv.buildTiles(true);
                    }
                }
                sv.data.lat = parseFloat(data.zoom.lat);
                sv.data.lon = parseFloat(data.zoom.lon);
                sv.reset();
            }
            sv.data.FPL = data;
            sv.data.div.zfpl.style.right = data.route && data.route.length ? null : '-666px';
            sv.data.div.mapCredit.div.style.right = data.route && data.route.length ? '200px' : null;
            sv.loadPlan();
        }
    },
    datalayer: function(p,isTimeout) {
        var sv = SkyVector;
        //sv.whilemove();
        if (sv.data.lon >= 180 || sv.data.lon <= -180 || Math.abs(sv.data.lon - sv.data.resetlon) > 90) {
            sv.reset();
            return;
        }
        var version = sv.data.datalayerver + 1;
        sv.data.datalayerver++;
        var layersave = sv.saveLayers();
        sv.setCookie("startLoc2", sv.data.protoid + "," + sv.data.scale + "," + sv.data.lat.toFixed(5) + "," + sv.data.lon.toFixed(5) + "," + layersave + "," + sv.data.fuel.curr + "-" + sv.data.fuel.qty + "-" + sv.data.fuel.unit);
        var cmd = new Object;
        if (p && p.cmd)
            cmd = p;
        var ll1 = sv.xy2ll(sv.data.p.x - (sv.data.width / 2), sv.data.p.y + (sv.data.height / 2));
        var ll2 = sv.xy2ll(sv.data.p.x + (sv.data.width / 2), sv.data.p.y - (sv.data.height / 2));
        sv.data.ll1 = ll1;
        sv.data.ll2 = ll2;
        cmd.ll = sv.data.lat.toFixed(5) + "," + sv.data.lon.toFixed(5);
        cmd.ll1 = ll1.lat.toFixed(5) + "," + ll1.lon.toFixed(5);
        cmd.ll2 = ll2.lat.toFixed(5) + "," + ll2.lon.toFixed(5);
        //cmd.wx=sv.data.wx;
        
        if (sv.data.FPL && sv.data.FPL.ver){
            cmd.pv=sv.data.FPL.ver;
        }else{
            cmd.pv=0;
        }
        cmd.res = (sv.data.proj.data.xr * sv.data.scalorFn(sv.data.scale, sv.data.overzoom) * sv.data.devicePixelRatioFn()).toFixed(3);
        sv.data.resolution = cmd.res;
        if (sv.data.prefs) {
            if (sv.data.prefs.etd)
                cmd.etd = sv.data.prefs.etd
            if (sv.data.prefs.windMB != undefined)
                cmd.windMB = sv.data.prefs.windMB
            if (sv.data.prefs.windZulu)
                cmd.windZulu = sv.data.prefs.windZulu
            if (sv.data.prefs.tas)
                cmd.tas = sv.data.prefs.tas
            if (sv.data.prefs.mach)
                cmd.mach = sv.data.prefs.mach
        }
        if (sv.data.settings.layers_vector.length > 0) {
            var layers = [];
            for (var i = 0; i < sv.data.settings.layers_vector.length; i++) {
                if (sv.data.div.settings.enabled[sv.data.settings.layers_vector[i]]) {
                    var layername = sv.data.settings.layers_vector[i];
                    layers.push(layername);
                    if (layername == 'jeta' || layername == 'avgas' || layername == 'mogas' || layername == 'saf') {
                        cmd.fuelcurr = sv.data.fuel.curr;
                    }
                }
            }
            if (layers.length > 0)
                cmd.layers = layers.join(",");
        }
        if (sv.data.settings.layers_raster.length > 0) {
            var rlayers = [];
            for (var i = 0; i < sv.data.settings.layers_raster.length; i++) {
                if (sv.data.div.settings.enabled[sv.data.settings.layers_raster[i]]) {
                    var layername = sv.data.settings.layers_raster[i];
                    rlayers.push(layername);
                }
            }
            if (rlayers.length > 0)
                cmd.rlayers = rlayers.join(",");
        }
        if (isTimeout){
            sv.data.toCounter++
            cmd.timeouts = sv.data.toCounter;
            if (sv.animate.state == 'play'){
                cmd.frames = sv.animate.frames;
            }else{
                cmd.frames = 0;
            }
        }else{
            sv.data.toCounter = 0;
        }
        /*
        if (sv.data.settings.routes.length > 0) {
            var routes = [];
            for (var i = 0; i < sv.data.settings.routes.length; i++) {
                if (sv.data.settings.routes[i].on) {
                    routes.push(sv.data.settings.routes[i].id);
                }
            }
            if (routes.length > 0)
                cmd.routes = routes.join(",");
        }
        if (sv.data.settings.tpp.length > 0) {
            var tpp = [];
            for (var i = 0; i < sv.data.settings.tpp.length; i++) {
                if (sv.data.settings.tpp[i].on) {
                    tpp.push(sv.data.settings.tpp[i].id);
                }
            }
            if (tpp.length > 0)
                cmd.tpp = tpp.join(",");
        }
        */ 
        
        var qs = sv.mkQS(cmd);
        sv.data.queryString = qs;
        sv.throbber(true, 'datalayer');
        var r = sv.request(sv.data.perldir + "/dLayer" + qs);
        sv.rLayer(ll1, ll2, sv.data.rasterKey);
        r.onerror = function() {
            sv.throbber(false, 'datalayer');
        }
        r.onload = function(data) {
            if (version < sv.data.datalayerver) {
                return;
            }
            sv.throbber(false, 'datalayer');
            if (data) {
                if (data.zoomto) {
                    sv.loadMap(data.zoomto);
                } else {
                    if (data.switchers && sv.data.settings.switchers) {
                        sv.switchers(data.switchers);
                    }
                    if (data.weather) {
                        sv.weather(data.weather);
                    } else {
                        sv.weather();
                    }
                    if (data.plan) {
                        sv.data.plan = data.plan;
                        sv.drawPlan();
                        if ((data.plan.points && data.plan.points.length > 0) || sv.data.div.panel)
                            sv.showPanel();
                    }
                    if (data.fpl){
                        sv.data.FPL = data.fpl;
                        sv.loadPlan()
                    }
                    if (data.cmd) {
                        try {
                            eval(data.cmd)
                        } catch (e) {
                        }
                        ;
                    }
                    if (data.curr) {
                        sv.data.fuel.currValue = parseFloat(data.curr);
                    }
                    if (data.wind) {
                        sv.windShapes(data);
                    }
                    if (data.shapes || sv.data.sDraw) {
                        sv.data.shapeStash = data.shapes;
                        sv.shapes(data.shapes);
                    } else {
                        sv.shape.svg();
                    }
                    if (data.user){
                        if (sv.data.uid != data.user.uid){
                            if (data.user.uid){
                                sv.data.uid=data.user.uid;
                                sv.data.username = data.user.name;
                                sv.data.useremail = data.user.email;
                                sv.data.permfpl=data.user.permfpl;
                                sv.data.div.login_link_icon.className = "fa fa-user";
                                sv.data.div.login_link.removeChild(sv.data.div.login_link_text);
                                sv.data.div.login_link_text = sv.ct(data.user.name);
                                sv.data.div.login_link.appendChild(sv.data.div.login_link_text);
                            }else{
                                sv.data.uid = 0;
                                sv.data.username = "";
                                sv.data.useremail = "";
                                sv.data.permfpl = 0;
                                sv.data.div.login_link_icon.className = "fa fa-key";
                                sv.data.div.login_link.removeChild(sv.data.div.login_link_text);
                                sv.data.div.login_link_text = sv.ct("Sign In");
                                sv.data.div.login_link.appendChild(sv.data.div.login_link_text);
                            }
                        }
                        if (data.user.uid){
                            sv.data.tails = data.user.tails;
                        }else{
                            sv.data.tails = [];
                        }
                    }else{
                        sv.data.uid = 0;
                        sv.data.username = "";
                        sv.data.useremail = "";
                        sv.data.permfpl = 0;
                        sv.data.div.login_link_icon.className = "fa fa-key";
                        sv.data.div.login_link.removeChild(sv.data.div.login_link_text);
                        sv.data.div.login_link_text = sv.ct("Sign In");
                        sv.data.div.login_link.appendChild(sv.data.div.login_link_text);
                    }
                    if (data.rcurrentframe){
                        if (isTimeout && sv.data.rcurrentframe != data.rcurrentframe){
                            sv.animate.reload();
                        }
                        sv.data.rcurrentframe = data.rcurrentframe;
                        sv.data.rtimestamps = data.rtimestamps;
                        if (sv.data.div.animationControl){
                            sv.data.div.animationControl.setTimestamp(0);
                        }
                    }
                    if (data.rasterKey){
                        sv.data.rasterKey = data.rasterKey;
                    }
                    if (data.rasterReloadTime && !sv.data.settings.href){
                        var now = new Date()
                        var utcms = now.getTime() - sv.data.timeDelta;
                        var reloadms = parseFloat(data.rasterReloadTime)*1000 - utcms;
                        if (reloadms < 15000){
                            reloadms = 15000;
                        }
                        if (reloadms < 600000){
                            sv.datalayerIdleTimeout(reloadms);
                        }
                    }
                    sv.drawPlan();
                }
            }
        }
        if (!sv.data.settings.href) {
            sv.datalayerIdleTimeout(600000);
        }
    },
    windShapes: function(data) {
        if (!data.shapes) {
            data.shapes = [];
        }
        for (var i = 0; i < data.wind.length; i++) {
            var row = data.wind[i];
            var rowlen = row[2];
            for (var j = 0; j < rowlen; j++) {
                var a = parseInt(row[4].substring(j * 4, (j + 1) * 4), 16);
                if (a > 32768) {
                    var dir = a & 511;
                    var speed = ((a & 32256) >> 9) * 5;
                    var lat = row[0];
                    var lon = row[1] + (j * row[3])
                    var gid = "w-" + lat + "-" + lon + "-" + dir + "-" + speed;
                    var s = {type: 1,shape: [lon, lat]};
                    this.shape.cache[gid] = s;
                    data.shapes.unshift({"id": gid,t: "windpoint","shape": s,"d1": dir,"d2": speed});
                }
            }
        }
    },
    weather: function(a) {
        while (this.data.div.weather.firstChild) {
            this.data.div.weather.removeChild(this.data.div.weather.firstChild);
        }
        if (a) {
            for (var i = 0; i < a.length; i++) {
                this.mkWeather(a[i]);
            }
        }
    },
    mkWeather: function(m) {
        var sv = this;
        var key = m.s + " " + m.d;
        var p = this.ll2xy(m.lat, m.lon);
        if (!this.data.div.wxcache || !this.data.div.wxcache[key]) {
            var w = this.ce("div");
            w.id = "wx_" + key;
            w.className = "sv_metar";
            var y = -26 * parseInt(m.i.substring(0, 1));
            var x = 0;
            switch (m.i.substring(1, 4)) {
                case "VFR":
                    x = 0;
                    break;
                case "MVF":
                    x = -26;
                    break;
                case "IFR":
                    x = -52;
                    break;
                case "LIF":
                    x = -78;
                    break;
                default:
                    break;
            }
            w.style.backgroundPosition = x + "px " + y + "px";
            w.onmouseout = function() {
                sv.wxHide();
                sv.data.canvasHoverOff = false;
            }
            w.onclick = function(e) {
                if (!e)
                    e = window.event;
                sv.rightClick(e);
            }
            if (!this.data.div.wxcache)
                this.data.div.wxcache = new Object;
            this.data.div.wxcache[key] = w;
        }
        this.data.div.wxcache[key].onmouseover = function() {
            sv.data.canvasHoverOff = true;
            sv.data.canvasHoverId = undefined;
            sv.wxBox(p, m);
        }
        this.data.div.wxcache[key].style.top = Math.round(p.y - this.data.slideroffsety - 11) + "px";
        this.data.div.wxcache[key].style.left = Math.round(p.x - this.data.slideroffsetx - 10) + "px";
        this.data.div.weather.appendChild(this.data.div.wxcache[key]);
    },
    wxBox: function(p, m) {
        if (!this.data.div.wxBox) {
            this.data.div.wxBox = this.ce("div");
            this.data.div.wxBox.className = "sv svwxbox";
            this.data.div.wxBoxTitle = this.ce("div");
            this.data.div.wxBoxTitle.className = "sv svwxtitle";
            this.data.div.wxBoxData = this.ce("pre");
            this.data.div.wxBoxData.className = "sv svwxdata";
            this.data.div.wxBox.appendChild(this.data.div.wxBoxTitle);
            this.data.div.wxBox.appendChild(this.data.div.wxBoxData);
        }
        var station = m.s;
        if (m.n)
            station += " " + m.n;
        this.data.div.wxBoxTitle.innerHTML = "Weather Station " + station + " <span class=\"sv svwxage\">(" + m.a + ")</span>";
        var data = m.m;
        if (m.t)
            data += "\n" + m.t;
        if (this.data.isIE) {
            this.data.div.wxBoxData.innerText = data;
        } else {
            this.data.div.wxBoxData.innerHTML = data;
        }
        this.data.div.wxBox.style.visibility = 'hidden';
        this.data.div.wxBox.style.top = "0px";
        this.data.div.wxBox.style.left = "0px";
        if (false && this.data.isWebkit3D) {
            this.data.div.chart.insertBefore(this.data.div.wxBox, this.data.div.chart.firstChild);
            var left = p.x - (this.data.p.x - this.data.width / 2);
            var top = p.y - (this.data.p.y - this.data.height / 2);
        } else {
            document.body.insertBefore(this.data.div.wxBox, document.body.firstChild);
            var so = this.getPos(this.data.div.slider);
            var left = p.x - (this.data.slideroffsetx - so.x);
            var top = p.y - (this.data.slideroffsety - so.y);
        }
        var w = this.data.div.wxBox.scrollWidth;
        var h = this.data.div.wxBox.scrollHeight;
        if (left + w + 19 > document.documentElement.clientWidth) {
            left -= w + 15;
            if (left < 0)
                left = 0;
        } else {
            left += 15;
        }
        if (top + h + 19 > document.documentElement.clientHeight) {
            top -= h + 15;
        } else {
            top += 15;
        }
        this.data.div.wxBox.style.top = Math.round(top) + "px";
        this.data.div.wxBox.style.left = Math.round(left) + "px";
        this.data.div.wxBox.style.visibility = 'visible';
    },
    wxHide: function() {
        try {
            if (false && this.data.isWebkit3D) {
                this.data.div.chart.removeChild(this.data.div.wxBox);
            } else {
                document.body.removeChild(this.data.div.wxBox);
            }
        } catch (e) {
        }
    },
    makePirep: function(lat, lon, style, meta) {
        var sv = this;
        var p = this.ll2xy(lat,lon);
        var img = this.ce("div", "sv_pirepmarker");
        img.style.backgroundPosition = "0px " + style.offset*-24 + "px";
        img.style.top = Math.round(p.y - this.data.slideroffsety - 24) + "px";
        img.style.left = Math.round(p.x - this.data.slideroffsetx) + "px";
        sv.data.div.weather.appendChild(img);
        return img;
    },
    hover: function(e, txt, classname) {
        if (this.hoveroff && this.data.hovermove)
            this.hoveroff();
        var sv = this;
        if (!this.data.div.hover) {
            this.data.div.hover = this.ce("div");
            this.data.div.hover.className = "sv svhover";
        }
        if (classname) {
            this.data.div.hover.className = "sv svhover " + classname;
        } else {
            this.data.div.hover.className = "sv svhover";
        }
        
        this.data.div.hover.innerHTML = txt;
        this.data.div.hover.style.visibility = 'hidden';
        this.data.div.hover.style.top = "0px";
        this.data.div.hover.style.left = "0px";
        document.body.insertBefore(this.data.div.hover, document.body.firstChild);
        this.data.hovermove = function(me, skipTest) {
            if (!me)
                me = window.event;
            var y = me.clientY + 15;
            var x = me.clientX + 15;
            if (!x){
                x=me.pageX - 60;
                y=me.pageY - 70;
            }
            if (x + sv.data.div.hover.scrollWidth + 6 > document.documentElement.clientWidth) {
                x = document.documentElement.clientWidth - (6 + sv.data.div.hover.scrollWidth);
            }
            if (y + sv.data.div.hover.scrollHeight + 4 > sv.data.mouse.oy + sv.data.height) {
                y = (sv.data.mouse.oy + sv.data.height) - (4 + sv.data.div.hover.scrollHeight);
            }
            sv.data.div.hover.style.top = y + "px";
            sv.data.div.hover.style.left = x + "px";
            if (!skipTest && sv.data.shapeclickon && (Math.abs(sv.data.shapeclickon.x - me.clientX) > 2 || Math.abs(sv.data.shapeclickon.y - me.clientY) > 2)) {
                sv.data.shapeclickon = false;
            }
        }
        this.data.hovermove(e, true);
        if (sv.data.isIE) {
            document.attachEvent("onmousemove", this.data.hovermove);
        } else {
            document.addEventListener("mousemove", this.data.hovermove, false);
        }
        sv.data.hoverison = true;
        this.data.div.hover.style.visibility = 'visible';
    //return hovermove; 
    },
    hoveroff: function() {
        var sv = this;
        try {
            if (sv.data.isIE) {
                document.detachEvent("onmousemove", this.data.hovermove);
            } else {
                document.removeEventListener("mousemove", this.data.hovermove, false);
            }
        } catch (e) {
        }
        this.data.hoverison = false;
        try {
            this.data.div.hover.innerHTML = '';
            document.body.removeChild(this.data.div.hover);
        } catch (e) {
        }
    },
    switchers: function(a) {
        while (this.data.div.switcher.firstChild) {
            this.data.div.switcher.removeChild(this.data.div.switcher.firstChild);
        }
        for (var i = 0; i < a.length; i++) {
            this.mkSwitcher(a[i]);
        }
    },
    mkSwitcher: function(s) {
        var sv = this;
        var key = s.protoid + "/" + s.edition + ":" + s.tileservers;
        if (!this.data.div.swcache || !this.data.div.swcache[key]) {
            var sw = this.ce("div");
            sw.className = "sv sw";
            sw.onclick = function() {
                sv.loadMap(s);
                try {
                    ga_event('send', 'event', 'Map', 'Switcher');
                } catch (e) {
                }
                ;
            }
            var sw1 = this.ce("div");
            sw1.className = "sv sw1";
            var sw2 = this.ce("div");
            sw2.className = "sv sw2";
            sw2.innerHTML = s.name;
            sw.appendChild(sw1);
            sw.appendChild(sw2);
            if (!this.data.div.swcache)
                this.data.div.swcache = new Object;
            this.data.div.swcache[key] = sw;
        }
        if (this.data.protoid == s.protoid) {
            this.data.div.swcache[key].childNodes[0].className = "sv sw1 swon";
            this.data.div.swcache[key].childNodes[1].className = "sv sw2 swon";
            if (this.data.edition == s.edition && this.data.tileurl != s.tileservers){
                this.data.tileurl = s.tileservers;
                this.data.tileservers = s.tileservers.split(',');
                this.reset();
            }
        } else {
            this.data.div.swcache[key].childNodes[0].className = "sv sw1";
            this.data.div.swcache[key].childNodes[1].className = "sv sw2";
        }
        this.data.div.switcher.appendChild(this.data.div.swcache[key]);
    },
    gcArc: function(dlat1, dlon1, dlat2, dlon2, maxsteps) {
        var points = false;
        var lat1 = dlat1 * this.data.proj.deg2rad;
        var lon1 = dlon1 * this.data.proj.deg2rad;
        var lat2 = dlat2 * this.data.proj.deg2rad;
        var lon2 = dlon2 * this.data.proj.deg2rad;
        var dist = dlon2 - dlon1;
        if (dist > 180) {
            dist -= 360;
        }
        if (dist < -180) {
            dist += 360;
        }
        var stepsPerDegree = .5;
        if (this.data.isFF) {
            stepsPerDegree = 4;
        }
        var steps = Math.ceil(Math.abs(dist) * stepsPerDegree);
        if (maxsteps && steps > maxsteps)
            steps = maxsteps;
        if (steps > 1) {
            points = [];
            for (var i = 1; i < steps; i++) {
                var d = i * (dist / steps) * this.data.proj.deg2rad;
                var lon = lon1 + d;
                var lat = Math.atan((Math.sin(lat1) * Math.cos(lat2) * Math.sin(lon - lon2) - Math.sin(lat2) * Math.cos(lat1) * Math.sin(lon - lon1)) / (Math.cos(lat1) * Math.cos(lat2) * Math.sin(lon1 - lon2)));
                if (lat > 90) {
                    lat = 90 - (lat - 90);
                    lon += 180;
                }
                points.push([lat * this.data.proj.rad2deg, lon * this.data.proj.rad2deg]);
            }
        }
        return points;
    },
    
    
    
    drawPlan: function() {
        if (this.data.plan.points && this.data.plan.points.length) {
            var p0 = this.ll2xy(this.data.plan.points[0].lat, this.data.plan.points[0].lon);
            this.data.plan.points[0].px = p0.x;
            this.data.plan.points[0].py = p0.y;
            var ext = {a: 1,minx: p0.x,maxx: p0.x,miny: p0.y,maxy: p0.y};
            for (var i = 0; i < this.data.plan.points.length - 1; i++) {
                var points = new Array();
                points.push([this.data.plan.points[i].lat, this.data.plan.points[i].lon]);
                for (var j = 0; j < this.data.plan.points[i].line.length; j++) {
                    points.push(this.data.plan.points[i].line[j]);
                }
                points.push([this.data.plan.points[i + 1].lat, this.data.plan.points[i + 1].lon]);
                this.data.plan.points[i].pline = [];
                var plinenum = 0;
                this.data.plan.points[i].pline[plinenum] = [];
                for (var j = 0; j < points.length; j++) {
                    var pl = points[j];
                    if (j > 0) {
                        var l1 = points[j - 1][1];
                        var l2 = pl[1];
                        while (l1 < this.data.lon - 180) {
                            l1 = (l1 * 1.0) + 360;
                        }
                        while (l1 > this.data.lon + 180) {
                            l1 = (l1 * 1.0) - 360;
                        }
                        while (l2 < this.data.lon - 180) {
                            l2 = (l2 * 1.0) + 360;
                        }
                        while (l2 > this.data.lon + 180) {
                            l2 = (l2 * 1.0) - 360;
                        }
                        if (Math.abs(l1 - l2) > 180) {
                            plinenum++;
                            this.data.plan.points[i].pline[plinenum] = [];
                        }
                    }
                    var pp = this.ll2xy(pl[0], pl[1]);
                    this.data.plan.points[i].pline[plinenum].push([pp.x, pp.y]);
                    var x = Math.round(pp.x);
                    var y = Math.round(pp.y);
                    if (x < ext.minx)
                        ext.minx = x;
                    if (x > ext.maxx)
                        ext.maxx = x;
                    if (y < ext.miny)
                        ext.miny = y;
                    if (y > ext.maxy)
                        ext.maxy = y;
                    if (j == points.length - 1) {
                        this.data.plan.points[i + 1].px = pp.x;
                        this.data.plan.points[i + 1].py = pp.y;
                    }
                }
                this.data.plan.points[i].px = this.data.plan.points[i].pline[0][0][0];
                this.data.plan.points[i].py = this.data.plan.points[i].pline[0][0][1];
            }
            var margin = 400;
            ext.minx -= margin;
            ext.maxx += margin;
            ext.miny -= margin;
            ext.maxy += margin;
            var wminx = Math.floor(this.data.p.x - (this.data.width / 2));
            var wmaxx = Math.ceil(this.data.p.x + (this.data.width / 2));
            var wminy = Math.floor(this.data.p.y - (this.data.height / 2));
            var wmaxy = Math.ceil(this.data.p.y + (this.data.height / 2));
            if (ext.minx < wminx)
                ext.minx = wminx;
            if (ext.maxx > wmaxx)
                ext.maxx = wmaxx;
            if (ext.miny < wminy)
                ext.miny = wminy;
            if (ext.maxy > wmaxy)
                ext.maxy = wmaxy;
            
            ext.minx = Math.round(ext.minx);
            ext.maxx = Math.round(ext.maxx);
            ext.miny = Math.round(ext.miny);
            ext.maxy = Math.round(ext.maxy);
            this.data.plan.ext = ext;
            var pwidth = ext.maxx - ext.minx;
            var pheight = ext.maxy - ext.miny;
            
            if (pwidth > 0 && pheight > 0) {
                if (this.data.isIE) {
                    if (this.data.vReady) {
                        if (!this.data.div.plan) {
                            this.data.div.plan = document.createElement("div");
                            this.data.div.plan.id = "sv_plan";
                            this.data.div.slider.insertBefore(this.data.div.plan, this.data.div.slider.firstChild);
                        }
                        var vml = this.data.div.plan;
                        while (vml.firstChild) {
                            vml.removeChild(vml.firstChild);
                        }
                        vml.style.width = ext.maxx - ext.minx + "px";
                        vml.style.height = ext.maxy - ext.miny + "px";
                        vml.style.top = Math.round(ext.miny - this.data.slideroffsety) + "px";
                        vml.style.left = Math.round(ext.minx - this.data.slideroffsetx) + "px";
                        for (var i = 0; i < this.data.plan.points.length - 1; i++) {
                            for (var ip = 0; ip < this.data.plan.points[i].pline.length; ip++) {
                                if (!this.data.div.planlines[i]) {
                                    this.data.div.planlines[i] = [];
                                }
                                if (!this.data.div.planlines[i][ip]) {
                                    this.data.div.planlines[i][ip] = document.createElement("v:polyline");
                                }
                                vml.appendChild(this.data.div.planlines[i][ip]);
                                var line = this.data.div.planlines[i][ip];
                                line.style.position = "absolute";
                                var p = [];
                                for (var j = 0; j < this.data.plan.points[i].pline[ip].length; j++) {
                                    var k = this.data.plan.points[i].pline[ip][j];
                                    p.push(Math.round((k[0] - ext.minx) * 10) / 10);
                                    p.push(Math.round((k[1] - ext.miny) * 10) / 10);
                                }
                                //try { line.stroke.opacity="0.50"; } catch(err) {};
                                var stroke = this.getChild(line, "v:stroke");
                                if (stroke) {
                                    try {
                                        stroke.opacity = "0.5";
                                    } catch (err) {
                                    }
                                    ;
                                }
                                line.strokeweight = "6px";
                                line.strokecolor = "#ff00ff";
                                line.filled = "false";
                                line.points.value = p.join(",");
                                this.lineDragIE(line, i);
                            }
                        }
                        for (var i = 0; i < this.data.plan.points.length; i++) {
                            var point;
                            if (this.data.div.planpoints[i]) {
                                point = this.data.div.planpoints[i];
                            } else {
                                this.data.div.planpoints[i] = new Object;
                                point = this.data.div.planpoints[i];
                                point.circle = document.createElement("v:oval");
                                point.circle.strokecolor = "#bb44bb";
                                point.circle.strokeweight = "2px";
                                point.circle.fillcolor = "white";
                                point.circle.style.position = "absolute";
                                point.circle.style.height = "8px";
                                point.circle.style.width = "8px";
                                point.group = document.createElement("v:group");
                                point.group.style.position = "absolute";
                                point.group.style.width = "200px";
                                point.group.style.height = "20px";
                                point.group.coordsize = "200,20";
                                point.rect = document.createElement("v:roundrect");
                                point.rect.style.position = "absolute";
                                point.rect.style.top = "2";
                                point.rect.style.width = "80";
                                point.rect.style.height = "16";
                                point.rect.fillcolor = "white";
                                point.rect.strokecolor = "#bb44bb";
                                point.rect.strokeweight = "2px";
                                point.rect.arcsize = "1";
                                point.group.appendChild(point.rect);
                                point.text = document.createElement("v:line");
                                point.text.stroked = "f";
                                point.text_path = document.createElement("v:path");
                                point.text_path.textpathok = "t";
                                point.text.appendChild(point.text_path);
                                point.tpath = document.createElement("v:textpath");
                                point.tpath.string = "hello";
                                point.tpath.on = "t";
                                point.tpath.style.font = "12px Arial";
                                point.text.appendChild(point.tpath);
                            }
                            vml.appendChild(point.circle);
                            var px = Math.round((this.data.plan.points[i].px - ext.minx) * 10) / 10;
                            var py = Math.round((this.data.plan.points[i].py - ext.miny) * 10) / 10;
                            point.circle.style.left = (px - 4) + "px";
                            point.circle.style.top = (py - 4) + "px";
                            this.pointDragIE(i);
                            if (this.data.plan.points[i + 1]) {
                                var x1 = this.data.plan.points[i].pline[0][0][0];
                                var y1 = this.data.plan.points[i].pline[0][0][1];
                                var x2 = this.data.plan.points[i].pline[0][1][0];
                                var y2 = this.data.plan.points[i].pline[0][1][1];
                                var x3 = this.data.plan.points[i + 1].px;
                                var y3 = this.data.plan.points[i + 1].py;
                                var ldist = 100;
                                //if (!isNaN(this.data.plan.points[i].dst)){
                                //    ldist = 84+(8 * Math.ceil(Math.LOG10E * Math.log(this.data.plan.points[i].dst)));
                                //}
                                var pdist = Math.sqrt(((x1 - x3) * (x1 - x3)) + ((y1 - y3) * (y1 - y3)));
                                if (this.data.plan.points[i].dst && pdist > ldist) {
                                    //point.rect.style.width=(ldist-20).toFixed(0);
                                    vml.appendChild(point.group);
                                    var rot = 0;
                                    var xt = 0;
                                    var thyp = Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
                                    var tw = (x2 - x1) * (100 / thyp);
                                    var th = (y2 - y1) * (100 / thyp);
                                    var tp = {to: {x: 0,y: 0},from: {x: 0,y: 0}};
                                    if (x1 < x2) {
                                        rot = Math.atan((y2 - y1) / (x2 - x1)) * this.data.proj.rad2deg;
                                        tp.from.x = x1;
                                        tp.from.y = y1;
                                        tp.to.x = x1 + tw;
                                        tp.to.y = y1 + th;
                                    } else if (x1 == x2) {
                                        rot = 90;
                                        if (y1 > y2) {
                                            xt = -ldist;
                                        }
                                    } else {
                                        rot = Math.atan((y1 - y2) / (x1 - x2)) * this.data.proj.rad2deg;
                                        xt = -ldist;
                                        tp.from.x = x1 + tw;
                                        tp.from.y = y1 + th;
                                        tp.to.x = x1;
                                        tp.to.y = y1;
                                    }
                                    tp.from.x -= ext.minx;
                                    tp.from.y -= ext.miny;
                                    tp.to.x -= ext.minx;
                                    tp.to.y -= ext.miny;
                                    point.text.from = tp.from.x + " " + tp.from.y;
                                    point.text.to = tp.to.x + " " + tp.to.y;
                                    point.group.style.top = (py - 10) + "px";
                                    point.group.style.left = (px - 100) + "px";
                                    point.group.style.rotation = rot;
                                    point.rect.style.left = (110 + xt);
                                    point.tpath.string = this.df(this.data.plan.points[i].mh) + " " + Math.round(this.data.plan.points[i].dst) + "nm";
                                    var fill = document.createElement("v:fill");
                                    fill.on = "True";
                                    fill.color = "black";
                                    point.text.appendChild(fill);
                                    vml.appendChild(point.text);
                                }
                            }
                        }
                    }
                } else {
                    if (!this.data.div.plan) {
                        this.addSvgLayer();
                    }
                    
                    var svg = this.data.div.plan;
                    while (svg.firstChild) {
                        svg.removeChild(svg.firstChild);
                    }
                    //this.moveSvgLayer();
                    for (var i = 0; i < this.data.plan.points.length - 1; i++) {
                        for (var pi = 0; pi < this.data.plan.points[i].pline.length; pi++) {
                            if (!this.data.div.planlines[i]) {
                                this.data.div.planlines[i] = [];
                            }
                            if (!this.data.div.planlines[i][pi]) {
                                this.data.div.planlines[i][pi] = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                            }
                            var line = this.data.div.planlines[i][pi];
                            svg.appendChild(line);
                            line.setAttribute("stroke-width", "6px");
                            line.setAttribute("stroke", "#ff00ff");
                            line.setAttribute("opacity", "0.5");
                            line.setAttribute("fill", "none");
                            var p = "";
                            for (var j = 0; j < this.data.plan.points[i].pline[pi].length; j++) {
                                var k = this.data.plan.points[i].pline[pi][j];
                                //p+=(k[0]-ext.minx)+","+(k[1]-ext.miny)+" ";
                                p += (k[0]) + "," + (k[1]) + " ";
                            }
                            line.setAttribute("points", p);
                            this.lineDrag_ADC(line, i);
                        }
                    }
                    for (var i = 0; i < this.data.plan.points.length; i++) {
                        if (!this.data.div.planpoints[i]) {
                            this.data.div.planpoints[i] = new Object;
                            var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                            c.setAttribute("r", "4");
                            c.setAttribute("stroke", "#bb44bb");
                            c.setAttribute("stroke-width", "2");
                            c.setAttribute("fill", "white");
                            this.data.div.planpoints[i].circle = c;
                            var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                            var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                            g.appendChild(rect);
                            g.appendChild(text);
                            rect.setAttribute("rx", "8");
                            rect.setAttribute("ry", "8");
                            rect.setAttribute("y", "-8");
                            rect.setAttribute("x", "10");
                            rect.setAttribute("fill", "white");
                            rect.setAttribute("height", "16");
                            rect.setAttribute("width", "80");
                            rect.setAttribute("stroke", "#bb44bb");
                            rect.setAttribute("stroke-width", "2");
                            text.setAttribute("x", "15");
                            text.setAttribute("y", "4");
                            text.setAttribute("font-size", "12px");
                            text.setAttribute("width", "80");
                            this.data.div.planpoints[i].group = g;
                            this.data.div.planpoints[i].text = text;
                            this.data.div.planpoints[i].rect = rect;
                        }
                        var point = this.data.div.planpoints[i];
                        svg.appendChild(point.circle);
                        point.circle.setAttribute("cx", this.data.plan.points[i].px);
                        point.circle.setAttribute("cy", this.data.plan.points[i].py);
                        this.pointDrag_ADC(i);
                        if (this.data.plan.points[i + 1]) {
                            var x1 = this.data.plan.points[i].pline[0][0][0];
                            var y1 = this.data.plan.points[i].pline[0][0][1];
                            var x2 = this.data.plan.points[i].pline[0][1][0];
                            var y2 = this.data.plan.points[i].pline[0][1][1];
                            var x3 = this.data.plan.points[i + 1].px;
                            var y3 = this.data.plan.points[i + 1].py;
                            var ldist = 100;
                            if (!isNaN(this.data.plan.points[i].dst)) {
                                ldist = 84 + (8 * Math.max(1, Math.ceil(Math.LOG10E * Math.log(this.data.plan.points[i].dst))));
                            }
                            var pdist = Math.sqrt(((x1 - x3) * (x1 - x3)) + ((y1 - y3) * (y1 - y3)));
                            if (this.data.plan.points[i].dst && pdist > ldist) {
                                point.text.setAttribute("width", (ldist - 20));
                                point.rect.setAttribute("width", (ldist - 20));
                                svg.appendChild(point.group);
                                var rot = 0;
                                var xt = 0;
                                if (x1 < x2) {
                                    rot = Math.atan((y2 - y1) / (x2 - x1)) * this.data.proj.rad2deg;
                                } else if (x1 == x2) {
                                    rot = 90;
                                    if (y1 > y2) {
                                        xt = -ldist;
                                    }
                                } else {
                                    rot = Math.atan((y1 - y2) / (x1 - x2)) * this.data.proj.rad2deg;
                                    xt = -ldist;
                                }
                                point.rect.setAttribute("x", 10 + xt);
                                point.text.setAttribute("x", 15 + xt);
                                point.group.setAttribute("transform", "translate(" + (this.data.plan.points[i].px) + " " + (this.data.plan.points[i].py) + ") rotate(" + rot + ")");
                                point.text.textContent = this.df(this.data.plan.points[i].mh) + " " + Math.round(this.data.plan.points[i].dst) + "nm";
                            }
                        }
                    }
                }
                if (this.data.div.plan)
                    this.data.div.plan.style.visibility = "visible";
            } else {
                if (this.data.div.plan)
                    this.data.div.plan.style.visibility = "hidden";
            }
        } else {
            if (this.data.div.plan)
                this.data.div.plan.style.visibility = "hidden";
        }
    },
    
    drawPlan_ADC: function() {
        if (this.data.plan.points && this.data.plan.points.length) {
            var p0 = this.ll2xy(this.data.plan.points[0].lat, this.data.plan.points[0].lon);
            this.draw.labelpoints.push(p0);
            this.data.plan.points[0].px = p0.x;
            this.data.plan.points[0].py = p0.y;
            var ext = {a: 1,minx: p0.x,maxx: p0.x,miny: p0.y,maxy: p0.y};
            for (var i = 0; i < this.data.plan.points.length - 1; i++) {
                var points = new Array();
                points.push([this.data.plan.points[i].lat, this.data.plan.points[i].lon]);
                for (var j = 0; j < this.data.plan.points[i].line.length; j++) {
                    points.push(this.data.plan.points[i].line[j]);
                }
                points.push([this.data.plan.points[i + 1].lat, this.data.plan.points[i + 1].lon]);
                this.data.plan.points[i].pline = [];
                var plinenum = 0;
                this.data.plan.points[i].pline[plinenum] = [];
                for (var j = 0; j < points.length; j++) {
                    var pl = points[j];
                    if (j > 0) {
                        var l1 = points[j - 1][1];
                        var l2 = pl[1];
                        while (l1 < this.data.lon - 180) {
                            l1 += 360;
                        }
                        while (l1 > this.data.lon + 180) {
                            l1 -= 360;
                        }
                        while (l2 < this.data.lon - 180) {
                            l2 += 360;
                        }
                        while (l2 > this.data.lon + 180) {
                            l2 -= 360;
                        }
                        if (Math.abs(l1 - l2) > 180) {
                            plinenum++;
                            this.data.plan.points[i].pline[plinenum] = [];
                        }
                    }
                    var pp = this.ll2xy(pl[0], pl[1]);
                    if (j > 0) {
                        this.draw.labelpoints.push(pp);
                    }
                    this.data.plan.points[i].pline[plinenum].push([pp.x, pp.y]);
                    var x = Math.round(pp.x);
                    var y = Math.round(pp.y);
                    if (x < ext.minx)
                        ext.minx = x;
                    if (x > ext.maxx)
                        ext.maxx = x;
                    if (y < ext.miny)
                        ext.miny = y;
                    if (y > ext.maxy)
                        ext.maxy = y;
                    if (j == points.length - 1) {
                        this.data.plan.points[i + 1].px = pp.x;
                        this.data.plan.points[i + 1].py = pp.y;
                    }
                }
                this.data.plan.points[i].px = this.data.plan.points[i].pline[0][0][0];
                this.data.plan.points[i].py = this.data.plan.points[i].pline[0][0][1];
            }
            var margin = 1400;
            ext.minx -= margin;
            ext.maxx += margin;
            ext.miny -= margin;
            ext.maxy += margin;
            var wminx = Math.floor(this.data.p.x - (this.data.width));
            var wmaxx = Math.ceil(this.data.p.x + (this.data.width));
            var wminy = Math.floor(this.data.p.y - (this.data.height));
            var wmaxy = Math.ceil(this.data.p.y + (this.data.height));
            if (ext.minx < wminx)
                ext.minx = wminx;
            if (ext.maxx > wmaxx)
                ext.maxx = wmaxx;
            if (ext.miny < wminy)
                ext.miny = wminy;
            if (ext.maxy > wmaxy)
                ext.maxy = wmaxy;
            
            ext.minx = Math.round(ext.minx);
            ext.maxx = Math.round(ext.maxx);
            ext.miny = Math.round(ext.miny);
            ext.maxy = Math.round(ext.maxy);
            this.data.plan.ext = ext;
            var pwidth = ext.maxx - ext.minx;
            var pheight = ext.maxy - ext.miny;
            
            if (pwidth > 0 && pheight > 0) {
                if (this.data.isIE) {
                    if (this.data.vReady) {
                        if (!this.data.div.plan) {
                            this.data.div.plan = document.createElement("div");
                            this.data.div.plan.id = "sv_plan";
                            this.data.div.slider.insertBefore(this.data.div.plan, this.data.div.slider.firstChild);
                        }
                        var vml = this.data.div.plan;
                        while (vml.firstChild) {
                            vml.removeChild(vml.firstChild);
                        }
                        vml.style.width = ext.maxx - ext.minx + "px";
                        vml.style.height = ext.maxy - ext.miny + "px";
                        vml.style.top = Math.round(ext.miny - this.data.slideroffsety) + "px";
                        vml.style.left = Math.round(ext.minx - this.data.slideroffsetx) + "px";
                        for (var i = 0; i < this.data.plan.points.length - 1; i++) {
                            for (var ip = 0; ip < this.data.plan.points[i].pline.length; ip++) {
                                if (!this.data.div.planlines[i]) {
                                    this.data.div.planlines[i] = [];
                                }
                                if (!this.data.div.planlines[i][ip]) {
                                    this.data.div.planlines[i][ip] = document.createElement("v:polyline");
                                }
                                vml.appendChild(this.data.div.planlines[i][ip]);
                                var line = this.data.div.planlines[i][ip];
                                line.style.position = "absolute";
                                var p = [];
                                for (var j = 0; j < this.data.plan.points[i].pline[ip].length; j++) {
                                    var k = this.data.plan.points[i].pline[ip][j];
                                    p.push(Math.round((k[0] - ext.minx) * 10) / 10);
                                    p.push(Math.round((k[1] - ext.miny) * 10) / 10);
                                }
                                //try { line.stroke.opacity="0.50"; } catch(err) {};
                                var stroke = this.getChild(line, "v:stroke");
                                if (stroke) {
                                    try {
                                        stroke.opacity = "0.5";
                                    } catch (err) {
                                    }
                                    ;
                                }
                                line.strokeweight = "6px";
                                line.strokecolor = "#ff00ff";
                                line.filled = "false";
                                line.points.value = p.join(" ");
                                this.lineDragIE(line, i);
                            }
                        }
                        for (var i = 0; i < this.data.plan.points.length; i++) {
                            var point;
                            if (this.data.div.planpoints[i]) {
                                point = this.data.div.planpoints[i];
                            } else {
                                this.data.div.planpoints[i] = new Object;
                                point = this.data.div.planpoints[i];
                                point.circle = document.createElement("v:oval");
                                point.circle.strokecolor = "#bb44bb";
                                point.circle.strokeweight = "2px";
                                point.circle.fillcolor = "white";
                                point.circle.style.position = "absolute";
                                point.circle.style.height = "8px";
                                point.circle.style.width = "8px";
                                point.group = document.createElement("v:group");
                                point.group.style.position = "absolute";
                                point.group.style.width = "200px";
                                point.group.style.height = "20px";
                                point.group.coordsize = "200,20";
                                point.rect = document.createElement("v:roundrect");
                                point.rect.style.position = "absolute";
                                point.rect.style.top = "2";
                                point.rect.style.width = "80";
                                point.rect.style.height = "16";
                                point.rect.fillcolor = "white";
                                point.rect.strokecolor = "#bb44bb";
                                point.rect.strokeweight = "2px";
                                point.rect.arcsize = "1";
                                point.group.appendChild(point.rect);
                                point.text = document.createElement("v:line");
                                point.text.stroked = "f";
                                point.text_path = document.createElement("v:path");
                                point.text_path.textpathok = "t";
                                point.text.appendChild(point.text_path);
                                point.tpath = document.createElement("v:textpath");
                                point.tpath.string = "hello";
                                point.tpath.on = "t";
                                point.tpath.style.font = "12px Arial";
                                point.text.appendChild(point.tpath);
                            }
                            vml.appendChild(point.circle);
                            var px = Math.round((this.data.plan.points[i].px - ext.minx) * 10) / 10;
                            var py = Math.round((this.data.plan.points[i].py - ext.miny) * 10) / 10;
                            point.circle.style.left = (px - 4) + "px";
                            point.circle.style.top = (py - 4) + "px";
                            if (i > 0 && i < this.data.plan.points.length - 1) {
                                this.pointDragIE(i);
                            }
                            if (this.data.plan.points[i + 1]) {
                                var x1 = this.data.plan.points[i].pline[0][0][0];
                                var y1 = this.data.plan.points[i].pline[0][0][1];
                                var x2 = this.data.plan.points[i].pline[0][1][0];
                                var y2 = this.data.plan.points[i].pline[0][1][1];
                                var x3 = this.data.plan.points[i + 1].px;
                                var y3 = this.data.plan.points[i + 1].py;
                                var pdist = Math.sqrt(((x1 - x3) * (x1 - x3)) + ((y1 - y3) * (y1 - y3)));
                                if (pdist > 100) {
                                    vml.appendChild(point.group);
                                    var rot = 0;
                                    var xt = 0;
                                    var thyp = Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
                                    var tw = (x2 - x1) * (100 / thyp);
                                    var th = (y2 - y1) * (100 / thyp);
                                    var tp = {to: {x: 0,y: 0},from: {x: 0,y: 0}};
                                    if (x1 < x2) {
                                        rot = Math.atan((y2 - y1) / (x2 - x1)) * this.data.proj.rad2deg;
                                        tp.from.x = x1;
                                        tp.from.y = y1;
                                        tp.to.x = x1 + tw;
                                        tp.to.y = y1 + th;
                                    } else if (x1 == x2) {
                                        rot = 90;
                                        if (y1 > y2) {
                                            xt = -100;
                                        }
                                    } else {
                                        rot = Math.atan((y1 - y2) / (x1 - x2)) * this.data.proj.rad2deg;
                                        xt = -100;
                                        tp.from.x = x1 + tw;
                                        tp.from.y = y1 + th;
                                        tp.to.x = x1;
                                        tp.to.y = y1;
                                    }
                                    tp.from.x -= ext.minx;
                                    tp.from.y -= ext.miny;
                                    tp.to.x -= ext.minx;
                                    tp.to.y -= ext.miny;
                                    point.text.from = tp.from.x + " " + tp.from.y;
                                    point.text.to = tp.to.x + " " + tp.to.y;
                                    point.group.style.top = (py - 10) + "px";
                                    point.group.style.left = (px - 100) + "px";
                                    point.group.style.rotation = rot;
                                    point.rect.style.left = (110 + xt);
                                    point.tpath.string = this.df(this.data.plan.points[i].mh) + " " + Math.round(this.data.plan.points[i].dst) + "nm";
                                    var fill = document.createElement("v:fill");
                                    fill.on = "True";
                                    fill.color = "black";
                                    point.text.appendChild(fill);
                                    vml.appendChild(point.text);
                                }
                            }
                        }
                    }
                } else {
                    if (!this.data.div.plan) {
                        this.data.div.plan = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        this.data.div.plan.id = "sv_plan";
                        this.data.div.slider.insertBefore(this.data.div.plan, this.data.div.slider.firstChild);
                    }
                    var svg = this.data.div.plan;
                    while (svg.firstChild) {
                        svg.removeChild(svg.firstChild);
                    }
                    svg.style.width = ext.maxx - ext.minx + "px";
                    svg.style.height = ext.maxy - ext.miny + "px";
                    svg.style.top = ext.miny - this.data.slideroffsety + "px";
                    svg.style.left = ext.minx - this.data.slideroffsetx + "px";
                    for (var i = 0; i < this.data.plan.points.length - 1; i++) {
                        for (var pi = 0; pi < this.data.plan.points[i].pline.length; pi++) {
                            if (!this.data.div.planlines[i]) {
                                this.data.div.planlines[i] = [];
                            }
                            if (!this.data.div.planlines[i][pi]) {
                                this.data.div.planlines[i][pi] = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                            }
                            var line = this.data.div.planlines[i][pi];
                            svg.appendChild(line);
                            line.setAttribute("stroke-width", "6px");
                            line.setAttribute("stroke", "#ff00ff");
                            line.setAttribute("opacity", "0.5");
                            line.setAttribute("fill", "none");
                            var p = "";
                            for (var j = 0; j < this.data.plan.points[i].pline[pi].length; j++) {
                                var k = this.data.plan.points[i].pline[pi][j];
                                p += (k[0] - ext.minx).toFixed(1) + "," + (k[1] - ext.miny).toFixed(1) + " ";
                            }
                            line.setAttribute("points", p);
                            this.lineDrag(line, i);
                        }
                    }
                    for (var i = 0; i < this.data.plan.points.length; i++) {
                        if (!this.data.div.planpoints[i]) {
                            this.data.div.planpoints[i] = new Object;
                            var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                            c.setAttribute("r", "4");
                            c.setAttribute("stroke", "#bb44bb");
                            c.setAttribute("stroke-width", "2");
                            c.setAttribute("fill", "white");
                            this.data.div.planpoints[i].circle = c;
                            var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                            var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                            g.appendChild(rect);
                            g.appendChild(text);
                            rect.setAttribute("rx", "8");
                            rect.setAttribute("ry", "8");
                            rect.setAttribute("y", "-8");
                            rect.setAttribute("x", "10");
                            rect.setAttribute("fill", "white");
                            rect.setAttribute("height", "16");
                            rect.setAttribute("width", "80");
                            rect.setAttribute("stroke", "#bb44bb");
                            rect.setAttribute("stroke-width", "2");
                            text.setAttribute("x", "15");
                            text.setAttribute("y", "4");
                            text.setAttribute("font-size", "12px");
                            text.setAttribute("width", "80");
                            this.data.div.planpoints[i].group = g;
                            this.data.div.planpoints[i].text = text;
                            this.data.div.planpoints[i].rect = rect;
                        }
                        var point = this.data.div.planpoints[i];
                        svg.appendChild(point.circle);
                        point.circle.setAttribute("cx", this.data.plan.points[i].px - ext.minx);
                        point.circle.setAttribute("cy", this.data.plan.points[i].py - ext.miny);
                        if (i > 0 && i < this.data.plan.points.length - 1) {
                            this.pointDrag(i);
                        }
                        if (this.data.plan.points[i + 1]) {
                            var x1 = this.data.plan.points[i].pline[0][0][0];
                            var y1 = this.data.plan.points[i].pline[0][0][1];
                            var x2 = this.data.plan.points[i].pline[0][1][0];
                            var y2 = this.data.plan.points[i].pline[0][1][1];
                            var x3 = this.data.plan.points[i + 1].px;
                            var y3 = this.data.plan.points[i + 1].py;
                            var pdist = Math.sqrt(((x1 - x3) * (x1 - x3)) + ((y1 - y3) * (y1 - y3)));
                            if (pdist > 100) {
                                svg.appendChild(point.group);
                                var rot = 0;
                                var xt = 0;
                                if (x1 < x2) {
                                    rot = Math.atan((y2 - y1) / (x2 - x1)) * this.data.proj.rad2deg;
                                } else if (x1 == x2) {
                                    rot = 90;
                                    if (y1 > y2) {
                                        xt = -100;
                                    }
                                } else {
                                    rot = Math.atan((y1 - y2) / (x1 - x2)) * this.data.proj.rad2deg;
                                    xt = -100;
                                }
                                point.rect.setAttribute("x", 10 + xt);
                                point.text.setAttribute("x", 15 + xt);
                                point.group.setAttribute("transform", "translate(" + (this.data.plan.points[i].px - ext.minx) + " " + (this.data.plan.points[i].py - ext.miny) + ") rotate(" + rot + ")");
                                point.text.textContent = this.df(this.data.plan.points[i].mh) + " " + Math.round(this.data.plan.points[i].dst) + "nm";
                            }
                        }
                    }
                }
                if (this.data.div.plan)
                    this.data.div.plan.style.visibility = "visible";
                //labels
                if (this.data.settings.labels) {
                    for (var i = 0; i < this.data.plan.points.length; i++) {
                        var gid = "planpt-" + i;
                        var ppt = this.data.plan.points[i];
                        if (this.draw.labelcache && this.draw.labelcache[gid]) {
                            obj = this.draw.labelcache[gid];
                            this.label(gid, ppt.lat, ppt.lon, ppt.id, 'routel', false, 1, obj);
                        } else {
                            this.draw.labelcache[gid] = this.label(gid, ppt.lat, ppt.lon, ppt.id, 'routel', false, 1);
                        }
                    }
                }
            } else {
                if (this.data.div.plan)
                    this.data.div.plan.style.visibility = "hidden";
            }
        } else {
            if (this.data.div.plan)
                this.data.div.plan.style.visibility = "hidden";
        }
    },
    hideLink: function() {
        if (this.data.div.link && this.data.div.link.div.style.visibility == 'visible') {
            this.data.div.link.div.style.visibility = 'hidden';
        }
    },
    hidePrint: function() {
        if (this.data.div.print && this.data.div.print.div.style.visibility == 'visible') {
            this.data.div.print.div.style.visibility = 'hidden';
        }
    },
    hidesrLink: function() {
        if (this.data.div.srLink && this.data.div.srLink.div.style.visibility == 'visible') {
            this.data.div.srLink.div.style.visibility = 'hidden';
        }
        if (this.data.div.searchResults) {
            this.data.div.searchResults.div.style.visibility = 'hidden';
        }
    },
    srLink: function(data) {
        var l;
        var sv = this;
        if (this.data.div.srLink) {
            l = this.data.div.srLink;
        } else {
            this.data.div.srLink = new Object;
            l = this.data.div.srLink;
            l.div = this.ce("div");
            l.div.id = "sv_srLink";
            l.div.className = "sv";
            l.div.onmouseover = function() {
                sv.data.nowheel = true;
            }
            l.div.onmouseout = function() {
                sv.data.nowheel = false;
            }
            l.div.onmousewheel = function(e) {
                if (!e)
                    e = window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = "true";
                }
            }
            l.bg = this.ce("div");
            l.bg.id = "sv_srLinkbg";
            l.bg.className = "xlucent80";
            l.div.appendChild(l.bg);
            l.a = this.ce("a");
            l.t1 = document.createTextNode('');
            l.t2 = document.createTextNode('');
            l.a.appendChild(l.t2);
            l.i = this.ce("img");
            l.div.appendChild(l.i);
            this.data.div.chart.appendChild(l.div);
        }
        l.div.style.visibility = 'visible';
        try {
            l.div.removeChild(l.a);
        } catch (e) {
        }
        ;
        try {
            l.div.removeChild(l.t1);
        } catch (e) {
        }
        ;
        l.i.src = this.data.images + "/" + data.type + ".png";
        if (data.r_url) {
            l.a.href = data.r_url;
            l.t2.data = data.r_name;
            l.div.appendChild(l.a);
        } else {
            l.t1.data = data.r_name;
            l.div.appendChild(l.t1);
        }
    },
    
    showPrint: function() {
        var d;
        var sv = this;
        if (this.data.div.print) {
            d = this.data.div.print;
        } else {
            this.data.div.print = new Object;
            d = this.data.div.print;
            d.div = this.ce("div");
            d.div.id = "sv_print";
            d.div.className = "sv";
            d.div.onmouseover = function() {
                sv.data.nowheel = true;
            }
            d.div.onmouseout = function() {
                sv.data.nowheel = false;
            }
            d.div.onmousewheel = function(e) {
                if (!e)
                    e = window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = "true";
                }
            }
            d.bg = this.ce("div");
            d.bg.id = "sv_printbg";
            d.bg.className = "xlucent80";
            d.div.appendChild(d.bg);
            var ci = this.ce("img");
            ci.className = "sv_panelx";
            ci.src = this.data.images + "/planclose.png";
            ci.onclick = function() {
                //sv.data.div.print.div.style.visibility='hidden';
                sv.hidePrint();
            }
            d.div.appendChild(ci);
            var h = this.ce("h1");
            h.className = "sv sv_panel";
            h.appendChild(document.createTextNode("Print Chart as PDF"));
            d.div.appendChild(h);
            d.div.appendChild(document.createTextNode("This will create a PDF of the current chart in the chart's original scale."));
            d.f1 = this.ce("form");
            d.f1.onsubmit = function() {
                return false;
            };
            var t = this.ce("table");
            t.className = "sv sv_print";
            t.id = "sv_printtable";
            var tbody = this.ce("tbody");
            var tr1 = this.ce("tr");
            var th1 = this.ce("th");
            tr1.appendChild(th1);
            var l1 = this.ce("label");
            l1.appendChild(document.createTextNode("Paper Size"));
            l1.setAttribute("for", "p");
            th1.appendChild(l1);
            var td1 = this.ce("td");
            tr1.appendChild(td1);
            var i1 = this.ce("select");
            i1.style.width = "165px";
            i1.name = "p";
            var pgs = {'A4': 'A4 210mm x 297mm','A3': 'A3 297mm x 420mm','Letter': 'Letter 8.5" x 11"','Legal': 'Legal 8.5" x 14"','Tabloid': 'Tabloid 11" x 17"'};
            for (var p in pgs) {
                var o = this.ce("option");
                i1.options.add(o);
                o.value = p;
                o.appendChild(document.createTextNode(pgs[p]));
                if (p == 'Letter')
                    o.selected = true;
            }
            td1.appendChild(i1);
            var i2 = this.ce("input");
            i2.type = "hidden";
            i2.name = "l";
            i2.value = "1";
            td1.appendChild(i2);
            var tr2 = this.ce("tr");
            var th2 = this.ce("th");
            th2.appendChild(document.createTextNode('Orientation'));
            tr2.appendChild(th2);
            var td2 = this.ce("td");
            var pl = this.ce("img");
            pl.style.position = 'absolute';
            pl.src = this.data.images + "/printpl" + this.data.png;
            d.pl = this.ce("img");
            d.pl.style.height = "90px";
            d.pl.style.width = "165px";
            var m = this.ce("map");
            m.id = "sv_printplmap";
            m.setAttribute("name", "sv_printplmap");
            var a1 = this.ce("area");
            a1.shape = "rect";
            a1.coords = "0,0,73,90";
            a1.href = "clickto:Select";
            a1.onclick = function() {
                d.pl.src = sv.data.images + "/printpl_p.gif";
                i2.value = "0";
                return false;
            };
            m.appendChild(a1);
            var a2 = this.ce("area");
            a2.shape = "rect";
            a2.coords = "74,0,165,90";
            a2.href = "clickto:Select";
            a2.onclick = function() {
                d.pl.src = sv.data.images + "/printpl_l.gif";
                i2.value = "1";
                return false;
            };
            m.appendChild(a2);
            pl.style.border = "none";
            pl.useMap = "#sv_printplmap";
            d.pl.src = this.data.images + "/printpl_l.gif";
            td2.appendChild(pl);
            td2.appendChild(m);
            td2.appendChild(d.pl);
            tr2.appendChild(td2);
            var tr3 = this.ce("tr");
            tr3.appendChild(this.ce("td"));
            var td3 = this.ce("td");
            var i3 = this.ce("input");
            i3.type = "button";
            i3.style.width = "80px";
            i3.value = "Cancel";
            i3.textContent = "Cancel";
            i3.onclick = function() {
                sv.hidePrint();
            }
            td3.appendChild(i3);
            var i4 = this.ce("input");
            i4.type = "button";
            i4.style.width = "80px";
            i4.value = "Print";
            i4.textContent = "Print";
            i4.onclick = function() {
                //window.location="/perl/print" + sv.mkQS({x:Math.round(sv.data.p.x*sv.data.scalors[sv.data.scale]),y:Math.round(sv.data.p.y*sv.data.scalors[sv.data.scale]),p:sv.data.protoid,e:sv.data.edition,l:i2.value,s:i1.options[i1.selectedIndex].value,r:sv.data.proj.data.yr});
                var w = window.open("/perl/print" + sv.mkQS({x: Math.round(sv.data.p.x * sv.data.scalorFn(sv.data.scale, sv.data.overzoom)),y: Math.round(sv.data.p.y * sv.data.scalorFn(sv.data.scale, sv.data.overzoom)),p: sv.data.protoid,e: sv.data.edition,l: i2.value,s: i1.options[i1.selectedIndex].value,r: sv.data.proj.data.yr}), "_blank");
                if (!w) {
                    window.location = "/perl/print" + sv.mkQS({x: Math.round(sv.data.p.x * sv.data.scalorFn(sv.data.scale, sv.data.overzoom)),y: Math.round(sv.data.p.y * sv.data.scalorFn(sv.data.scale, sv.data.overzoom)),p: sv.data.protoid,e: sv.data.edition,l: i2.value,s: i1.options[i1.selectedIndex].value,r: sv.data.proj.data.yr});
                }
            }
            td3.appendChild(i4);
            td3.appendChild(this.ce("br"));
            td3.appendChild(document.createTextNode("NOT FOR NAVIGATION"));
            tr3.appendChild(td3);
            tbody.appendChild(tr1);
            tbody.appendChild(tr2);
            tbody.appendChild(tr3);
            t.appendChild(tbody);
            
            d.f1.appendChild(t);
            d.div.appendChild(d.f1);
            var s = this.ce("div");
            s.style.width = "300px";
            s.style.fontSize = "10px";
            s.appendChild(document.createTextNode("* For best results when printing, disable scaling. If the colors look bad, try an advanced setting called \"Let printer determine colors.\""));
            s.appendChild(this.ce("br"));
            s.appendChild(document.createTextNode("** Flight plan printing coming soon."));
            d.div.appendChild(s);
            this.data.div.chart.appendChild(d.div);
            var h = d.div.clientHeight;
            d.bg.style.height = h + "px";
        
        }
        d.div.style.visibility = 'visible';
    },
    showPrint_ADC: function() {
        var sv = SkyVector;
        var qString = sv.data.queryString
        qString += sv.mkQS({p: sv.data.protoid,z: sv.data.scale})
        qString = qString.replace("?", "&").replace("?", "&");
        if (sv.data.rasterLayers && (sv.data.rasterLayers.length > 0)) {
            qString += "&layers_raster=" + sv.data.rasterLayers.join(",");
        }
        qString += "&labels=" + sv.data.settings.labels;
        if (document.getElementById("identifier")) {
            qString += "&identifier=" + document.getElementById("identifier").value;
        }
        var printURL = sv.data.perldir + "/print" + sv.mkQS({url: document.location + qString});
        var w = window.open(printURL, "_blank");
        if (!w) {
            window.location = printURL;
        }
    },
    showLink: function() {
        var l;
        var sv = this;
        sv.hideDialogs();
        if (this.data.div.link) {
            l = this.data.div.link;
        } else {
            this.data.div.link = new Object;
            l = this.data.div.link;
            l.div = this.ce("div");
            l.div.id = "sv_link";
            l.div.className = "sv";
            l.div.onmouseover = function() {
                sv.data.nowheel = true;
            }
            l.div.onmouseout = function() {
                sv.data.nowheel = false;
            }
            l.div.onmousewheel = function(e) {
                if (!e)
                    e = window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = "true";
                }
            }
            l.bg = this.ce("div");
            l.bg.id = "sv_linkbg";
            l.bg.className = "xlucent80";
            l.div.appendChild(l.bg);
            var ci = this.ce("img");
            ci.className = "sv_panelx";
            ci.src = this.data.images + "/planclose.png";
            ci.onclick = function() {
                sv.data.div.link.div.style.visibility = 'hidden';
            }
            l.div.appendChild(ci);
            var f = this.ce("form");
            f.onsubmit = function() {
                return false;
            }
            var h = this.ce("h1");
            h.className = "sv sv_panel";
            h.appendChild(document.createTextNode("Plain Text Link"));
            f.appendChild(h);
            f.appendChild(document.createTextNode("Paste link in Email, Instant Messenger, or anywhere."));
            l.ilink = this.ce("input");
            l.ilink.style.width = "376px";
            l.ilink.style.marginBottom = "10px";
            l.ilink.onclick = function() {
                this.select();
            }
            f.appendChild(l.ilink);
            var h2 = this.ce("h1");
            h2.className = "sv sv_panel";
            h2.appendChild(document.createTextNode("Image Link with Chart Snippet"));
            f.appendChild(h2);
            f.appendChild(document.createTextNode("Paste HTML source code into web page."));
            l.iembed = this.ce("input");
            l.iembed.style.width = "376px";
            l.iembed.onclick = function() {
                this.select();
            }
            f.appendChild(l.iembed);
            l.div.appendChild(f);
            this.data.div.chart.appendChild(l.div);
        }
        l.div.style.visibility = 'visible';
        l.ilink.value = this.genlink();
        l.ilink.select();
        l.iembed.value = this.genembed();
    },
    hideDialogs: function() {
        if (this.data.div.settings && this.data.div.settings.div.style.visibility == 'visible') {
            this.data.div.settings.div.style.visibility = 'hidden';
        }
        if (this.data.div.link && this.data.div.link.div.style.visibility == 'visible') {
            this.data.div.link.div.style.visibility = 'hidden';
        }
        if (this.data.div.print && this.data.div.print.div.style.visibility == 'visible') {
            this.data.div.print.div.style.visibility = 'hidden';
        }
        if (this.data.div.infoBox && this.data.div.infoBox.div.style.visibility == 'visible') {
            this.data.div.infoBox.div.style.visibility = 'hidden';
        }
    },
    showLegend: function(layername) {
        var l;
        var sv = this;
        if (this.data.div.legend) {
            l = this.data.div.legend;
            l.div.style.visibility = 'visible';
        } else {
            this.data.div.legend = new Object;
            l = this.data.div.legend;
            l.div = this.ce("div");
            l.div.onmouseover = function() {
                sv.data.nowheel = true;
            }
            l.div.onmouseout = function() {
                sv.data.nowheel = false;
            }
            l.div.onmousewheel = function(e) {
                if (!e)
                    e = window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = "true";
                }
            }
            l.div.id = "sv_legend";
            l.nexrad = this.ce("img");
            l.nexrad.src = this.data.images + "/mrmslegend.png";
            l.nexrad.style.width = "156px";
            l.nexrad.style.height = "23px";
            l.nexrad.className = "sv_legendimg xlucent80f hideSmall";
            l.nexrad.style.backgroundColor = 'white';
            l.div.appendChild(l.nexrad);

            l.sat = this.ce("div","sv_legendimg xlucent80f hideSmall");
            l.satlink = this.ce("a");
            l.satlink.href="https://wxsolutions.bcisse.com/flightwx/";
            l.satlink.target="_blank";
            l.satimg = this.ce("img");
            l.satimg.src = this.data.images + "/satlegend.png";
            l.satimg.style.width = "160px";
            l.satimg.style.height = "30px";
            l.satimg.setAttribute("title","Satellite Layer powered by BCI");
            l.satlink.appendChild(l.satimg);
            l.sat.appendChild(l.satlink); 
            l.div.appendChild(l.sat);

            l.ct = this.ce("div","sv_legendimg xlucent80f hideSmall");
            l.ctlink = this.ce("a");
            l.ctlink.href="https://wxsolutions.bcisse.com/flightwx/";
            l.ctlink.target="_blank";
            l.ctimg = this.ce("img");
            l.ctimg.src = this.data.images + "/cloudtop.png";
            l.ctimg.style.width = "160px";
            l.ctimg.style.height = "30px";
            l.ctimg.setAttribute("title","Cloud Top Height powered by BCI");
            l.ctlink.appendChild(l.ctimg);
            l.ct.appendChild(l.ctlink);
            l.div.appendChild(l.ct);

            this.data.div.chart.appendChild(l.div);
        }
        if (layername == 'nexrad') {
            l.nexrad.style.display = "block";
            l.sat.style.display = "none";
            l.ct.style.display = "none";
        }
        if (layername == 'sat') {
            l.sat.style.display = "block";
            l.nexrad.style.display = "none";
            l.ct.style.display = "none";
        }
        if (layername == 'cloudtop') {
            l.ct.style.display = "block";
            l.nexrad.style.display = "none";
            l.sat.style.display = "none";
        }
    },
    hideLegend: function(layername) {
        if (this.data.div.legend) {
            var l = this.data.div.legend;
            if (layername == 'all') {
                l.nexrad.style.display = "none";
                l.sat.style.display = "none";
                l.ct.style.display = "none";
            }
        }
    },
    showSettings: function(tab, firstrun) {
        var s;
        var sv = this;
        sv.hideDialogs();
        if (this.data.div.settings && !firstrun) {
            s = this.data.div.settings;
            this.updateWindLabel();
            s.div.style.visibility = 'visible';
            try {
                ga_event('send', 'event', 'Map', 'Layers');
            } catch (e) {
            }
            ;
        } else {
            this.data.div.settings = new Object;
            s = this.data.div.settings;
            s.div = this.ce("div");
            if (firstrun) {
                s.div.style.visibility = 'hidden';
            }
            this.data.div.chart.appendChild(s.div);
            s.div.onmouseover = function() {
                sv.data.nowheel = true;
            }
            s.div.onmouseout = function() {
                sv.data.nowheel = false;
            }
            s.div.onmousewheel = function(e) {
                if (!e)
                    e = window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = "true";
                }
            }
            s.div.id = "sv_settings";
            s.bg = this.ce("div");
            s.bg.id = "sv_settingsbg";
            s.bg.className = "xlucent80";
            s.div.appendChild(s.bg);
            var ci = this.ce("img");
            ci.className = "sv_panelx";
            ci.src = this.data.images + "/planclose.png";
            ci.onclick = function() {
                sv.data.div.settings.div.style.visibility = 'hidden';
            }
            s.div.appendChild(ci);
            
            var ultab = this.ce("ul");
            ultab.id = "sv_settingstabs";
            s.t1 = this.ce("li");
            s.t1.className = "on";
            s.t1.innerHTML = 'Weather';
            ultab.appendChild(s.t1);
            s.t1a = this.ce("li");
            s.t1a.innerHTML = 'Nav';
            ultab.appendChild(s.t1a);
            s.t2 = this.ce("li");
            s.t2.innerHTML = 'FBOs';
            s.t2.style.display = "none"
            ultab.appendChild(s.t2);
            s.div.appendChild(ultab);
            s.page = this.ce("div");
            s.page.id = "sv_settingspage";
            s.div.appendChild(s.page);
            s.p1 = this.ce("div");
            s.p1.className = "sv_settingspage";
            s.page.appendChild(s.p1);
            s.p1a = this.ce("div");
            s.p1a.className = "sv_settingspage";
            s.page.appendChild(s.p1a);
            s.p2 = this.ce("div");
            s.p2.className = "sv_settingspage";
            s.page.appendChild(s.p2);
            s.p2.style.zIndex = 1;
            s.p1.style.zIndex = 2;
            s.t1.onclick = function() {
                s.t1.className = "on";
                s.t1a.className = "";
                s.t2.className = "";
                s.p1.style.zIndex = 2;
                s.p1a.style.zIndex = 1;
                s.p2.style.zIndex = 1;
            }
            s.t1a.onclick = function() {
                s.t1a.className = "on";
                s.t1.className = "";
                s.t2.className = "";
                s.p1a.style.zIndex = 2;
                s.p1.style.zIndex = 1;
                s.p2.style.zIndex = 1;
            }
            s.t2.onclick = function() {
                s.t2.className = "on";
                s.t1.className = "";
                s.t1a.className = "";
                s.p2.style.zIndex = 2;
                s.p1.style.zIndex = 1;
                s.p1a.style.zIndex = 1;
            }
            var layers = {};
            s.enabled = {};
            s.params = {};
            for (var i = 0; i < this.data.settings.layers_vector.length; i++) {
                layers[this.data.settings.layers_vector[i]] = 'V';
            }
            for (var i = 0; i < this.data.settings.layers_raster.length; i++) {
                layers[this.data.settings.layers_raster[i]] = 'R';
            }
            for (var i = 0; i < this.data.settings.layers_on.length; i++) {
                s.enabled[this.data.settings.layers_on[i]] = true;
            }
            //METAR         
            var icon = this.makeIcon();
            var img = this.ce("img");
            img.src = this.data.images + "/metaficon.png";
            //img.style.marginTop = "-6px";
            img.style.position = "absolute";
            img.style.width = "24px";
            img.style.height = "12px";
            icon.appendChild(img);
            var setMetar = this.makeSetting("metar", "Text Weather (METAR/TAF)", icon);
            s.p1.appendChild(setMetar);
            setMetar.setCheck();
            //TFR
            var setTfr = this.makeSetting("tfr", "Temporary Flight Restrictions", this.makeIcon("#FF0000", "#FFE6E6"));
            s.p1.appendChild(setTfr);
            setTfr.setCheck();
            //DROTAMS
            var setDrotam = this.makeSettingEx("drotam","DROTAMs™", "drotam", this.makeIcon("#6000FF","#e7d9ff"));
            setDrotam.className = "sv_settingsinline";
            s.p1.appendChild(setDrotam);
            setDrotam.setCheck();
            var setDrotam200 = this.makeSettingEx("drotam200","> 200AGL", "drotam");
            setDrotam200.className = "sv_settingsinline";
            s.p1.appendChild(setDrotam200);
            setDrotam200.setCheck();
            s.p1.appendChild(this.clearBoth());
            //PIREP
            var picon = this.makeIcon();
            var pimg = this.ce("img");
            pimg.src = this.data.images + "/pirepicon.png";
            //img.style.marginTop = "-6px";
            pimg.style.position = "absolute";
            pimg.style.width = "24px";
            pimg.style.height = "12px";
            picon.appendChild(pimg);
            var setPirep = this.makeSetting("pirep","Pilot Reports", picon);
            s.p1.appendChild(setPirep);
            setPirep.setCheck();

            //SIGMET
            var sigmetbox = this.ce("div");
            sigmetbox.className = "sv_settingsbox";
            var sigmetlabel = this.ce("div");
            sigmetlabel.className = "sv_settingsboxlabel";
            sigmetlabel.appendChild(document.createTextNode("Sigmets"));
            sigmetbox.appendChild(sigmetlabel);
            s.p1.appendChild(sigmetbox);
            
            var setSigmet = this.makeSetting("sm-cv,sm-int,sm-unk", "Sigmets", this.makeIcon("#0080FF", "#E6F2FF"));
            setSigmet.className = "sv_settingsinline";
            sigmetbox.appendChild(setSigmet);
            setSigmet.setCheck();
            
            var setOutlook = this.makeSetting("sm-co", "Outlooks", this.makeIcon("#FFA000", "#FFF5E6"));
            setOutlook.className = "sv_settingsinline";
            sigmetbox.appendChild(setOutlook);
            setOutlook.setCheck();
            sigmetbox.appendChild(this.clearBoth());

            //AIRMET
            var airmetbox = this.ce("div");
            airmetbox.className = "sv_settingsbox";
            var airmetlabel = this.ce("div");
            airmetlabel.className = "sv_settingsboxlabel";
            airmetlabel.appendChild(document.createTextNode("Airmets"));
            airmetbox.appendChild(airmetlabel);
            s.p1.appendChild(airmetbox);
            
            var am1 = this.makeSetting("am-z", "Icing", this.makeIcon("#00ffff", "#e6FFFF"));
            am1.className = "sv_settingsinline";
            airmetbox.appendChild(am1);
            am1.setCheck();
            
            var am2 = this.makeSetting("am-tt", "Turbulence", this.makeIcon("#008000", "#e6f2e6"));
            am2.className = "sv_settingsinline";
            airmetbox.appendChild(am2);
            am2.setCheck();

            //airmetbox.appendChild(this.ce("br"));
            
            var am3 = this.makeSetting("am-si", "Instrument Flight Rules", this.makeIcon("#500090", "#ede5f3"));
            am3.className = "sv_settingsinline";
            airmetbox.appendChild(am3);
            am3.setCheck();
            
            var am4 = this.makeSetting("am-sm", "Mountain Obscuration", this.makeIcon("#a000a0", "#f5e5f5"));
            am4.className = "sv_settingsinline";
            airmetbox.appendChild(am4);
            am4.setCheck();
            
            airmetbox.appendChild(this.clearBoth());


            var radarbox = this.ce("div");
            radarbox.className = "sv_settingsbox";
            var radarlabel = this.ce("div");
            radarlabel.className = "sv_settingsboxlabel";
            radarlabel.appendChild(document.createTextNode("Radar, Satellite, and Clouds"));
            radarbox.appendChild(radarlabel);
            s.p1.appendChild(radarbox);
            var radarIcon = this.makeIcon();
            var radarImg = this.ce("img");
            radarImg.src = this.data.images + "/mrmsicon.png";
            radarImg.style.width = "24px";
            radarImg.style.height = "12px";
            radarIcon.appendChild(radarImg);
            var setRadar = this.makeSettingEx("nexrad", "MRMS Weather Radar", "radsat", radarIcon);
            radarbox.appendChild(setRadar);
            //radarbox.appendChild(this.ct("Radar Temporarily Offline"));
            setRadar.setCheck();
            var satIcon = this.makeIcon();
            var satImg = this.ce("img");
            satImg.src = this.data.images + "/saticon.png";
            satImg.style.width = "24px";
            satImg.style.height = "12px";
            satIcon.appendChild(satImg);
            var setSat = this.makeSettingEx("sat", "Satellite IR4", "radsat", satIcon);
            radarbox.appendChild(setSat);
            setSat.setCheck();
            var ctIcon = this.makeIcon();
            var ctImg = this.ce("img");
            ctImg.src = this.data.images + "/cloudtopicon.png";
            ctImg.style.width = "24px";
            ctImg.style.height = "12px";
            ctIcon.appendChild(ctImg);
            var ctSet = this.makeSettingEx("cloudtop","Cloud Top Height","radsat", ctIcon);
            radarbox.appendChild(ctSet);
            ctSet.setCheck();
            s.ctSetFilter = this.makeSetting("cloudtopfilter","Hide below altitude FL 300");
            s.ctSetFilter.style.marginLeft = "20px";
            radarbox.appendChild(s.ctSetFilter);
            s.ctSetFilter.setCheck();

            //Winds 
            var windbox = this.ce("div");
            windbox.className = "sv_settingsbox";
            var windlabel = this.ce("div");
            windlabel.className = "sv_settingsboxlabel";
            windlabel.appendChild(document.createTextNode("Winds Aloft"));
            windbox.appendChild(windlabel);
            var windGear = this.ce("img");
            windGear.className = "sv_windSettingsGear";
            windGear.src = this.data.images + "/windgearicon.png";
            windbox.appendChild(windGear);
            var windPopUpOn = false;
            var windPopUp = this.ce("div");
            windPopUp.className = "sv_windPopUp";
            windbox.appendChild(windPopUp);
            var windmb = this.ce("div");
            windmb.className = "sv_windpopupvalue";
            windmb.style.top = "12px";
            windmb.style.left = "0px";
            windPopUp.appendChild(windmb);
            var windalt = this.ce("div");
            windalt.className = "sv_windpopupvalue";
            windalt.style.top = "12px";
            windalt.style.left = "153px";
            windPopUp.appendChild(windalt);
            var windzulu = this.ce("div");
            windzulu.className = "sv_windpopupvalue";
            windzulu.style.top = "42px";
            windzulu.style.left = "0px";
            windPopUp.appendChild(windzulu);
            var windoffset = this.ce("div");
            windoffset.className = "sv_windpopupvalue";
            windoffset.style.top = "42px";
            windoffset.style.left = "153px";
            windPopUp.appendChild(windoffset);
            var windslider1 = this.ce("img");
            windslider1.src = this.data.images + "/slider.png";
            windslider1.className = "sv_windSlider";
            windPopUp.appendChild(windslider1);
            var sliderMove1 = function(x, y) {
                var stops = sv.data.windLevels.length - 1;
                var i = Math.round(x * stops);
                var level = sv.data.windLevels[i];
                if (level[0] == 0) {
                    windmb.innerHTML = 'SFC';
                    windalt.innerHTML = 'SFC';
                } else {
                    windmb.innerHTML = level[0] + " mb";
                    windalt.innerHTML = level[1];
                }
                var calt = level[2];
                if (calt < 26000){
                    calt = 26000;
                }
                sv.data.prefs.cloudAltitude = calt;
                sv.data.div.settingsLabels["cloudtopfilter"].nodeValue="Hide below "+calt.toFixed()+"ft";

                return [i / stops, 0];
            }
            var sliderSet1 = function(x, y) {
                var stops = sv.data.windLevels.length - 1;
                var i = Math.round(x * stops);
                var level = sv.data.windLevels[i];
                sv.data.prefs.windMB = level[0];
                sv.updateWindLabel();
                sv.datalayer();
            }
            var slidecontrol1 = sv.sliderControl(windslider1, 45, 10, 100, 0, sliderMove1, sliderSet1, 0, 0);
            
            var windslider2 = this.ce("img");
            windslider2.src = this.data.images + "/slider.png";
            windslider2.className = "sv_windSlider";
            windPopUp.appendChild(windslider2);
            
            var now = new Date()
            var utcms = now.getTime();
            var startms = Math.floor(utcms / 10800000) * 10800000;
            
            var sliderMove2 = function(x, y) {
                var i = Math.round(x * 60);
                var t = new Date(startms + i * 10800000);
                var day = t.getUTCDate().toFixed(0);
                var hour = t.getUTCHours().toFixed(0);
                if (day.length == 1)
                    day = "0" + day;
                if (hour.length == 1)
                    hour = "0" + hour;
                windzulu.innerHTML = day + hour + "z";
                windoffset.innerHTML = "+" + (i * 3).toFixed(0) + " hrs"
                return [i / 60, 0];
            }
            var sliderSet2 = function(x, y) {
                var i = Math.round(x * 60);
                sv.data.prefs.windZulu = Math.round((startms + i * 10800000) / 1000);
                sv.updateWindLabel();
                sv.datalayer();
            }
            
            var slidecontrol2 = sv.sliderControl(windslider2, 45, 40, 100, 0, sliderMove2, sliderSet2, 0, 0);
            
            var keyPress = function(e) {
                if (e.keyIdentifier == 'Up' || e.key == "ArrowUp") {
                    var x = slidecontrol1.getX() + (1 / (sv.data.windLevels.length - 1));
                    slidecontrol1.setX(x);
                    x = slidecontrol1.getX();
                    sliderMove1(x, 0);
                    sliderSet1(x, 0);
                    e.preventDefault();
                } else if (e.keyIdentifier == 'Down' || e.key == "ArrowDown") {
                    var x = slidecontrol1.getX() - (1 / (sv.data.windLevels.length - 1));
                    slidecontrol1.setX(x);
                    x = slidecontrol1.getX();
                    sliderMove1(x, 0);
                    sliderSet1(x, 0);
                    e.preventDefault();
                } else if (e.keyIdentifier == 'Right' || e.key == "ArrowRight") {
                    var x = slidecontrol2.getX() + 1 / 60;
                    slidecontrol2.setX(x);
                    x = slidecontrol2.getX();
                    sliderMove2(x, 0);
                    sliderSet2(x, 0);
                    e.preventDefault();
                } else if (e.keyIdentifier == 'Left' || e.key == "ArrowLeft") {
                    var x = slidecontrol2.getX() - 1 / 60;
                    slidecontrol2.setX(x);
                    x = slidecontrol2.getX();
                    sliderMove2(x, 0);
                    sliderSet2(x, 0);
                    e.preventDefault();
                }
            }
            
            s.p1.appendChild(windbox);
            var windIcon = this.makeIcon();
            var barbImg = this.ce("img");
            barbImg.src = this.data.images + "/barbicon.png";
            barbImg.style.width = "24px";
            barbImg.style.height = "13px";
            windIcon.appendChild(barbImg)
            var windSetting = this.makeSetting("winds", "Show Wind Barbs", windIcon);
            windbox.appendChild(windSetting);
            windSetting.setCheck();
            this.data.div.windLabel = this.ce("div");
            this.data.div.windLabel.className = "sv_windLabel";
            this.data.div.windLabel.innerText = "300mb (FL300) at +0hr";
            windbox.appendChild(this.data.div.windLabel);
            this.updateWindLabel();
            var hideWindPopUp = undefined;
            hideWindPopUp = function(e) {
                var target = e.target;
                if (!target) {
                    target = e.srcElement;
                }
                if (target !== windPopUp && 
                target !== windslider1 && 
                target !== windslider2 && 
                target !== windGear) {
                    if (windPopUpOn) {
                        windPopUpOn = false;
                        windPopUp.style.visibility = 'hidden';
                    }
                    if (document.detachEvent) {
                        document.detachEvent("onclick", hideWindPopUp);
                        document.detachEvent("onkeydown", keyPress);
                    } else {
                        document.removeEventListener("click", hideWindPopUp, true);
                        document.removeEventListener("keydown", keyPress, false);
                    }
                }
                return false;
            }
            windGear.onclick = function() {
                if (windPopUpOn) {
                    hideWindPopUp({target: false});
                } else {
                    var initialX = 0;
                    var stops = sv.data.windLevels.length - 1;
                    for (var i = 0; i < stops; i++) {
                        if (Math.round(sv.data.windLevels[i][0]) == Math.round(sv.data.prefs.windMB)) {
                            initialX = i / stops;
                            break;
                        }
                    }
                    slidecontrol1.setX(initialX);
                    sliderMove1(initialX, 0);
                    
                    var now = new Date()
                    var utcms = now.getTime() - sv.data.timeDelta;
                    startms = Math.floor(utcms / 10800000) * 10800000;
                    initialX = 0;
                    if (sv.data.prefs.windZulu) {
                        if (sv.data.prefs.windZulu < startms / 1000) {
                            sv.data.prefs.windZulu = Math.round(startms / 1000);
                        } else {
                            initialX = (Math.round(sv.data.prefs.windZulu / 10800) * 10800000 - startms) / 648000000;
                        }
                    } else {
                        sv.data.prefs.windZulu = Math.round(startms / 1000)
                    }
                    slidecontrol2.setX(initialX);
                    sliderMove2(initialX, 0);
                    if (document.attachEvent) {
                        document.attachEvent("onclick", hideWindPopUp);
                        document.attachEvent("onkeydown", keyPress);
                    } else {
                        document.addEventListener("click", hideWindPopUp, true);
                        document.addEventListener("keydown", keyPress, false);
                    }
                    windPopUpOn = true;
                    windPopUp.style.visibility = 'visible';
                
                }
                return false;
            }
            
            //var wxWarning = this.ce("div");
            //wxWarning.id = "sv_wxWarning";
            //wxWarning.innerHTML = "<b>Beta Warning:</b> The data products available here may not be complete, current, or correct. Please report any errors to the forums.";
            //s.p1.appendChild(wxWarning);

            //TRACKS
            var trackbox = this.ce("div");
            trackbox.className = "sv_settingsbox";
            var tracklabel = this.ce("div");
            tracklabel.className = "sv_settingsboxlabel";
            tracklabel.appendChild(document.createTextNode("Organized Track Systems"));
            trackbox.appendChild(tracklabel);
            s.p1a.appendChild(trackbox);
            var natlabel = this.ce("div");
            natlabel.className = "sv_settingslabel";
            natlabel.appendChild(document.createTextNode("North Atlantic Tracks"));
            var nateIcon = this.makeIcon("#0099BB");
            nateIcon.style.borderWidth = "4px 0 0 0";
            nateIcon.style.height = "5px";
            nateIcon.style.width = "40px";
            var setNate = this.makeSetting("nate", "East", nateIcon);
            setNate.className = "sv_settingsinline";
            var natwIcon = this.makeIcon("#00AA88");
            natwIcon.style.borderWidth = "4px 0 0 0";
            natwIcon.style.height = "5px";
            natwIcon.style.width = "40px";
            var setNatw = this.makeSetting("natw", "West", natwIcon);
            var patlabel = this.ce("div");
            patlabel.className = "sv_settingslabel";
            patlabel.appendChild(document.createTextNode("Pacific Tracks"));
            var pateIcon = this.makeIcon("#0099BB");
            pateIcon.style.borderWidth = "4px 0 0 0";
            pateIcon.style.height = "5px";
            pateIcon.style.width = "40px";
            var setPate = this.makeSetting("pate", "East", pateIcon);
            setPate.className = "sv_settingsinline";
            var patwIcon = this.makeIcon("#00AA88");
            patwIcon.style.borderWidth = "4px 0 0 0";
            patwIcon.style.height = "5px";
            patwIcon.style.width = "40px";
            var setPatw = this.makeSetting("patw", "West", patwIcon);
            var auslabel = this.ce("div");
            auslabel.className = "sv_settingslabel";
            auslabel.appendChild(document.createTextNode("Australia Flex Tracks"));
            var ausotsaIcon = this.makeIcon();
            ausotsaIcon.style.borderWidth = "3px 0 3px 0";
            ausotsaIcon.style.borderColor = "#0099BB red #00AA88 red";
            ausotsaIcon.style.width = "40px";
            ausotsaIcon.style.height = "2px";
            ausotsaIcon.style.marginBottom = "0px";
            var setAusotsa = this.makeSetting("ausots-a", "Group A - Asia", ausotsaIcon);
            //setAusotsa.className = "sv_settingsinline";
            var ausotsbIcon = this.makeIcon();
            ausotsbIcon.style.borderWidth = "3px 0 3px 0";
            ausotsbIcon.style.borderColor = "#FF6633 red #BB8855 red";
            ausotsbIcon.style.width = "40px";
            ausotsbIcon.style.height = "2px";
            ausotsbIcon.style.marginBottom = "0px";
            var setAusotsb = this.makeSetting("ausots-b", "Group B - Middle East", ausotsbIcon);
            var ausotseIcon = this.makeIcon();
            ausotseIcon.style.borderWidth = "3px 0 3px 0";
            ausotseIcon.style.borderColor = "#FF9900 red #779900 red";
            ausotseIcon.style.width = "40px";
            ausotseIcon.style.height = "2px";
            ausotseIcon.style.marginBottom = "0px";
            var setAusotse = this.makeSetting("ausots-e", "Group E - Domestic", ausotseIcon);
            trackbox.appendChild(natlabel);
            trackbox.appendChild(setNate);
            trackbox.appendChild(setNatw);
            trackbox.appendChild(patlabel);
            trackbox.appendChild(setPate);
            trackbox.appendChild(setPatw);
            trackbox.appendChild(auslabel);
            trackbox.appendChild(setAusotsa);
            trackbox.appendChild(setAusotsb);
            trackbox.appendChild(setAusotse);
            setNate.setCheck();
            setNatw.setCheck();
            setPate.setCheck();
            setPatw.setCheck();
            setAusotsa.setCheck();
            setAusotsb.setCheck();
            setAusotse.setCheck();

            //FBO Finder
            var fuelbox = this.ce("div");
            fuelbox.className = "sv_settingsbox";
            var fuellabel = this.ce("div");
            fuellabel.className = "sv_settingsboxlabel";
            fuellabel.appendChild(document.createTextNode("Show Fuel Prices"));
            fuelbox.appendChild(fuellabel);
            s.p2.appendChild(fuelbox);
            var setJeta = this.makeSettingEx("jeta", "Jet A", "fuel");
            var setAvgas = this.makeSettingEx("avgas", "100LL", "fuel");
            var setMogas = this.makeSettingEx("mogas", "Mogas", "fuel");
            var setSaf = this.makeSettingEx("saf", "SAF", "fuel");
            setJeta.className = "sv_settingsinline";
            setAvgas.className = "sv_settingsinline";
            setMogas.className = "sv_settingsinline";
            setSaf.className = "sv_settingsinline";
            fuelbox.appendChild(setJeta);
            fuelbox.appendChild(setSaf);
            fuelbox.appendChild(setAvgas);
            fuelbox.appendChild(setMogas);
            setJeta.setCheck();
            setAvgas.setCheck();
            setMogas.setCheck();
            setSaf.setCheck();
            var currencydiv = this.ce("div");
            currencydiv.style.clear = "both";
            currencydiv.appendChild(document.createTextNode("Show prices in"));
            fuelbox.appendChild(currencydiv);
            s.currencyselect = this.ce("select");
            s.currencyselect.className = "sv_currencyselect";
            fuelbox.appendChild(s.currencyselect);
            var alreadyselected = false;
            var makeCurrencyOption = function(curr) {
                var option = document.createElement("option");
                option.value = curr[0];
                option.className = "sv_wideoption";
                option.appendChild(document.createTextNode(curr[0] + " - " + curr[1]));
                option.dp = curr[2];
                if (!alreadyselected && sv.data.fuel.curr == curr[0]) {
                    alreadyselected = true;
                    option.selected = "true";
                }
                return option;
            }
            for (var i = 0; i < this.data.selectlist.currency.length; i++) {
                var curr = this.data.selectlist.currency[i];
                s.currencyselect.appendChild(makeCurrencyOption(curr));
            }
            s.currencyselect.onchange = function() {
                sv.data.fuel.curr = this.options[this.selectedIndex].value;
                sv.data.fuel.dp = this.options[this.selectedIndex].dp;
                sv.datalayer();
            }
            fuelbox.appendChild(document.createTextNode("per"));
            s.currencyqty = this.ce("input");
            s.currencyqty.value = this.data.fuel.qty;
            s.currencyqty.className = "sv_currencyqty";
            fuelbox.appendChild(s.currencyqty);
            s.currencyqty.onchange = function() {
                sv.data.fuel.qty = this.value;
                sv.datalayer();
            }
            s.unitsselect = this.ce("select");
            s.unitsselect.className = "sv_unitsselect";
            fuelbox.appendChild(s.unitsselect);
            var alreadyselected = false;
            var makeUnitOption = function(unit) {
                var option = document.createElement("option");
                option.value = unit[0];
                option.className = "sv_wideoption";
                option.appendChild(document.createTextNode(unit[1]));
                option.cval = unit[2].toString();
                if (!alreadyselected && sv.data.fuel.unit == unit[0]) {
                    alreadyselected = true;
                    option.selected = "true";
                }
                return option;
            }
            for (var i = 0; i < this.data.selectlist.units.length; i++) {
                var unit = this.data.selectlist.units[i];
                s.unitsselect.appendChild(makeUnitOption(unit));
            }
            s.unitsselect.onchange = function() {
                var option = this.options[this.selectedIndex];
                sv.data.fuel.unit = this.options[this.selectedIndex].value;
                if (sv.data.fuel.unit == 'lb' && 
                    (sv.data.div.settings.enabled.avgas ||
                     sv.data.div.settings.enabled.mogas)) {
                    sv.data.fuel.cval = 6.073;
                } else {
                    sv.data.fuel.cval = parseFloat(this.options[this.selectedIndex].cval);
                }
                sv.datalayer();
            }
            var currWarning = this.ce("div");
            currWarning.id = "sv_currWarning";
            currWarning.innerHTML = "<b>Disclaimer:</b> Currency and Unit conversion accuracy not guaranteed.";
            fuelbox.appendChild(currWarning);
            var divlimit = this.ce("div");
            divlimit.className = "sv_settingsfineprint";
            divlimit.appendChild(document.createTextNode("Filter by: (Requires advertising)"));
            //s.p2.appendChild(document.createTextNode("Limit results by:")); 
            s.p2.appendChild(divlimit);

            //Networks
            var netbox = this.makeSettingsBox("Networks", 
            [
                ['aff_network_sig', 'Signature', true]
                //['aff_network_uvfn', 'UVair FBO Network', true]
            ]);
            //s.p2.appendChild(netbox);
            //netbox.setDisplayed();
            if (0) {
                //fuel brands
                var fuelbox = this.makeSettingsBox("Fuel Brands", 
                [
                    ['aff_fuelbrand_epic', 'EPIC', true], 
                    ['aff_fuelbrand_avfuel', 'AVFuel', true], 
                    ['aff_fuelbrand_phillips', 'Phillips 66', true], 
                    ['aff_fuelbrand_shell', 'Shell', true]
                //['aff_fuelbrand_others','Others',true]
                ]);
                s.p2.appendChild(fuelbox);
                fuelbox.setDisplayed();
            }

            //payment methods
            var cardbox = this.makeSettingsBox("Payment Methods", 
            [
                ['aff_aircard', 'US Government AirCard', true], 
                ['aff_usgcf', 'US Government Contract Fuel', true], 
                ['aff_colt', 'Colt', true], 
                ['aff_uvair', 'UVair', true], 
                ['aff_epiccard', 'EPIC Card', true], 
                ['aff_alliance', 'Alliance', true], 
                ['aff_avcard', 'AVCARD', true], 
                ['aff_multiservice', 'MultiService', true],
                ['aff_titan_contractfuel', 'Titan Contract Fuel', true]
            ]);
            s.p2.appendChild(cardbox);
            cardbox.setDisplayed();


            //rewards
            var rewardbox = this.makeSettingsBox("Rewards Programs", 
            [
                ['aff_avtrip', 'AVTRIP', true], 
                ['aff_tailwins', 'TailWins', true], 
                ['aff_flybuys', 'FlyBuys', true], 
                ['aff_titan_rewards', 'Titan Rewards', true],
                ['aff_wingpoints', 'WingPoints', true], 
                ['aff_bravo', 'Bravo', true]
            ]);
            
            s.p2.appendChild(rewardbox);
            rewardbox.setDisplayed();

            //features
            var featurebox = this.makeSettingsBox("FBO Features", 
            [
                ['aff_safety1st', 'Safety 1st', true], 
                ['aff_wsi', 'WSI Weather', true], 
                ['aff_caa', 'CAA Preferred', true], 
                ['aff_snacks', 'Crew Snacks', true], 
                ['aff_crewcar', 'Crew Car', true], 
                ['aff_customs', 'Customs', true], 
                ['aff_dca', 'DASSP DCA Gateway', true]
            ]);
            s.p2.appendChild(featurebox);
            featurebox.setDisplayed();

            //rentalcar
            var rentalcarbox = this.makeSettingsBox("Ground Transport", 
            [
                ['aff_alamo', 'Alamo', true], 
                ['aff_avis', 'Avis', true], 
                ['aff_budget', 'Budget', true], 
                ['aff_enterprise', 'Enterprise', true], 
                ['aff_hertz', 'Hertz', true], 
                ['aff_national', 'National', true],
                ['aff_gorentals', 'Go Rentals', true]
            ]);
            s.p2.appendChild(rentalcarbox);
            rentalcarbox.setDisplayed();
            
            
            var mkRoute = function(r) {
                var ck = sv.ce("input");
                ck.type = "checkbox";
                var divd = sv.ce("div");
                var div = sv.ce("span");
                divd.appendChild(div);
                div.className = "sv_settingsd";
                divd.style.clear = "both";
                var editBtn = sv.ce("div");
                editBtn.className = "sv_editbtn";
                editBtn.onclick = function(e) {
                    if (!e)
                        e = window.event;
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    } else {
                        e.cancelBubble = "true";
                    }
                    sv.editRoute(r.id, r.name);
                    div.onclick();
                }
                div.appendChild(editBtn);
                div.onclick = function() {
                    if (r.on) {
                        r.on = false;
                        editBtn.style.visibility = 'hidden';
                        ck.checked = false;
                    } else {
                        sv.draw.labelca = [];
                        sv.draw.labelpc = {};
                        sv.draw.labeldup = {};
                        r.on = true;
                        if (sv.data.param.allowEdit) {
                            editBtn.style.visibility = '';
                        }
                        ck.checked = true;
                    }
                    sv.bigeditbtnShowHide();
                    sv.datalayer();
                }
                div.appendChild(ck);
                var colorkey = sv.ce("img");
                colorkey.src = sv.data.images + "/colorkey.png";
                colorkey.className = "sv_colorkey";
                colorkey.style.backgroundColor = r.color;
                div.appendChild(colorkey);
                div.appendChild(document.createTextNode(r.name));
                s.p2.appendChild(divd);
                if (r.on) {
                    ck.checked = true;
                    if (!sv.data.param.allowEdit) {
                        editBtn.style.visibility = 'hidden';
                    }
                } else {
                    editBtn.style.visibility = 'hidden';
                }
                
                sv.data.settings.colormap[r.id] = r.color;
                r.ck = ck;
                r.editBtn = editBtn;
            }
            if (true || this.data.settings.routes.length > 0) {
                s.t2.style.display = "block";
                var checkroutes = sv.ce("div");
                checkroutes.className = "sv_checkall";
                var checkrouteson = false;
                checkroutes.onmouseover = function() {
                    if (checkrouteson) {
                        checkroutes.style.backgroundPosition = "-13px 0px";
                    } else {
                        checkroutes.style.backgroundPosition = "0px 0px";
                    }
                }
                checkroutes.onmouseout = function() {
                    if (checkrouteson) {
                        checkroutes.style.backgroundPosition = "-13px -13px";
                    } else {
                        checkroutes.style.backgroundPosition = "0px -13px";
                    }
                }
                checkroutes.onclick = function() {
                    if (checkrouteson) {
                        checkrouteson = false;
                        checkroutes.style.backgroundPosition = "0px -13px";
                    } else {
                        checkrouteson = true;
                        checkroutes.style.backgroundPosition = "-13px -13px";
                    }
                    for (var i = 0; i < sv.data.settings.routes.length; i++) {
                        if (checkrouteson) {
                            sv.data.settings.routes[i].ck.checked = true;
                            sv.data.settings.routes[i].on = true;
                            if (sv.data.param.allowEdit) {
                                sv.data.settings.routes[i].editBtn.style.visibility = '';
                            }
                        } else {
                            sv.data.settings.routes[i].ck.checked = false;
                            sv.data.settings.routes[i].on = false;
                            sv.data.settings.routes[i].editBtn.style.visibility = 'hidden';
                        }
                        sv.draw.labelca = [];
                        sv.draw.labelpc = {};
                        sv.draw.labeldup = {};
                        sv.datalayerTimeout();
                    }
                    sv.bigeditbtnShowHide();
                }
                //s.p2.appendChild(checkroutes);
                //s.p2.appendChild(document.createTextNode("Display All Routes"));
                for (var i = 0; i < this.data.settings.routes.length; i++) {
                    mkRoute(this.data.settings.routes[i]);
                }
                sv.bigeditbtnShowHide();
            }
            var mkTpp = function(r) {
                var ck = sv.ce("input");
                ck.type = "checkbox";
                if (r.on)
                    ck.checked = true;
                var divd = sv.ce("div");
                var div = sv.ce("span");
                divd.appendChild(div);
                div.className = "sv_settingsd";
                divd.style.clear = "both";
                div.onclick = function() {
                    if (r.on) {
                        r.on = false;
                        ck.checked = false;
                    } else {
                        sv.draw.labelca = [];
                        sv.draw.labelpc = {};
                        sv.draw.labeldup = {};
                        r.on = true;
                        ck.checked = true;
                    }
                    sv.datalayer();
                }
                div.appendChild(ck);
                var colorkey = sv.ce("img");
                colorkey.src = sv.data.images + "/colorkey.png";
                colorkey.className = "sv_colorkey";
                colorkey.style.backgroundColor = r.color;
                div.appendChild(colorkey);
                if (r.link) {
                    var pdflink = sv.ce("a")
                    pdflink.href = r.link;
                    pdflink.target = "_blank";
                    var pdfimg = sv.ce("img");
                    pdfimg.src = sv.data.images + "/page_white_acrobat_small.png";
                    pdfimg.className = "sv_pdfimg";
                    pdflink.appendChild(pdfimg);
                    divd.appendChild(pdflink);
                }
                div.appendChild(document.createTextNode(r.name));
                s.p2.appendChild(divd);
                sv.data.settings.colormap[r.id] = r.color;
                r.ck = ck;
            }
            if (this.data.settings.tpp.length > 0) {
                s.t2.style.display = "block";
                var dps = [];
                var stars = [];
                for (var i = 0; i < this.data.settings.tpp.length; i++) {
                    var r = this.data.settings.tpp[i];
                    if (r.type == 'STAR')
                        stars.push(r);
                    if (r.type == 'DP')
                        dps.push(r);
                }
                if (dps.length > 0) {
                    var checkdps = sv.ce("div");
                    checkdps.className = "sv_checkall";
                    var checkdpson = false;
                    checkdps.onmouseover = function() {
                        if (checkdpson) {
                            checkdps.style.backgroundPosition = "-13px 0px";
                        } else {
                            checkdps.style.backgroundPosition = "0px 0px";
                        }
                    }
                    checkdps.onmouseout = function() {
                        if (checkdpson) {
                            checkdps.style.backgroundPosition = "-13px -13px";
                        } else {
                            checkdps.style.backgroundPosition = "0px -13px";
                        }
                    }
                    checkdps.onclick = function() {
                        if (checkdpson) {
                            checkdpson = false;
                            checkdps.style.backgroundPosition = "0px -13px";
                        } else {
                            checkdpson = true;
                            checkdps.style.backgroundPosition = "-13px -13px";
                        }
                        for (var i = 0; i < dps.length; i++) {
                            if (checkdpson) {
                                dps[i].ck.checked = true;
                                dps[i].on = true;
                            } else {
                                dps[i].ck.checked = false;
                                dps[i].on = false;
                            }
                            sv.draw.labelca = [];
                            sv.draw.labelpc = {};
                            sv.draw.labeldup = {};
                            sv.datalayerTimeout();
                        }
                    }
                    s.p2.appendChild(checkdps);
                    s.p2.appendChild(document.createTextNode("Display All Departure Procedures"));
                    for (var i = 0; i < dps.length; i++) {
                        mkTpp(dps[i]);
                    }
                }
                if (stars.length > 0) {
                    var checkstars = sv.ce("div");
                    checkstars.className = "sv_checkall";
                    var checkstarson = false;
                    checkstars.onmouseover = function() {
                        if (checkstarson) {
                            checkstars.style.backgroundPosition = "-13px 0px";
                        } else {
                            checkstars.style.backgroundPosition = "0px 0px";
                        }
                    }
                    checkstars.onmouseout = function() {
                        if (checkstarson) {
                            checkstars.style.backgroundPosition = "-13px -13px";
                        } else {
                            checkstars.style.backgroundPosition = "0px -13px";
                        }
                    }
                    checkstars.onclick = function() {
                        if (checkstarson) {
                            checkstarson = false;
                            checkstars.style.backgroundPosition = "0px -13px";
                        } else {
                            checkstarson = true;
                            checkstars.style.backgroundPosition = "-13px -13px";
                        }
                        for (var i = 0; i < stars.length; i++) {
                            if (checkstarson) {
                                stars[i].ck.checked = true;
                                stars[i].on = true;
                            } else {
                                stars[i].ck.checked = false;
                                stars[i].on = false;
                            }
                            sv.draw.labelca = [];
                            sv.draw.labelpc = {};
                            sv.draw.labeldup = {};
                            sv.datalayerTimeout();
                        }
                    }
                    s.p2.appendChild(checkstars);
                    s.p2.appendChild(document.createTextNode("Display All STARs"));
                    for (var i = 0; i < stars.length; i++) {
                        mkTpp(stars[i]);
                    }
                }
            }
            this.dragEnable(s.div, s.bg);
        }
        if (tab) {
            if (tab == 1) {
                s.t1.onclick();
            } else if (tab == 2) {
                s.t2.onclick();
            }
        }
    },
    showPanel: function() {
        var p;
        var sv = this;
        if (this.data.div.panel) {
            p = this.data.div.panel;
        } else {
            this.data.div.panel = new Object;
            p = this.data.div.panel;
            p.dragon = false;
            p.rows = [];
            p.div = this.ce("div");
            p.div.onmouseover = function() {
                sv.data.nowheel = true;
            }
            p.div.onmouseout = function() {
                sv.data.nowheel = false;
            }
            p.div.onmousewheel = function(e) {
                if (!e)
                    e = window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = "true";
                }
            }
            p.div.id = "sv_panel";
            if (!this.data.settings.plandata)
                p.div.style.visibility = 'hidden';
            p.div.className = "sv";
            p.bg = this.ce("div");
            p.bg.id = "sv_panelbg";
            p.bg.className = "xlucent80";
            p.div.appendChild(p.bg);
            var ci = this.ce("img");
            ci.className = "sv_panelx";
            ci.src = this.data.images + "/planclose.png";
            ci.onclick = function() {
                sv.data.div.panel.div.style.visibility = 'hidden';
            }
            p.div.appendChild(ci);
            var h = this.ce("h1");
            h.className = "sv sv_panel";
            h.appendChild(document.createTextNode("Flight Plan"));
            p.div.appendChild(h);
            p.div.appendChild(document.createTextNode("Enter waypoints separated by spaces"));
            var f = this.ce("form");
            var inp = this.ce("input");
            inp.style.width = "210px";
            f.appendChild(inp);
            var b = this.ce("input");
            b.type = "submit";
            b.value = "Add";
            b.textContent = "Add";
            f.appendChild(b);
            f.onsubmit = function() {
                if (inp.value == 'getshape') {
                    sv.getshape();
                } else {
                    var data = {cmd: 'planPts',d: inp.value,cid: sv.data.protoid};
                    inp.select();
                    sv.datalayer(data);
                }
                return false;
            }
            f.style.display = "block";
            f.style.marginTop = "4px";
            f.style.marginBottom = "4px";
            p.div.appendChild(f);
            this.data.div.chart.appendChild(p.div);
            p.form = this.ce("form");
            p.form.id = "sv_fmtas";
            var btnrev = this.ce("input");
            btnrev.type = "button";
            btnrev.textContent = "Reverse";
            btnrev.value = "Reverse";
            btnrev.onclick = function() {
                sv.datalayer({'cmd': 'planR'});
                return false;
            }
            p.form.appendChild(btnrev);
            var btnclr = this.ce("input");
            btnclr.type = "button";
            btnclr.textContent = "Clear";
            btnclr.value = "Clear";
            btnclr.onclick = function() {
                sv.datalayer({'cmd': 'planX'});
                return false;
            }
            p.form.appendChild(btnclr);
            p.form.appendChild(document.createTextNode(' GS '));
            p.tas = this.ce("input");
            p.tas.style.width = "50px";
            p.tas.style.textAlign = "center";
            p.tas.value = ''; //default TAS
            p.form.appendChild(p.tas);
            p.form.appendChild(document.createTextNode(' kts'));
            p.tas.onchange = function() {
                sv.datalayer({'cmd': 'planTAS','tas': p.tas.value});
                return false;
            }
            p.form.onsubmit = function() {
                return false;
            }
            p.sdiv = this.ce("div");
            p.sdiv.id = "sv_panelsdiv";
            p.div.appendChild(p.sdiv);
            p.htarget = this.ce("div");
            p.htarget.className = "sv_panelhtarget";
            p.totals = this.ce("div");
            p.totals.style.height = "25px";
            td = this.ce("div");
            td.className = "sv_paneltotal";
            td.appendChild(document.createTextNode("Total"));
            p.totals.appendChild(td);
            p.tdst = this.ce("div");
            p.tdst.className = "sv_panel_tdist";
            p.totals.appendChild(p.tdst);
            p.tte = this.ce("div");
            p.tte.className = "sv_panel_tte";
            p.totals.appendChild(p.tte);
            p.warning = this.ce("div");
            p.warning.className = "sv_planwarning";
            p.warning.appendChild(document.createTextNode("Not for Navigation"));
            p.div.appendChild(p.warning);
            this.dragEnable(p.div, h);
            this.dragEnable(p.div, p.bg);
            this.dragEnable(p.div, p.warning);
        }
        while (p.sdiv.firstChild) {
            p.sdiv.removeChild(p.sdiv.firstChild);
        }
        p.sdiv.appendChild(p.htarget);
        if (this.data.plan.points && this.data.plan.points.length > 0) {
            try {
                p.div.removeChild(p.warning);
            } catch (e) {
            }
            p.len = this.data.plan.points.length;
            var size = 0 + p.len;
            if (size > 6)
                size = 6;
            p.sdiv.style.height = ((size * 40) + 1) + "px";
            for (var i = 0; i < p.len; i++) {
                if (!p.rows[i]) {
                    p.rows[i] = this.panelRow();
                }
                var r = p.rows[i];
                r.setData(this.data.plan.points[i], i);
                p.sdiv.appendChild(r);
            }
            p.tdst.innerHTML = Math.round(this.data.plan.distance * 10) / 10 + "<span class=\"half\">nm</span>";
            p.tte.innerHTML = this.data.plan.tte;
            p.tas.value = this.data.plan.tas;
            p.div.appendChild(p.totals);
            p.div.appendChild(p.warning);
            p.div.insertBefore(p.form, p.sdiv);
        } else {
            try {
                p.div.removeChild(p.form);
            } catch (e) {
            }
            try {
                p.div.removeChild(p.totals);
            } catch (e) {
            }
            p.sdiv.style.height = "0px";
        }
        
        var h = p.div.clientHeight;
        p.bg.style.height = h + "px";
    },
    panelRow: function() {
        var sv = this;
        var row = this.ce("div");
        row.className = "sv_panelrow";
        var icon = this.ce("div");
        icon.className = "sv_panelicon";
        var img = this.ce("img");
        img.className = "sv_panelicon";
        icon.appendChild(img);
        var icontext = this.ce("div");
        icontext.className = "sv_panelicontxt";
        icon.appendChild(icontext);
        row.appendChild(icon);
        var handle = this.ce("div");
        handle.className = "sv_panelhandle";
        if (this.data.isIE) {
            var himg = this.ce("img");
            himg.style.height = "38px";
            himg.style.width = "38px";
            himg.src = this.data.images + "/clear.gif";
            handle.appendChild(himg);
        }
        row.appendChild(handle);
        handle.ondrag = function() {
            return false;
        }
        var offset;
        var newpos;
        var hmove = function(e) {
            if (!e)
                e = window.event;
            var y1 = e.clientY - offset.y;
            var p = sv.data.div.panel;
            if (offset.sh > offset.ch) {
                if (e.clientY > offset.starty) {
                    p.sdiv.scrollTop = Math.round(offset.startScroll + ((y1 - offset.starty2) / (offset.ch - offset.starty2)) * ((offset.sh - offset.ch) - offset.startScroll));
                } else {
                    p.sdiv.scrollTop = Math.round(offset.startScroll * y1 / offset.starty2);
                }
            }
            var y2 = y1 + sv.data.div.panel.sdiv.scrollTop;
            newpos = Math.round(y2 / 40);
            if (newpos < 0)
                newpos = 0;
            if (newpos > p.len)
                newpos = p.len;
            p.htarget.style.top = ((newpos * 40) - 2) + "px";
            p.htarget.style.visibility = "visible";
        }
        var hup = function(e) {
            if (!e)
                e = window.event;
            sv.data.div.panel.dragon = false;
            handle.style.cursor = "pointer";
            if (sv.data.isIE) {
                document.detachEvent("onmousemove", hmove);
                document.detachEvent("onmouseup", hup);
            } else {
                document.removeEventListener("mousemove", hmove, false);
                document.removeEventListener("mouseup", hup, false);
            }
            sv.data.div.panel.htarget.style.top = "3px";
            sv.data.div.panel.htarget.style.visibility = "hidden";
            if (Math.abs(e.clientX - offset.startx) + Math.abs(e.clientY - offset.starty) < 3) {
                sv.getChart({z: sv.data.scale,ll: row.data.lat + "," + row.data.lon});
            } else {
                var d = {cmd: "planO",pos: row.pos + 1,'new': newpos + 1};
                sv.datalayer(d);
            }
        }
        handle.onmousedown = function(e) {
            if (!e)
                e = window.event;
            sv.data.div.panel.dragon = true;
            offset = sv.getPos(sv.data.div.panel.sdiv);
            offset.startx = e.clientX;
            offset.starty = e.clientY;
            offset.starty2 = e.clientY - offset.y;
            offset.startScroll = sv.data.div.panel.sdiv.scrollTop;
            offset.ch = sv.data.div.panel.sdiv.clientHeight;
            offset.sh = sv.data.div.panel.sdiv.scrollHeight;
            if (sv.data.isIE) {
                e.cancelBubble = true;
                document.attachEvent("onmousemove", hmove);
                document.attachEvent("onmouseup", hup);
            } else {
                e.stopPropagation();
                document.addEventListener("mousemove", hmove, false);
                document.addEventListener("mouseup", hup, false);
            }
            return false;
        }
        var title = this.ce("div");
        title.className = "sv_panelt";
        row.appendChild(title);
        var hdg = this.ce("div");
        hdg.className = "sv_paneldata sv_pd1";
        row.appendChild(hdg);
        var dst = this.ce("div");
        dst.className = "sv_paneldata sv_pd2";
        row.appendChild(dst);
        var ete = this.ce("div");
        ete.className = "sv_paneldata sv_pd3";
        row.appendChild(ete);
        var ximg = this.ce("img");
        ximg.className = "sv_panelximg";
        ximg.src = this.data.images + "/delete.png";
        row.appendChild(ximg);
        row.onmouseover = function() {
            if (sv.data.div.panel.dragon) {
                handle.style.cursor = "move";
            } else {
                ximg.style.visibility = "visible";
                handle.style.cursor = "pointer";
            }
            sv.pointHL(row.pos, true);
        }
        row.onmouseout = function() {
            ximg.style.visibility = "hidden";
            sv.pointHL(row.pos, false);
        }
        ximg.onclick = function() {
            sv.planDel({'pos': row.pos + 1});
        }
        row.setData = function(data, pos) {
            row.pos = pos;
            row.data = {lat: data.lat + 0,lon: data.lon + 0};
            img.src = sv.data.images + "/" + data.type + ".png";
            icontext.innerHTML = data.id;
            var name = data.name;
            if (name == 'GPS') {
                var llf = sv.llf(data.lat, data.lon);
                name = llf.lat + " " + llf.lon;
            }
            if (data.freq) {
                name = name.concat(" (", data.freq, " ", data.id, ")");
            }
            if (data.url) {
                name = "<a href=\"" + data.url + "\">" + name + "</a>";
            }
            title.innerHTML = name;
            ximg.style.visibility = "hidden";
            sv.pointHL(row.pos, false);
            if (data.dst) {
                hdg.innerHTML = sv.df(data.mh) + " <span style=\"font-size: 70%\">(" + sv.df(data.th) + "T)</span>";
                dst.innerHTML = (Math.round(data.dst * 10) / 10) + "<span class=\"half\">nm</span>";
                ete.innerHTML = data.ete;
                hdg.style.display = "block";
                dst.style.display = "block";
                ete.style.display = "block";
            } else {
                hdg.style.display = "none";
                dst.style.display = "none";
                ete.style.display = "none";
            }
        
        }
        return row;
    },
    pointHL: function(pos, on) {
        var sv = this;
        if (sv.data.div.planpoints[pos]) {
            if (on) {
                if (sv.data.isIE) {
                    sv.data.div.planpoints[pos].circle.strokecolor = "#ff00ff";
                    sv.data.div.planpoints[pos].circle.strokeweight = "3px";
                    sv.data.div.planpoints[pos].rect.strokecolor = "#ff00ff";
                    sv.data.div.planpoints[pos].rect.strokeweight = "3px";
                } else {
                    sv.data.div.planpoints[pos].circle.setAttribute("stroke", "#ff00ff");
                    sv.data.div.planpoints[pos].circle.setAttribute("stroke-width", "3px");
                    sv.data.div.planpoints[pos].rect.setAttribute("stroke", "#ff00ff");
                    sv.data.div.planpoints[pos].rect.setAttribute("stroke-width", "3px");
                }
            } else {
                if (sv.data.isIE) {
                    sv.data.div.planpoints[pos].circle.strokecolor = "#bb44bb";
                    sv.data.div.planpoints[pos].circle.strokeweight = "2px";
                    sv.data.div.planpoints[pos].rect.strokecolor = "#bb44bb";
                    sv.data.div.planpoints[pos].rect.strokeweight = "2px";
                } else {
                    sv.data.div.planpoints[pos].circle.setAttribute("stroke", "#bb44bb");
                    sv.data.div.planpoints[pos].circle.setAttribute("stroke-width", "2px");
                    sv.data.div.planpoints[pos].rect.setAttribute("stroke", "#bb44bb");
                    sv.data.div.planpoints[pos].rect.setAttribute("stroke-width", "2px");
                }
            }
        }
    },
    panelScroll: function(i) {
        if (this.data.div.panel && this.data.div.panel.rows && this.data.div.panel.rows[i]) {
            var p = this.data.div.panel;
            if (i * 40 < p.sdiv.scrollTop) {
                p.sdiv.scrollTop = (i * 40);
            } else if ((((i + 1) * 40) - 240) > p.sdiv.scrollTop) {
                p.sdiv.scrollTop = ((i + 1) * 40) - 240;
            }
        }
    },
    lineDrag: function(line, i) {
        var sv = this;
        //var x1=this.data.plan.points[i].px-sv.data.plan.ext.minx;
        //var y1=this.data.plan.points[i].py-sv.data.plan.ext.miny;
        //var x2=this.data.plan.points[i+1].px-sv.data.plan.ext.minx;
        //var y2=this.data.plan.points[i+1].py-sv.data.plan.ext.miny;
        var x1 = this.data.plan.points[i].px;
        var y1 = this.data.plan.points[i].py;
        var x2 = this.data.plan.points[i + 1].px;
        var y2 = this.data.plan.points[i + 1].py;
        line.style.cursor = "move";
        line.ondrag = function() {
            return false;
        };
        line.onselectstart = function() {
            return false;
        };
        var offset;
        var lDrag = function(e) {
            if (!e)
                e = window.event;
            e.stopPropagation();
            line.setAttribute("points", x1 + "," + y1 + " " + (e.clientX - offset.x) + "," + (e.clientY - offset.y) + " " + x2 + "," + y2);
        }
        var lDragup = function(e) {
            document.removeEventListener("mousemove", lDrag, false);
            document.removeEventListener("mouseup", lDragup, false);
            sv.data.linedragging = undefined;
            sv.rightClick(e, i + 1);
        }
        line.onmousedown = function(e) {
            if (!e)
                e = window.event;
            e.stopPropagation();
            sv.data.linedragging = true;
            offset = sv.getPos(sv.data.div.slider);
            offset.x += document.body.scrollLeft + document.documentElement.scrollLeft - sv.data.slideroffsetx;
            offset.y += document.body.scrollTop + document.documentElement.scrollTop - sv.data.slideroffsety;
            document.addEventListener("mousemove", lDrag, false);
            document.addEventListener("mouseup", lDragup, false);
            try {
                sv.data.div.plan.removeChild(sv.data.div.planpoints[i].group);
            } catch (e) {
            }
            sv.panelScroll(i);
            return false;
        }
    },
    lineDragIE: function(line, i) {
        var sv = this;
        var x1 = this.data.plan.points[i].px - sv.data.plan.ext.minx;
        var y1 = this.data.plan.points[i].py - sv.data.plan.ext.miny;
        var x2 = this.data.plan.points[i + 1].px - sv.data.plan.ext.minx;
        var y2 = this.data.plan.points[i + 1].py - sv.data.plan.ext.miny;
        line.style.cursor = "move";
        line.ondrag = function() {
            return false;
        };
        line.onselectstart = function() {
            return false;
        };
        var offset;
        var lDrag = function(e) {
            if (!e)
                e = window.event;
            line.points.value = x1 + "," + y1 + " " + (e.clientX - offset.x) + "," + (e.clientY - offset.y) + " " + x2 + "," + y2;
        }
        var planElem = this.data.plan.points[i].ix;
        var lDragup = function(e) {
            document.detachEvent("onmousemove", lDrag);
            document.detachEvent("onmouseup", lDragup);
            sv.rightClick(e, planElem);                        
        }
        line.onmousedown = function(e) {
            if (!e)
                e = window.event;
            e.cancelBubble = true;
            offset = sv.getPos(sv.data.div.slider);
            offset.x += document.body.scrollLeft + document.documentElement.scrollLeft + sv.data.plan.ext.minx - sv.data.slideroffsetx;
            offset.y += document.body.scrollTop + document.documentElement.scrollTop + sv.data.plan.ext.miny - sv.data.slideroffsety;
            document.attachEvent("onmousemove", lDrag);
            document.attachEvent("onmouseup", lDragup);
            try {
                sv.data.div.plan.removeChild(sv.data.div.planpoints[i].group);
            } catch (e) {
            }
            try {
                sv.data.div.plan.removeChild(sv.data.div.planpoints[i].text);
            } catch (e) {
            }
            sv.panelScroll(i);
        }
    },
    pointDrag: function(i) {
        var sv = this;
        var x1, y1, x2, y2;
        var line1, line2;
        var l = sv.data.plan.points.length;
        if (l > 1) {
            if (i > 0) {
                x1 = sv.data.plan.points[i - 1].px;
                y1 = sv.data.plan.points[i - 1].py;
                line1 = sv.data.div.planlines[i - 1][sv.data.div.planlines[i - 1].length - 1];
            }
            if (i + 1 < l) {
                x2 = sv.data.plan.points[i + 1].px;
                y2 = sv.data.plan.points[i + 1].py;
                line2 = sv.data.div.planlines[i][0];
            }
        }
        var circle = sv.data.div.planpoints[i].circle;
        circle.style.cursor = "move";
        circle.ondrag = function() {
            return false;
        };
        circle.onselectstart = function() {
            return false;
        };
        var offset;
        var cDrag = function(e) {
            if (!e)
                e = window.event;
            e.stopPropagation();
            var x = Math.round(e.clientX - offset.x);
            var y = Math.round(e.clientY - offset.y);
            if (line1) {
                line1.setAttribute("points", x1 + "," + y1 + " " + x + "," + y);
            }
            if (line2) {
                line2.setAttribute("points", x + "," + y + " " + x2 + "," + y2);
            }
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
        }
        var cDragup = function(e) {
            document.removeEventListener("mousemove", cDrag, false);
            document.removeEventListener("mouseup", cDragup, false);
            sv.data.linedragging = false;
            sv.rightClick(e, i + 1, 1);
        }
        circle.onmousedown = function(e) {
            if (!e)
                e = window.event;
            e.stopPropagation();
            sv.data.linedragging = true;
            sv.data.canvasHoverId = undefined;
            sv.data.canvasUrl = undefined;
            sv.hoveroff();
            offset = sv.getPos(sv.data.div.slider);
            offset.x += document.body.scrollLeft + document.documentElement.scrollLeft - sv.data.slideroffsetx;
            offset.y += document.body.scrollTop + document.documentElement.scrollTop - sv.data.slideroffsety;
            document.addEventListener("mousemove", cDrag, false);
            document.addEventListener("mouseup", cDragup, false);
            if (line1) {
                try {
                    sv.data.div.plan.removeChild(sv.data.div.planpoints[i - 1].group);
                } catch (e) {
                }
            }
            if (line2) {
                try {
                    sv.data.div.plan.removeChild(sv.data.div.planpoints[i].group);
                } catch (e) {
                }
            }
            sv.panelScroll(i);
            return false;
        }
    },
    pointDragIE: function(i) {
        var sv = this;
        var x1, y1, x2, y2;
        var line1, line2;
        var l = sv.data.plan.points.length;
        if (l > 1) {
            if (i > 0) {
                x1 = sv.data.plan.points[i - 1].px - sv.data.plan.ext.minx;
                y1 = sv.data.plan.points[i - 1].py - sv.data.plan.ext.miny;
                line1 = sv.data.div.planlines[i - 1][sv.data.div.planlines[i - 1].length - 1];
            //line1=sv.data.div.planlines[i-1];
            }
            if (i + 1 < l) {
                x2 = sv.data.plan.points[i + 1].px - sv.data.plan.ext.minx;
                y2 = sv.data.plan.points[i + 1].py - sv.data.plan.ext.miny;
                line2 = sv.data.div.planlines[i][0];
            //line2=sv.data.div.planlines[i];
            }
        }
        var circle = sv.data.div.planpoints[i].circle;
        circle.style.cursor = "move";
        circle.ondrag = function() {
            return false;
        };
        circle.onselectstart = function() {
            return false;
        };
        var offset;
        var cDrag = function(e) {
            if (!e)
                e = window.event;
            var x = Math.round(e.clientX - offset.x);
            var y = Math.round(e.clientY - offset.y);
            if (line1) {
                line1.points.value = x1 + "," + y1 + " " + x + "," + y;
            }
            if (line2) {
                line2.points.value = x + "," + y + " " + x2 + "," + y2;
            }
            circle.style.left = (x - 4) + "px";
            circle.style.top = (y - 4) + "px";
        }
        var planElem = this.data.plan.points[i].ix;
        var cDragup = function(e) {
            document.detachEvent("onmousemove", cDrag);
            document.detachEvent("onmouseup", cDragup);
            sv.data.linedragging = false;
            sv.rightClick(e, planElem, 1);
        }
        circle.onmousedown = function(e) {
            if (!e)
                e = window.event;
            e.cancelBubble = true;
            sv.data.linedragging = true;
            offset = sv.getPos(sv.data.div.slider);
            offset.x += document.body.scrollLeft + document.documentElement.scrollLeft + sv.data.plan.ext.minx - sv.data.slideroffsetx;
            offset.y += document.body.scrollTop + document.documentElement.scrollTop + sv.data.plan.ext.miny - sv.data.slideroffsety;
            document.attachEvent("onmousemove", cDrag);
            document.attachEvent("onmouseup", cDragup);
            if (line1) {
                try {
                    sv.data.div.plan.removeChild(sv.data.div.planpoints[i - 1].group);
                } catch (e) {
                }
                try {
                    sv.data.div.plan.removeChild(sv.data.div.planpoints[i - 1].text);
                } catch (e) {
                }
            }
            if (line2) {
                try {
                    sv.data.div.plan.removeChild(sv.data.div.planpoints[i].group);
                } catch (e) {
                }
                try {
                    sv.data.div.plan.removeChild(sv.data.div.planpoints[i].text);
                } catch (e) {
                }
            }
            sv.panelScroll(i);
        }
    },
    lineDrag_ADC: function(line, i) {
        var sv = this;
        var lat1 = this.data.plan.points[i].lat;
        var lon1 = this.data.plan.points[i].lon;
        var lat2 = this.data.plan.points[i + 1].lat;
        var lon2 = this.data.plan.points[i + 1].lon;
        var fplPoint = this.data.FPL.planPE[this.data.plan.points[i + 1].ix];
        if (fplPoint && fplPoint.viaspan) {
            line.onmouseover = function() {
                fplPoint.viaspan.style.borderColor = "#FF0080";
                fplPoint.viaspan.style.backgroundColor = "#FFFFAA";
            }
            line.onmouseout = function() {
                fplPoint.viaspan.style.borderColor = "transparent";
                fplPoint.viaspan.style.backgroundColor = "transparent";
            }
        }
        line.style.cursor = "move";
        
        line.ondrag = function() {
            return false;
        };
        line.onselectstart = function() {
            return false;
        };
        //var offset;
        var sp;
        var lDrag = function(e) {
            if (!e)
                e = window.event;
            e.stopPropagation();
            var mx = sv.data.p.x + sv.data.mouse.x - sv.data.width / 2;
            var my = sv.data.p.y + sv.data.mouse.y - sv.data.height / 2;
            var mpos = sv.xy2ll(mx, my);
            var newlat = mpos.lat;
            var newlon = mpos.lon;

            var arc1 = sv.gcArc(lat1, lon1, newlat, newlon, 30);
            var arc2 = sv.gcArc(newlat, newlon, lat2, lon2, 30);
            var pt = sv.ll2xy(lat1, lon1);
            var line1 = [Math.round(pt.x) + "," + Math.round(pt.y)];
            if (arc1) {
                for (var i = 0; i < arc1.length; i++) {
                    pt = sv.ll2xy(arc1[i][0], arc1[i][1]);
                    line1.push(Math.round(pt.x) + "," + Math.round(pt.y));
                }
            }
            pt = sv.ll2xy(newlat, newlon);
            line1.push(Math.round(pt.x) + "," + Math.round(pt.y));
            if (arc2) {
                for (var i = 0; i < arc2.length; i++) {
                    pt = sv.ll2xy(arc2[i][0], arc2[i][1]);
                    line1.push(Math.round(pt.x) + "," + Math.round(pt.y));
                }
            }
            pt = sv.ll2xy(lat2, lon2);
            line1.push(Math.round(pt.x) + "," + Math.round(pt.y));
            
            line.setAttribute("points", line1.join(" "));
        }
        var planElem = this.data.plan.points[i].ix;
        var lDragup = function(e) {
            document.removeEventListener("mousemove", lDrag, false);
            document.removeEventListener("mouseup", lDragup, false);
            sv.data.linedragging = undefined;
            sv.rightClick(e, planElem);                        
        }
        line.onmousedown = function(e) {
            if (!e)
                e = window.event;
            e.stopPropagation();
            sv.data.linedragging = true;
            document.addEventListener("mousemove", lDrag, false);
            document.addEventListener("mouseup", lDragup, false);
            try {
                sv.data.div.plan.removeChild(sv.data.div.planpoints[i].group);
            } catch (e) {
            }
            sv.data.isPlanDragging = true;
            sv.panelScroll(i);
            return false;
        }
    },
    lineDragIE_ADC: function(line, i) {
        var sv = this;
        var lat1 = this.data.plan.points[i].lat;
        var lon1 = this.data.plan.points[i].lon;
        var lat2 = this.data.plan.points[i + 1].lat;
        var lon2 = this.data.plan.points[i + 1].lon;
        var fplPoint = this.data.FPL[this.data.plan.points[i + 1].ix];
        if (fplPoint && fplPoint.viaspan) {
            line.onmouseover = function() {
                fplPoint.viaspan.style.borderColor = "#FF0080";
                fplPoint.viaspan.style.backgroundColor = "#FFFFAA";
            }
            line.onmouseout = function() {
                fplPoint.viaspan.style.borderColor = "white";
                fplPoint.viaspan.style.backgroundColor = "transparent";
            }
        }
        line.style.cursor = "move";
        line.ondrag = function() {
            return false;
        };
        line.onselectstart = function() {
            return false;
        };
        var sp;
        var lDrag = function(e) {
            if (!e)
                e = window.event;
            sp = sv.showSnap(true);
            if (sp) {
                var newlat = sp.lat;
                var newlon = sp.lon;
            } else {
                sv.showSnap(false);
                var mx = sv.data.p.x + sv.data.mouse.x - sv.data.width / 2;
                var my = sv.data.p.y + sv.data.mouse.y - sv.data.height / 2;
                var mpos = sv.xy2ll(mx, my);
                var newlat = mpos.lat;
                var newlon = mpos.lon;
            }
            var arc1 = sv.gcArc(lat1, lon1, newlat, newlon, 10);
            var arc2 = sv.gcArc(newlat, newlon, lat2, lon2, 10);
            var pt = sv.ll2xy(lat1, lon1);
            var line1 = [Math.round(pt.x - sv.data.plan.ext.minx) + "," + Math.round(pt.y - sv.data.plan.ext.miny)];
            if (arc1) {
                for (var i = 0; i < arc1.length; i++) {
                    pt = sv.ll2xy(arc1[i][0], arc1[i][1]);
                    line1.push(Math.round(pt.x - sv.data.plan.ext.minx) + "," + Math.round(pt.y - sv.data.plan.ext.miny));
                }
            }
            pt = sv.ll2xy(newlat, newlon);
            line1.push(Math.round(pt.x - sv.data.plan.ext.minx) + "," + Math.round(pt.y - sv.data.plan.ext.miny));
            if (arc2) {
                for (var i = 0; i < arc2.length; i++) {
                    pt = sv.ll2xy(arc2[i][0], arc2[i][1]);
                    line1.push(Math.round(pt.x - sv.data.plan.ext.minx) + "," + Math.round(pt.y - sv.data.plan.ext.miny));
                }
            }
            pt = sv.ll2xy(lat2, lon2);
            line1.push(Math.round(pt.x - sv.data.plan.ext.minx) + "," + Math.round(pt.y - sv.data.plan.ext.miny));
            
            line.points.value = line1.join(" ");
        
        }
        var lDragup = function(e) {
            document.detachEvent("onmousemove", lDrag);
            document.detachEvent("onmouseup", lDragup);
            sv.snapEnd(e, i, sp, false);
            sv.data.isPlanDragging = false;
        }
        line.onmousedown = function(e) {
            if (!e)
                e = window.event;
            e.cancelBubble = true;
            document.attachEvent("onmousemove", lDrag);
            document.attachEvent("onmouseup", lDragup);
            try {
                sv.data.div.plan.removeChild(sv.data.div.planpoints[i].group);
            } catch (e) {
            }
            try {
                sv.data.div.plan.removeChild(sv.data.div.planpoints[i].text);
            } catch (e) {
            }
            sv.data.isPlanDragging = true;
            sv.panelScroll(i);
        }
    },
    pointDrag_ADC: function(i) {
        var sv = this;
        var lat1, lon1, lat2, lon2;
        var line1, line2;
        var l = sv.data.plan.points.length;
        if (l > 1) {
            if (i > 0) {
                lat1 = sv.data.plan.points[i - 1].lat;
                lon1 = sv.data.plan.points[i - 1].lon;
                line1 = sv.data.div.planlines[i - 1][sv.data.div.planlines[i - 1].length - 1];
            }
            if (i + 1 < l) {
                lat2 = sv.data.plan.points[i + 1].lat;
                lon2 = sv.data.plan.points[i + 1].lon;
                line2 = sv.data.div.planlines[i][0];
            }
        }
        var circle = sv.data.div.planpoints[i].circle;
        var fplPoint = this.data.FPL.planPE[this.data.plan.points[i].ix];
        if (fplPoint && fplPoint.span) {
            circle.onmouseover = function() {
                fplPoint.span.style.borderColor = "#FF0080";
                fplPoint.span.style.backgroundColor = "#FFFFAA";
            }
            circle.onmouseout = function() {
                fplPoint.span.style.borderColor = "transparent";
                fplPoint.span.style.backgroundColor = "transparent";
            }
        }
        circle.style.cursor = "move";
        circle.ondrag = function() {
            return false;
        };
        circle.onselectstart = function() {
            return false;
        };
        var offset;
        var sp;
        var cDrag = function(e) {
            if (!e)
                e = window.event;
            e.stopPropagation();

                var x = Math.round(e.clientX - offset.x);
                var y = Math.round(e.clientY - offset.y);
                var mx = sv.data.p.x + sv.data.mouse.x - sv.data.width / 2;
                var my = sv.data.p.y + sv.data.mouse.y - sv.data.height / 2;
                var mpos = sv.xy2ll(mx, my);
                var newlat = mpos.lat;
                var newlon = mpos.lon;

            if (line1) {
                var arc1 = sv.gcArc(lat1, lon1, newlat, newlon, 30);
                var pt = sv.ll2xy(lat1, lon1);
                var linepts = [Math.round(pt.x) + "," + Math.round(pt.y)];
                if (arc1) {
                    for (var i = 0; i < arc1.length; i++) {
                        pt = sv.ll2xy(arc1[i][0], arc1[i][1]);
                        linepts.push(Math.round(pt.x) + "," + Math.round(pt.y));
                    }
                }
                pt = sv.ll2xy(newlat, newlon);
                linepts.push(Math.round(pt.x) + "," + Math.round(pt.y));
                
                line1.setAttribute("points", linepts.join(" "));
            }
            if (line2) {
                var arc2 = sv.gcArc(newlat, newlon, lat2, lon2, 30);
                var pt = sv.ll2xy(newlat, newlon);
                var linepts = [Math.round(pt.x) + "," + Math.round(pt.y)];
                if (arc2) {
                    for (var i = 0; i < arc2.length; i++) {
                        pt = sv.ll2xy(arc2[i][0], arc2[i][1]);
                        linepts.push(Math.round(pt.x) + "," + Math.round(pt.y));
                    }
                }
                pt = sv.ll2xy(lat2, lon2);
                linepts.push(Math.round(pt.x) + "," + Math.round(pt.y));
                
                line2.setAttribute("points", linepts.join(" "));
            }
            circle.setAttribute("cx", mx);
            circle.setAttribute("cy", my);
        }
        var planElem = this.data.plan.points[i].ix;
        var cDragup = function(e) {
            document.removeEventListener("mousemove", cDrag, false);
            document.removeEventListener("mouseup", cDragup, false);
            sv.data.linedragging = false;
            sv.rightClick(e, planElem, 1);
        }
        circle.onmousedown = function(e) {
            if (!e)
                e = window.event;
            e.stopPropagation();
            sv.data.linedragging = true;
            if (e.button == 2 || e.ctrlKey) {
                sv.deleteDialog(i, e.clientX, e.clientY);
                return false;
            }
            offset = sv.getPos(sv.data.div.slider);
            offset.x += document.body.scrollLeft + document.documentElement.scrollLeft + sv.data.plan.ext.minx - sv.data.slideroffsetx;
            offset.y += document.body.scrollTop + document.documentElement.scrollTop + sv.data.plan.ext.miny - sv.data.slideroffsety;
            document.addEventListener("mousemove", cDrag, false);
            document.addEventListener("mouseup", cDragup, false);
            if (line1) {
                try {
                    sv.data.div.plan.removeChild(sv.data.div.planpoints[i - 1].group);
                } catch (e) {
                }
            }
            if (line2) {
                try {
                    sv.data.div.plan.removeChild(sv.data.div.planpoints[i].group);
                } catch (e) {
                }
            }
            sv.data.isPlanDragging = true;
            sv.panelScroll(i);
            return false;
        }
    },
    pointDragIE_ADC: function(i) {
        var sv = this;
        var lat1, lon1, lat2, lon2;
        var line1, line2;
        var l = sv.data.plan.points.length;
        if (l > 1) {
            if (i > 0) {
                lat1 = sv.data.plan.points[i - 1].lat;
                lon1 = sv.data.plan.points[i - 1].lon;
                line1 = sv.data.div.planlines[i - 1][sv.data.div.planlines[i - 1].length - 1];
            }
            if (i + 1 < l) {
                lat2 = sv.data.plan.points[i + 1].lat;
                lon2 = sv.data.plan.points[i + 1].lon;
                line2 = sv.data.div.planlines[i][0];
            }
        }
        var circle = sv.data.div.planpoints[i].circle;
        var fplPoint = this.data.FPL[this.data.plan.points[i].ix];
        if (fplPoint && fplPoint.span) {
            circle.onmouseover = function() {
                fplPoint.span.style.borderColor = "#FF0080";
                fplPoint.span.style.backgroundColor = "#FFFFAA";
            }
            circle.onmouseout = function() {
                fplPoint.span.style.borderColor = "transparent";
                fplPoint.span.style.backgroundColor = "transparent";
            }
        }
        circle.style.cursor = "move";
        circle.ondrag = function() {
            return false;
        };
        circle.onselectstart = function() {
            return false;
        };
        //var offset;
        var sp;
        var cDrag = function(e) {
            if (!e)
                e = window.event;
            sp = sv.showSnap(true);
            if (sp) {
                var x = Math.round(sp.x - sv.data.plan.ext.minx);
                var y = Math.round(sp.y - sv.data.plan.ext.miny);
                var newlat = sp.lat;
                var newlon = sp.lon;
            } else {
                sv.showSnap(false);
                var x = Math.round(e.clientX - offset.x);
                var y = Math.round(e.clientY - offset.y);
                var mx = sv.data.p.x + sv.data.mouse.x - sv.data.width / 2;
                var my = sv.data.p.y + sv.data.mouse.y - sv.data.height / 2;
                var mpos = sv.xy2ll(mx, my);
                var newlat = mpos.lat;
                var newlon = mpos.lon;
            }
            if (line1) {
                var arc1 = sv.gcArc(lat1, lon1, newlat, newlon, 10);
                var pt = sv.ll2xy(lat1, lon1);
                var linepts = [Math.round(pt.x - sv.data.plan.ext.minx) + "," + Math.round(pt.y - sv.data.plan.ext.miny)];
                if (arc1) {
                    for (var i = 0; i < arc1.length; i++) {
                        pt = sv.ll2xy(arc1[i][0], arc1[i][1]);
                        linepts.push(Math.round(pt.x - sv.data.plan.ext.minx) + "," + Math.round(pt.y - sv.data.plan.ext.miny));
                    }
                }
                pt = sv.ll2xy(newlat, newlon);
                linepts.push(Math.round(pt.x - sv.data.plan.ext.minx) + "," + Math.round(pt.y - sv.data.plan.ext.miny));
                
                line1.points.value = linepts.join(" ");
            }
            if (line2) {
                var arc2 = sv.gcArc(newlat, newlon, lat2, lon2, 10);
                var pt = sv.ll2xy(newlat, newlon);
                var linepts = [Math.round(pt.x - sv.data.plan.ext.minx) + "," + Math.round(pt.y - sv.data.plan.ext.miny)];
                if (arc2) {
                    for (var i = 0; i < arc2.length; i++) {
                        pt = sv.ll2xy(arc2[i][0], arc2[i][1]);
                        linepts.push(Math.round(pt.x - sv.data.plan.ext.minx) + "," + Math.round(pt.y - sv.data.plan.ext.miny));
                    }
                }
                pt = sv.ll2xy(lat2, lon2);
                linepts.push(Math.round(pt.x - sv.data.plan.ext.minx) + "," + Math.round(pt.y - sv.data.plan.ext.miny));
                line2.points.value = linepts.join(" ");
            }
            circle.style.left = (x - 4) + "px";
            circle.style.top = (y - 4) + "px";
        }
        var cDragup = function(e) {
            document.detachEvent("onmousemove", cDrag);
            document.detachEvent("onmouseup", cDragup);
            sv.snapEnd(e, i, sp, true);
            sv.data.isPlanDragging = false;
        }
        circle.onmousedown = function(e) {
            if (!e)
                e = window.event;
            e.cancelBubble = true;
            if (e.button == 2 || e.ctrlKey) {
                sv.deleteDialog(i, e.clientX, e.clientY);
                return false;
            }
            offset = sv.getPos(sv.data.div.slider);
            offset.x += document.body.scrollLeft + document.documentElement.scrollLeft + sv.data.plan.ext.minx - sv.data.slideroffsetx;
            offset.y += document.body.scrollTop + document.documentElement.scrollTop + sv.data.plan.ext.miny - sv.data.slideroffsety;
            document.attachEvent("onmousemove", cDrag);
            document.attachEvent("onmouseup", cDragup);
            if (line1) {
                try {
                    sv.data.div.plan.removeChild(sv.data.div.planpoints[i - 1].group);
                } catch (e) {
                }
                try {
                    sv.data.div.plan.removeChild(sv.data.div.planpoints[i - 1].text);
                } catch (e) {
                }
            }
            if (line2) {
                try {
                    sv.data.div.plan.removeChild(sv.data.div.planpoints[i].group);
                } catch (e) {
                }
                try {
                    sv.data.div.plan.removeChild(sv.data.div.planpoints[i].text);
                } catch (e) {
                }
            }
            sv.data.isPlanDragging = true;
            sv.panelScroll(i);
        }
    },
    reset: function(zoomdir, noblank) {
        var sv = SkyVector;

        // if scale isn't 1 then overzoom should be 0 -- the rest of the code is supposed
        // to enforce that invariant, but just in case something goes wrong:
        if (sv.data.scale !== 1 && sv.data.overzoom !== 0) {
            //debugger;;;
            sv.data.overzoom = 0;
            sv.buildTiles(true);
        }
        sv.data.lon = sv.lmod(sv.data.lon);
        sv.data.resetlon = sv.data.lon;
        var p = sv.ll2xy(sv.data.lat, sv.data.lon);
        sv.draw.cache = {};
        sv.draw.labelca = [];
        sv.draw.labelpc = {};
        sv.draw.labelpoints = [];
        sv.draw.distpoints = [];
        sv.draw.labeldup = {};
        sv.hoveroff();
        sv.shape.cache = {};
        if (!noblank) {
            for (var y = 0; y < sv.data.tiles.length; y++) {
                for (var x = 0; x < sv.data.tiles[y].length; x++) {
                    sv.data.tiles[y][x].img.style.visibility = "hidden";
                    sv.data.ztiles[y][x].img.style.visibility = "hidden";
                }
            }
        }
        sv.hideLink();
        sv.hidesrLink();
        sv.wxHide();
        sv.rMenuHide();
        sv.rLayerHide();
        sv.shape.svg();
        sv.showSnap(false);
        if (false && sv.data.isWebkit3D) {
            sv.data.slideroffsetx = Math.round(p.x - (sv.data.width / 2)) - 1000;
            sv.data.slideroffsety = Math.round(p.y - (sv.data.height / 2)) - 1000;
            sv.data.panoffsetx = p.x - 1000;
            sv.data.panoffsety = p.y - 1000;
        } else {
            sv.data.slideroffsetx = Math.round(p.x - (sv.data.width / 2));
            sv.data.slideroffsety = Math.round(p.y - (sv.data.height / 2));
            sv.data.panoffsetx = p.x;
            sv.data.panoffsety = p.y;
        }
        sv.data.p = {x: p.x,y: p.y};
        if (zoomdir)
            sv.underpan(zoomdir);
        if (sv.data.devicePixelRatioFn() >= 1){
            sv.data.xmax = Math.ceil((sv.data.chartwidth / sv.data.scalorFn(sv.data.scale, 0)) / (sv.data.tilesize * sv.data.devicePixelRatioFn()));
            sv.data.ymax = Math.ceil((sv.data.chartheight / sv.data.scalorFn(sv.data.scale, 0)) / (sv.data.tilesize * sv.data.devicePixelRatioFn()));
        }else{
            sv.data.xmax = Math.floor((sv.data.chartwidth / sv.data.scalorFn(sv.data.scale, 0)) / (sv.data.tilesize * sv.data.devicePixelRatioFn()));
            sv.data.ymax = Math.floor((sv.data.chartheight / sv.data.scalorFn(sv.data.scale, 0)) / (sv.data.tilesize * sv.data.devicePixelRatioFn()));
        }

        sv.pan(true);
    },
    zoom: function(a) {
        if (a == 'in') {
            if (this.data.scale > 1) {
                this.data.scale--;
                this.reset('in');
            } else {
                if (this.data.overzoom < this.data.maxoverzoom) {
                    ++this.data.overzoom;
                    this.buildTiles(true);
                    this.reset('in');
                }
            }
        } else if (a == 'out') {
            if (this.data.overzoom) {
                --this.data.overzoom;
                this.buildTiles(true);
                this.reset('out');
            } else if (this.data.scale < this.data.maxzoom) {
                this.data.scale++;
                this.reset('out');
            }
        } else {
            var z = parseInt(a);
            if (z > 0 && z <= this.data.maxzoom) {
                this.data.scale = z;
                var oldOverzoom = this.data.overzoom;
                this.data.overzoom = 0;
                if (oldOverzoom) {
                    this.buildTiles(true);
                }
                this.reset();
            }
        }
        try {
            ga_event('send', 'event', 'Map', 'Zoom', a + "");
        } catch (e) {
        }
        ;
    },
    cookie: function(name) {
        if (!this.data.cookie) {
            this.data.cookie = new Object;
            var cookies = document.cookie.split("; ");
            for (var c = 0; c < cookies.length; c++) {
                var p = cookies[c].split("=");
                this.data.cookie[p[0]] = p[1];
            }
        }
        return this.data.cookie[name] ? this.data.cookie[name] : '';
    },
    setCookie: function(name, val) {
        if (!this.data.cookie) {
            this.cookie(name);
        }
        document.cookie = name + "=" + val + "; domain=" + window.location.host + "; expires=Mon, 27-Jul-2030 23:59:59 GMT; path=/";
    },
    ce: function(type, classname) {
        var o;
        if (document.createElementNS) {
            o = document.createElementNS("http://www.w3.org/1999/xhtml", type);
        }else{
            o = document.createElement(type);
        }
        if (classname) o.className = classname;
        if (type == "input" || type == "textarea") {
            o.setAttribute("autocomplete",false);
            o.setAttribute("spellcheck",false);
        }
        return o;
    },
    ct: function(text) {
        return document.createTextNode(text);
    },
    param: function(name, value) {
        if (!this.data.param) {
            this.data.param = new Object;
            var s = window.location.search;
            if (s) {
                s.replace(/\+/g, '%20');
                var p = s.substr(1).split("&");
                for (var i = 0; i < p.length; i++) {
                    var t = p[i].split("=");
                    this.data.param[unescape(t[0])] = unescape(t[1]);
                }
            }
        }
        if (value) {
            this.data.param[name] = value;
        }
        return this.data.param[name] ? this.data.param[name] : '';
    },
    fixCss: function() {
        if (this.data.settings.href) {
            var s = {
                "*.sv": "font-family: Verdana, Arial, sans-serif; font-size: 14px; margin: 0px; padding: 0px; color: black; font-weight: normal;",
                "a.sv_rmenu": "font-weight: normal;",
                "form": "display: inline;",
                "div.sv_chart": "background-color:#d5e6e6; overflow: hidden; text-align: left; border: 1px solid #808080; border-top: none; position: relative;",
                "div.sv_slider": "position: absolute; margin-top: 0px; margin-left: 0px;",
                "div.sv_glass": "position: absolute; top: 0px; left: 0px; overflow: hidden;",
                "div.sv_switcher": "z-index: 10; position: absolute; right: 0px; top: 30px;",
                "div.sv_weather": "z-index: 4; position: absolute; right: 0px; top: 0px;",
                "#sv_slider": "position: absolute; z-index: -1",
                "#sv_plan": "position: absolute; z-index: 4; ",
                "#sv_svgLayer": "position: absolute; z-index: 4",
                "#sv_rLayer": "position: absolute; border: none; z-index: 2; ",
                "#sv_animframe": "position: absolute; border: none; z-index: 2; ",
                "#sv_throbber": "position: absolute; z-index: 5; display: none;",
                "#sv_shapes": "position: absolute; z-index: 3; "
            };
        } else {
            var s = {
                "body": "-webkit-user-select: none;",
                "*.sv": "font-family: Arial, Verdana, sans-serif; font-size: 14px; margin: 0px; padding: 0px; color: black; font-weight: normal;",
                "a.sv_rmenu": "font-weight: normal;",
                "form": "display: inline;",
                "div.sv_chart": "background-color:#d5e6e6; overflow: hidden; text-align: left; border: 1px solid #808080; border-top: none; position: relative;",
                "div.sv_slider": "position: absolute; margin-top: 0px; margin-left: 0px;",
                "div.sv_glass": "position: absolute; top: 0px; left: 0px; overflow: hidden; touch-action: none;",
                "div.sv_switcher": "z-index: 10; position: absolute; right: 0px; top: 30px;",
                "div.sv_weather": "z-index: 4; position: absolute; right: 0px; top: 0px;",
                "div.sv_droplayer": "z-index:4; position: absolute; right: 0px; top: 0px;",
                "div.sv_droptarget": "position: absolute; background-color: rgba(255,0,255,0.5); width: 10px; height: 10px;",
                "img.sv_snapIcon": "z-index: 4; position:absolute; width: 14px; height: 14px; display: none;",
                "div.sv_snapconfirmLabel": "font-size: 12px; padding: 0px 4px 0px 18px; border: 2px solid #aaa; -moz-border-radius: 5px; -webkit-border-radius: 1px; border-radius: 1px; white-space: nowrap; background: #ffffff url(" + this.data.images + "/snapicon.png) no-repeat scroll 2px -1px; width: 42px; text-align: center;",
                "select.sv_snapconfirmSelect": "width: 68px; font-size: 11px; text-align: center;",
                "div.sv_snapLabel": "z-index: 4; position:absolute; display: none;font-size: 12px; padding: 0px 4px 0px 18px; border: 2px solid #bb44bb; -moz-border-radius: 5px; -webkit-border-radius: 1px; border-radius: 1px; white-space: nowrap; background: #ffffff url(" + this.data.images + "/snapicon.png) no-repeat scroll 2px -1px;",
                "div.svwxbox": "z-index: 21; position: absolute; background-color: #ffffaa; border: 1px solid black; padding: 3px; font-size: 12px;",
                "div.svhover": "z-index: 11; position: absolute; max-width: 300px; background-color: #ddffdd; border: 1px solid black; padding: 3px; font-size: 12px;",
                "div.svwxtitle": "font-size: 120%",
                "span.svwxage": "font-size: 67%; color: #888888;",
                "div.sv_pirepage": "font-size: 80%; color: #777;",
                "pre.svwxdata": "font-size: 10px;",
                "div.sw": "float: right; cursor: pointer;",
                "div.sw1": "float: left; background: url(" + this.data.images + "/sw.png) no-repeat 0 0; width: 10px; height: 28px; background-size: 415px 28px; ",
                "div.sw2": "float: left; background-repeat: no-repeat; background-position: top right; background-image: url(" + this.data.images + "/sw.png); height: 28px; padding: 6px 13px 0px 0px;font-size: 12px; line-height: 12px; background-size: 415px 28px;",
                "div.sw1.swon": "background-image: url(" + this.data.images + "/sw2.png); color: white;",
                "div.sw2.swon": "background-image: url(" + this.data.images + "/sw2.png); color: white;",
                "img.sv_zc": "position: absolute; bottom: 0px; right: 0px; border: none; z-index: 10; width: 164px; height: 35px;",
                "img.sv_zs": "position: absolute; bottom: 1px; right: 54px; border: none; cursor: W-resize; z-index: 10; width: 18px; height: 33px;",
                "img.sv_zfpl": "position: absolute; bottom: 0px; right: 164px; border: none; z-index: 10; width: 30px; height: 35px; cursor: pointer;",
                "img.sv_za": "position: absolute; width: 75px; height: 75px; z-index: 20; display: none;",
                //"div.sv_bigeditbtn":"position: absolute; width: 66px; height: 38px; z-index: 20; bottom: 0px; right: 170px; background: transparent url("+this.data.images+"/bigeditbtn.png) no-repeat scroll 0px 0px;",
                "div.sv_topbar": "position: absolute; height: 22px; border-top: 1px solid #cccccc; border-bottom: 1px solid #666666; width: 100%; z-index: 10; -webkit-user-select: text;",
                "div.sv_topbarbg": "position: absolute; height: 24px; background-color: black; width: 100%;z-index: 10;",
                "span.sv_topbarlink": "margin: 0px 10px; color: white;",
                "span.sv_topbarlink:hover": "text-decoration: underline; cursor: pointer;",
                "#sv_topbarul": "list-style: none; color: white; margin-top: 2px; ",
                "#sv_tbtime": "font-size: 10px; line-height: 22px;",
                "#sv_tbll": "width: 220px; overflow: visible; margin: 0px -30px 0px -30px; text-align: center;",
                "#sv_topbarul li": "float: right; padding-right: 2em; ",
                "#sv_topbarul li.ul:hover": "text-decoration: underline; cursor: pointer;",
                "#sv_topbarul li.ul2": "text-decoration: underline; cursor: pointer;",
                "#sv_topbarul img": "border: none; padding-right: 4px; vertical-align: top; margin-top: 2px;",
                "#sv_topbarul a:hover": "text-decoration: underline; cursor: pointer;",
                "#sv_slider": "position: absolute; z-index: -1",
                "#sv_plan": "position: absolute; z-index: 4;",
                "#sv_svgLayer": "position: absolute; z-index: 4",
                "#sv_rLayer": "position: absolute; border: none; z-index: 2; ",
                "#sv_animframe": "position: absolute; border: none; z-index: 2; ",
                "#sv_shapes": "position: absolute; z-index: 3; ",
                "input.sv_search": "vertical-align: top; width: 60px; height: 16px; font-size: 14px; line-height: 14px; margin: 0px 3px 0px 3px; padding: 0px; background-color: #ddd; border: 1px inset #eee;",
                "input.sv_searchbtn": "font-size: 10px; padding: 0px; margin: 0px 3px;",
                "div.sv_rmenu": "position: absolute; border: 2px outset #e0e0e0; background-color: #e0e0e0; z-index: 11; visibility: hidden; padding: 0px; font-size: 12px; line-height: 10px; touch-action: none; -webkit-user-select: text;",
                "div.sv_rmenutitle2": "background-color: #4D7FA5; color: white; padding: 2px 10px; font-weight: bold;",
                "div.sv_rmenutitle": "color: #4D7FA5; background-color: #aaa; color: black; padding: 2px 10px 2px 10px;border-bottom: 1px solid #e0e0e0; ",
                "#sv_rmenu table": "border-spacing: 0px; padding: 2px; border-collapse: collapse;",
                "#sv_rmenu td": "padding: 0px; height: 15px; margin: 0px; font-size: 12px",
                "#sv_rmenu img": "padding: 0px 2px;",
                "#sv_rmenu a": "color: #0161ab;",
                "#sv_srLink": "position: absolute; width: 300px; left: 3px; top: 26px; color: black; z-index: 10; padding: 4px; font-size: 13px;",
                "#sv_srLink a": "color: #0161ab;",
                "#sv_srLink img": "vertical-align: middle; padding: 0px 3px;",
                "#sv_srLinkbg": "position: absolute; width: 300px; height: 25px; background-color: #eee; z-index: -1; margin: -4px;",
                "#sv_searchResults": "position: absolute; width: 300px; left: 5px; top: 30px; color: black; z-index: 20; padding: 4px; font-size: 13px; ",
                "#sv_srTable": "padding: 0px; width: 100%;",
                "#sv_srTable td": "padding: 0px",
                "#sv_link": "position: absolute; width: 400px; right: 0px; top: 60px; color: black; z-index: 10; padding: 9px; font-size: 13px;",
                "#sv_linkbg": "position: absolute; width: 400px; height: 146px; background-color: #eee;z-index: -1; margin: -9px;",
                "#sv_print": "position: absolute; width: 318px; right: 0px; top: 60px; color: black; z-index: 10; padding: 9px; font-size: 13px;",
                "#sv_printbg": "position: absolute; width: 318px; height: 280px; background-color: #eee;z-index: -1; margin: -9px;",
                "#sv_printtable": "width: 300px;",
                "#sv_printtable th": "font-weight: bold;",
                "ul.sv_tabs": "list-style: none; margin: 2px 5px -1px 10px; padding: 0px; height: 22px;",
                "li.sv_tabs": "position: relative; z-index: 0; float: left; cursor:pointer; width:110px; height: 22px; margin: 0px -4px 0px -4px; text-align: center; padding-top: 3px; background: transparent url('" + this.data.images + "/tab_off.png') no-repeat top right; background-size: 110px 22px;",
                "li.sv_tabon": "z-index: 1; background: transparent url('" + this.data.images + "/tab_on.png') no-repeat top right; background-size: 110px 22px;",
                "div.sv_tabpage": "clear: both; position: absolute; padding: 7px 0px; display: none;",
                "div.sv_tabon": "display: block;",
                "div.sv_divhr": "margin: 4px 15px 4px 15px; border-bottom: 1px dashed #808080; height: 0px;",

                "#sv_settings": "position: absolute; width: 300px; right: 0px; top: 60px; color: black; z-index: 10; padding: 9px; font-size: 13px;",
                "#sv_settingsbg": "position: absolute; width: 300px; height: 329px; background-color: #eee; z-index: -1; margin: -9px;",
                "#sv_settingstabs": "list-style: none; margin: 2px 5px -1px 10px; padding: 0px; height: 22px;",
                "#sv_settingstabs li": "position: relative; z-index: 0; float: left; cursor:pointer; width:80px; height: 22px; margin: 0px -4px 0px -4px; text-align: center; padding-top: 3px; background: transparent url('" + this.data.images + "/tab_off2.png') no-repeat top right; background-size: 80px 22px;",
                "#sv_settingstabs li.on": "z-index: 1; background: transparent url('" + this.data.images + "/tab_on2.png') no-repeat top right; background-size: 80px 22px;",
                "#sv_settingspage": "border: 1px solid #808080; background-color: white; height: 285px; margin: 0px 18px 0px 0px;",
                "div.sv_settingspage": "clear: both; position: absolute; margin: 3px 0px 3px 3px; background-color: white; width: 270px; height: 279px; overflow-y: scroll;",
                "div.sv_settingsbox": "border: 1px solid #AAAAAA; border-radius: 10px; margin: 10px 3px; padding: 10px 10px 6px 10px;white-space: wrap;",
                "div.sv_settingsboxac": "border: 1px solid #AAAAAA; border-radius: 10px; padding: 10px 10px 6px 10px;white-space: wrap;",
                "div.sv_settingsshade": "margin: 10px 3px 10px 3px; overflow-y: hidden; transition: height 200ms;",
                "div.sv_settingboxholder": "min-height: 7px;",
                "div.sv_settingsboxlabel": "background-color: #FFFFFF; color: #AAAAAA; font-size: 14px; line-height: 18px; margin: -17px 0 0 15px; overflow: visible; padding: 0 5px; position: absolute; line-height: 10px;",
                "div.sv_settingsboxlabelac": "z-index: 1; background-color: #FFFFFF; color: #AAAAAA; font-size: 14px; line-height: 18px; margin: -6px 0 0 29px; overflow: visible; padding: 0 5px; position: absolute; line-height: 10px; cursor: pointer; ",
                "div.sv_settingsboxlabelac:hover": "color: #7777AA;",
                "div.sv_settingsboxtriangle": "z-index: 2; color: #AAAAAA; position: absolute; font-size: 14px; margin: -10px 0 0 20px; transition: transform 200ms, opacity 400ms;",
                "div.sv_settingsboxtrianglerot": "transform: rotate(90deg); opacity: 0;",
                "div.sv_settingsinline": "display: inline; margin-right: 12px; float: left;",
                "div.sv_settingsdisabled": "color: #AAAAAA;",
                "div.sv_settingslabel": "font-style: italic; margin-top: 3px; font-size: 14px;",
                "a.sv_settingscredit": "margin-bottom: -3px; text-decoration: none; display: block; text-align: right; color: #AAAAAA; font-size: 10px; cursor: pointer",
                "img.sv_windSettingsGear": "float: right; width: 20px; height: 20px; cursor: pointer; ",
                "div.sv_windPopUp": "position: absolute; width: 203px; height: 76px; box-shadow: rgba(0,0,0,.4) 5px 5px 10px 0px; border: 1px solid #AAAAAA; border-radius: 10px; visibility: hidden; background: white url(" + this.data.images + "/alttimebar.png) no-repeat 50px 10px; background-size: 105px 60px; margin-top: -50px; margin-left: -7px; ",
                "img.sv_windSlider": "position: absolute; width: 15px; height: 19px;",
                "div.sv_windpopupvalue": "position: absolute; text-align: center; width: 50px; height: 14px; font-size: 10px;",
                "#sv_wxWarning": "color: #a00000; font-size: 10px;",
                "div.sv_windLabel": "margin: 3px 0 0 30px; font-size: 10px;",
                "#sv_currWarning": "color: #AAAAAA; font-size: 10px; text-align: center;",
                "div.sv_settingsfineprint": "font-size: 11px;",
                "#sv_mapCredit": "position: absolute; bottom: 1px; right: 170px; font-size: 8px; z-index: 3;",
                "#sv_legend": "position: absolute; bottom: 0px; left: 0px; padding: 9px; font-size: 10px; z-index: 10; ",
                ".sv_legendimg": "display: none; margin-top: 5px; position: relative;",
                "div.sv_legendpane": "position: absolute; height: 8px; width: 30px; bottom: 0px",
                "#sv_message": "position: absolute; width: 200px; z-index: 100; top: 60px;left: 30px; background-color: white; padding: 20px; border: 1px solid #999;",
                "#sv_infoBox": "position: absolute; z-index: 20; top: 60px;left: 30px; background-color: white; padding: 5px 20px 10px 20px; border: 1px solid #999; border-radius: 10px; box-shadow: 10px 10px 40px 0px black; -webkit-user-select: text;",
                "#sv_infoBox pre": "font-size: 11px; font-family: Menlo, DejaVu Sans Mono, fixed-width; ",
                "div.sv_infoBoxTxt": "max-height: 200px; overflow-y: auto; overflow-x: hidden; padding-right: 1em; ",
                "input.sv_messageOkBtn": "display: block; margin-left: auto; margin-right: auto; width: 140px;",
                "#sv_importdialog": "position: absolute; width: 300px; z-index: 4; top: 60px;left: 30px; background-color: white; padding: 20px; border: 1px solid #999;",
                "#sv_progressbarholder": "width: 300px; height: 5px; border: 1px inset #aaaaaa; background-color: #aaaaaa;",
                "#sv_progressbar": "height: 100%; width: 1%; background-color: #4D7FA5;",
                "#sv_deleteDialog": "position: absolute; color: black; z-index: 15; padding: 9px; visibility: hidden; font-size: 12px; background-color: white; border: 1px solid #999;",
                "#sv_deleteDialogLink": "cursor: pointer;",
                "#sv_deleteDialogLink:hover": "color: white; background-color: #4D7FA5;",
                "#sv_confirmdelete": "position: absolute; width: 210px; height: 130px; color: black; z-index: 15; padding: 9px; visibility: hidden;",
                "#sv_confirmdeletebg": "position:absolute; width: 210px; height: 130px; z-index: -1; margin: -9px; background-color: #eee;",
                "#sv_confirmsnap": "position: absolute; width: 210px; height: 180px; color: black; z-index: 15; padding: 9px; visibility: hidden;",
                "#sv_confirmsnap input": "width: 80px;",
                "#sv_confirmsnaptable td": "background: none; font-size: 11px; text-align: right; vertical-align: middle; padding: 1px 3px;",
                "#sv_confirmsnapbg": "position:absolute; width: 210px; height: 182px; z-index: -1; margin: -9px; background-color: #eee;",
                "#sv_aircraftEdit": "position: absolute; width: 400px; left: 70px; top: 100px; color: black; z-index: 20; padding: 9px; font-size: 13px; background-color: #eee; border: 1px solid #999; border-radius: 10px; box-shadow: 10px 10px 40px 0px black;",
                "#sv_planEdit": "position: absolute; width: 400px; left: 20px; top: 44px; color: black; z-index: 10; padding: 9px; font-size: 13px;",
                "#sv_planEditbg": "position: absolute; width: 400px; background-color: #eee;z-index: -1; margin: -9px;",
                "#sv_planEditField": "background-color: white; border: 1px solid #999; width: 373px; height: 70px; padding: 3px; overflow-y: auto; overflow-x: hidden; -webkit-user-select: text;",
                "#sv_planundo": "position: absolute; width: 56px; height: 20px; background: transparent url('" + this.data.images + "/undoredo.png') no-repeat 0px 0px; background-size: 112px 60px; left: 228px; top: 7px; cursor: pointer;",
                "#sv_planredo": "position: absolute; width: 56px; height: 20px; background: transparent url('" + this.data.images + "/undoredo.png') no-repeat -56px 0px; background-size: 112px 60px; left: 284px; top: 7px; cursor: pointer;",
                "#sv_btnredraw": "position: absolute; width: 76px; height: 27px; background: transparent url('" + this.data.images + "/redrawupdate.png') no-repeat 0px 0px; left: 238px; ; cursor: pointer;",
                "#sv_btnupdate": "position: absolute; width: 76px; height: 27px; background: transparent url('" + this.data.images + "/redrawupdate.png') no-repeat 0px -75px; left: 313px; ; cursor: pointer;",
                "#sv_plandist": "position: absolute; left: 190px; font-size: 11px; line-height: 20px;",
                "span.sv_plantpp": "color: #b60; border-bottom: 2px solid white; white-space: nowrap; position: relative;",
                "span.sv_planats": "color: #080; border-bottom: 2px solid white; white-space: nowrap; position: relative;",
                "span.sv_wrongway": "background: transparent url('" + this.data.images + "/donotenter.png') no-repeat 0px 2px; padding-left: 13px;",
                "span.sv_plandirect": "color: #bbb; font-weight: bold; border-bottom: 2px solid white; white-space: nowrap; position: relative; background: transparent url('" + this.data.images + "/directarrow.gif') no-repeat -6px 5px; padding-left: 2px; padding-right: 6px; ",
                "span.sv_plandirectwrap": "color: #bbb; font-weight: normal; border-bottom: 2px solid white; white-space: nowrap;",
                "span.sv_plandirectd": "position: absolute;",
                "span.sv_planunk": "color: #bbb; border-bottom: 2px solid white; white-space: nowrap; position: relative;",
                "span.sv_planopt": "width: 13px; height: 14px; border-bottom: 2px solid white; color: white; font-size: 1px; white-space: nowrap; position: relative; background: transparent url('" + this.data.images + "/space.png') no-repeat 0 0; display: inline-block; vertical-align: bottom;",
                "span.sv_planpoint": "color: #000; border-bottom: 2px solid white; position: relative;",
                "span.sv_planfl": "color: #06B; border-bottom: 2px solid white; position: relative;",
                "span.sv_pulldownarrow": "position: absolute; z-index: 1; width: 15px; height: 20px; background: red url('" + this.data.images + "/pulldown.png') no-repeat 2px 0px; ",
                //"span.sv_pulldownarrow:hover":"background-position: -15px 0px",
                "div.sv_pulldownmenu": "position: absolute; z-index: 4;  width: 60px; border: 1px solid #999; top: 9px; right: -8px; text-align: right; background-color: #dddddd; color: black; text-decoration: none; font-weight: normal; margin: 5px;",
                "div.sv_pulldownopt": "text-decoration: none; padding-right: 2px; overflow: hidden;",
                "div.sv_pulldownopt:hover": "background-color: #4D7FA5; color: white;",
                "#sv_panel": "position: absolute; width: 300px; left: 20px; top: 44px; color: black; z-index: 10; padding: 9px; font-size: 13px;",
                "#sv_panelbg": "position: absolute; width: 300px; height: 40px; background-color: #eee;z-index: -1; margin: -9px;",
                "#sv_panelsdiv": "position: relative; width: 280px; height: 0px; overflow: auto; margin: 8px 0px;",
                "#sv_panelsdiv a": "color: #0161ab;",
                "#svfpl_minilog a": "color: #0161ab; ",
                "h1.sv_panel": "font-size: 14px; font-weight: bold; padding: 0 0 4px 0;",
                "div.sv_panelrow": "position: absolute; font-size: 12px; font-family: Verdana, Arial, sans-serif; transition: top 100ms; overflow-y: display;",
                "div.floating": "z-index: 1; left: 7px;",
                "div.sv_panelicon": "position: absolute; width: 40px; height: 39px; border: 1px solid black; text-align: center; background: #eeeeee url(" + this.data.images + "/g40.gif) repeat 0 0;",
                "div.sv_panelhandle": "position: absolute; width: 40px; height: 39px; cursor: pointer; ",
                "div.sv_panelhtarget": "top: 4px; left: 0px; position: absolute; width: 42px; height: 6px; background-color: black; visibility: hidden; z-index: 1",
                "img.sv_panelicon": "margin-top: 5px; width: 16px; height: 13px;",
                "img.sv_pdfimg": "position: absolute; border: none; left: 200px;",
                "img.sv_panelx": "margin-top: 0px; margin-right: 18px; float: right;cursor: pointer; width: 19px; height: 19px;",
                "div.sv_panelt": "position: absolute; margin-left: 41px; margin-top: 10px; width: 325px; height: 17px; border: 1px solid black; padding: 3px 0px 0px 4px; overflow: hidden; background: #eeeeee url(" + this.data.images + "/g20.gif) repeat 0 0; white-space: nowrap;",
                "div.sv_paneldata": "position: absolute; margin-top: -9px; height: 16px; padding-top: 2px; text-align: center; border: 1px solid black; background-color: #4D7FA5; color: white;",
                "div.sv_pd1": "margin-left: 41px; width: 82px; background: #4D7FA5 url(" + this.data.images + "/planarrow.gif) no-repeat 0 0; background-size: 6px 19px;",
                "div.sv_pd2": "margin-left: 124px; width: 55px;",
                "div.sv_pd3": "margin-left: 180px; width: 60px;",
                "div.sv_pd4": "margin-left: 241px; width: 60px;",
                "div.sv_pd5": "margin-left: 302px; width: 60px;",
                "div.sv_pdpd": "position: absolute; visibility: hidden; background-image: url("+this.data.images+"/pdpd.png); background-size: 12px 12px; margin-left: 168px; margin-top: -5px; width: 12px; height: 12px; pointer-events: none;",
                "div.sv_pdviapd": "position: absolute; visibility: hidden; background-color: white; border: 1px solid #999; width: 55px; margin-left: 124px; margin-top: 10px;z-index: 2; box-shadow: 2px 2px 5px rgba(0,0,0,.3); ",
                "div.sv_pdviarow": "border-bottom: 1px dashed #999; text-align: center; cursor: pointer;",
                "div.sv_pdviarow:hover": "background-color: #EEE;",
                "img.sv_panelximg": "position: absolute; margin-top: 5px; margin-left: 35px;z-index: 10; visibility: hidden; cursor: pointer; width: 16px; height: 13px;",
                "*.half": "font-size: 70%",
                "div.sv_paneltotal": "position: absolute; margin-left: 20px; width: 60px; height: 18px; border: 1px solid black; padding-top: 2px; text-align: center; background: #eeeeee url(" + this.data.images + "/g20.gif) repeat 0 0; white-space: nowrap;",
                "div.sv_panel_tdist": "position: absolute; width: 75px; height: 18px; margin-left: 81px; padding-top: 2px; text-align: center; border: 1px solid black; background-color: #4D7FA5; color: white;",
                "div.sv_panel_tte": "position: absolute; width: 75px; height: 18px; margin-left: 157px; padding-top: 2px; text-align: center; border: 1px solid black; background-color: #4D7FA5; color: white;",
                "div.sv_planwarning": "text-align: center; font-size: 10px; color: #a00000;",
                "div.svlabel": "position: absolute; padding: 0px 2px; border: 1px solid #888888; font-size: 10px; text-align: center; line-height: 10px; white-space: nowrap;",
                "div.svwfcast": "position: absolute; padding: 0px 2px; top: 50px; font-size: 12px; text-align: center; line-height: 12px; white-space: nowrap; color: black; font-weight:bolder; font-family:'DejaVu', sans-serif;background: #D8D8D8;",
                "div.svshape_tfr": "border: 0; color: red; padding: 0; background: none;",
                "div.svshape_tfr_proposed": "border: 0; color: orange; padding: 0; background: none;",
                "div.svshape_multiLineLabel": "white-space:pre;border:none;",
                //"div.svshape_etopsdata":"width: 80px",
                "div.svshape_sDraw": "border: 0; color: black; padding: 0;",
                "div.svshape_routel": "border: 1px solid black;-moz-border-radius:5px;color:#000000;",
                "div.svshape_ausots-a": "border: none; height: 12px;padding:1px;-moz-border-radius:8px;color:white;background:#0099BB;text-align: center;",
                "div.svshape_ausots-aw": "border: none; height: 12px;padding:1px 3px;-moz-border-radius:8px;color:white;background:#00AA88;text-align: center;",
                "div.svshape_ausots-b": "border: none; height: 12px;padding:1px;-moz-border-radius:8px;color:white;background:#BB8855;text-align: center;",
                "div.svshape_ausots-bw": "border: none; height: 12px;padding:1px 3px;-moz-border-radius:8px;color:white;background:#FF6633;text-align: center;",
                "div.svshape_ausots-e": "border: none; height: 12px;padding:1px;-moz-border-radius:8px;color:white;background:#FF9900;text-align: center;",
                "div.svshape_ausots-ew": "border: none; height: 12px;padding:1px 3px;-moz-border-radius:8px;color:white;background:#779900;text-align: center;",
                "div.svshape_pate": "border: none; height: 12px;padding:1px 3px;-moz-border-radius:8px;color:white;background:#0099BB;text-align: center;",
                "div.svshape_patw": "border: none; height: 12px;padding:1px 3px;-moz-border-radius:8px;color:white;background:#00AA88;text-align: center;",
                "div.svshape_nate": "border: none; width: 12px; height: 12px;padding:1px;-moz-border-radius:8px;color:white;background:#0099BB;text-align: center;",
                "div.svshape_natw": "border: none; width: 12px; height: 12px;padding:1px;-moz-border-radius:8px;color:white;background:#00AA88;text-align: center;",
                "div.svshape_etopsAirport": "border: 1px solid black;-moz-border-radius:5px;color:#000000;",
                "div.svshape_fuelg": "border: 1px solid black;padding: 1px 3px; border-radius:5px;font-weight:bold;color:#000000;background:#ffff00;",
                "div.svshape_fuel": "border: 1px solid black;padding: 1px 3px;border-radius:5px;font-weight:bold;color:#555555;background:#F7F7F7;",
                "div.svlabels_bg": "background-color:#FFFFFF;position:absolute;width:100%;height:100%;z-index:-1;margin-left:-2;",
                "div.svshape_tppl": "border: 1px solid black; color:#000000; ",
                "div.svlabels": "position: absolute; z-index: 5",
                "canvas.svlabels": "position: absolute; z-index: 5; pointer-events: none;",
                "canvas.svcanvas": "position: absolute; z-index: 4; pointer-events: none;",
                "img.colorkey": "width: 19px; height: 10px; vertical-align: middle;",
                "#sv_radarbar": "position: absolute; top: 5px; left: 30px; height: 30px; width: 105px;",
                "#sv_radarslider": "position: absolute; top: 5px; left: 100px;",
                "#sv_fuelbar": "position: absolute; top: 5px; left: 30px; height: 30px; width: 105px;",
                "#sv_fuelslider": "position: absolute; top: 5px; left: 31px;",
                "#sv_altbar": "position: absolute; top: 5px; left: 30px; height: 30px; width: 105px;",
                "#sv_altslider": "position: absolute; top: 5px; left: 31px;",
                "#sv_altinput": "font-size: 12px; position: absolute; width: 60px; left: 160px;text-align: center;",
                "#sv_anibuttons": "position: absolute; top: 0px; left: 142px; width: 104px; height: 26px; background: none;",
                "#sv_anibtn1": "position: absolute; top: 0px; left: 0px; width: 26px; height: 26px; background: transparent url(" + this.data.images + "/playbuttons.png) no-repeat 0px 0px",
                "#sv_anibtn2": "position: absolute; top: 0px; left: 26px; width: 26px; height: 26px; background: transparent url(" + this.data.images + "/playbuttons.png) no-repeat -26px 0px",
                "#sv_anibtn3": "position: absolute; top: 0px; left: 52px; width: 26px; height: 26px; background: transparent url(" + this.data.images + "/playbuttons.png) no-repeat -52px 0px",
                "#sv_anibtn4": "position: absolute; top: 0px; left: 78px; width: 26px; height: 26px; background: transparent url(" + this.data.images + "/playbuttons.png) no-repeat -78px 0px",
                "#sv_fuelstoplbl": "color: #aaaaaa; font-size: 10px; position: absolute; width: 35px; left: 145px; line-height: 11px;",
                "#sv_fuelstoprwy": "font-size: 12px; position: absolute; width: 60px; left: 175px;text-align: center;",
                "#sv_fuelstoprangeck": "position: absolute; left: 20px; margin-top: 6px;",
                "#sv_fuelstoprangelbl": "color: #aaaaaa; font-size: 10px; line-height: 11px; position: absolute; width: 60px; left: 42px;",
                "#sv_fuelstoprangemin": "font-size: 12px; width: 60px;position: absolute; left: 95px;text-align:center;",
                "#sv_fuelstoprangemax": "font-size: 12px; width: 60px;position: absolute; left: 175px; text-align: center;",
                "#sv_fuelstoprangelbl2": "position: absolute; left: 160px; margin-top: 6px; color: #aaaaaa; font-size: 10px; ",
                "div.svfuelicao": "position: absolute; right: 0px; top: 0px; color: white; background-color: #4D7FA5; padding: 2px 4px; font-size: 16px; line-height: 16px;",
                "div.svfuelprice": "position: absolute; right:0px;bottom: 0px; padding: 2px; background-color: #888; line-height: 4px; border-radius: 3px; margin: 2px;",
                "div.svfuelhover": "background-color: white; padding-right: 60px; line-height: 14px;",
                "div.svfuelhoverg": "width: 200px; height: 44px;background-color: white;",
                "#sv_throbber": "position: absolute; z-index: 5; display: none;",
                "div.sv_checkall": "float: left; padding: 0px; margin: 4px 2px 0px 2px; width: 13px; height: 13px; background: white url(" + this.data.images + "/checks.png) no-repeat 0px -13px;",
                "span.sv_settingsd": "white-space: nowrap;",
                "span.sv_settingsd:hover": "cursor: pointer;",
                "div.sv_settingsLegend": "width: 22px; height: 10px; border: 1px solid white; margin: 2px 3px -2px 3px; display: inline-block;",
                ".clearboth": "clear:both;",
                ".svblue": "color: #4D7FA5",
                ".svdarkblue": "color: #1b5b8c",
                "div.sv_editbtn": "position: absolute; right: 4px; width: 31px; height: 14px; background: white url(" + this.data.images + "/editbutton.png) no-repeat 0px -1px;",
                "div.sv_editbtn:hover": "background-position: 0px -16px;",
                "select.sv_currencyselect": "position: relative; font-family: monospace; width: 55px; margin-right: 6px;",
                "input.sv_currencyqty": "width: 40px; text-align: center; margin: 0 6px; border: 1px solid #aaa; border-radius: 10px;",
                "select.sv_unitsselect": "width: 90px;",
                "option.sv_wideoption": "width: 200px; ",
                "span.ffpdgt": "width: 16px; height: 22px; display: inline-block; background-image: url(/sites/all/modules/custom/fbo/images/gaspricec.png);",
                "span.ffpdgtr": "width: 16px; height: 22px; display: inline-block; background-image: url(/sites/all/modules/custom/fbo/images/gaspriceb.png); background-size: 80px 220px;",
                "img.sv_fuellogo": "display: block; position: absolute; bottom: 2px; left: 2px; width: 105px; height: 24px;",
                "span.svmetsev": "color: red; text-decoration: underline;",
                "span.svmetph": "color: #f00;",
                "span.svmetobs": "color: #850;",
                "span.svmetalt": "color: #00f;",
                "span.svmetmov": "color: #080;",
                "span.svmetwi": "color: #888;",
                "div.sv_pirepmarker": "position: absolute; display: block; width: 40px; height: 24px; background-size: 40px 816px; background-image: url(" + this.data.images + "/pirep.png);",
                "div.sv_metar": "position: absolute; display: block; width: 26px; height: 26px; background-size: 104px 130px; background-image: url(" + this.data.images + "/iconsprite.png);",
                "input.svfpl_input": "border: 1px solid #999; border-radius: 4px; width: 60px; text-align: center; margin: 1px; padding: 1px 0px; text-transform: uppercase",
                "input.small": "width: 40px;",
                "span.svfpl_label": "font-size: 12px; padding: 0 3px; display: inline-block;",
                "div.svfpl_airportpicker": "position: absolute; border: 1px solid #555; background-color: white; margin-left: 80px; z-index: 30",
                "div.svfpl_airportpickeroption:hover": "background-color: #aaaaaa;",
                ".svfpl_airportlink": "display: inline-block; vertical-align: top; padding: 2px 5px; width: 230px; line-height: 13px; height: 15px; overflow-x: hidden; overflow-y: visible;",
                "a.svfpl_aptlink": "white-space: nowrap; color: #1b5b8c; padding-right: 200px;",
                "a.svfpl_link": "color: #1b5b8c; text-decoration: none; margin: 0px 2em;",
                "a.svfpl_link:hover": "text-decoration: underline;",
                "div.sv_calendar": "position: absolute; z-index: 3; background-color: white; border: 1px solid #555;",
                "div.sv_calendar_head": "text-align: center;",
                "div.sv_calendardayh": "display: inline-block; font-size: 9px; width: 22px; text-align: center; background-color: #1b5b8c; color: white;",
                "div.sv_calendarday": "display: inline-block; font-size: 10px; width: 20px; border: 1px solid white; cursor: pointer; text-align: center;",
                "div.sv_calendarday:hover": "background-color: #ff7; border-color: red;",
                "a.svfpl_iconlink": "color: #1b5b8c; padding: 0 3px; cursor: pointer;",
                "a.svfpl_iconlinkdisabled": "color: #888; cursor: auto;",
                "span.svfpl_toolbar": "margin-left: 20px;",
                "a.svfpl_iconlinkbtn": "color: #1b5b8c; padding: 2px 3px; cursor: pointer; border: 1px solid #eee;",
                "a.svfpl_iconlinkbtn:hover": "background-color: #fff; border: 1px solid #ccc;",
                "div.svfpl_total": "display: inline-block; width: 60px; color: #1b5b8c; font-weight: bold;",
                "div.svfpl_buttondisabled": "border: 1px solid #999; border-radius: 8px; display: inline-block; min-width: 50px; color: #999; padding: 3px 8px; cursor: pointer; margin: 2px 4px; text-align: center;",
                "div.svfpl_button": "border: 1px solid #1b5b8c; border-radius: 8px; display: inline-block; min-width: 50px; background-color: #e0e0e0; color: #1b5b8c; padding: 3px 8px; cursor: pointer; margin: 2px 4px; text-align: center;",
                "div.svfpl_button:hover": "background-color: white;",
                "div.svfpl_buttonon": "border-color: white; background-color: #4D7FA5; color: white;",
                "div.svfpl_totals": "margin: 3px 0 2px 10px;",
                "div.svfpl_routeList": "position: absolute; width: 375px; height: 0px;  z-index: 30; transition: height 200ms, box-shadow 200ms, border 200ms; overflow: hidden; background-color: white;",
                "div.svfpl_routeListOpen": "box-shadow: 5px 5px 15px 0px #555; border: 1px solid #555",
                "div.svfpl_routemask": "position: absolute; top: -1000px; left: -1000px; width: 3000px; height: 3000px; z-index: 25;",
                "div.svfpl_routeEntry": "height: 44px; ",
                "div.svfpl_routeStrip": "height: 28px; font-size: 12px; margin-left: 20px; display: table; overflow-y: hidden; position: relative;",
                "div.svfpl_routeStripInner": "display: table-cell; vertical-align: middle; max-height: 28px;",
                "div.svfpl_routeTotals": "height: 15px; border-bottom: 1px dashed #AAA; text-align: right; padding-right: 20px; padding-left: 3px;",
                "span.svfpl_routeTotal": "display: inline-block; width: 52px; color: #1b5b8c; font-weight: bold; text-align: left;",
                "span.svfpl_routeLabel": "color: #555; display: inline-block; width: 32px; text-align: right; padding-right: 3px;",
                "span.svfpl_routeEntryIcon": "float: left; padding: 0 3px;",
                "div.svfpl_colorpicker": "position: absolute; display: none; border: 1px solid black; padding: 3px; background-color: #EEE; left: 60px; z-index: 3; width: 209px;",
                "div.svfpl_colorsquare": "display: inline-block; width: 15px; height: 15px; border: 1px solid #808080; margin: 1px;",
                "div.svfpl_icaoEquipPicker": "position: absolute; display: none; border: 1px solid black; padding 3px; background-color: #EEE; left: 30px; z-index: 3; width: 360px; height: 250px; overflow-y: scroll;",
                "h1.svfpl_picker": "margin: 0px 0px 0px 30px; font-size: 12px; color: #1b5b8c;",
                "#svfpl_rnavpickertable td": "text-align: center; border: 1px solid #aaa;",
                "#svfpl_rnavpickertable th": "text-align: center; width: 55px; color: #1b5b8c; vertical-align: bottom; font-weight: normal;",
                "#svfpl_rnavpickertable": "border-collapse: collapse",
                "#sv_fileForm": "position: absolute; visibility: hidden; width: 600px; left: 70px; top: 44px; color: black; z-index: 20; padding: 9px; font-size: 13px; background-color: #eee; border: 1px solid #999; border-radius: 10px; box-shadow: 10px 10px 40px 0px black; overflow-y: auto;",
                "div.svfpl_filelabel": "font-size: 10px; position: absolute; ",
                "div.svfpl_fileRow": "margin-top: 16px; position: relative; height: 24px;",
                "span.svfpl_planspan": "margin: 0px 2px; display: inline-block; position: relative;",
                "option.svfpl_wideoption": "width: 200px;",
                "div.svfpl_modalmaskdark": "position: absolute; top: -1000px; left: -1000px; width: 3000px; height: 3000px; z-index: 250; background-color: black;",
                "div.svfpl_modalmask": "position: absolute; top: -1000px; left: -1000px; width: 3000px; height: 3000px; z-index: 200; ",
                "div.svfpl_modaldialog": "position: absolute; z-index: 251; background-color: #eee; border: 1px solid #888; border-radius: 10px; width: 400px; padding: 10px; box-shadow: 10px 10px 10px rgba(0,0,0,.5);",
                "div.svfpl_inputgroup": "text-align: center; margin: 8px; ",
                "span.svfpl_inputicon": "border: 1px solid #1b5b8c; border-radius: 4px 0 0 4px; background-color: #1b5b8c; color: white; font-size: 14px; line-height: 20px; height:20px; width: 36px; text-align: center;",
                "input.svfpl_inputgroup": "border: 1px solid #1b5b8c; border-radius:  0 4px 4px 0; background-color: white; width: 240px; font-size: 14px; line-height: 20px; height: 20px; padding: 0 10px;",
                "div.svfpl_loginhead": "font-size: 20px; text-align: center; margin: 8px;",
                "div.svfpl_loginmessage": "font-size: 12px; text-align: center; margin: 8px;",
                "div.svfpl_openListBox": "width: 400px; background-color: white; border: 1px solid #666; font-size: 13px;",
                "div.svfpl_openListBoxScroll": "height: 170px; overflow-y: scroll",
                "div.svfpl_openListBoxHeader": "background-color: #1b5b8c; color: white",
                "div.svfpl_openListBoxRow": "cursor: pointer;",
                "div.svfpl_openListBoxRowselected": "background-color:#cee3f3 ",
                "div.svfpl_openListBoxRow:hover": "background-color:#f0f0f0; ",
                "span.svfpl_openListBoxCell1": "display: inline-block; width:  50px; white-space: nowrap; overflow: hidden; margin-left: 5px;",
                "span.svfpl_openListBoxCell2": "display: inline-block; width: 170px; white-space: nowrap; overflow: hidden; margin-left: 5px;",
                "span.svfpl_openListBoxCell3": "display: inline-block; width:  80px; white-space: nowrap; overflow: hidden; margin-left: 5px;",
                "span.svfpl_openListBoxCell4": "display: inline-block; width:  60px; white-space: nowrap; overflow: hidden; margin-left: 5px;",
                "#sv_briefing": "position: absolute; visibility: hidden; width: 600px; left: 70px; top: 44px; color: black; z-index: 20; padding: 9px; font-size: 13px; background-color: white; border: 1px solid #999; border-radius: 10px; box-shadow: 10px 10px 40px 0px black; -webkit-user-select: text; ",
                "div.sv_briefingtext": " overflow-y: scroll;",
                "#sv_briefing h1": "color: #1b5b8c; font-size: 16px; margin: 0 0 3px 0;",
                "#sv_briefing h2": "color: black; font-size: 14px; margin: 0 0 2px 0;",
                //"div.svscroll_wrapper": "-webkit-overflow-scrolling: touch; -webkit-overflow: scroll-y; -moz-overflow: initial; width: 100%; height: 100%; padding: 0; margin: 0;",
                "div.svscroll_wrapper": "width: 100%; height: 100%; padding: 0; margin: 0;",
                "div.svfpl_statuslabel": "color: #666; position: absolute; margin-top: 6px; display: none; height: 20px;",
                "div.svfpl_helpmessage": "font-size: 17px; color: #999; position: absolute; margin-top: -50px; width: 373px; text-align: center;;",
                "span.svfpl_statusmessage": "font-weight: bold; color: #666; padding-left: 4px;",
                "#svfpl_tailpicker": "position: absolute; visibility: hidden; background-color: white; border: 1px solid #1b5b8c; width: 80px; box-shadow: 5px 5px 15px 0px #555; z-index: 3;",
                "div.svfpl_tailpickerrow": "border-bottom: 1px dashed #999; padding: 2px 4px; cursor: pointer;",
                "div.svfpl_tailpickerrow:hover": "background-color: #eee;",
                "#svfpl_minilog": "position: relative; overflow-y: auto; width: 388px; ",
                "nounderline": "text-decoration: none;",
                "#sv_viahovertip th": "background-color: #1b5b8c; color: white; text-align: center; font-size: 10px; width: 60px;",
                "#sv_viahovertip td": "text-align: center; font-size: 16px;",
                "#sv_viahovertip": "border-radius: 5px; border: 1px solid #1b5b8c; position: absolute; visibility: hidden; z-index: 110; border-spacing: 0px; box-shadow: 4px 4px 16px 0px rgba(0,0,0,0.3); background-color: white;",
                "img.svfpl_switch": "width: 41px; height: 16px; background-position: -25px 0; background-size: 66px 16px; transition: background-position 300ms;",
                ".svfpl_showhide": "transition: height 300ms, width 300ms, margin 300ms; overflow: hidden;",
                ".svfpl_row": "height: 21px;",
                "div.svfpl_shareform": "width: 400px; height: 200px; background-color: #eee; box-shadow: 5px 5px 5px rgba(0,0,0,0.5); border-radius: 10px; ",
                "h1.sv_sharepanel": "margin-top: 10px; line-height: 10px; font-size: 20px; color: #4d7faf; text-align: center;",
                "h2.sv_sharepanel": "margin-top: 15px; line-height: 20px; font-size: 17px; color: #777; font-weight: normal; ",
                "h3.sv_sharepanel": "margin-top: 15px; line-height: 20px; font-size: 17px; color: #777; font-weight: normal; text-align: center; width: 130px; margin-top: 34px;",
                "div.svfpl_shareicons": "top: 30px; left: 0px; position: absolute; width: 80px; height: 160px; background: #DDD url("+this.data.images+"/shareicons.png) no-repeat 0 0; background-size: 80px 160px;",
                "div.svfpl_shareiconson": "position: absolute; top: 0px; left: 0px; width: 80px; height: 40px; background: #4d7faf url("+this.data.images+"/shareiconson.png) no-repeat 0 0; background-size: 80px 160px; cursor: pointer;",
                "div.svfpl_sharepane": "position: absolute; top: 30px; left: 80px; width: 320px; height: 160px; background-color: white;text-align: center;",
                "div.svfpl_sharearea": "position: absolute; top: 0px; left: 0px; width: 77px; height: 40px; cursor: pointer; border-right: 3px solid #DDD;",
                "div.notsvfpl_sharearea:hover": "border-right: 3px solid #4d7faf;",
                "div.svfpl_sharehr": "width: 220px; height: 1px; border-bottom: 1px solid #999; margin: 0 auto 0 auto;",
                "div.svfpl_sharehrlabel": "position: relative; width: 50px; background-color: white; color: #999; margin-top: -9px; margin-left: 135px;",
                "a.svfpl_privacylink": "position: absolute; right: 10px; color: #777; top: 10px; text-decoration: none; font-size: 10px; ",
                "div.sv_infoboxline": "font-family: ubuntu, Verdana, sans-serif; text-align: center; line-height: 150%;",
                "span.sv_infoboxlbl": "color: #888; width: 70px; padding-right: 2px; text-align: right; display: inline-block;",
                "span.sv_infoboxtxt": "width: 250px; display: inline-block; border-bottom: 1px solid #ddd; color: #1B5B8C; text-align: left; padding-left: 1em;",
                "div.tppMenu": "position: absolute;z-index: 12; background-color: #ccc; border: 1px solid #888; border-radius: 5px; padding: 5px; max-height: 250px; overflow-y: auto; font-size: 12px;",
                "table.tppMenu": "border-spacing: 0;",
                "td.tppMenu": "background-color: white; cursor: pointer;",
                "td.tppMenu:hover": "color: white; background-color: #4d7faf;",
                "td.tppMenuPdf": "background-color: white;",
                "a.tppMenuPdf": "color: red; padding: 0 8px;",
                "a.tppMenuPdf:hover": "color: white; background-color: #4d7faf;",
                "div.sv_blueapp": "position: absolute; top: 8px; left:0px; text-align: center; width: 61px; height: 65px; font-size: 12px;",
                "div.sv_blueappicon": "display: inline-block; width: 48px; height: 48px; background-image: url("+this.data.images+"/blueappicons2.png); background-repeat: no-repeat; background-size: 288px 48px;",
                "div.sv_blueapplabel": "color: black;",
                "div.sv_sharehelp": "color: #999; font-size: 12px; margin: -5px 0 10px 0;",
                "#sv_animationControl": "position: absolute; z-index: 15; width: 288px; height: 44px; bottom: 12px; left: 50%; margin-left: -144px; ",
                "div.sv_animationControlbg":"z-index: -1; position:absolute; background-color: #EEE; width: 244px; height: 42px; left: 22px; border-top: 1px solid #b0b0b0; border-bottom: 1px solid #808080;",
                "#sv_aniplay": "position: absolute; width: 44px; height: 44px; background-image: url(" + this.data.images + "/animatebuttons.png); background-size: 220px 132px",
                "#sv_anispeed": "position: absolute; left: 244px; width: 44px; height: 44px; background-image: url(" + this.data.images + "/animatebuttons.png); background-size: 220px 132px",
                ".sv_aniplay": "background-position: 0px 0px",
                ".sv_aniplay:hover": "background-position: 0px -44px",
                ".sv_anipause": "background-position: -44px 0px",
                ".sv_anipause:hover": "background-position: -44px -44px",
                ".sv_anispeed1": "background-position: -88px 0px",
                ".sv_anispeed1:hover": "background-position: -88px -44px",
                ".sv_anispeed2": "background-position: -132px 0px",
                ".sv_anispeed2:hover": "background-position: -132px -44px",
                ".sv_anispeed3": "background-position: -176px 0px",
                ".sv_anispeed3:hover": "background-position: -176px -44px",
                "div.sv_animatecontrolframe": "position: absolute; background-color: #aaa; height: 6px; width; 10px; top: 19px;",
                "div.sv_animatecursor": "position: absolute; z-index: 2; height: 12px; width: 12px; top: 16px; left: 230px; background: transparent url(" + this.data.images + "/animatecursor.png) no-repeat; background-size: 12px 12px;",
                "div.sv_animationscrubber": "position: absolute; width: 200px; height: 44px; left: 44px; z-index: 4; touch-action: none;",
                "div.sv_animationTimestamp": "position: absolute; width: 200px; height: 20px; left: 44px; top: 3px; font-weight: bold; color: #1b5b8c; text-align: center; font-size: 13px; line-height: 15px;",
                "div.sv_animationRange": "position: absolute; width: 200px; height: 20px; left: 44px; top: 27px; color: #666; text-align: center; font-size: 12px;",
                "#sv_animationControlSmall": "position: absolute; z-index: 10; width: 200px; height: 20px; bottom: 12px; left: 50%; margin-left: -100px;",
                "div.sv_animationControlbgSmall":"z-index: -1; position:absolute; background-color: #EEE; width: 100%; height: 100%; border: 1px solid #b0b0b0; ",
                "div.sv_animationTimestampSmall": "position: absolute; width: 100px; height: 20px; left: 0px; top: 3px; font-weight: bold; color: #1b5b8c; text-align: center; font-size: 13px; line-height: 15px;",
                "div.sv_animationRangeSmall": "position: absolute; width: 100px; height: 20px; left: 100px; top: 4px; color: #666; text-align: center; font-size: 12px; line-height: 14px;"




            //"select:focus": "width: auto; position: relative;",
            };
        }
        if (this.data.isSafari) {
            s["img.sv_zs"] = "position: absolute; bottom: 1px; right: 54px; border: none; cursor: ew-resize; z-index: 10; width: 18px; height: 33px;";
            for (var sel in s) {
                if (s[sel].indexOf('-moz-border-radius') != -1) {
                    s[sel] = s[sel].replace("-moz-border-radius", "border-radius");
                }
            }
        }
        if (this.data.isWebkit){

        }
        if (false && this.data.isWebkit3D) {
            s["div.svscroll_wrapper"] = "-webkit-overflow-scrolling: touch; overflow-y: scroll; width: 100%; height: 100%; padding: 0; margin: 0;";
            s["div.sv_slider"] = "position: absolute; width: 3000px; height: 3000px; overflow:hidden; z-index: 1;";
            s["div.sv_zoomer"] = "position: absolute; width: 3000px; height: 3000px; overflow:hidden; z-index: 0; visibility: hidden; background-color: #d5e6e6; ";
            s["div.sv_weather"] = "z-index: 4; position: absolute; right: 0px; top: 0px; overflow:hidden; width:3000px; height: 3000px;";
        }
        s["div.sv_zoomer"] = "position: absolute; width: 3000px; height: 3000px; overflow:hidden; z-index: 0; visibility: hidden; background-color: #d5e6e6; ";
        if (this.data.isIE) {
            if (true || this.data.isIE8) {
                s["v\\:group"] = "behavior: url(#default#VML);";
                s["v\\:oval"] = "behavior: url(#default#VML);";
                s["v\\:polyline"] = "behavior: url(#default#VML);";
                s["v\\:line"] = "behavior: url(#default#VML);";
                s["v\\:roundrect"] = "behavior: url(#default#VML);";
                s["v\\:textpath"] = "behavior: url(#default#VML);";
                s["v\\:shape"] = "behavior: url(#default#VML);";
                s["v\\:path"] = "behavior: url(#default#VML);";
                s["v\\:fill"] = "behavior: url(#default#VML);";
                s["v\\:stroke"] = "behavior: url(#default#VML);";
            } else {
                s["v\\: *"] = "behavior: url(#default#VML);";
            }
            s["*.xlucent25"] = "filter: alpha(opacity=25);";
            s["*.xlucent50"] = "filter: alpha(opacity=50);";
            s["*.xlucent80"] = "filter: alpha(opacity=75);";
            s["*.sv_xlback"] = "background: transparent; filter: progid:DXImageTransform.Microsoft.Gradient(GradientType=1,StartColorStr='#BFEEEEEE',EndColorStr='#BFEEEEEE');";
            //s["*.sv_labelbg"] = "background: transparent; filter: progid:DXImageTransform.Microsoft.Gradient(GradientType=1,StartColorStr='#80FFFFFF',EndColorStr='#80FFFFFF');";
            s["*.sv_labelbg"] = "background: white; ";
            //s["div.sv_checkall"]="float: left; padding: 0px; margin: 4px 2px 0px 2px; position: relative; width: 13px; height: 13px; background: white url("+this.data.images+"/checks.png) no-repeat 0px -13px;";
            if (this.data.isIE6) {
                s["#sv_topbarul input"] = "vertical-align: top; margin: 0px;";
                s["div.sw1"] = "float: left; background: url(" + this.data.images + "/sw.gif) no-repeat 0 0; width: 10px; height: 28px; ";
                s["div.sw2"] = "float: left; background-repeat: no-repeat; background-position: top right; background-image: url(" + this.data.images + "/sw.gif); height: 28px; padding: 4px 13px 0px 0px;font-size: 12px;";
                s["div.sw1.swon"] = "background-image: url(" + this.data.images + "/sw2.gif); color: white;";
                s["div.sw2.swon"] = "background-image: url(" + this.data.images + "/sw2.gif); color: white;";
            } else {
                s["input[type=checkbox]"] = "vertical-align: top; margin: 0px;";
            }
        } else {
            s["*.xlucent25"] = "opacity: .25;";
            s["*.xlucent50"] = "opacity: .5;";
            s["*.xlucent80"] = "opacity: .75;";
            s["*.xlucent60"] = "opacity: .6;";
            s["*.xlucent80f"] = "opacity: .75;";
            s["*.sv_xlback"] = "background-color: rgba(238,238,238,.75);";
            s["*.sv_labelbg"] = "background-color: rgba(255,255,255,.5);";
            s["input[type=checkbox]"] = "vertical-align: top; margin: 2px;";
        }
        if (false && this.data.isIE9plus) {
            s["div.sv_weather"] = "z-index: 6; position: absolute; right: 0px; top: 0px;";
            s["#sv_svgLayer"] = "position: absolute; z-index: 6";
        }
        if (document.styleSheets.length == 0) {
            var ss = this.ce("style");
            ss.setAttribute("type", "text/css");
            var head = document.getElementsByTagName("head").item(0);
            if (head) {
                head.appendChild(ss);
            } else {
                return false;
            }
        }
        var sheet = document.styleSheets.item(0);
        if (this.data.isIE6) {
            for (var si = 0; si < document.styleSheets.length; si++) {
                document.styleSheets.item(si).disabled = true;
            }
        }
        if (sheet.insertRule) {
            var position = 0;
            try {
                position = sheet.cssRules.length;
            } catch (e) {
            }
            for (var i in s) {
                sheet.insertRule(i + " { " + s[i] + " }", position);
                position++;
            }
        } else if (sheet.addRule) {
            for (var i in s) {
                sheet.addRule(i, s[i]);
            }
        }
        
        if (this.data.isIE) {
            var ss = this.ce("style");
            ss.setAttribute("type", "text/css");
            ss.setAttribute("media", "print");
            var head = document.getElementsByTagName("head").item(0);
            if (head) {
                head.appendChild(ss);
            }
        }
        
        for (var index = 0; index < document.styleSheets.length; index++) {
            sheet = document.styleSheets.item(index);
            if ((sheet.media == "print") || (sheet.media.mediaText == "print")) {
                var stylesToHide = ["div.sv_topbar", "div.sv_switcher", "img.sv_zc", "img.sv_zs", 
                    "#sv_settingstabs", "#sv_settingspage", "#sv_settingsbg", "img.sv_panelx"];
                for (var sIndex = 0; sIndex < stylesToHide.length; sIndex++) {
                    var style = stylesToHide[sIndex];
                    if (sheet.insertRule) {
                        var position = 0;
                        try {
                            position = sheet.cssRules.length;
                        } catch (e) {
                        }
                        sheet.insertRule(style + " { " + "visibility:hidden" + " } ", position);
                    } 
                    else if (sheet.addRule) {
                        sheet.addRule(style, "visibility:hidden;");
                    }
                }
            }
        }
        if (this.data.isIE6) {
            for (var si = 0; si < document.styleSheets.length; si++) {
                document.styleSheets.item(si).disabled = false;
            }
        }
    },
    request: function(url) {
        var request = new Object;
        if (window.XMLHttpRequest) {
            request.xml = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            try {
                request.xml = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    request.xml = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                }
            }
        }
        if (request.xml) {
            request.xml.onreadystatechange = function() {
                if (request.xml.readyState == 4) {
                    if (request.xml.status == 200) {
                        var a;
                        try {
                            eval("a=" + request.xml.responseText);
                        } catch (e) {
                        }
                        ;
                        if (a) {
                            if (request.onload) {
                                request.onload(a);
                            }
                        }
                    } else {
                        if (request.onerror) {
                            request.onerror(request.xml.status);
                        }
                    }
                }
            }
            if (url.indexOf("?") > 0) {
                url += "&";
            } else {
                url += "?";
            }
            url += "rand=" + Math.random().toFixed(5).substr(2);
            if (request.xml.readyState == 2 || request.xml.readyState == 3) {
                try {
                    request.xml.abort();
                } catch (e) {
                }
            }
            request.xml.open('GET', url, true);
            request.xml.send(null);
        }
        return request;
    },
    mkQS: function(args, noescape) {
        var p = [];
        for (var i in args) {
            if (noescape) {
                p.push(i + "=" + args[i]);
            } else {
                p.push(encodeURIComponent(i) + "=" + encodeURIComponent(args[i]));
            }
        }
        return "?" + p.join("&");
    },
    setProj: function(srs) {
        var proj = this.data.proj;
        proj.srs = srs;
        if (srs && srs.proj == 'lcc') {
            this.data.scalors = this.data.scalors1;
            proj.data = new Object;
            proj.data.lat_1 = parseFloat(proj.srs.lat_1) * proj.deg2rad;
            proj.data.lat_2 = parseFloat(proj.srs.lat_2) * proj.deg2rad;
            proj.data.lon_0 = parseFloat(proj.srs.lon_0) * proj.deg2rad;
            proj.data.lat_0 = parseFloat(proj.srs.lat_0) * proj.deg2rad;
            proj.data.x_0 = parseFloat(proj.srs.x_0);
            proj.data.y_0 = parseFloat(proj.srs.y_0);
            proj.data.xr = parseFloat(proj.srs.xr);
            proj.data.yr = parseFloat(proj.srs.yr);
            proj.data.m1 = proj.mkM(proj.data.lat_1);
            proj.data.t1 = proj.mkT(proj.data.lat_1);
            proj.data.m2 = proj.mkM(proj.data.lat_2);
            proj.data.t2 = proj.mkT(proj.data.lat_2);
            proj.data.t0 = proj.mkT(proj.data.lat_0);
            proj.data.ns = Math.log(proj.data.m1 / proj.data.m2) / Math.log(proj.data.t1 / proj.data.t2);
            proj.data.f = proj.data.m1 / (proj.data.ns * Math.pow(proj.data.t1, proj.data.ns));
            proj.data.r = proj.wgs_a * proj.data.f * Math.pow(proj.data.t0, proj.data.ns);
        } else if (srs && srs.proj == 'sm') {
            if (this.data.maxzoom % 2) {
                this.data.scalors = this.data.scalors2;
            } else {
                this.data.scalors = this.data.scalors1;
            }
            proj.data = new Object;
            proj.data.x_0 = parseFloat(proj.srs.x_0);
            proj.data.y_0 = parseFloat(proj.srs.y_0);
            proj.data.xr = parseFloat(proj.srs.xr);
            proj.data.yr = parseFloat(proj.srs.yr);
        } else {
            proj.data = new Object;
            proj.data.xr = 1;
            proj.data.yr = 1;
            proj.data.x_0 = 0;
            proj.data.y_0 = 0;
        //unknown proj
        }
    },
    ll2xy: function(lat, lon, nowrap) {
        lat = parseFloat(lat);
        lon = parseFloat(lon);
        var proj = this.data.proj;
        var p = new Object;
        if (!proj.srs) {
            p.x = lon;
            p.y = -1 * lat;
            p.x /= this.data.scalorFn(this.data.scale, this.data.overzoom);
            p.y /= this.data.scalorFn(this.data.scale, this.data.overzoom);
            return p;
        }
        if (proj.srs.proj == 'lcc') {
            lon *= proj.deg2rad;
            lat *= proj.deg2rad;
            var c = Math.abs(Math.abs(lat) - (proj.pi / 2));
            var t = proj.mkT(lat);
            var r = proj.wgs_a * proj.data.f * Math.pow(t, proj.data.ns);
            var th = proj.data.ns * proj.wrap(lon - proj.data.lon_0);
            p.x = r * Math.sin(th) - proj.data.x_0;
            p.y = (proj.data.r - r * Math.cos(th)) - proj.data.y_0;
        } else if (proj.srs.proj == 'sm') {
            if (!nowrap) {
                lon = this.lmod(lon);
                while (lon < this.data.lon - 180) {
                    lon += 360;
                }
                while (lon > this.data.lon + 180) {
                    lon -= 360;
                }
            }
            if (lat > 89.5)
                lat = 89.5;
            if (lat < -89.5)
                lat = -89.5;
            p.x = proj.wgs_a * proj.pi * lon / 180;
            p.y = proj.wgs_a * Math.log(Math.tan(.25 * proj.pi + .5 * lat * proj.deg2rad)) - proj.data.y_0;
            p.x -= proj.data.x_0;
        }
        p.x /= proj.data.xr * this.data.scalorFn(this.data.scale, this.data.overzoom) * this.data.devicePixelRatio;
        p.y /= proj.data.yr * this.data.scalorFn(this.data.scale, this.data.overzoom) * this.data.devicePixelRatio;
        p.x = Math.round(p.x * 10) / 10;
        p.y = Math.round(p.y * 10) / 10;
        return p;
    },
    xy2ll: function(x, y) {
        var proj = this.data.proj;
        var p = new Object;
        x *= proj.data.xr * this.data.scalorFn(this.data.scale, this.data.overzoom) * this.data.devicePixelRatio;
        y *= proj.data.yr * this.data.scalorFn(this.data.scale, this.data.overzoom) * this.data.devicePixelRatio;
        if (!proj.srs) {
            p.lat = -1 * y;
            p.lon = x;
            return p;
        }
        if (proj.srs.proj == 'lcc') {
            x += proj.data.x_0;
            y += proj.data.y_0;
            y = proj.data.r - y;
            var c, r;
            if (proj.data.ns > 0) {
                r = Math.sqrt(x * x + y * y);
                c = 1.0;
            } else {
                r = -1 * Math.sqrt(x * x + y * y);
                c = -1.0;
            }
            var th = Math.atan2(c * x, c * y);
            var t = Math.pow(r / (proj.wgs_a * proj.data.f), (1 / proj.data.ns));
            var a, b;
            p.lat = (proj.pi / 2) - (Math.atan(t) * 2);
            for (var i = 0; i < 20; i++) {
                a = Math.sin(p.lat) * proj.wgs_e;
                b = (proj.pi / 2) - Math.atan(t * Math.pow(((1 - a) / (1 + a)), proj.wgs_e / 2)) * 2 - p.lat;
                p.lat += b;
                if (Math.abs(b) < .000000001)
                    i = 20;
            }
            p.lon = proj.wrap(th / proj.data.ns + proj.data.lon_0);
        } else if (proj.srs.proj == 'sm') {
            p.lon = (x + proj.data.x_0) / proj.wgs_a;
            p.lat = proj.pi / 2 - 2 * Math.atan(Math.exp(-1 * (y + proj.data.y_0) / proj.wgs_a));
        }
        p.lat *= proj.rad2deg;
        p.lon *= proj.rad2deg;
        return p;
    },
    getPos: function(o) {
        var p = {x: 2,y: 2};
        if (o.offsetParent) {
            p.x += o.offsetLeft;
            p.y += o.offsetTop;
            while (o = o.offsetParent) {
                p.x += o.offsetLeft;
                p.y += o.offsetTop;
            }
        }
        return p;
    },
    getPosScroll: function(o) {
        var p = {x: 2,y: 2};
        if (o.offsetParent) {
            p.x += o.offsetLeft - o.scrollLeft;
            p.y += o.offsetTop - o.scrollTop;
            while (o = o.offsetParent) {
                p.x += o.offsetLeft - o.scrollLeft;
                p.y += o.offsetTop - o.scrollTop;
            }
        }
        return p;
    },
    lmod: function(lon) {
        if (!isNaN(lon)) {
            while (lon < -180) {
                lon += 360;
            }
            while (lon > 180) {
                lon -= 360;
            }
            return lon;
        } else {
            return NaN;
        }
    },
    llfold: function(lat, lon) {
        lon = this.lmod(lon);
        lat = Math.round(lat * 3600);
        lon = Math.round(lon * 3600);
        var ns = "N";
        var ew = "E";
        if (lat < 0) {
            ns = "S";
            lat *= -1;
        }
        if (lon < 0) {
            ew = "W";
            lon *= -1;
        }
        var s = lat % 60;
        lat = Math.round((lat - s) / 60);
        var m = lat % 60;
        var d = Math.round((lat - m) / 60);
        lat = d + "&deg;" + m + "'" + s + "&quot;" + ns;
        s = lon % 60;
        lon = Math.round((lon - s) / 60);
        m = lon % 60;
        d = Math.round((lon - m) / 60);
        lon = d + "&deg;" + m + "'" + s + "&quot;" + ew;
        return {lat: lat,lon: lon};
    },
    llf: function(lat, lon) {
        lat = Math.round(lat * 6000);
        lon = Math.round(lon * 6000);
        var ns = "N";
        var ew = "E";
        if (lat < 0) {
            ns = "S";
            lat *= -1;
        }
        if (lon < 0) {
            ew = "W";
            lon *= -1;
        }
        var m = ((lat % 6000) / 100);
        var d = Math.round((lat / 6000) - (m / 60));
        lat = ns + d + "&deg;" + m.toFixed(2) + "'";
        m = ((lon % 6000) / 100);
        d = Math.round((lon / 6000) - (m / 60));
        lon = ew + d + "&deg;" + m.toFixed(2) + "'";
        return {lat: lat,lon: lon};
    },
    df: function(d) {
        var ds = Math.round(d);
        if (ds < 0) {
            ds+= 360;
        }
        if (ds >=360){
            ds -= 360;
        }
        var l = String(ds).length;
        if (l == 1) {
            return "00" + ds + "\u00b0";
        } else if (l == 2) {
            return "0" + ds + "\u00b0";
        } else {
            return ds + "\u00b0";
        }
    },
    chartSel: function(id, mX, mY, a) {
        var r = this.request(this.data.perldir + "/chartSel" + this.mkQS({id: id,x: mX,y: mY,a: a,j: 1,z: this.data.scale}));
        var sv = this;
        r.onload = function(data) {
            if (data && data.protoid)
                sv.loadMap(data);
        }
    },
    getshape: function() {
        var shape = "POLYGON((";
        var pts = []
        for (var i = 0; i <= this.data.plan.points.length; i++) {
            var point = this.data.plan.points[(i == this.data.plan.points.length ? 0 : i)];
            pts.push(point.lon + " " + point.lat);
        }
        
        shape += pts.join(",");
        shape += "))";
        alert(shape);
    },
    genlink: function() {
        var d = {
            ll: this.data.lat + "," + this.data.lon,
            chart: this.data.protoid,
            zoom: this.data.scale
        }
        var strip =""
        if (this.data.FPL){
            if (this.data.FPL && this.data.FPL.speed){
                if (this.data.FPL.speedunit == 'KT'){
                    var pad = "N0000";
                    var spd = ""+this.data.FPL.speed;
                    strip += pad.substring(0,pad.length-spd.length)+spd;
                }else{
                    strip += this.data.FPL.speed;
                }
            }
            if (this.data.FPL && this.data.FPL.alt){
                if (this.data.FPL.alt.substring(0,2) == 'FL'){
                    strip += "F" + this.data.FPL.alt.substring(2);
                }else{
                    strip += "A" + this.data.FPL.alt;
                }
            }
            if (this.data.FPL.dep){
                strip += " " + this.data.FPL.dep.ident + " ";
            }
            strip += this.data.FPL.routeStrip;
            if (this.data.FPL.dst){
                strip += " " + this.data.FPL.dst.ident;
            }
            d.fpl = encodeURIComponent(strip);
        }
        return "https://skyvector.com/" + this.mkQS(d, true);
    },
    genembed: function() {
        var rand = Math.round(Math.random() * 9999);
        var embed = "<div id=\"sv_" + rand + "\" style=\"width: 200px; height: 200px;\">Make your <a href=\"https://skyvector.com/\">Flight Plan</a> at SkyVector.com</div><script src=\"//skyvector.com/api/lchart?ll=" + this.data.lat + "," + this.data.lon + "&amp;s=" + this.data.scale + "&amp;c=sv_" + rand + "&amp;i=" + this.data.protoid + "\" type=\"text/javascript\"></script>";
        return embed;
    },
    rLayer: function(ll1, ll2, rasterKey) {
        var d;
        var sv = this;
        if (this.data.div.rLayer) {
            d = this.data.div.rLayer;
        } else {
            this.data.div.rLayer = new Object;
            d = this.data.div.rLayer;
            d.img = this.ce("img");
            d.img.id = "sv_rLayer";
            d.img.className = "sv xlucent60";
            d.img.style.visibility = "hidden";
            d.isnew = true;
            d.img.onload = function() {
                if (d.img.complete) {
                    d.img.style.top = Math.round(sv.data.p.y - sv.data.panoffsety) + "px";
                    d.img.style.left = Math.round(sv.data.p.x - sv.data.panoffsetx) + "px";
                    d.img.style.visibility = "visible";
                }
            }
            this.data.div.slider.appendChild(d.img);
        }
        d.img.style.width = this.data.width + "px";
        d.img.style.height = this.data.height + "px";
        if (this.data.settings.layers_raster.length > 0) {
            var largestDim = this.data.width > this.data.height ? this.data.width : this.data.height;
            var rasterScale = Math.ceil(largestDim / this.data.rasterMaxSize);
            var rasterWidth = Math.round(this.data.width/rasterScale);
            var rasterHeight = Math.round(this.data.height/rasterScale);
            if (this.data.div.settings.enabled['nexrad']) {
                this.showAnimationControls(true);
                this.showLegend('nexrad');
                var args = {rk:rasterKey,ext: ll1.lon.toFixed(5) + "," + ll1.lat.toFixed(5) + "," + ll2.lon.toFixed(5) + "," + ll2.lat.toFixed(5), size: rasterWidth +"x"+ rasterHeight, layers: "nexrad", chart: this.data.protoid, edition: this.data.edition};
                sv.animate.set("/wx/frame" + this.mkQS(args), 30, 30);
                d.img.style.visibility = 'hidden';
            } else if (this.data.div.settings.enabled['sat']) {
                this.showAnimationControls(true);
                this.showLegend('sat');
                var args = {rk:rasterKey,ext: ll1.lon.toFixed(5) + "," + ll1.lat.toFixed(5) + "," + ll2.lon.toFixed(5) + "," + ll2.lat.toFixed(5), size: rasterWidth +"x"+ rasterHeight, layers: "sat", chart: this.data.protoid, edition: this.data.edition};
                //d.img.src = "/wx/frame" + this.mkQS(args);
                sv.animate.set("/wx/frame" + this.mkQS(args), 12, 12);
                d.img.style.visibility = 'hidden';
            } else if (this.data.div.settings.enabled['cloudtop']) {
                this.showAnimationControls(true);
                this.showLegend('cloudtop');
                var filterAlt=0;
                if (this.data.div.settings.enabled['cloudtopfilter'] && this.data.prefs.cloudAltitude){
                    filterAlt = this.data.prefs.cloudAltitude;
                }
                var args = {rk:rasterKey,ext: ll1.lon.toFixed(5) + "," + ll1.lat.toFixed(5) + "," + ll2.lon.toFixed(5) + "," + ll2.lat.toFixed(5), size: rasterWidth +"x"+ rasterHeight, layers: "cloudtop", chart: this.data.protoid, edition: this.data.edition, "falt": filterAlt};
                //d.img.src = "/wx/frame" + this.mkQS(args);
                sv.animate.set("/wx/frame" + this.mkQS(args), 12, 12);
                d.img.style.visibility = 'hidden';
            } else {
                this.showAnimationControls(false);
                this.hideLegend('all');
                sv.animate.clear();
                d.img.style.visibility = 'hidden';
            }
        
        } else {
            d.img.style.visibility = 'hidden';
        }
    },
    rLayerHide: function() {
        if (this.data.div.rLayer && this.data.div.rLayer.img && this.data.div.rLayer.img.style.visibility == 'visible') {
            this.data.div.rLayer.img.style.visibility = 'hidden';
        }
        if (this.data.div.anim && this.data.div.anim.style.visibility == 'visible') {
            this.data.div.anim.style.visibility = 'hidden';
        }
    },
    animate: {
        sv: this,
        range: 30,
        baseUrl: '',
        frames: 1,
        delay: 250,
        frame: 0,
        pauseframes: 10,
        pausestep: 0,
        state: 'stop',
        images: [],
        interval: false,
        counter: 0,
        ready: false,
        offsets: [],
        cachebust: "",
        isVisible: false,
        init: function() {
            var sv = SkyVector;
            var anim = sv.data.div.anim;
            if (!anim) {
                sv.data.div.anim = sv.ce("img");
                anim = sv.data.div.anim;
                anim.id = "sv_animframe";
                anim.className = "sv xlucent80";
                anim.style.visibility = "hidden";
                sv.data.div.slider.appendChild(anim);
            }
            this.ready = true;
        },
        reload: function(baseUrl, range, maxframes){
            //invalidate all images
            var date = new Date();
            this.cachebust = (date.getTime()/1000).toFixed(0);
            if (this.isVisible){
                this.set('same');
            }
        },
        set: function(baseUrl, range, maxframes) {
            var sv = SkyVector;
            if (!this.ready)
                this.init();
            var sameUrl = false;
            if (baseUrl == 'same') {
                sameUrl = true;
                baseUrl = this.baseUrl;
            } else {
                this.baseUrl = baseUrl;
            }
            var delta = 1;
            if (isNaN(range)) {
                range = this.range;
            } else {
                this.range = range;
            }
            if (!isNaN(maxframes)){
                if (maxframes > sv.data.maxframes){
                    this.frames = sv.data.maxframes;
                }else{
                    this.frames = maxframes;
                }
            }
            this.pauseframes = Math.ceil(500/this.delay);
            if (this.frames > 1 && range && range > (delta * this.frames)) {
                delta = range / (this.frames - 1);
            }
            if (this.state != 'play')
                range = 0;
            var itop = Math.round(sv.data.p.y - sv.data.panoffsety);
            var ileft = Math.round(sv.data.p.x - sv.data.panoffsetx);
            var iwidth = sv.data.width;
            var iheight = sv.data.height;
            for (var i = 0; i < this.frames; i++) {
                if (baseUrl) {
                    var age = Math.round(i * delta);
                    if (!this.images[i] || !this.images[i].img.complete) {
                        this.images[i] = this.createImage(i);
                    }
                    this.images[i].age = age;
                    this.images[i].setsrc(baseUrl + '&age=' + age + "&cb=" + this.cachebust, ileft, itop, iwidth, iheight);
                    if ((this.state != 'play' && i == this.frame) || (this.state == 'play' && range >= age)) {
                        this.images[i].load();
                    }
                } else {
                    if (this.images[i]){
                        this.images[i].ready = false;
                        this.images[i].active = false;
                    }
                }
            }
            if (this.interval)
                window.clearInterval(this.interval);
            if (baseUrl) {
                if (range > 0) {
                    if (this.state == 'play') {
                        this.interval = window.setInterval(SkyVector.animate.timer, this.delay);
                    }
                } else {
                    this.state = 'pause';
                }
            } else {
                this.state = 'stop';
                this.visible(false);
            }
            this.update();
        },
        play: function() {
            this.state = 'play';
            if (this.interval)
                window.clearInterval(this.interval);
            this.interval = window.setInterval(SkyVector.animate.timer, this.delay);
            if (this.frame == 0)
                this.frame = this.frames;
            this.step();
        },
        pause: function() {
            this.state = 'pause';
            if (this.interval)
                window.clearInterval(this.interval);
        },
        timer: function() {
            //var anim=SkyVector.animate;
            //anim.step(false);
            SkyVector.animate.step(false);
        },
        step: function(p_direction) {
            var sv = SkyVector;
            this.checkstates();
            var direction = 1;
            if (p_direction) {
                if (this.interval)
                    window.clearInterval(this.interval);
                direction = p_direction;
            }
            if (direction == 1) {
                if (this.frame < 1) {
                    if (!p_direction)
                        this.pausestep++;
                        if (this.pausestep <= this.pauseframes){
                            return; //pause a frame
                        }
                    this.frame = this.frames;
                }
                this.pausestep = 0; 
                this.frame--;
                while (this.frame > 0 && !this.images[this.frame] || (this.images[this.frame] && !this.images[this.frame].ready) || (this.images[this.frame] && !this.images[this.frame].active)) {
                    //skip ahead
                    this.frame--;
                }
            } else {
                this.frame++;
                if (this.frame == this.frames)
                    this.frame = 0;
            }
            if (this.images[this.frame] && this.images[this.frame].ready && this.images[this.frame].active) {
                sv.data.div.anim.src = this.images[this.frame].isrc;
                sv.data.div.anim.style.left = this.offsets[this.frame][0] + "px";
                sv.data.div.anim.style.top = this.offsets[this.frame][1] + "px";
                sv.data.div.anim.style.width = this.offsets[this.frame][2] + "px";
                sv.data.div.anim.style.height = this.offsets[this.frame][3] + "px";
                this.visible(true);
            }
            if (this.callback){
                this.callback(true);
            }
        },
        jump: function(frameIndex) {
            var sv = SkyVector;
            this.checkstates();
            if (!this.images[frameIndex].active){
                this.images[frameIndex].load();
            }
            this.frame = frameIndex;
            if (this.images[this.frame] && this.images[this.frame].ready && this.images[this.frame].active) {
                sv.data.div.anim.src = this.images[this.frame].isrc;
                sv.data.div.anim.style.left = this.offsets[this.frame][0] + "px";
                sv.data.div.anim.style.top = this.offsets[this.frame][1] + "px";
                sv.data.div.anim.style.width = this.offsets[this.frame][2] + "px";
                sv.data.div.anim.style.height = this.offsets[this.frame][3] + "px";
                this.visible(true);
            }
            if (this.callback){
                this.callback(true);
            }
        },
        visible: function(show) {
            var sv = SkyVector;
            if (sv.data.div.anim) {
                if (show) {
                    this.isVisible = true;
                    if (sv.data.div.anim.style.visibility != 'visible') {
                        sv.data.div.anim.style.visibility = 'visible';
                        sv.data.div.anim.style.top = Math.round(sv.data.p.y - sv.data.panoffsety) + "px";
                        sv.data.div.anim.style.left = Math.round(sv.data.p.x - sv.data.panoffsetx) + "px";
                    }
                } else {
                    this.isVisible = false;
                    sv.data.div.anim.style.visibility = 'hidden';
                }
            }
        },
        clear: function() {
            this.set(false);
            this.frame = 0;
        },
        checkstates: function() {
            for (var i = 0; i < this.frames; i++) {
                var img = this.images[i];
                //if(img.active && !img.ready){
                if (img.active) {
                    if (img.img.complete) {
                        img.ready = true;
                        this.offsets[i] = [img.ileft, img.itop, img.iwidth, img.iheight];
                    } else {
                        img.ready = false;
                    }
                }
            }
        },
        update: function(a) {
            var sv = SkyVector;
            this.counter++;
            var anim = sv.data.div.anim;
            if (this.state == 'stop') {
                this.visible(false);
            } else {
                if (this.images[this.frame] && this.images[this.frame].active && this.images[this.frame].ready) {
                    anim.src = this.images[this.frame].isrc;
                    anim.style.left = this.offsets[this.frame][0] + "px";
                    anim.style.top = this.offsets[this.frame][1] + "px";
                    anim.style.width = this.offsets[this.frame][2] + "px";
                    anim.style.height = this.offsets[this.frame][3] + "px";
                    this.visible(true);
                } else {
                    this.visible(false);
                }
            }
            if (this.callback){
                this.callback();
            }
        },
        createImage: function(imgid) {
            var sv = SkyVector;
            var img = {}
            img.img = sv.ce("img");
            img.ready = false;
            img.active = false;
            img.isnew = true;
            img.id = imgid;
            img.update = this.update;
            img.sv = this.sv;
            img.ileft = 0;
            img.itop = 0;
            img.iwidth = 0;
            img.iheight = 0;
            img.setsrc = function(url, ileft, itop, iwidth, iheight) {
                img.ready = false;
                img.active = false;
                if (url) {
                    if (img.src != url) {
                        img.isrc = url;
                        //img.img.src = img.isrc;
                        img.src = url;
                        img.ready = false;
                        img.ileft = ileft;
                        img.itop = itop;
                        img.iwidth = iwidth;
                        img.iheight = iheight;
                        if (this.frame == img.id) {
                            this.sv.data.div.anim.style.visibility = 'hidden';
                        }
                        if (img.isnew) {
                            img.isnew = false;
                            SkyVector.animate.offsets[img.id] = [img.ileft, img.itop, img.iwidth, img.iheight];
                        }
                    }
                }
            }
            img.load = function() {
                this.active = true;
                this.img.src = this.isrc;
                if (this.img.complete) {
                    this.ready = true;
                }
            }
            img.img.onload = function() {
                if (img.active) {
                    if (img.img.complete) {
                        img.ready = true;
                        SkyVector.animate.offsets[img.id] = [img.ileft, img.itop, img.iwidth, img.iheight];
                        SkyVector.animate.update(img.id);
                    } else {
                        img.ready = false;
                    }
                }
            }
            return img;
        }
    },
    showLayer: function(layername) {
        for (var i = 0; i < this.data.rLayers.length; i++) {
            if (this.data.rLayers[i] == layername) {
                return;
            }
        }
        this.data.rLayers.push(layername);
    },
    hideLayer: function(layername) {
        for (var i = 0; i < this.data.rLayers.length; i++) {
            if (this.data.rLayers[i] == layername) {
                this.data.rLayers.splice(i, 1);
                i = -1;
            }
        }
    },
    showPlan: function(plan) {
    },
    hidePlan: function(plan) {
    },
    passMouseEvents: function(object) {
        var sv = this;
        var lastTarget = undefined;
        var enabled = true;
        var func = function(e) {
            if (enabled && object.style.visibility != 'hidden') {
                enabled = false;
                e.stopPropagation();
                if (sv.data.div.canvas)
                    sv.data.div.canvas.style.visibility = 'hidden';
                if (sv.data.div.labels)
                    sv.data.div.labels.style.visibility = 'hidden';
                var target = document.elementFromPoint(e.pageX, e.pageY);
                if (sv.data.div.canvas)
                    sv.data.div.canvas.style.visibility = 'visible';
                if (sv.data.div.labels)
                    sv.data.div.labels.style.visibility = 'visible';
                
                if (target && target !== object) {
                    var newEvent = document.createEvent("MouseEvents");
                    var eType = e.type;
                    if (lastTarget !== target) {
                        if (e.type == 'mouseover' || e.type == 'mousemove') {
                            if (lastTarget) {
                                try {
                                    lastTarget.fireEvent('onmouseout');
                                } catch (err) {
                                }
                            }
                            eType = 'mouseover';
                        }
                    }
                    newEvent.initMouseEvent(eType, e.bubbles, e.cancelable, e.view, e.detail, e.screenX, e.screenY, 
                    e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, null)
                    target.dispatchEvent(newEvent);
                    lastTarget = target;
                } else {
                    if (lastTarget) {
                        try {
                            lastTarget.fireEvent('onmouseout');
                        } catch (err) {
                        }
                    }
                    lastTarget = undefined;
                }
                enabled = true;
            }
        }
        var eventtypes = ['mouseenter', 'mouseleave', 'mouseout', 'mousemove', 'mousedown', 'mouseup', 'mouseover', 'dblclick', 'rightclick', 'click'];
        for (var i = 0; i < eventtypes.length; i++) {
            object.addEventListener(eventtypes[i], func, false);
        }
    },
    addNS: function() {
        if (!this.data.vReady) {
            this.data.vReady = true;
            try {
                document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
            } catch (e) {
                this.data.vReady = false;
            }
            if (this.data.vReady) {
                if (this.data.vectorCache) {
                    this.shapes(this.data.vectorCache);
                    this.data.vectorCache = false;
                }
                if (this.data.plan.points && this.data.plan.points.length) {
                    this.drawPlan();
                }
            } else {
                this.data.addNSTO = window.setTimeout("SkyVector.addNS()", 100);
            }
        }
    },
    shape: {
        sv: this,
        o: 0,
        bin: [],
        extent: {},
        cache: {},
        i1: function(o) {
            var q = Math.floor(o / 4);
            var m = o % 4;
            var a = this.bin[q];
            return (a >> ((3 - m) * 8)) & 0xFF;
        },
        i4: function(o) {
            return ((((((this.i1(o + 3) & 0x7F) << 8) + this.i1(o + 2)) << 8) + this.i1(o + 1)) << 8) + this.i1(o);
        },
        dbl: function(o) {
            var h = (this.i1(o + 7) << 8) + this.i1(o + 6);
            var a = (((this.i1(o + 6) << 8) + this.i1(o + 5)) << 8) + this.i1(o + 4);
            var b = (this.i1(o + 3) << 8) + this.i1(o + 2);
            var c = (this.i1(o + 1) << 8) + this.i1(o + 0);
            var sgn = h >> 15 ? -1.0 : 1.0;
            var exp = Math.pow(2, (((h >> 4) & 0x7ff) - 1023));
            a = a & 0x0fffff | 0x100000;
            return sgn * (a / 1048576 + b / 68719476736 + c / 4503599627370496) * exp;
        },
        b64: function(encoded) {
            if (!this._base64) {
                this._base64 = {};
                var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                for (var i = 0; i < 64; i++) {
                    this._base64[a.substr(i, 1)] = i;
                }
                this._base64["="] = 0;
            }
            var out = [];
            var tmp = [];
            encoded += "====";
            var len = encoded.length;
            var offset = 0;
            for (var j = 0; j < len; j += 4) {
                var n = 0;
                var i = j;
                while (i + offset < len && !encoded.substring(i + offset, i + offset + 1).match(/[A-Za-z0-9\+\/\=]/))
                    offset++;
                n += this._base64[encoded.substring(i + offset, i + offset + 1)];
                n = n << 6;
                i++;
                while (i + offset < len && !encoded.substring(i + offset, i + offset + 1).match(/[A-Za-z0-9\+\/\=]/))
                    offset++;
                n += this._base64[encoded.substring(i + offset, i + offset + 1)];
                n = n << 6;
                i++;
                while (i + offset < len && !encoded.substring(i + offset, i + offset + 1).match(/[A-Za-z0-9\+\/\=]/))
                    offset++;
                n += this._base64[encoded.substring(i + offset, i + offset + 1)];
                n = n << 6;
                i++;
                while (i + offset < len && !encoded.substring(i + offset, i + offset + 1).match(/[A-Za-z0-9\+\/\=]/))
                    offset++;
                n += this._base64[encoded.substring(i + offset, i + offset + 1)];
                tmp.push(n >> 16 & 0xff);
                tmp.push(n >> 8 & 0xff);
                tmp.push(n & 0xff);
                if (tmp.length > 3) {
                    out.push((((((tmp.shift() << 8) + tmp.shift()) << 8) + tmp.shift()) << 8) + tmp.shift());
                }
            }
            return out;
        },
        point: function() {
            var r = [this.dbl(this.o), this.dbl(this.o + 8)];
            this.o += 16;
            if (!this.extent.minx || r[0] < this.extent.minx)
                this.extent.minx = r[0];
            if (!this.extent.maxx || r[0] > this.extent.maxx)
                this.extent.maxx = r[0];
            if (!this.extent.miny || r[1] < this.extent.miny)
                this.extent.miny = r[1];
            if (!this.extent.maxy || r[1] > this.extent.maxy)
                this.extent.maxy = r[1];
            return r;
        },
        ring: function() {
            var pts = this.i4(this.o);
            this.o += 4;
            var r = [];
            for (var i = 0; i < pts; i++) {
                r.push(this.point());
            }
            return r;
        },
        wkbPoint: function() {
            var endian = this.i1(this.o);
            if (endian != 1)
                return;
            var stype = this.i4(this.o + 1);
            if (stype != 1)
                return;
            this.o += 5;
            return this.point();
        },
        wkbLineString: function() {
            var endian = this.i1(this.o);
            if (endian != 1)
                return;
            var stype = this.i4(this.o + 1);
            if (stype != 2)
                return;
            this.o += 5;
            var pts = this.i4(this.o);
            this.o += 4;
            var r = [];
            for (var i = 0; i < pts; i++) {
                r.push(this.point());
            }
            return r;
        },
        wkbPolygon: function() {
            var endian = this.i1(this.o);
            if (endian != 1)
                return;
            var stype = this.i4(this.o + 1);
            if (stype != 3)
                return;
            this.o += 5;
            var nrings = this.i4(this.o);
            this.o += 4;
            var r = [];
            this.extent = {}
            for (var i = 0; i < nrings; i++) {
                r.push(this.ring());
            }
            return [r, {minx: this.extent.minx,maxx: this.extent.maxx,miny: this.extent.miny,maxy: this.extent.maxy}];
        },
        wkbMultiPoint: function() {
            var endian = this.i1(this.o);
            if (endian != 1)
                return;
            var stype = this.i4(this.o + 1);
            if (stype != 4)
                return;
            this.o += 5;
            var pts = this.i4(this.o);
            this.o += 4;
            var r = [];
            for (var i = 0; i < pts; i++) {
                r.push(this.wkbPoint());
            }
            return r;
        },
        wkbMultiLineString: function() {
            var endian = this.i1(this.o);
            if (endian != 1)
                return;
            var stype = this.i4(this.o + 1);
            if (stype != 5)
                return;
            this.o += 5;
            var nlines = this.i4(this.o);
            this.o += 4;
            var r = [];
            for (var i = 0; i < nlines; i++) {
                r.push(this.wkbLineString());
            }
            return r;
        },
        wkbMultiPolygon: function() {
            var endian = this.i1(this.o);
            if (endian != 1)
                return;
            var stype = this.i4(this.o + 1);
            if (stype != 6)
                return;
            this.o += 5;
            var npoly = this.i4(this.o);
            this.o += 4;
            var r = [];
            for (var i = 0; i < npoly; i++) {
                r.push(this.wkbPolygon());
            }
            return r;
        },
        parse: function(gid, raw) {
            if (this.cache && this.cache[gid])
                return this.cache[gid];
            this.bin = this.b64(raw);
            var endian = this.i1(0);
            if (endian != 1)
                return;
            var stype = this.i4(1);
            this.o = 0;
            this.extent = {};
            var s = {};
            s.type = stype;
            if (stype == 1) {
                s.shape = this.wkbPoint();
            } else if (stype == 2) {
                s.shape = this.wkbLineString();
            } else if (stype == 3) {
                s.shape = this.wkbPolygon();
            } else if (stype == 4) {
                s.shape = this.wkbMultiPoint();
            } else if (stype == 5) {
                s.shape = this.wkbMultiLineString();
            } else if (stype == 6) {
                s.shape = this.wkbMultiPolygon();
            }
            s.extent = this.extent;
            this.cache[gid] = s;
            return s;
        },
        canvas: function() {
            var sv = SkyVector;
            if (sv.data.div.canvas)
                return sv.data.div.canvas;
            if (sv.data.canvas) {
                sv.data.div.canvas = document.createElement("canvas");
                sv.passMouseEvents(sv.data.div.canvas);
                sv.data.div.canvas.className = "svcanvas";
                sv.data.div.canvas.setAttribute("width", Math.round(sv.data.width * sv.data.devicePixelRatioFn()));
                sv.data.div.canvas.setAttribute("height", Math.round(sv.data.height * sv.data.devicePixelRatioFn()));
                sv.data.div.canvas.style.width = sv.data.width + "px";
                sv.data.div.canvas.style.height = sv.data.height + "px";
                sv.data.div.slider.insertBefore(sv.data.div.canvas, sv.data.div.weather);
                var ctx = sv.data.div.canvas.getContext("2d");
                ctx.scale(sv.data.devicePixelRatioFn(), sv.data.devicePixelRatioFn());
                sv.data.canvasTranslate = [-1 * sv.data.slideroffsetx, -1 * sv.data.slideroffsety];
                ctx.translate(sv.data.canvasTranslate[0], sv.data.canvasTranslate[1]);
                sv.data.div.ctx = ctx;
                sv.moveSvgLayer(1);
            }
            return sv.data.div.canvas;
        },
        labels: function() {
            var sv = SkyVector;
            if (sv.data.div.labels)
                return sv.data.div.labels;
            if (sv.data.canvas) {
                sv.data.div.labels = document.createElement("canvas");
                sv.passMouseEvents(sv.data.div.labels);
                sv.data.div.labels.className = "svlabels";
                sv.data.div.labels.setAttribute("width", Math.round(sv.data.width * sv.data.devicePixelRatioFn()));
                sv.data.div.labels.setAttribute("height", Math.round(sv.data.height * sv.data.devicePixelRatioFn()));
                sv.data.div.labels.style.width = sv.data.width + "px";
                sv.data.div.labels.style.height = sv.data.height + "px";
                sv.data.div.slider.insertBefore(sv.data.div.labels, sv.data.div.weather);
                var ctx = sv.data.div.labels.getContext("2d");
                ctx.scale(sv.data.devicePixelRatioFn(), sv.data.devicePixelRatioFn());
                sv.data.canvasTranslateLabel = [-1 * sv.data.slideroffsetx, -1 * sv.data.slideroffsety];
                ctx.translate(sv.data.canvasTranslateLabel[0], sv.data.canvasTranslateLabel[1]);
                sv.data.div.labelctx = ctx;
                sv.moveSvgLayer(1);
            } else {
                sv.data.div.labels = sv.ce("div");
                sv.data.div.labels.className = "sv svlabels";
                sv.data.div.labels.id = "svlabels";
                sv.data.div.slider.insertBefore(sv.data.div.labels, sv.data.div.weather);
            }
            return sv.data.div.labels;
        },
        svg: function(firstload) {
            var sv = SkyVector;
            var svg;
            if (sv.data.isIE) {
                if (!sv.data.div.shapes) {
                    sv.data.div.shapes = document.createElement("div");
                    sv.data.div.shapes.id = "sv_shapes";
                    sv.data.div.slider.insertBefore(sv.data.div.shapes, sv.data.div.slider.firstChild);
                    if (firstload)
                        return false;
                }
                svg = sv.data.div.shapes;
                while (svg.firstChild) {
                    svg.removeChild(svg.firstChild);
                }
                if (sv.data.div.labels) {
                    while (sv.data.div.labels.firstChild) {
                        sv.data.div.labels.removeChild(sv.data.div.labels.firstChild);
                    }
                }
            } else {
                if (!sv.data.div.shapes) {
                    sv.addSvgLayer();
                    if (firstload)
                        return false;
                }
                svg = sv.data.div.shapes;
                
                while (svg.firstChild) {
                    svg.removeChild(svg.firstChild);
                }
                if (sv.data.div.labels) {
                    while (sv.data.div.labels.firstChild) {
                        sv.data.div.labels.removeChild(sv.data.div.labels.firstChild);
                    }
                }
                sv.moveSvgLayer();
            }
            return svg;
        }
    },
    labeltail: function(x1, y1, x2, y2) {
        if (this.data.div.shapes) {
            var svg = this.data.div.shapes;
        } else {
            return;
        }
        if (this.data.isIE) {
            var line = document.createElement("v:line");
            x1 -= this.data.slideroffsetx;
            x2 -= this.data.slideroffsetx;
            y1 -= this.data.slideroffsety;
            y2 -= this.data.slideroffsety;
            
            line.from = x1 + "," + y1;
            line.to = x2 + "," + y2;
            svg.appendChild(line);
            var stroke = this.getChild(line, "v:stroke");
            if (stroke) {
                try {
                    stroke.opacity = "0.5";
                } catch (err) {
                }
                ;
            }
            line.strokecolor = "#808080";
            line.strokeweight = "2px";
        } else {
            var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            line.setAttribute("style", "stroke-width: 2px; stroke: #AAAAAA;");
            svg.appendChild(line);
        }
    },
    label: function(gid, lat, lon, text, type, line, distance, obj) {
        if (this.data.canvas) {
            return this.labelCanvas(gid, lat, lon, text, type, line, distance, obj);
        } else {
            return this.labelHTML(gid, lat, lon, text, type, line, distance, obj);
        }
    },
    labelCanvas: function(gid, lat, lon, text, type, line, distance, obj) {
        distance = parseFloat(distance);
        var canvas = this.shape.labels();
        var ctx = this.data.div.labelctx;
        if (type == 'fuelg') {
            ctx.font = "bold 10px Verdana,sans-serif";
        } else if (type == 'fuel') {
            ctx.font = "bold 10px Verdana,sans-serif";
        } else {
            ctx.font = "bold 10px Verdana,sans-serif";
        }
        var metric = ctx.measureText(text);
        var width = metric.width + 6;
        var height = metric.height + 6;
        height = 12;
        var p = this.ll2xy(lat, lon);
        
        var pos;
        if (line) {
            pos = this.lposline(gid, p.x, p.y, width, height, text);
        } else {
            pos = this.lpos(gid, p.x, p.y, width, height, text, distance);
            if (distance > 0 && !pos) {
                pos = this.lpos(gid, p.x, p.y, width, height, text, distance * 2);
            }
            if (distance > 0 && !pos) {
                pos = this.lpos(gid, p.x, p.y, width, height, text, distance * 3);
            }
        }
        if (pos) {
            if (type == 'fuelg') {
                ctx.fillStyle = "#FFFF80";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
            } else if (type == 'pate' || type == 'nate' || type == 'ausots-a') {
                ctx.fillStyle = "#0099BB";
                ctx.strokeStyle = "#0099BB";
                ctx.lineWidth = 1;
            } else if (type == 'patw' || type == 'natw' || type == 'ausots-aw') {
                ctx.fillStyle = "#00AA88";
                ctx.strokeStyle = "#00AA88";
                ctx.lineWidth = 1;
            } else if (type == 'ausots-b') {
                ctx.fillStyle = "#BB8855";
                ctx.strokeStyle = "#BB8855";
                ctx.lineWidth = 1;
            } else if (type == 'ausots-bw') {
                ctx.fillStyle = "#FF6633";
                ctx.strokeStyle = "#FF6633";
                ctx.lineWidth = 1;
            } else if (type == 'ausots-e') {
                ctx.fillStyle = "#FF9900";
                ctx.strokeStyle = "#FF9900";
                ctx.lineWidth = 1;
            } else if (type == 'ausots-ew') {
                ctx.fillStyle = "#779900";
                ctx.strokeStyle = "#779900";
                ctx.lineWidth = 1;
            } else {
                ctx.fillStyle = "#F7F7F7";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
            }
            this.canvasRoundRect(ctx, pos.x, pos.y, width, height, 5);
            ctx.fill();
            ctx.stroke();
            if (type == 'fuelg') {
                ctx.fillStyle = "#000000";
            } else if (type == 'fuel') {
                ctx.fillStyle = "#555555";
            } else if (
            type == 'nate' || 
            type == 'natw' || 
            type == 'pate' || 
            type == 'patw' || 
            type == 'ausots-a' || 
            type == 'ausots-aw' || 
            type == 'ausots-b' || 
            type == 'ausots-bw' || 
            type == 'ausots-e' || 
            type == 'ausots-ew') {
                ctx.fillStyle = "#FFFFFF";
            }
            if (!isNaN(pos.x) && !isNaN(pos.y)) {
                ctx.fillText(text, Math.round(pos.x + 3), Math.round(pos.y + height - 2));
            }
            return [pos.x, pos.y, width, height];
        } else {
            return [-1, -1, width, height];
        }
    },
    labelHTML: function(gid, lat, lon, text, type, line, distance, obj) {
        distance = parseInt(distance);
        if (!obj) {
            obj = this.ce("div");
            obj.className = (type ? "svshape_" + type : "") + " svlabel sv_labelbg";
        }
        obj.innerHTML = text;
        obj.style.top = "0px";
        obj.style.left = "0px";
        obj.style.visibility = 'hidden';
        this.shape.labels().appendChild(obj);
        var p = this.ll2xy(lat, lon);
        
        var pos;
        if (line) {
            pos = this.lposline(gid, p.x, p.y, obj.scrollWidth, obj.scrollHeight, text);
        } else {
            pos = this.lpos(gid, p.x, p.y, obj.scrollWidth, obj.scrollHeight, text, distance);
            if (distance > 0 && !pos) {
                pos = this.lpos(gid, p.x, p.y, obj.scrollWidth, obj.scrollHeight, text, distance * 2);
            }
            if (distance > 0 && !pos) {
                pos = this.lpos(gid, p.x, p.y, obj.scrollWidth, obj.scrollHeight, text, distance * 3);
            }
        
        }
        if (pos) {
            obj.style.left = (pos.x - this.data.slideroffsetx) + "px";
            obj.style.top = (pos.y - this.data.slideroffsety) + "px";
            obj.style.visibility = 'visible';
            if (distance) {
                var linex = 0;
                var liney = 0;
                if (pos.x < p.x && pos.x + obj.scrollWidth > p.x) {
                    linex = Math.round(pos.x + obj.scrollWidth / 2);
                } else {
                    if (p.x < pos.x) {
                        linex = pos.x;
                    } else {
                        linex = pos.x + obj.scrollWidth;
                    }
                }
                if (pos.y < p.y && pos.y + obj.scrollHeight > p.y) {
                    liney = Math.round(pos.y + obj.scrollHeight / 2);
                } else {
                    if (p.y < pos.y) {
                        liney = pos.y;
                    } else {
                        liney = pos.y + obj.scrollHeight;
                    }
                }
                this.labeltail(linex, liney, p.x, p.y);
            }
        }
        return obj;
    },
    lposline: function(gid, x, y, width, height, text) {
        var sv = this;
        if (sv.draw.labelpc[gid])
            return sv.draw.labelpc[gid];
        var dupkey = x + "-" + y + "-" + text;
        if (sv.draw.labeldup[dupkey])
            return false;
        sv.draw.labeldup[dupkey] = true;
        
        var check = function(gid, minx, maxx, miny, maxy) {
            var collisions = 0;
            var len = sv.draw.labelca.length;
            for (var i = 0; i < len; i++) {
                var c = sv.draw.labelca[i];
                if (!(c[1] > maxx || c[2] < minx || c[3] > maxy || c[4] < miny || c[0] == gid)) {
                    collisions++;
                    i = len;
                }
            }
            if (collisions) {
                return false;
            } else {
                return true;
            }
        }
        var points = [];
        var s = sv.shape.cache[gid];
        
        if (s) {
            var len = s.shape.length;
            for (var i = 0; i < len; i++) {
                if (i > 0) {
                    var lon1 = s.shape[i - 1][0];
                    var lon2 = s.shape[i][0];
                    while (lon1 > sv.data.lon + 180) {
                        lon1 -= 360;
                    }
                    while (lon1 < sv.data.lon - 180) {
                        lon1 += 360;
                    }
                    while (lon2 > sv.data.lon + 180) {
                        lon2 -= 360;
                    }
                    while (lon2 < sv.data.lon - 180) {
                        lon2 += 360;
                    }
                    if (Math.abs(lon2 - lon1) > 180) {
                        break;
                    }
                }
                var p = sv.ll2xy(s.shape[i][1], s.shape[i][0]);
                points.push(p);
            }
        } else {
            return;
        }
        if (points.length < 2) {
            return;
        }
        var seglen = [];
        var linelength = 0;
        var len = points.length - 1;
        for (var i = 0; i < len; i++) {
            var l = Math.sqrt(Math.pow((points[i].x - points[i + 1].x), 2) + Math.pow((points[i].y - points[i + 1].y), 2));
            seglen[i] = l;
            linelength += l;
        }
        var pointonline = function(dist) {
            var target = dist * linelength;
            for (var i = 0; i < len; i++) {
                if (seglen[i] > target) {
                    var d = target / seglen[i];
                    var x = points[i].x + d * (points[i + 1].x - points[i].x);
                    var y = points[i].y + d * (points[i + 1].y - points[i].y);
                    return {"x": x,"y": y};
                } else {
                    target -= seglen[i];
                }
            }
        }
        for (var i = .4; i <= .6; i += .05) {
            var p = pointonline(i);
            var minx = Math.round(p.x - (width / 2));
            var maxx = Math.round(p.x + (width / 2));
            var miny = Math.round(p.y - (height / 2));
            var maxy = Math.round(p.y + (height / 2));
            if (check(gid, minx, maxx, miny, maxy)) {
                sv.draw.labelca.push([gid, minx, maxx, miny, maxy]);
                var r = {"x": minx,"y": miny};
                sv.draw.labelpc[gid] = r;
                return r;
            }
        }
    },
    lpos: function(gid, x, y, width, height, text, distance) {
        var sv = this;
        distance = distance ? parseInt(distance) : 0;
        if (sv.draw.labelpc[gid])
            return sv.draw.labelpc[gid];
        x = Math.round(x);
        y = Math.round(y);
        var dupkey = x + "-" + y + "-" + text;
        if (sv.draw.labeldup[dupkey])
            return false;
        
        var check = function(gid, minx, maxx, miny, maxy) {
            var collisions = 0;
            var len = sv.draw.labelca.length;
            for (var i = 0; i < len; i++) {
                var c = sv.draw.labelca[i];
                if (!(c[1] > maxx || c[2] < minx || c[3] > maxy || c[4] < miny || c[0] == gid)) {
                    collisions++;
                    i = len;
                }
            }
            if (collisions) {
                return false;
            } else {
                return true;
            }
        }
        var checknear = function(targetx, targety, labelx, labely) {
            var dist = Math.sqrt(Math.pow(labelx - targetx, 2) + Math.pow(labely - targety, 2));
            var len = sv.draw.distpoints.length;
            for (var i = 0; i < len; i++) {
                var p = sv.draw.distpoints[i];
                var d = Math.sqrt(Math.pow(p[0] - labelx, 2) + Math.pow(p[1] - labely, 2));
                if (dist - d > 2) {
                    return false;
                }
            }
            return true;
        }
        var n1 = false;
        var n2 = false;
        for (var i = 0; i < sv.draw.labelpoints.length; i++) {
            var diffx = Math.abs(sv.draw.labelpoints[i].x - x);
            var diffy = Math.abs(sv.draw.labelpoints[i].y - y);
            if (diffx < 2 && diffy < 2) {
                if (i > 0) {
                    n1 = sv.draw.labelpoints[i - 1];
                }
                i++;
                if (i < sv.draw.labelpoints.length) {
                    n2 = sv.draw.labelpoints[i];
                }
                break;
            }
            if (!n2) {
                n2 = n1;
                n1 = sv.draw.labelpoints[i];
                n1.dist = Math.sqrt(Math.pow(n1.x - x, 2) + Math.pow(n1.y - y, 2));
            } else {
                var xd = sv.draw.labelpoints[i].x - x;
                var yd = sv.draw.labelpoints[i].y - y;
                if (Math.abs(xd) < n2.dist && Math.abs(yd) < n2.dist) {
                    var rd = Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2));
                    if (rd < n1.dist) {
                        n2 = n1;
                        n1 = sv.draw.labelpoints[i];
                        n1.dist = rd;
                    } else if (rd < n2.dist) {
                        n2 = sv.draw.labelpoints[i];
                        n2.dist = rd;
                    }
                }
            }
        }
        var a = [50, 230, 130, 310, 180, 0, 90, 270];
        var bend = 0;
        if (n1 && n2) {
            var a1 = Math.atan2(y - n1.y, x - n1.x) * 57.295779513;
            var a2 = Math.atan2(y - n2.y, x - n2.x) * 57.295779513;
            var bend = (a1 + a2) / 2;
            if (Math.abs(a1 - a2) > 180) {
                bend += 180;
            }
            var a3 = Math.abs(bend - a1) * 2;
            while (a3 > 360) {
                a3 -= 360;
            }
            a = [bend];
            if (a3 < 185)
                a.push(bend + 180);
            for (i = 20; i <= a3; i += 20) {
                a.push(bend - i);
                a.push(bend + i);
                if (a3 - i < 180) {
                    a.push(bend - (a3 - i));
                    a.push(bend + (a3 - i));
                }
            }
        }
        
        
        var radius = 15 + width * .5 + distance;
        width += Math.round(distance / 5);
        height += Math.round(distance / 5);
        var hw = Math.round(width / 2);
        var hh = Math.round(height / 2);
        for (var i = 0; i < a.length; i++) {
            var angle = (a[i]) / 57.295779513;
            var xo = radius * Math.cos(angle);
            if (distance > 0) {
                var yo = radius * Math.sin(angle);
            } else {
                var yo = radius * Math.sin(angle) / (width / height);
            }
            var minx = Math.round(x + xo - hw);
            var maxx = Math.round(x + xo + width - hw);
            var miny = Math.round(y + yo - hh);
            var maxy = Math.round(y + yo + height - hh);
            if (check(gid, minx, maxx, miny, maxy)) {
                if (distance == 0 || checknear(x, y, x + xo, y + yo)) {
                    sv.draw.labelca.push([gid, minx, maxx, miny, maxy]);
                    var r = {"x": Math.round(minx + distance / 8),"y": Math.round(miny + distance / 6)};
                    sv.draw.labelpc[gid] = r;
                    sv.draw.labeldup[dupkey] = true;
                    if (distance > 0) {
                        sv.draw.distpoints.push([x, y]);
                    }
                    return r;
                }
            }
        }
        return false;
    },
    shapes: function(shapearray) {
        var sv = this;
        if (!shapearray)
            shapearray = [];
        var svg = this.shape.svg();
        if (this.data.vReady) {
            this.data.vExt = { // extents for vector drawing
                minx: sv.data.p.x - ((sv.data.width / 2) + 100),
                maxx: sv.data.p.x + ((sv.data.width / 2) + 100),
                miny: sv.data.p.y - ((sv.data.height / 2) + 100),
                maxy: sv.data.p.y + ((sv.data.height / 2) + 100)
            };
            if (this.data.sDraw) {
                var id = 1;
                for (var i in this.data.sDraw) {
                    var s = this.data.sDraw[i];
                    var gid = "sDraw" + id;
                    shapearray.push({t: (s.styleType ? s.styleType : 'sDraw'),"id": gid,shape: s});
                    this.shape.cache[gid] = s;
                    id++;
                }
            }
            var nowDate = new Date();
            var timenow = nowDate.getTime() - this.data.timeDelta;
            timenow /= 1000;
            for (var i in shapearray) {
                var shape = shapearray[i];
                var meta = {};
                if (shape.shape) {
                    if (shape.shape.hover)
                        meta.hover = shape.shape.hover;
                    if (shape.shape.url)
                        meta.url = shape.shape.url;
                    if (shape.shape.label)
                        meta.label = shape.shape.label;
                    if (shape.shape.distance)
                        meta.distance = shape.shape.distance;
                }
                meta.type = shape.t;
                var s = this.shape.parse(shape.id, shape.g);
                if (shape.t == 'tfr') {
                    var at = this.mkActiveTime(shape);
                    s.style = {sw: 4,s: 'red',fo: .1,f: 'red'};
                    if (!at.valid) {
                        s.style.s = '#ff6000';
                        s.style.f = '#ff6000';
                        s.style.fo = .2;
                    }
                    meta.hover = shape.n + ": " + shape.r + "<br/>Effective: " + shape.v + "<br/>From " + shape.a1 + " to " + shape.a2 + "<br/>" + at.message;
                    meta.url = shape.u;
                } else if (shape.t == 'stfr') {
                    var at = this.mkActiveTime(shape);
                    s.style = {sw: 4,s: 'red',fo: .1,f: 'red'};
                    if (!at.valid) {
                        s.style.s = '#ff6000';
                        s.style.f = '#ff6000';
                        s.style.fo = .2;
                    }
                    meta.hover = shape.d + "<br/>" + at.message;
                    meta.url = shape.u;
                } else if (shape.t == 'tfr-r') {
                    var at = this.mkActiveTime(shape);
                    s.style = {sw: 7,dash:"3 6",s: '#6196dc',fo: .2,f: '#6196dc'};
                    meta.hover = shape.n + ": " + shape.r + "<br/>Effective: " + shape.v + "<br/>From " + shape.a1 + " to " + shape.a2 + "<br/>" + at.message;
                    meta.url = shape.u;
                } else if (shape.t == 'tfr-m') {
                    var at = this.mkActiveTime(shape);
                    s.style = {sw: 7,dash:"3 6",s: '#a766a8',fo: .2,f: '#a766a8'};
                    meta.hover = shape.n + ": " + shape.r + "<br/>Effective: " + shape.v + "<br/>From " + shape.a1 + " to " + shape.a2 + "<br/>" + at.message;
                    meta.url = shape.u;
                } else if (shape.t == 'drotam'){
                    var at = this.mkActiveTime(shape);
                    meta.hover = "UAS Operating Area " + shape.n + "<br/>Effective: " + shape.v + "<br/>From " + shape.a1 + " to " + shape.a2 + "<br/>" + at.message;
                    meta.infoBox = shape.txt;
                    if (shape.sz > 2){
                        s.style = {sw: 5,s:'#6000FF'}; 
                    }else{
                        s.style = {sw: 4,s:'#6000FF',f:'#6000FF',fo:.1}; 
                    }
                } else if (shape.t == 'drotam_uasfr'){
                    meta.hover = 'UAS Operations Prohibited SFC-400AGL';
                    meta.infoBox = shape.txt;
                    s.style = {sw: 4, s: '#aa0080', f: '#aa0080', fo: .2};
                } else if (shape.t == 'multiLineLabel') {
                    s.style = {sw: 1,s: '#000000',f: '#000000'};
                    meta.label
                } else if (shape.t == 'tpp') {
                    s.style = {sw: 3,s: this.data.settings.colormap[shape.d2]};
                    meta.url = shape.u;
                    meta.hover = shape.d3;
                } else if (shape.t == 'routel') {
                    s.style = {sw: 2,s: this.data.settings.colormap[shape.d2],pr: 3,f: 'white'}
                    meta.label = shape.d1;
                } else if (shape.t == 'fs_no_fuel') {
                    s.style = {sw: 2,s: 'black',pr: 3,so: .5,f: 'white'}
                    meta.hover = shape.d2
                } else if (shape.t == 'fuel') {
                    s.style = {sw: 2,s: '#808080',pr: 3,f: '#ffffff'};
                    var price = [];
                    var price2 = undefined;
                    if (shape.p) {
                        price = this.price(shape.p, this.fboid(shape.f));
                        price2 = this.doprc(shape.op, shape.f);
                    }
                    if (price[1]) {
                        meta.label = price[1];
                    }
                    if (price[0]) {
                        meta.type = 'fuelg';
                        s.style.f = "#FFFF80";
                        s.style.s = "#444444";
                    }
                    if (shape.gp) {
                        if (shape.gl) {
                            s.style.img = this.data.images + "/fuel/glyphs/" + shape.gl + ".png";
                            s.style.iw = 14;
                            s.style.ih = 14;
                        }
                        meta.hoverclass = 'svfuelhoverg';
                        var flogo = "";
                        if (shape.b) {
                            flogo = "<img class=\"sv_fuellogo\" src=\"" + this.data.images + "/fuel/" + shape.b + ".png\"/>";
                        }
                        if (price2) {
                            meta.hover = "<div class=\"svfuelicao\">" + shape.i + "</div><div class=\"svfuelprice\">" + price2 + "</div>" + shape.n + "<br/>" + flogo;
                        } else {
                            meta.hover = "<div class=\"svfuelicao\">" + shape.i + "</div>" + shape.n + "<br/>" + flogo;
                        }
                        shape.i + " - " + shape.n;
                    } else {
                        meta.hoverclass = 'svfuelhover';
                        meta.hover = "<div class=\"svfuelicao\">" + shape.i + "</div>" + shape.n;
                    //meta.hover = shape.i + " - " + shape.n;
                    }
                    meta.url = shape.u;
                } else if (shape.t == 'fs_area') {
                    s.style = {f: 'green',fo: .09}
                } else if (shape.t == 'route') {
                    s.style = {sw: 3,s: this.data.settings.colormap[shape.d2]}
                } else if (shape.t == 'etops') {
                    s.style = {sw: 1,s: '#006400',f: '#32CD32',fo: .07};
                } else if (shape.t == 'avoid_fir') {
                    s.style = {sw: 1,s: '#B22222',f: '#B22222',fo: .07};
                    meta.label = shape.d1
                } else if (shape.t == 'etopsAirport') {
                    s.style = {sw: 2,s: '#006400',f: '#32CD32',pr: 3}
                    meta.label = shape.d1;
                } else if (shape.t == 'wfcast') {
                    sv.data.div.windForecast.innerHTML = shape.d1;
                    sv.data.div.windForecast.style.display = 'block';
                } else if (shape.t == 'windpoint') {
                    //s.style={ sw:4,s:'#000000',f:'#696969'}
                    //meta.hover = shape.d4
                    var speed = String(Math.ceil(shape.d2 / 5) * 5);
                    if (speed == '0' || shape.d1 == '360') {
                        shape.d1 = '000';
                    }
                    if (speed.length == 1) {
                        speed = "00" + speed;
                    } else if (speed.length == 2) {
                        speed = "0" + speed;
                    }
                    var direction = String(shape.d1 % 360);
                    if (direction.length == 1) {
                        direction = "00" + direction;
                    } else if (direction.length == 2) {
                        direction = "0" + direction;
                    }
                    s.style = {img: sv.data.images + "/barbs/barb" + direction + speed + ".png",iw: 59,ih: 59,barb: 1,dir: direction,spd: speed};
                } else if (shape.t == 'volcanic_ash_low') {
                    s.style = {sw: 2,s: 'blue',f: 'blue',fo: .2}
                    meta.hover = shape.d1
                    meta.url = shape.d2
                } else if (shape.t == 'volcanic_ash_medium') {
                    s.style = {sw: 2,s: 'yellow',f: 'yellow',fo: .2}
                    meta.hover = shape.d1
                    meta.url = shape.d2
                } else if (shape.t == 'volcanic_ash_high') {
                    s.style = {sw: 2,s: 'red',f: 'red',fo: .2}
                    meta.hover = shape.d1;
                    meta.url = shape.d2
                } else if (shape.t == 'nate' || shape.t == 'pate') {
                    if (shape.st == 'narthin'){
                        var width = 2000/sv.data.resolution;
                        if (width > 4) width = 4;
                        s.style = {sw: width,s: "#0099BB"}
                        meta.hover = shape.n;
                    }else if (shape.st == 'nar'){
                        s.style = {sw: 2,s: "#0099BB"}
                        meta.hover = shape.n;
                    }else{
                        s.style = {sw: 3,s: "#0099BB"}
                        if (shape.st == 'cpdlc' || shape.st == 'rlatsm') {
                            s.style.sw = 5;
                            s.style.dash = "8 4";
                        }
                        meta.label = shape.n;
                        meta.line = true;
                        meta.hover = shape.d
                        meta.infoBox = shape.txt;
                    }
                } else if (shape.t == 'natw' || shape.t == 'patw') {
                    if (shape.st == 'narthin'){
                        var width = 2000/sv.data.resolution;
                        if (width > 4) width = 4;
                        s.style = {sw: width ,s: "#00AA88"}
                        meta.hover = shape.n;
                    }else if (shape.st == 'nar'){
                        s.style = {sw: 2 ,s: "#00AA88"}
                        meta.hover = shape.n;
                    }else{
                        s.style = {sw: 3,s: "#00AA88"}
                        if (shape.st == 'cpdlc' || shape.st == 'rlatsm') {
                            s.style.dash = "8 4";
                            s.style.sw = 5;
                        }
                        meta.label = shape.n;
                        meta.line = true;
                        meta.hover = shape.d
                        meta.infoBox = shape.txt;
                    }
                } else if (shape.t == 'ausots-a') {
                    s.style = {sw: 3,s: "#0099bb"}
                    if (shape.st == 'cpdlc') {
                        s.style.dash = "8 4";
                        s.style.sw = 5;
                    } else if (shape.st == 'west') {
                        meta.type = 'ausots-aw';
                        s.style.s = "#00aa88";
                    }
                    meta.label = shape.n;
                    meta.line = true;
                    meta.hover = shape.d
                    meta.infoBox = shape.txt;
                } else if (shape.t == 'ausots-b') {
                    s.style = {sw: 3,s: "#BB8855"}
                    if (shape.st == 'cpdlc') {
                        s.style.dash = "8 4";
                        s.style.sw = 5;
                    } else if (shape.st == 'west') {
                        meta.type = 'ausots-bw';
                        s.style.s = "#FF6633";
                    }
                    meta.label = shape.n;
                    meta.line = true;
                    meta.hover = shape.d
                    meta.infoBox = shape.txt;
                
                } else if (shape.t == 'ausots-e') {
                    s.style = {sw: 3,s: "#FF9900"}
                    if (shape.st == 'cpdlc') {
                        s.style.dash = "8 4";
                        s.style.sw = 5;
                    } else if (shape.st == 'west') {
                        meta.type = 'ausots-ew';
                        s.style.s = "#779900";
                    }
                    meta.label = shape.n;
                    meta.line = true;
                    meta.hover = shape.d
                    meta.infoBox = shape.txt;
                } else if (shape.t == 'cadiz') {
                    meta.hover = shape.d;
                    meta.infoBox = shape.txt;
                    s.style = {dash: "8 4",sw: 3,so: 0.2,s: "black"};
                } else if (shape.t == 'tppl') {
                    s.style = {s: this.data.settings.colormap[shape.d2],f: 'white',sw: 2,pr: 3};
                    meta.label = shape.d1;
                    meta.url = shape.u;
                    meta.hover = shape.d3;
                } else if (shape.t && (shape.t.indexOf('am-') != -1 || shape.t.indexOf('sm-') != -1)) {
                    if (shape.sev) {
                        meta.hover = shape.sev + " " + shape.haz;
                    } else if (shape.haz) {
                        meta.hover = shape.hov;
                    }
                    meta.infoBox = shape.txt;
                    if (shape.t == 'am-tt') {
                        s.style = {s: '#008000',sw: 2,f: "#008000",fo: .1}
                    } else if (shape.t == 'am-si') {
                        s.style = {s: '#500090',sw: 2,f: "#500090",fo: .1};
                    } else if (shape.t == 'am-sm') {
                        s.style = {s: '#a000a0',sw: 2,f: "#a000a0",fo: .1};
                    } else if (shape.t == 'am-z') {
                        s.style = {s: '#00ffff',sw: 2,f: "#00ffff",fo: .1};
                    } else if (shape.t == 'am-zm') {
                        s.style = {s: '#00aaff',sw: 2,f: "#00aaff",fo: .1, dash:"15,5"};
                    } else if (shape.t == 'am-zl') {
                        s.style = {s: '#00aaff',sw: 3, dash:"15,5" };
                    } else if (shape.t == 'sm-cv') {
                        s.style = {s: '#0080ff',sw: 2,f: "#0080ff",fo: .1};
                    } else if (shape.t == 'sm-int') {
                        s.style = {s: '#0080ff',sw: 2,f: "#0080ff",fo: .1};
                        meta.hover = shape.n;
                    } else if (shape.t == 'sm-unk') {
                        s.style = {s: '#0080ff',sw: 2,f: "#0080ff",fo: .1};
                        meta.hover = shape.n;
                    } else if (shape.t == 'sm-co') {
                        s.style = {s: '#ffa000',sw: 2,f: "#ffa000",fo: .1};
                    }
                } else if (shape.t == 'fir') {
                    s.style = {s: "blue",sw: 1};
                } else if (shape.t == 'markup') {
                    if (shape.d1)
                        meta.hover = shape.d1;
                    if (shape.d2)
                        meta.label = shape.d2;
                    if (shape.u)
                        meta.url = shape.u;
                    s.style = {s: 'blue',f: 'blue',fo: 0.3};
                    if (shape.f)
                        s.style.f = shape.f;
                    if (shape.fo)
                        s.style.fo = shape.fo;
                    if (shape.s)
                        s.style.s = shape.s;
                    if (shape.so)
                        s.style.so = shape.so;
                } else if (shape.t == 'sigmet') {
                    s.style = {s: "#0080ff",sw: 3,f: "#0080ff",fo: 0.1};
                    meta.hover = shape.txt;
                    meta.url = shape.u;
                } else if (shape.t == 'pirep') {
                    s.style = {pirep:1,offset:shape.icon};
                    var nicetime = sv.niceTimeDelta(timenow-shape.time);
                    if (shape.dscr){
                        meta.hover="";
                        for (var idescr=0; idescr < shape.dscr.length; idescr++){
                            meta.hover += "<div>"+shape.dscr[idescr]+"</div>";
                        }
                        meta.hover += "<div class=\"sv_pirepage\">Reported " + nicetime + " ago.</div>";
                    }else{
                        meta.hover = "PIREP<div class=\"sv_pirepage\">Reported " + nicetime + " ago.</div>";
                    }
                    var descr = shape.txt +"\n\n";
                    descr += "<div class=\"sv_infoboxline\"><span class=\"sv_infoboxlbl\">Report Age</span><span class=\"sv_infoboxtxt\">"+nicetime+"</span></div>";
                    if (shape.ac){
                        descr += "<div class=\"sv_infoboxline\"><span class=\"sv_infoboxlbl\">Aircraft</span><span class=\"sv_infoboxtxt\">"+shape.ac;
                        if (shape.alt){
                            descr += " at " + shape.alt + "ft";
                        }
                        descr += "</span></div>";
                    }
                    if (shape.ws){
                        descr += "<div class=\"sv_infoboxline\"><span class=\"sv_infoboxlbl\">Wind</span><span class=\"sv_infoboxtxt\">"+shape.wd + "&deg; @ "+shape.ws+"kts</span></div>";
                    }
                    if (shape.tmp){
                        descr += "<div class=\"sv_infoboxline\"><span class=\"sv_infoboxlbl\">Temperature</span><span class=\"sv_infoboxtxt\">"+shape.tmp+"&deg;C</span></div>";
                    }
                    if (shape.dscr){
                        for (var idescr=0; idescr < shape.dscr.length; idescr++){
                            descr += "<div class=\"sv_infoboxline\"><span class=\"sv_infoboxlbl\">Observation</span><span class=\"sv_infoboxtxt\">"+shape.dscr[idescr]+"</span></div>";
                        }
                    }
                    if (shape.rmk){
                        descr += "<div class=\"sv_infoboxline\"><span class=\"sv_infoboxlbl\">Remark</span><span class=\"sv_infoboxtxt\">"+shape.rmk+"</span></div>";
                    }

                    meta.infoBox = descr ;
                }
                if (s) {
                    if (s.type == 6) {
                        this.draw.mpoly(svg, shape.id, s.shape, (s.style ? s.style : {f: "red",fo: 0.5}), s.extent, meta);
                    } else if (s.type == 5) {
                        this.draw.mline(svg, shape.id, s.shape, (s.style ? s.style : {s: "blue",sw: 1}), s.extent, meta);
                    } else if (s.type == 4) {
                        this.draw.mpoint(svg, shape.id, s.shape, (s.style ? s.style : {s: "blue",sw: 1}), meta);
                    } else if (s.type == 3) {
                        this.draw.poly(svg, shape.id, s.shape[0], (s.style ? s.style : {f: "green",fo: .5}), s.extent, meta);
                    } else if (s.type == 2) {
                        this.draw.line(svg, shape.id, s.shape, (s.style ? s.style : {s: "green",sw: 1}), s.extent, meta);
                    } else if (s.type == 1) {
                        this.draw.point(svg, shape.id, s.shape, (s.style ? s.style : {s: "green",sw: 1}), meta);
                    }
                }
            }
        } else {
            this.data.vectorCache = shapearray;
        }
    },
    draw: {
        sv: this,
        cache: {},
        labelcache: {},
        labelca: [],
        labelpc: {},
        labelpoints: [],
        distpoints: [],
        labeldup: {},
        point: function(svg, gid, shape, style, meta) {
            var sv = SkyVector;
            if (!style)
                style = {};
            if (!parseFloat(style.pr))
                style.pr = 4;
            if (this.cache && this.cache[gid]) {
                var path = this.cache[gid];
                svg.appendChild(path);
                this.meta(path, meta, gid, style);
                if (sv.data.isIE)
                    this.style(path, style);
            } else {
                if (sv.data.isIE) {
                    if (style.pirep){
                        var img = sv.makePirep(shape[1], shape[0], style, meta);
                        this.meta(img, meta);
                    }else if (style.img) {
                        var path = document.createElement("img");
                        var p = sv.ll2xy(shape[1], shape[0]);
                        path.style.position = "absolute";
                        path.style.width = style.iw;
                        path.style.height = style.ih;
                        path.style.top = Math.round(p.y - sv.data.slideroffsety - ((style.ih - 1) / 2));
                        path.style.left = Math.round(p.x - sv.data.slideroffsetx - ((style.iw - 1) / 2));
                        path.src = style.img;
                        svg.appendChild(path);
                        this.meta(path, meta, gid, style);
                        this.cache[gid] = path;
                    } else {
                        var path = document.createElement("v:oval");
                        var p = sv.ll2xy(shape[1], shape[0]);
                        path.style.position = "absolute";
                        path.style.top = Math.round(p.y - sv.data.slideroffsety - style.pr);
                        path.style.left = Math.round(p.x - sv.data.slideroffsetx - style.pr);
                        var pr2 = Math.round(2 * style.pr);
                        path.style.width = pr2;
                        path.style.height = pr2;
                        svg.appendChild(path);
                        this.style(path, style);
                        this.meta(path, meta, gid, style);
                        this.cache[gid] = path;
                    }
                } else {
                    if (style.barb && sv.data.canvas) {
                        sv.drawCanvasBarb(shape[1], shape[0], style.dir, style.spd);
                    } else if (style.pirep){
                        var img = sv.makePirep(shape[1], shape[0], style, meta);
                        this.meta(img, meta);
                    } else if (style.img) {
                        if (sv.data.canvas) {
                            var canvas = sv.shape.canvas();
                            var ctx = sv.data.div.ctx;
                            var p = sv.ll2xy(shape[1], shape[0]);
                            var px = Math.round(p.x - (style.iw / 2));
                            var py = Math.round(p.y - (style.ih / 2));
                            if (!sv.data.glyphCache)
                                sv.data.glyphCache = {};
                            if (!sv.data.glyphCache[style.img]) {
                                sv.data.glyphCache[style.img] = new Image();
                                sv.data.glyphCache[style.img].src = style.img;
                                if (!sv.data.glyphCache[style.img].naturalHeight) {
                                    sv.data.glyphCache[style.img].onload = function() {
                                        sv.shapes(sv.data.shapeStash);
                                    }
                                }
                            }
                            ctx.drawImage(sv.data.glyphCache[style.img], px, py, style.iw, style.ih);
                            this.metaCanvas(px, py, style.iw, style.ih, meta, gid, style);
                            sv.draw.labelca.push([gid, px, px + style.iw, py, py + style.ih]);
                            if (meta.label) {
                                var lp = sv.label(gid, shape[1], shape[0], meta.label, meta.type, meta.line, meta.distance);
                                this.metaCanvas(lp[0], lp[1], lp[2], lp[3], meta, gid, style);
                            }
                        } else {
                            var path = document.createElementNS("http://www.w3.org/2000/svg", "image");
                            path.setAttribute("width", style.iw + "px");
                            path.setAttribute("height", style.ih + "px");
                            var p = sv.ll2xy(shape[1], shape[0]);
                            path.setAttribute("x", Math.round(p.x - ((style.iw - 1) / 2)));
                            path.setAttribute("y", Math.round(p.y - ((style.ih - 1) / 2)));
                            path.setAttributeNS("http://www.w3.org/1999/xlink", "href", style.img);
                            this.meta(path, meta, gid, style);
                            if (!sv.data.forImage || (sv.data.ll1.lon < shape[0] && sv.data.ll1.lat > shape[1] && sv.data.ll2.lon > shape[0] && sv.data.ll2.lat < shape[1])) {
                                this.cache[gid] = path;
                                svg.appendChild(path);
                            }
                        }
                    } else {
                        if (sv.data.canvas) {
                            var canvas = sv.shape.canvas();
                            var ctx = sv.data.div.ctx;
                            ctx.strokeStyle = style.s;
                            ctx.lineWidth = style.sw;
                            ctx.fillStyle = style.f
                            var p = sv.ll2xy(shape[1], shape[0]);
                            ctx.beginPath()
                            ctx.arc(p.x, p.y, style.pr, 0, 6.283);
                            ctx.fill();
                            ctx.stroke();
                            this.metaCanvas(p.x - style.pr, p.y - style.pr, 2 * style.pr, 2 * style.pr, meta, gid, style);
                            var pr = style.pr + 1;
                            sv.draw.labelca.push([gid, p.x - pr, p.x + pr, p.y - pr, p.y + pr]);
                            if (meta.label) {
                                var lp = sv.label(gid, shape[1], shape[0], meta.label, meta.type, meta.line, meta.distance);
                                this.metaCanvas(lp[0], lp[1], lp[2], lp[3], meta, gid, style);
                            }
                        } else {
                            var path = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                            var p = sv.ll2xy(shape[1], shape[0]);
                            path.setAttribute("cx", p.x);
                            path.setAttribute("cy", p.y);
                            path.setAttribute("r", style.pr);
                            this.style(path, style);
                            this.meta(path, meta, gid, style);
                            if (!sv.data.forImage || (sv.data.ll1.lon < shape[0] && sv.data.ll1.lat > shape[1] && sv.data.ll2.lon > shape[0] && sv.data.ll2.lat < shape[1])) {
                                this.cache[gid] = path;
                                //alert("draw!\nll1="+sv.data.ll1.lon+","+sv.data.ll1.lat+ "\nll2="+sv.data.ll2.lon+","+sv.data.ll2.lat+"\nshape="+shape[0] +"," +shape[1]);
                                svg.appendChild(path);
                            }
                        }
                    }
                }
            }
        },
        line: function(svg, gid, shape, style, extent, meta) {
            var sv = SkyVector;
            if (this.cache && this.cache[gid]) {
                var path = this.cache[gid];
                svg.appendChild(path);
                this.meta(path, meta, gid, style);
                if (sv.data.isIE)
                    this.style(path, style);
            } else {
                if (sv.data.isIE) {
                    var path = document.createElement("v:shape");
                    var p1 = sv.ll2xy(extent.maxy, extent.minx);
                    var p2 = sv.ll2xy(extent.miny, extent.maxx);
                    if (p1.x > p2.x) {
                        var tempx = p1.x;
                        p1.x = p2.x;
                        p2.x = tempx;
                    }
                    if (p1.y > p2.y) {
                        var tempy = p1.y;
                        p2.y = p1.y;
                        p2.y = tempy;
                    }
                    p1.x = Math.round(p1.x - 10);
                    p1.y = Math.round(p1.y - 10);
                    path.style.position = "absolute";
                    path.style.top = Math.round(p1.y - sv.data.slideroffsety);
                    path.style.left = Math.round(p1.x - sv.data.slideroffsetx);
                    var width = Math.round(20 + p2.x - p1.x);
                    var height = Math.round(20 + p2.y - p1.y);
                    if (width < 0 || height < 0)
                        return;
                    path.style.width = width;
                    path.style.height = height;
                    path.coordorigin = Math.round(p1.x * 10) + " " + Math.round(p1.y * 10);
                    path.coordsize = Math.round(width * 10) + " " + Math.round(height * 10);
                    var v = 'm';
                    var npts = shape.length;
                    var lineon = false;
                    for (var i = 0; i < npts; i++) {
                        var xy = sv.ll2xy(shape[i][1], shape[i][0]);
                        sv.draw.labelpoints.push(xy);
                        var jump = false;
                        if (i + 1 < shape.length) {
                            var lon1 = shape[i][0];
                            var lon2 = shape[i + 1][0];
                            while (lon1 > sv.data.lon + 180) {
                                lon1 -= 360;
                            }
                            while (lon1 < sv.data.lon - 180) {
                                lon1 += 360;
                            }
                            while (lon2 > sv.data.lon + 180) {
                                lon2 -= 360;
                            }
                            while (lon2 < sv.data.lon - 180) {
                                lon2 += 360;
                            }
                            if (Math.abs(lon2 - lon1) > 180) {
                                jump = true;
                            }
                        }
                        v += Math.round(xy.x * 10) + "," + Math.round(xy.y * 10);
                        if (jump) {
                            v += " e m ";
                            lineon = false;
                        } else {
                            if (!lineon) {
                                v += " l ";
                                lineon = true;
                            } else if (i < (npts - 1)) {
                                v += ", ";
                            }
                        }
                    }
                    v += " e";
                    path.path = v;
                    path.stroked = "false";
                    path.filled = "false";
                    svg.appendChild(path);
                    this.style(path, style);
                    this.meta(path, meta, gid, style);
                    this.cache[gid] = path;
                } else {
                    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    var d = 'M';
                    var lineon = false;
                    for (var i = 0; i < shape.length; i++) {
                        var xy = sv.ll2xy(shape[i][1], shape[i][0]);
                        sv.draw.labelpoints.push(xy);
                        var jump = false;
                        if (i + 1 < shape.length) {
                            var lon1 = shape[i][0];
                            var lon2 = shape[i + 1][0];
                            var lat1 = shape[i][1];
                            var lat2 = shape[i + 1][1];
                            while (lon1 > sv.data.lon + 180) {
                                lon1 -= 360;
                            }
                            while (lon1 < sv.data.lon - 180) {
                                lon1 += 360;
                            }
                            while (lon2 > sv.data.lon + 180) {
                                lon2 -= 360;
                            }
                            while (lon2 < sv.data.lon - 180) {
                                lon2 += 360;
                            }
                            if (Math.abs(lon2 - lon1) > 180) {
                                jump = true;
                            }
                        }
                        if (sv.data.forImage) {
                            if (i == 0) {
                                var xy2 = sv.ll2xy(shape[i + 1][1], shape[i + 1][0]);
                                if (xy.x <= sv.data.vExt.minx && xy2.x <= sv.data.vExt.minx)
                                    xy.x = sv.data.vExt.minx;
                                if (xy.x >= sv.data.vExt.maxx && xy2.x >= sv.data.vExt.maxx)
                                    xy.x = sv.data.vExt.maxx;
                                if (xy.y <= sv.data.vExt.miny && xy2.y <= sv.data.vExt.miny)
                                    xy.y = sv.data.vExt.miny;
                                if (xy.y >= sv.data.vExt.maxy && xy2.y >= sv.data.vExt.maxy)
                                    xy.y = sv.data.vExt.maxy;
                            } else if (i == shape.length - 1) {
                                var xy2 = sv.ll2xy(shape[i - 1][1], shape[i - 1][0]);
                                if (xy.x <= sv.data.vExt.minx && xy2.x <= sv.data.vExt.minx)
                                    xy.x = sv.data.vExt.minx;
                                if (xy.x >= sv.data.vExt.maxx && xy2.x >= sv.data.vExt.maxx)
                                    xy.x = sv.data.vExt.maxx;
                                if (xy.y <= sv.data.vExt.miny && xy2.y <= sv.data.vExt.miny)
                                    xy.y = sv.data.vExt.miny;
                                if (xy.y >= sv.data.vExt.maxy && xy2.y >= sv.data.vExt.maxy)
                                    xy.y = sv.data.vExt.maxy;
                            } else {
                                var xy2 = sv.ll2xy(shape[i + 1][1], shape[i + 1][0]);
                                var xy3 = sv.ll2xy(shape[i - 1][1], shape[i - 1][0]);
                                if (xy.x <= sv.data.vExt.minx && xy2.x <= sv.data.vExt.minx && xy3.x <= sv.data.vExt.minx)
                                    xy.x = sv.data.vExt.minx;
                                if (xy.x >= sv.data.vExt.maxx && xy2.x >= sv.data.vExt.maxx && xy3.x >= sv.data.vExt.maxx)
                                    xy.x = sv.data.vExt.maxx;
                                if (xy.y <= sv.data.vExt.miny && xy2.y <= sv.data.vExt.miny && xy3.y <= sv.data.vExt.miny)
                                    xy.y = sv.data.vExt.miny;
                                if (xy.y >= sv.data.vExt.maxy && xy2.y >= sv.data.vExt.maxy && xy3.y >= sv.data.vExt.maxy)
                                    xy.y = sv.data.vExt.maxy;
                            }
                        }
                        d += xy.x + " " + xy.y;
                        if (jump) {
                            d += "M";
                            lineon = false;
                        } else {
                            if (!lineon) {
                                d += "L";
                                lineon = true;
                            } else {
                                d += " ";
                            }
                        }
                    }
                    path.setAttribute("d", d);
                    this.style(path, style);
                    this.cache[gid] = path;
                    this.meta(path, meta, gid, style);
                    svg.appendChild(path);
                }
            }
        },
        poly: function(svg, gid, shape, style, extent, meta) {
            var sv = SkyVector;
            if (this.cache && this.cache[gid]) {
                var path = this.cache[gid];
                svg.appendChild(path);
                this.meta(path, meta, gid, style);
                if (sv.data.isIE)
                    this.style(path, style);
            } else {
                if (sv.data.isIE) {
                    var path = document.createElement("v:shape");
                    var p1 = sv.ll2xy(extent.maxy, extent.minx, true);
                    var p2 = sv.ll2xy(extent.miny, extent.maxx, true);
                    p1.x = Math.round(p1.x - 10);
                    p1.y = Math.round(p1.y - 10);
                    path.style.position = "absolute";
                    path.style.top = Math.round(p1.y - sv.data.slideroffsety);
                    path.style.left = Math.round(p1.x - sv.data.slideroffsetx);
                    var width = Math.round(20 + Math.abs(p2.x - p1.x));
                    var height = Math.round(20 + Math.abs(p2.y - p1.y));
                    path.style.width = width;
                    path.style.height = height;
                    path.coordorigin = Math.round(p1.x * 10) + " " + Math.round(p1.y * 10);
                    path.coordsize = Math.round(width * 10) + " " + Math.round(height * 10);
                    var lon1 = (extent.minx + extent.maxx) / 2;
                    var shift = 0;
                    if (lon1 < sv.data.lon - 180) {
                        shift = 360;
                    } else if (lon1 > sv.data.lon + 180) {
                        shift = -360;
                    }
                    var v = '';
                    for (var i = 0; i < shape.length; i++) {
                        v += "m ";
                        var npts = shape[i].length;
                        for (var j = 0; j < npts; j++) {
                            var xy = sv.ll2xy(shape[i][j][1], shape[i][j][0] + shift, true);
                            v += Math.round(xy.x * 10) + "," + Math.round(xy.y * 10);
                            if (j == 0) {
                                v += " l ";
                            } else if (j < (npts - 1)) {
                                v += ", ";
                            }
                        }
                        v += " x";
                    }
                    v += " e";
                    path.path = v;
                    path.stroked = "false";
                    path.filled = "false";
                    svg.appendChild(path);
                    this.style(path, style);
                    this.meta(path, meta, gid, style);
                    this.cache[gid] = path;
                } else {
                    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    var d = '';
                    var lon1 = (extent.minx + extent.maxx) / 2;
                    var shift = 0;
                    if (lon1 < sv.data.lon - 180) {
                        shift = 360;
                    } else if (lon1 > sv.data.lon + 180) {
                        shift = -360;
                    }
                    for (var i = 0; i < shape.length; i++) {
                        d += "M";
                        for (var j = 0; j < shape[i].length; j++) {
                            var xy = sv.ll2xy(shape[i][j][1], shape[i][j][0] + shift, true);
                            d += xy.x + " " + xy.y;
                            if (j == 0) {
                                d += "L";
                            } else {
                                d += " ";
                            }
                        }
                        d += "z";
                    }
                    path.setAttribute("d", d);
                    this.style(path, style);
                    this.meta(path, meta, gid, style);
                    this.cache[gid] = path;
                    svg.appendChild(path);
                }
            }
        },
        mpoly: function(svg, gid, shape, style, extent, meta) {
            var mid = 1;
            for (var i = 0; i < shape.length; i++) {
                this.poly(svg, (gid + "-|" + mid), shape[i][0], style, shape[i][1], meta);
                mid++;
            }
        },
        mline: function(svg, gid, shape, style, extent, meta) {
            var id = 1;
            for (var i = 0; i < shape.length; i++) {
                this.line(svg, (gid + "-|" + id), shape[i], style, extent, meta);
                id++;
            }
        },
        mpoint: function(svg, gid, shape, style, meta) {
            var id = 1;
            for (var i = 0; i < shape.length; i++) {
                this.point(svg, (gid + "-|" + id), shape[i], style, meta);
                id++;
            }
        },
        style: function(shape, style) {
            var sv = SkyVector;
            if (sv.data.isIE) {
                if (style.f || style.fo) {
                    var fill = sv.getChild(shape, "v:fill");
                    if (style.f && fill) {
                        try {
                            fill.on = "true";
                            fill.color = style.f;
                        } catch (err) {
                        }
                        ;
                    }
                    if (style.fo && fill) {
                        try {
                            fill.opacity = style.fo;
                        } catch (err) {
                        }
                        ;
                    }
                }
                if (style.s || style.sw || style.so) {
                    var stroke = sv.getChild(shape, "v:stroke");
                    if (stroke) {
                        if (style.s || style.sw) {
                            try {
                                stroke.on = "true";
                                stroke.color = style.s;
                                stroke.weight = style.sw + "px";
                            } catch (err) {
                            }
                            ;
                        }
                        if (style.so) {
                            try {
                                stroke.opacity = style.so;
                            } catch (err) {
                            }
                            ;
                        }
                        if (style.dash) {
                            try {
                                stroke.dashstyle = style.dash;
                            } catch (err) {
                            }
                            ;
                        }
                    }
                }
            } else {
                if (style.f) {
                    shape.setAttribute("fill", style.f);
                } else {
                    shape.setAttribute("fill", "none");
                }
                if (style.fo) {
                    shape.setAttribute("fill-opacity", style.fo);
                }
                if (style.s || style.sw) {
                    shape.setAttribute("stroke", style.s);
                    shape.setAttribute("stroke-width", style.sw);
                    shape.setAttribute("stroke-linecap", "round");
                    shape.setAttribute("stroke-linejoin", "round");
                }
                if (style.so) {
                    shape.setAttribute("stroke-opacity", style.so);
                }
                if (style.dash) {
                    shape.setAttribute("stroke-dasharray", style.dash);
                    shape.setAttribute("stroke-linecap", "butt");
                    shape.setAttribute("stroke-linejoin", "butt");
                }
            }
        },
        meta: function(shape, meta, gid, style) {
            var sv = SkyVector;
            if (meta.hover) {
                var sw = false;
                if (style && style.sw) {
                    sw = style.sw;
                }
                shape.onmouseover = function(e) {
                    if (!e)
                        e = window.event;
                    sv.hover(e, meta.hover, meta.hoverclass);
                    if (sw && sw > 0) {
                        if (sv.data.isIE) {
                            var stroke = sv.getChild(shape, "v:stroke");
                            if (stroke) {
                                try {
                                    stroke.weight = (sw * 2) + "px";
                                } catch (err) {
                                }
                                ;
                            }
                        } else {
                            if (style && style.dash){
                                shape.setAttribute("stroke-dasharray", undefined);
                                shape.setAttribute("stroke-linecap", "round");
                                shape.setAttribute("stroke-linejoin", "round");
                            }else{
                                shape.setAttribute("stroke-width", sw * 2);
                            }
                        }
                    }
                }
                shape.onmouseout = function() {
                    sv.hoveroff();
                    if (sw && sw > 0) {
                        if (sv.data.isIE) {
                            var stroke = sv.getChild(shape, "v:stroke");
                            if (stroke) {
                                try {
                                    stroke.weight = sw + "px";
                                } catch (err) {
                                }
                                ;
                            }
                        } else {
                            if (style && style.dash){
                                shape.setAttribute("stroke-dasharray", style.dash);
                                shape.setAttribute("stroke-linecap", "butt");
                                shape.setAttribute("stroke-linejoin", "butt");
                            }else{
                                shape.setAttribute("stroke-width", sw);
                            }
                        }
                    }
                }
            }
            if (meta.label && sv.data.settings.labels) {
                if (!meta.lat || !meta.lon) {
                    var s;
                    if (isNaN(gid) && gid.indexOf("-|") != -1) {
                        var rootgid = gid.match(/(^.*)\-\|/);
                        s = sv.shape.cache[rootgid[1]];
                    } else {
                        s = sv.shape.cache[gid];
                    }
                    if (s.extent && s.extent.minx && s.extent.maxx && s.extent.miny && s.extent.maxy) {
                        meta.lat = (s.extent.miny + s.extent.maxy) / 2;
                        meta.lon = (s.extent.minx + s.extent.maxx) / 2;
                    } else {
                        if (isNaN(s.shape[0])) {
                            if (isNaN(s.shape[0][0])) {
                                if (isNaN(s.shape[0][0][0])) {
                                    if (isNaN(s.shape[0][0][0][0])) {
                                    //alert("no point found");
                                    } else {
                                        meta.lon = s.shape[0][0][0][0];
                                        meta.lat = s.shape[0][0][0][1];
                                    }
                                } else {
                                    meta.lon = s.shape[0][0][0];
                                    meta.lat = s.shape[0][0][1];
                                }
                            } else {
                                meta.lon = s.shape[0][0];
                                meta.lat = s.shape[0][1];
                            }
                        } else {
                            meta.lon = s.shape[0];
                            meta.lat = s.shape[1];
                        }
                    }
                }
                var obj = false;
                if (this.labelcache && this.labelcache[gid]) {
                    obj = this.labelcache[gid];
                    sv.label(gid, meta.lat, meta.lon, meta.label, meta.type, meta.line, meta.distance, obj);
                } else {
                    this.labelcache[gid] = sv.label(gid, meta.lat, meta.lon, meta.label, meta.type, meta.line, meta.distance);
                }
                if (meta.hover || meta.url) {
                    if (sv.data.canvas) {
                        var lp = this.labelcache[gid];
                        sv.draw.metaCanvas(lp[0], lp[1], lp[2], lp[3], meta, gid, style);
                    } else {
                        sv.draw.meta(this.labelcache[gid], {"hoverclass": meta.hoverclass,"hover": meta.hover,"url": meta.url,"infoBox": meta.infoBox}, {});
                    }
                }
            }
            if (meta.url) {
                shape.style.cursor = 'pointer';
                shape.onmousedown = function(e) {
                    if (!e)
                        e = window.event;
                    sv.data.shapeclickon = {"x": e.clientX,"y": e.clientY};
                }
                if (meta.url.match(/^http(s)?\:\/\//) || meta.url.match('Pdf?') || meta.url.match('FuelQuote?')) {
                    shape.onclick = function() {
                        if (sv.data.shapeclickon && !sv.data.canvasUrl)
                            window.open(meta.url, '_blank');
                    }
                } else if (meta.url.match('MapWeatherInfo')) {
                    shape.onclick = function() {
                        if (sv.data.shapeclickon && !sv.data.canvasUrl)
                            window.open(meta.url, '_blank', 'height=400,width=500,scrollbars=yes');
                    }
                } else {
                    shape.onclick = function() {
                        if (sv.data.shapeclickon && !sv.data.canvasUrl)
                            window.location = meta.url;
                    }
                }
            }
            if (meta.infoBox) {
                shape.onmousedown = function(e) {
                    if (!e)
                        e = window.event;
                    sv.data.shapeclickon = {"x": e.clientX,"y": e.clientY};
                }
                shape.style.cursor = 'pointer';
                shape.onclick = function() {
                    if (sv.data.shapeclickon)
                        sv.showInfoBox(meta.infoBox);
                }
            }
        },
        metaCanvas: function(x, y, width, height, meta, gid, style) {
            var sv = SkyVector;
            if (meta.hover || meta.url) {
                sv.data.canvasTargets.hover.push([x, y, width, height, function(e) {
                        if (!e)
                            e = window.event;
                        if (meta.hover)
                            sv.hover(e, meta.hover, meta.hoverclass);
                        if (meta.url) {
                            sv.data.canvasUrl = meta.url;
                            sv.data.div.chart.style.cursor = 'pointer';
                        }
                        if (meta.infoBox) {
                            sv.data.canvasInfoBox = meta.infoBox;
                            sv.data.div.chart.style.cursor = 'pointer';
                        }
                    }, 
                    function(e) {
                        sv.hoveroff();
                        sv.data.canvasUrl = undefined;
                        sv.data.canvasInfoBox = undefined;
                        sv.data.div.chart.style.cursor = 'auto';
                    }]);
            }
        }
    },
    sDraw: function(shapelist) {
        try {
            if (shapelist) {
                for (var i = 0; i < shapelist.length; i++) {
                    var s = shapelist[i];
                    var extent = new Object;
                    if (s.type == 6) {
                        for (var j = 0; j < s.shape.length; j++) {
                            extent = {};
                            for (var k = 0; k < s.shape[j].length; k++) {
                                for (var l = 0; l < s.shape[j][k].length; l++) {
                                    var p = s.shape[j][k][l];
                                    if (!extent.minx || p[0] < extent.minx)
                                        extent.minx = p[0];
                                    if (!extent.maxx || p[0] > extent.maxx)
                                        extent.maxx = p[0];
                                    if (!extent.miny || p[1] < extent.miny)
                                        extent.miny = p[1];
                                    if (!extent.maxy || p[1] > extent.maxy)
                                        extent.maxy = p[1];
                                }
                            }
                            s.shape[j] = [s.shape[j], extent]; //add extent to polygon
                        }
                    } else if (s.type == 3 || s.type == 5) {
                        for (var j = 0; j < s.shape.length; j++) {
                            for (var k = 0; k < s.shape[j].length; k++) {
                                var p = s.shape[j][k];
                                if (!extent.minx || p[0] < extent.minx)
                                    extent.minx = p[0];
                                if (!extent.maxx || p[0] > extent.maxx)
                                    extent.maxx = p[0];
                                if (!extent.miny || p[1] < extent.miny)
                                    extent.miny = p[1];
                                if (!extent.maxy || p[1] > extent.maxy)
                                    extent.maxy = p[1];
                            }
                        }
                        if (s.type == 3) {
                            s.shape = [s.shape, extent]; //add extent to polygon
                        }
                    } else if (s.type == 2) {
                        for (var j = 0; j < s.shape.length; j++) {
                            var p = s.shape[j];
                            if (!extent.minx || p[0] < extent.minx)
                                extent.minx = p[0];
                            if (!extent.maxx || p[0] > extent.maxx)
                                extent.maxx = p[0];
                            if (!extent.miny || p[1] < extent.miny)
                                extent.miny = p[1];
                            if (!extent.maxy || p[1] > extent.maxy)
                                extent.maxy = p[1];
                        }
                    }
                    shapelist[i].extent = extent;
                }
                this.data.sDraw = shapelist;
                if ((this.data.protoid > 0) && (this.data.proj.data))
                    this.shapes([]);
            } else {
                this.data.sDraw = false;
                if ((this.data.protoid > 0) && (this.data.proj.data))
                    this.shapes([]);
            }
        } catch (err) {
        }
        ;
    },
    mod: function(a, b) {
        var c = a % b;
        if (c < 0)
            c += b;
        return c;
    },
    resetZoomer: function(blank) {
        var sv = SkyVector;
        sv.data.div.zoomer.style.zIndex = 0;
        sv.data.div.zoomer.style.transition = '';

        if (blank) {
            sv.data.div.zoomer.style.visibility = "hidden";
            //sv.data.div.zoomer.style.transform = 'matrix(1,0,0,1,0,0)';
            sv.data.div.zoomer.style.transform = 'none';
        }
    },
    orient: function() {
        var sv = SkyVector;
        if (window.orientation != sv.data.orientation) {
            sv.data.orientation = window.orientation;
            sv.data.div.chart.style.width = "auto";
            sv.data.div.chart.style.height = "auto";
            window.setTimeout(sv.buildTiles, 500);
        }
    },
    resize: function() {
        var sv = SkyVector;
        var co = sv.getPos(sv.data.div.chart);
        sv.data.mouse.ox = co.x;
        sv.data.mouse.oy = co.y;
        sv.data.tilesize = 0;
        window.setTimeout(sv.buildTiles, 100);
    },
    showHideTimeLocation: function(){
        if (this.data.div.chart.clientWidth < 700){
            if (this.data.div.tbll){
                this.data.div.tbll.style.display = "none";
            }
            if (this.data.div.tbtime){
                this.data.div.tbtime.style.display = "none";
            }
        }else{
            if (this.data.div.tbll){
                this.data.div.tbll.style.display = "list-item";
            }
            if (this.data.div.tbtime){
                this.data.div.tbtime.style.display = "list-item";
            }
        }
    },
    getChild: function(obj, childName) {
        if (obj && obj.getElementsByTagName && childName) {
            var shortName = childName.replace(/^v\:/, "");
            var children = obj.getElementsByTagName(shortName);
            if (children && children.length) {
                return children[0];
            } else {
                var child = document.createElement(childName);
                obj.appendChild(child);
                return child;
            }
        }
    },
    getByte: function(bin, offset) {
        var q = Math.floor(offset / 4);
        var m = offset % 4;
        var a = bin[q];
        return (a >> ((3 - m) * 8)) & 0xFF;
    },
    getLetter: function(a) {
        if (!this.data.lettermap) {
            var b = " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            this.data.lettermap = new Array;
            for (var i = 0; i < 39; i++) {
                this.data.lettermap[i] = b.substr(i, 1);
            }
        }
        var retval = this.data.lettermap[a];
        return retval;
    },
    locationKey: function(lat, lon) {
        return Math.floor((lon + 180) / 2) * 90 + Math.floor((lat + 90) / 2);
    },
    editRoute: function(routeid, routename) {
        var sv = this;
        sv.disablePrint();
        //sv.throbber(true,'editRoute');
        this.data.origCustomValue = false;
        if (routename == 'Custom') {
            try {
                if (window.opener && window.opener.document) {
                    var fplCustom = window.opener.document.getElementById('Route');
                    if (fplCustom) {
                        this.data.origCustomValue = fplCustom.value;
                    }
                }
            } catch (e) {
            }
        }
        this.importWaypointsMessage();
        var r = sv.request(sv.data.perldir + "/editPlan" + sv.mkQS({"getTable": 1,"routeid": routeid,"chart": sv.data.protoid,"orig_apt": sv.param('origin'),"dest_apt": sv.param('destination')}));
        r.onerror = function() {
            alert("ajax error");
            sv.throbber(false, 'editRoute');
            sv.finishImport();
        }
        r.onload = function(data) {
            sv.data.pointstatus = 0;
            sv.data.numpoints = data.numpoints;
            sv.data.FPL = data.FPL;
            sv.importWaypointsProgress();
            sv.data.pointraw = sv.shape.b64(data.points);
            if (!sv.data.waypointTable) {
                sv.data.waypointTable = [];
                sv.data.waypointTableIndex = {};
            }
            window.setTimeout(SkyVector.doImportWaypoints, 100);
        //sv.throbber(false,'editRoute');
        }
    },
    savePoint: function(type, icao, ident, lat, lon) {
        var sv = this;
        var intable = false;
        if (sv.data.waypointTableIndex[ident]) {
            var ix = sv.data.waypointTableIndex[ident];
            for (var i = 0; i < ix.length; i++) {
                var hit = ix[i];
                if (hit.type == type && hit.icao == icao) {
                    intable = true;
                }
            }
        }
        if (!intable) {
            var locKey = sv.locationKey(lat, lon);
            if (!sv.data.waypointTable[locKey]) {
                sv.data.waypointTable[locKey] = new Array({"type": type,"icao": icao,"ident": ident,"lat": lat,"lon": lon});
            } else {
                sv.data.waypointTable[locKey].push({"type": type,"icao": icao,"ident": ident,"lat": lat,"lon": lon});
            }
            if (!sv.data.waypointTableIndex[ident]) {
                sv.data.waypointTableIndex[ident] = new Array(sv.data.waypointTable[locKey][sv.data.waypointTable[locKey].length - 1]);
            } else {
                sv.data.waypointTableIndex[ident].push(sv.data.waypointTable[locKey][sv.data.waypointTable[locKey].length - 1]);
            }
        }
    },
    importWaypoints: function(istart, count) {
        for (var i = istart; i <= istart + count; i++) {
            var start = (i - 1) * 10;
            var b1 = this.getByte(this.data.pointraw, start);
            var l1 = this.getLetter((b1 & 31) + 10);
            var type = (b1 & 224) >> 5;
            var num = 0;
            for (var j = 1; j < 5; j++) {
                num = num * 256 + this.getByte(this.data.pointraw, start + j);
            }
            var part2 = "";
            while (num > 0) {
                var a = num % 38
                part2 = this.getLetter(a) + part2;
                num = (num - a) / 38;
            }
            var text = l1 + part2;
            var icao = text.substr(0, 2);
            var ident = text.substr(2);
            try {
                ident = ident.trim(); // kinda newish
            } catch (e) {
                var si = ident.indexOf(" ");
                if (si != -1) {
                    ident = ident.substr(0, si);
                }
            }
            var xi = 0;
            var yi = 0;
            for (var j = 0; j <= 5; j++) {
                var b = this.getByte(this.data.pointraw, start + 5 + j);
                for (var k = 0; k < 4; k++) {
                    var power = 20 - ((4 * j) + k + 1);
                    var shft = 7 - (2 * k);
                    var xbit = (b & (1 << shft)) >> shft;
                    shft--;
                    var ybit = (b & (1 << shft)) >> shft;
                    ybit = xbit ^ ybit;
                    xi += xbit * Math.pow(2, power);
                    yi += ybit * Math.pow(2, power);
                }
            }
            var x = (xi * 40075016.685578486 / (Math.pow(2, 20) - 1)) - 20037508.342789243;
            var y = (yi * 40075016.685578486 / (Math.pow(2, 20) - 1)) - 20037508.342789243;
            var lon = x / 111319.490793273572;
            var lat = (1.570796326794897 - 2 * Math.atan(Math.exp(y / 6378137.0))) * -57.29577951308232;
            this.savePoint(type, icao, ident, lat, lon);
        }
    },
    finishImport: function() {
        //this.data.div.importDialog.div.style.visibility="hidden";
        this.data.pointstatus = 0;
        this.data.numpoints = 0;
        this.data.pointraw = [];
        this.loadPlan();
        this.data.dontClose = false;
        window.setTimeout(SkyVector.hideImportWaypointsMessage, 1000);
        //turn off routes
        this.data.div.settings.div.style.visibility = "hidden";
    //switch to Hi?
    },
    doImportWaypoints: function() {
        //called on a timer, import a batch at a time
        //and update progress bar
        var sv = SkyVector;
        if (sv.data.pointstatus < sv.data.numpoints) {
            var count = 500;
            if (sv.data.pointstatus + count > sv.data.numpoints) {
                count = sv.data.numpoints - sv.data.pointstatus;
                sv.importWaypoints(sv.data.pointstatus, count);
                sv.data.pointstatus += count;
                sv.importWaypointsProgress();
                sv.finishImport();
            } else {
                sv.importWaypoints(sv.data.pointstatus, count);
                sv.data.pointstatus += count;
                sv.importWaypointsProgress();
                window.setTimeout(SkyVector.doImportWaypoints, 20);
            }
        } else {
            sv.finishImport();
        }
    },
    importWaypointsProgress: function() {
        this.data.div.progressbar.style.width = Math.round(20 + (80 * this.data.pointstatus / this.data.numpoints)) + "%";
        this.data.div.progressmsg.innerHTML = this.data.pointstatus + " of " + this.data.numpoints + " waypoints loaded.";
    },
    hideImportWaypointsMessage: function() {
        var sv = SkyVector;
        sv.data.div.importDialog.div.style.visibility = "hidden";
    },
    importWaypointsMessage: function() {
        if (this.data.div.importDialog) {
            var p = this.data.div.importDialog;
        } else {
            this.data.div.importDialog = new Object;
            p = this.data.div.importDialog;
            p.div = this.ce("div");
            p.div.id = "sv_importdialog";
            p.div.appendChild(document.createTextNode("Loading Waypoints Table"));
            p.bar = this.ce("div");
            p.bar.id = "sv_progressbarholder";
            p.div.appendChild(p.bar);
            this.data.div.progressbar = this.ce("div");
            this.data.div.progressbar.id = "sv_progressbar";
            p.bar.appendChild(this.data.div.progressbar);
            this.data.div.progressmsg = this.ce("div");
            this.data.div.progressmsg.id = "sv_progressmsg";
            p.div.appendChild(this.data.div.progressmsg);
            this.data.div.chart.appendChild(p.div);
        }
        p.div.style.top = Math.round(-30 + this.data.height / 2) + "px";
        p.div.style.left = Math.round(-200 + this.data.width / 2) + "px";
        this.data.div.progressmsg.innerHTML = 'Downloading...';
        this.data.div.progressbar.style.width = "1%";
        p.div.style.visibility = "visible";
    },
    getSnap: function(lat, lon) {
        var locKey = this.locationKey(lat, lon);
        var minlon = Math.floor(lon / 2) * 2 - .01;
        var maxlon = Math.ceil(lon / 2) * 2 + .01;
        var minlat = Math.floor(lat / 2) * 2 - .01;
        var maxlat = Math.ceil(lat / 2) * 2 + .01;
        if (minlon < -180)
            minlon += 360;
        if (minlon > 180)
            minlon -= 360;
        if (maxlon < -180)
            maxlon += 360;
        if (maxlon > 180)
            maxlon -= 360;
        var neighbors = [[lat, minlon], [minlat, minlon], [minlat, lon], [minlat, maxlon], [lat, maxlon], [maxlat, maxlon], [maxlat, lon], [maxlat, minlon]];
        var winner = this.getSnapKey(lat, lon, locKey);
        for (var i = 0; i < 8; i++) {
            var dist = this.gcDist(neighbors[i][0], neighbors[i][1], lat, lon);
            if (dist < winner.dist) {
                var candidate = this.getSnapKey(lat, lon, this.locationKey(neighbors[i][0], neighbors[i][1]));
                if (candidate.dist < winner.dist) {
                    winner = candidate;
                }
            }
        }
        return winner.point;
    },
    getSnapKey: function(lat, lon, locKey) {
        var winner;
        var mindist = 9999999;
        if (this.data.waypointTable && this.data.waypointTable[locKey]) {
            for (var i = 0; i < this.data.waypointTable[locKey].length; i++) {
                var candidate = this.data.waypointTable[locKey][i];
                var dist = this.gcDist(lat, lon, candidate.lat, candidate.lon);
                if (!winner || dist < mindist) {
                    winner = candidate;
                    mindist = dist;
                }
            }
        }
        return {"point": winner,"dist": mindist};
    },
    gcDist: function(lat1, lon1, lat2, lon2) {
        lat1 *= this.data.proj.deg2rad;
        lon1 *= this.data.proj.deg2rad;
        lat2 *= this.data.proj.deg2rad;
        lon2 *= this.data.proj.deg2rad;
        var dist = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        dist *= 6370986; //postgis sphere
        //dist*=6371000; //FAI sphere
        return dist;
    },
    planDist: function(snapIx, snapPoint, ispoint) {
        var dist = 0.0;
        if (this.data.FPL && this.data.FPL.length) {
            var lastpoint = this.lookupWaypoint(this.data.FPL[0]);
            for (var i = 1; i < this.data.FPL.length; i++) {
                for (var j = 0; j < this.data.FPL[i].route.length; j++) {
                    var point = this.lookupWaypoint(this.data.FPL[i].route[j]);
                    if (point) {
                        dist += this.gcDist(lastpoint.lat, lastpoint.lon, point.lat, point.lon)
                        lastpoint = point;
                    }
                }
            }
        }
        return dist;
    },
    showSnap: function(showhide) {
        if (showhide) {
            var panx = 0;
            var pany = 0;
            if (this.data.mouse.x > this.data.width - 30) {
                panx = 10;
            }
            if (this.data.mouse.x < 30) {
                panx = -10;
            }
            if (this.data.mouse.y < 50) {
                pany = -10;
            }
            if (this.data.mouse.y > this.data.height - 30) {
                pany = 10;
            }
            if (panx != 0 || pany != 0) {
                this.data.p.x += panx;
                this.data.p.y += pany;
                this.pan();
                return;
            }
            var x = this.data.p.x + this.data.mouse.x - this.data.width / 2;
            var y = this.data.p.y + this.data.mouse.y - this.data.height / 2;
            var p = this.xy2ll(x, y);
            p.lon = this.lmod(p.lon);
            var point = this.getSnap(p.lat, p.lon);
            if (point) {
                if (!this.data.div.snapIcon) {
                    this.data.div.snapIcon = this.ce("img");
                    this.data.div.snapIcon.className = "sv_snapIcon";
                    this.data.div.snapIcon.src = this.data.images + "/snappoint.png";
                    this.data.div.slider.appendChild(this.data.div.snapIcon);
                    this.data.div.snapLabel = this.ce("div");
                    this.data.div.snapLabel.className = "sv_snapLabel"; // sv_xlback";
                    this.data.div.slider.appendChild(this.data.div.snapLabel);
                }
                var p = this.ll2xy(point.lat, point.lon);
                this.data.div.snapIcon.style.left = Math.round(p.x - this.data.slideroffsetx - 8) + "px";
                this.data.div.snapIcon.style.top = Math.round(p.y - this.data.slideroffsety - 7) + "px";
                this.data.div.snapLabel.style.left = Math.round(p.x - this.data.slideroffsetx + 12) + "px";
                this.data.div.snapLabel.style.top = Math.round(p.y - this.data.slideroffsety - 5) + "px";
                this.data.div.snapLabel.innerHTML = point.ident;
                this.data.div.snapIcon.style.display = "block";
                this.data.div.snapLabel.style.backgroundPosition = "2px " + (-2 - 20 * point.type) + "px";
                this.data.div.snapLabel.style.display = "inline-block";
                return {"x": p.x,"y": p.y,"id": point.ident,"icao": point.icao,"t": point.type,"lat": point.lat,"lon": point.lon};
            }
        } else {
            if (this.data.div.snapIcon) {
                this.data.div.snapIcon.style.display = "none";
                this.data.div.snapLabel.style.display = "none";
            }
        }
    },
    loadPlan: function(redoundo, planver) {
        this.draw.cache = {};
        this.draw.labelca = [];
        this.draw.labelpc = {};
        this.draw.labelpoints = [];
        this.draw.distpoints = [];
        this.draw.labeldup = {};
        if (this.data.plan.points) {
            for (var i = 0; i < this.data.plan.points.lenght; i++) {
                var gid = "planpt-" + i;
                if (this.draw.labelcache && this.draw.labelcache[gid]) {
                    obj = this.draw.labelcache[gid];
                    try {
                        this.data.div.labels.removeChild(obj);
                    } catch (e) {
                    }
                
                }
            }
        }
        //if (redoundo) {
        //    this.data.FPL = this.copyPlan(this.data.FPLhist[planver]);
        //    this.data.planver = planver;
        //} else {
        //    this.backupPlan();
        //}
        var FPL = this.data.FPL;
        this.showPlanEdit(FPL);
        //if (FPL && FPL.tempInfo && (FPL.tempInfo.setAlt || FPL.tempInfo.setETD)){
        if (FPL && ((FPL.alt && !this.data.prefs.cloudAltitude) || (FPL.tempInfo &&  (FPL.tempInfo.setAlt || FPL.tempInfo.setETD)))  ){
            var cloudAlt = this.data.prefs.cloudAltitude;
            this.setWindFromFPL(FPL);
            if (cloudAlt != this.data.prefs.cloudAltitude){
                this.datalayer();
            }
        }
        this.data.plan.points = [];
        this.data.div.zfpl.style.right = FPL && FPL.route && FPL.route.length ? null : '-666px';
        this.data.div.mapCredit.div.style.right = FPL && FPL.route && FPL.route.length ? '200px' : null;
        if (FPL && FPL.route && FPL.route.length) {
            for (var i = 0; i < FPL.route.length; i++) {
                var point = FPL.route[i];
                    var route = [[point.lat, point.lon]];
                    if (i < FPL.route.length - 1) {
                        var nextpoint = FPL.route[i + 1];
                        if (nextpoint.route && nextpoint.route.length){
                            for (var j = 1; j < nextpoint.route.length; j++) {
                                route.push([nextpoint.route[j].lat, nextpoint.route[j].lon]);
                            }
                            var lp = route[route.length-1];
                            if (lp[0] != nextpoint.lat || lp[1] != nextpoint.lon){
                                route.push([nextpoint.lat,nextpoint.lon]);
                            }
                        }else{
                            route.push([nextpoint.lat,nextpoint.lon]);
                        }
                    } else {
                    }
                    // add great circle arcs
                    var route2 = [];
                    for (var j = 0; j < route.length - 1; j++) {
                        var newpts = this.gcArc(route[j][0], route[j][1], route[j + 1][0], route[j + 1][1]);
                        route2.push([route[j][0], route[j][1]]);
                        if (newpts) {
                            for (var k = 0; k < newpts.length; k++) {
                                route2.push([newpts[k][0], newpts[k][1]]);
                            }
                        }
                    //route2.push(route[j+1]);
                    }
                    route2.shift(); //remove first point
                    //route2.pop(); //remove last point
                    
                    point.lineid = this.data.plan.points.length - 1;
                    this.data.plan.points.push({
                        "ix": point.pe,
                        "id": point.id,
                        "ic": point.icao,
                        "type": point.type,
                        "lat": point.lat,
                        "lon": point.lon,
                        "line": route2,
                        "dst": point.dst,
                        "mh": point.mh});

            }
        }
        //this.datalayer();
        this.drawPlan();
        this.getRoutes();
    },
    getRoutes: function(){
        var sv=this;
        var FPL = this.data.FPL;
        if (FPL.dep && FPL.dst && FPL.dep.ident != FPL.dst.ident){
            if (
                (FPL.dep.ident != this.data.routeData.orig || 
                 FPL.dst.ident != this.data.routeData.dest ||
                 FPL.speed != this.data.routeData.spd ||
                 FPL.eddz != this.data.routeData.eddz ||
                 FPL.etdz != this.data.routeData.etdz ||
                 FPL.alt != this.data.routeData.alt)) 
            {
                this.data.routeData.orig = FPL.dep.ident;
                this.data.routeData.dest = FPL.dst.ident;
                this.data.routeData.spd = FPL.speed;
                this.data.routeData.eddz = FPL.eddz;
                this.data.routeData.etdz = FPL.etdz;
                this.data.routeData.alt = FPL.alt;
                var q = { 
                    dep: FPL.dep.ident,
                    dst: FPL.dst.ident,
                    alt: FPL.alt
                }
                sv.routeLinkState('spinning');
                var r = sv.request(sv.data.perldir + "/routes" + sv.mkQS(q));
                r.onload = function(data) {
                    sv.loadRoutes(data);
                }
            }
        }else{
            this.data.routeData = {
                orig: undefined,
                dest: undefined,
                eddz: undefined,
                etdz: undefined,
                alt: undefined,
                spd: undefined,
                tail: undefined
            };
            sv.routeLinkState('disabled');
        }
    },
    hideRoutes: function() {
        if (this.data.div.planEdit.routeMask) {
            this.data.div.planEdit.div.removeChild(this.data.div.planEdit.routeMask);
            delete this.data.div.planEdit.routeMask;
        }
        this.data.div.planEdit.routeList.style.height = '0px';
        this.data.div.planEdit.routeList.className = "svfpl_routeList";
    },
    loadRoutes: function(data) {
        var sv = this;
        if (data && data.length){
            this.routeLinkState('enabled');
            var p = this.data.div.planEdit.routeList;
            this.data.div.planEdit.routeListCount = data.length;
            while(p.firstChild){
                p.removeChild(p.firstChild);
            }
            var makeLabel = function(text,className){
                var l = sv.ce("span",className);
                l.appendChild(document.createTextNode(text));
                return l;
            }
            for (var i=0; i < data.length; i++){
                (function(){
                    var row = sv.ce("div","svfpl_routeEntry");
                    if (i % 2){
                        row.style.backgroundColor = "#f0f8ff";
                    }
                    var strip = sv.ce("div","svfpl_routeStrip");
                    var stripInner = sv.ce("div","svfpl_routeStripInner");
                    var size = Math.round(1000/data[i].route.length) ;
                    if (size > 12) size= 12;
                    stripInner.style.fontSize = size + "px";
                    stripInner.appendChild(document.createTextNode(data[i].route));
                    strip.appendChild(stripInner);
                    row.appendChild(strip);
                    var totals = sv.ce("div","svfpl_routeTotals");
                    if (i == 0 && data.length > 1){
                        var leaficon = sv.ce("span","svfpl_routeEntryIcon fa fa-leaf");
                        leaficon.style.color = "green";
                        leaficon.setAttribute("title","Most Efficient Route.");
                        totals.appendChild(leaficon);
                    }
                    if (data[i].asd){
                        if (parseInt(data[i].age) < 3){
                            var timeicon = sv.ce("span","svfpl_routeEntryIcon fa fa-clock-o");
                            timeicon.setAttribute("title","Cleared " + data[i].age + " days ago.");
                            totals.appendChild(timeicon);
                        }
                        if (data[i].count > 3){
                            var hearticon = sv.ce("span","svfpl_routeEntryIcon fa fa-heart");
                            hearticon.style.color = "red";
                            hearticon.setAttribute("title","Cleared " + data[i].count + " times.");
                            totals.appendChild(hearticon);
                        }
                    }
                    if (data[i].pfr){
                        var gavelicon = sv.ce("span","svfpl_routeEntryIcon fa fa-gavel");
                        gavelicon.style.color = "blue";
                        gavelicon.setAttribute("title","ATC Preferred Route. " + data[i].altitude +" "+ data[i].hours +" "+ data[i].limits );
                        totals.appendChild(gavelicon);
                    }
                    totals.appendChild(makeLabel("Dist:","svfpl_routeLabel"));
                    totals.appendChild(makeLabel(data[i].dist,"svfpl_routeTotal"));
                    totals.appendChild(makeLabel("ETE:","svfpl_routeLabel"));
                    totals.appendChild(makeLabel(data[i].ete,"svfpl_routeTotal"));
                    totals.appendChild(makeLabel("Burn:","svfpl_routeLabel"));
                    totals.appendChild(makeLabel(data[i].burn,"svfpl_routeTotal"));
                    row.appendChild(totals);
                    p.appendChild(row);
                    var route = data[i].route;
                    row.onclick = function() {
                        sv.hideRoutes();
                        sv.fpl({"cmd":"route","route":route});
                    }
                })();
            }
        }else{
            this.routeLinkState('disabled');
        }
    },
    showRoutes: function() {
        var sv = this;
        if (this.data.div.planEdit.routeLinkEnabled){
            this.data.div.planEdit.routeList.className = "svfpl_routeList svfpl_routeListOpen";
            this.data.div.planEdit.routeList.style.height = (this.data.div.planEdit.routeListCount * 44) + "px";
            this.data.div.planEdit.routeList.style.visibility = 'visible';
            this.data.div.planEdit.routeMask = this.ce("div","svfpl_routemask");
            this.data.div.planEdit.div.appendChild(this.data.div.planEdit.routeMask);
            this.data.div.planEdit.routeMask.onclick = function(){
                sv.hideRoutes();
            }
        }
    },
    routeLinkState: function(state){
        if (state == 'disabled'){
            this.data.div.planEdit.routeLinkEnabled = false;
            this.data.div.planEdit.routeLink.style.cursor = 'auto';
            this.data.div.planEdit.routeLink.style.color = '#888';
            this.data.div.planEdit.routeIcon.style.color = '#888';
            this.data.div.planEdit.routeIcon.style.display = 'inline';
            this.data.div.planEdit.routeSpinner.style.display = 'none';
        }else if (state == 'spinning'){
            this.data.div.planEdit.routeLinkEnabled = false;
            this.data.div.planEdit.routeLink.style.cursor = 'auto';
            this.data.div.planEdit.routeLink.style.color = '#888';
            this.data.div.planEdit.routeIcon.style.color = '#888';
            this.data.div.planEdit.routeIcon.style.display = 'none';
            this.data.div.planEdit.routeSpinner.style.display = 'inline';
        }else{
            this.data.div.planEdit.routeLinkEnabled = true;
            this.data.div.planEdit.routeLink.style.cursor = 'pointer';
            this.data.div.planEdit.routeLink.style.color = '#000';
            this.data.div.planEdit.routeIcon.style.display = 'inline';
            this.data.div.planEdit.routeIcon.style.color = '#1b5b8c';
            this.data.div.planEdit.routeSpinner.style.display = 'none';
        }
    },
    lookupWaypoint: function(point) {
        var ix = this.data.waypointTableIndex[point.id];
        if (ix) {
            for (var i = 0; i < ix.length; i++) {
                if (ix[i].icao == point.icao && this.typemap(ix[i].type) == point.t.substr(0, 1)) {
                    return {"lat": ix[i].lat,"lon": ix[i].lon,"t": ix[i].type};
                }
            }
        }
        return false;
    },
    typemap: function(itype) {
        if (itype == 0) {
            return 'E';
        } else if (itype == 1) {
            return 'E';
        } else if (itype == 2) {
            return 'N';
        } else if (itype == 7) {
            return 'A';
        } else {
            return 'V';
        }
    },
    doprc: function(b, O) {
        var C = ((O & 255) * 16777216) + ((O & 65280) * 256) + ((O & 4080) * 16) + ((O & 1044480) / 4096);
        var c = (b ^ C) & 1;
        var d = ((b ^ C) & 14) >> 1;
        var e = ((b ^ C) & 48) >> 4;
        var f = (b ^ C) >>> 6;
        var o = "";
        var i = function(a, b, c) {
            if (!c) {
                c = "";
            }
            var retina = "";
            if (window.devicePixelRatio > 1) {
                retina = "r";
            }
            o += "<span class=\"ffpdgt" + retina + "\" style=\"" + c + "background-position: " + a + " " + b + ";\"></span>";
        }
        if (d) {
            var g = c ? "-48px" : "-32px";
            var h = ((d - 1) * -22).toString() + "px";
            i(g, h);
        }
        while (f > 0) {
            var k = f % 13;
            f = (f - k) / 13;
            if (k == 12) {
                var g = c ? "-72px" : "-64px";
                i(g, "-22px", "width: 8px; ");
            } else if (k == 11) {
                var g = c ? "-72px" : "-64px";
                i(g, 0, "width: 8px; ");
            } else {
                k = k % 10;
                var g = c ? "-16px" : "0px";
                var h = (k * -22).toString() + "px";
                i(g, h);
            }
        }
        if (e) {
            var g = c ? "-48px" : "-32px";
            var h = ((e + 3) * -22).toString() + "px";
            i(g, h);
        }
        return o;
    },
    backupPlan: function() {
        if (!this.data.FPLhist) {
            this.data.FPLhist = [];
            this.data.planver = -1;
        }
        if (this.data.planver < this.data.FPLhist.length - 1) {
            this.data.FPLhist.splice(this.data.planver + 1);
        }
        this.data.FPLhist.push(this.data.FPL);
        this.data.FPL = this.copyPlan(this.data.FPL);
        this.data.planver = this.data.FPLhist.length - 1;
    //this.data.dontClose = true;
    },
    copyPlan: function(FPL) {
        var copy = [];
        for (var i = 0; i < FPL.length; i++) {
            var o = FPL[i];
            copy.push({
                "id": o.id,
                "icao": o.icao,
                "t": o.t,
                "via": o.via,
                "vt": o.vt,
                "fl": o.fl,
                "rwy": o.rwy,
                "wrongWay": o.wrongWay,
                "wrongLevel": o.wrongLevel,
                "vias": [],
                "route": []});
            if (o.route) {
                for (var j = 0; j < o.route.length; j++) {
                    copy[i].route.push({
                        "id": o.route[j].id,
                        "icao": o.route[j].icao,
                        "t": o.route[j].t});
                }
            }
            if (o.vias) {
                for (var j = 0; j < o.vias.length; j++) {
                    var via = new Object;
                    via = {
                        "id": o.vias[j].id,
                        "rwyTran": o.vias[j].rwyTran,
                        "t": o.vias[j].t,
                        "area": o.vias[j].area,
                        "wrongLevel": o.vias[j].wrongLevel,
                        "wrongWay": o.vias[j].wrongWay,
                        "prepend": false,
                        "append": false,
                        "route": []};
                    for (var k = 0; k < o.vias[j].route.length; k++) {
                        via.route.push({
                            "id": o.vias[j].route[k].id,
                            "icao": o.vias[j].route[k].icao,
                            "t": o.vias[j].route[k].t});
                    }
                    if (o.vias[j].prepend) {
                        via.prepend = [];
                        for (var k = 0; k < o.vias[j].prepend.length; k++) {
                            via.prepend.push({
                                "id": o.vias[j].prepend[k].id,
                                "icao": o.vias[j].prepend[k].icao,
                                "t": o.vias[j].prepend[k].t});
                        }
                    }
                    if (o.vias[j].append) {
                        via.append = [];
                        for (var k = 0; k < o.vias[j].append.length; k++) {
                            via.append.push({
                                "id": o.vias[j].append[k].id,
                                "icao": o.vias[j].append[k].icao,
                                "t": o.vias[j].append[k].t});
                        }
                    }
                    copy[i].vias.push(via);
                }
            }
        }
        return copy;
    },
    showPlanEdit: function(FPL) {
        var p;
        var sv = this;
        if (this.data.div.planEdit) {
            p = this.data.div.planEdit;
        } else {
            this.data.div.planEdit = {};
            p = this.data.div.planEdit;
            p.minilog = false; 
            if (this.data.userpref && this.data.userpref.hasOwnProperty('miniNavLog')){
                p.minilog = this.data.userpref.miniNavLog;
            }
            p.div = this.ce("div");
            p.div.onmouseover = function() {
                sv.data.nowheel = true;
            }
            p.div.onmouseout = function() {
                sv.data.nowheel = false;
                
                // Some spans, when hovered on, cause the via hover tip to show. Moving the mouse
                // off the span hides the tip. Unfortunately, it is possible for the tip to
                // become stuck on (this can happen when the span is deleted).
                // This next little bit is a backup tip-hiding mechanism to handle that
                // unusual situation.
                if (sv.data.div.viaHoverTip) {
                    sv.data.div.viaHoverTip.table.style.visibility = 'hidden';
                }
            }
            p.div.onmousewheel = function(e) {
                if (!e)
                    e = window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = "true";
                }
            }
            p.div.onclick = function() {
                sv.hideViaPulldowns();
            }
            p.div.id = "sv_planEdit";
            p.bg = this.ce("div","svfpl_showhide");
            p.bg.id = "sv_planEditbg";
            p.div.appendChild(p.bg);
            var ci = this.ce("img");
            ci.className = "sv_panelx";
            ci.style.marginTop = "-3px";
            ci.src = this.data.images + "/planclose.png";
            ci.onclick = function() {
                p.div.style.visibility = 'hidden';
            }
            p.div.appendChild(ci);
            
            var h1 = this.ce("h1");
            h1.className = "sv sv_panel";
            
            h1.appendChild(document.createTextNode("Flight Plan"));
            p.div.appendChild(h1);
            p.pdowns = this.ce("div");
            p.div.appendChild(p.pdowns);
            var toolbar = this.ce("span","svfpl_toolbar");
            p.linkNew = this.ce("a","svfpl_iconlinkbtn");
            p.linkNew.appendChild(this.ce("span","fa fa-file-o"));
            p.linkNew.setAttribute("title","New Plan");
            toolbar.appendChild(p.linkNew);
            p.linkOpen = this.ce("a","svfpl_iconlinkbtn");
            p.linkOpen.appendChild(this.ce("span","fa fa-folder-open-o"));
            p.linkOpen.setAttribute("title","Open Plan");
            toolbar.appendChild(p.linkOpen);
            p.linkSave = this.ce("a","svfpl_iconlinkbtn");
            p.linkSave.appendChild(this.ce("span","fa fa-save"));
            p.linkSave.setAttribute("title","Save Plan");
            toolbar.appendChild(p.linkSave);
            p.linkShare = this.ce("a","svfpl_iconlinkbtn");
            p.linkShare.appendChild(this.ce("span","fa fa-share-square-o"));
            p.linkShare.setAttribute("title","Send Plan To...");
            toolbar.appendChild(p.linkShare);
            
            var nlswitch = this.ce("img","svfpl_switch");
            nlswitch.src = this.data.images + "/switchmask.png";
            nlswitch.style.backgroundImage = "url("+this.data.images+ "/nlswitch.png)";
            nlswitch.style.margin = "0 0 0 130px";
            nlswitch.setAttribute("title","Show Mini NavLog");
            if (p.minilog){
                nlswitch.style.backgroundPosition = "0px 0px";
            }

            toolbar.appendChild(nlswitch);

            p.linkNew.onclick = function(){
                try {
                    ga_event('send', 'event', 'FPL', 'NewPlan');
                } catch (e) {
                } ;
                sv.fpl({'cmd':'clr'});
            }
            p.linkOpen.onclick = function(){
                try {
                    ga_event('send', 'event', 'FPL', 'OpenPlan');
                } catch (e) {
                } ;
                if (sv.data.uid){
                    if (sv.data.permfpl){
                        var r = sv.request(sv.data.perldir + '/fpllist');
                        r.onload = function(data){
                            if (data.fpls){
                                sv.showLoadForm(data.fpls);
                            }
                        }
                    }else{
                        sv.eula();
                    }
                }else{
                    sv.login("You must be logged in to open flight plans.");
                }
            }

            p.linkSave.onclick = function(){
                try {
                    ga_event('send', 'event', 'FPL', 'SavePlan');
                } catch (e) {
                } ;
                if (sv.data.uid){
                    if (sv.data.permfpl){
                        sv.showSaveForm();
                    }else{
                        sv.eula();
                    }
                }else{
                    sv.login("You must be logged in to save flight plans.");
                }
            }
            p.linkShare.onclick = function(){
                try {
                    ga_event('send', 'event', 'FPL', 'SharePlan');
                } catch (e) {
                } ;
                sv.showShareForm();
            }






            h1.appendChild(toolbar);
            
            var addLabel = function(div, text, width, align) {
                var span = sv.ce("span");
                span.className = "svfpl_label";
                span.appendChild(document.createTextNode(text));
                if (width){
                    span.style.width = width + "px";
                }
                if (align){
                    span.style.textAlign = align;
                }
                div.appendChild(span);
            }
            
            addLabel(p.div, "Aircraft", 70,"right");
            p.aircraft = this.ce("input", "svfpl_input");
            p.aircraft.id = "svfpl_aircraft";
            p.aircraft.setAttribute("placeholder","tail #");
            p.aircraft.setAttribute("maxlength","10");
            p.div.appendChild(p.aircraft);
            p.aircraft.onfocus = function(){
                if (!sv.data.uid){
                    sv.login("You must sign in to access Aircraft Performance Profiles");
                    return false;
                }
                if (!sv.data.permfpl){
                    sv.eula();
                    return false;
                }
                if (sv.data.tails){
                    sv.showTailPicker(p.aircraft);
                }
            }
            p.aircraft.onchange = function(){
                sv.fpl({'cmd':'aircraft','acft':p.aircraft.value});
            }

            var planeicon = this.ce("a","svfpl_iconlink");
            planeicon.appendChild(this.ce("span","fa fa-plane"));
            planeicon.setAttribute("title","Edit Aircraft Profile");
            var planeEnabled = false;
            p.enablePlane = function(isEnabled){
                if (isEnabled){
                    planeEnabled = true;
                    planeicon.className="svfpl_iconlink";
                }else{
                    planeEnabled = false;
                    planeicon.className="svfpl_iconlink svfpl_iconlinkdisabled";
                }
            }
            p.enablePlane(false);
            planeicon.onclick = function(){
                if (planeEnabled){
                    try {
                        ga_event('send', 'event', 'FPL', 'EditAircraft');
                    } catch (e) {
                    } ;
                    if (sv.data.uid){
                        if (sv.data.permfpl){
                            var qs = sv.mkQS({cmd:'get',ident:p.aircraft.value});
                            var r=sv.request(sv.data.perldir + '/aircraft' + qs);
                            r.onload = function(data){
                                if (data.aircraft){
                                    if (data.aircraft.ident){
                                        sv.showAircraftEdit(data.aircraft);
                                    }else{
                                        sv.simpleDialog("exclamation-triangle","red","Please enter your tail number");
                                    }
                                }
                            }
                        }else{
                            sv.eula();
                        }
                    }else{
                        sv.login("You must sign in to access Aircraft Performance Profiles");
                    }
                }
            }
            p.div.appendChild(planeicon);

            addLabel(p.div, "Spd",32,'right');
            p.spd = this.ce("input", "svfpl_input small");
            p.spd.id = "svfpl_spd";
            p.spd.setAttribute("pattern","M?[0-9]*");
            p.spd.setAttribute("placeholder","110");
            p.spd.setAttribute("tabindex","-1");
            p.div.appendChild(p.spd);
            p.spd.onchange = function(){
                sv.fpl({'cmd':'spd','spd':p.spd.value});
                try {
                    ga_event('send', 'event', 'FPL', 'setSpeed', p.spd.value);
                } catch (e) { } ;
            }
            
            addLabel(p.div, "Alt",20,"right");
            p.altitude = this.ce("input","svfpl_input small");
            p.altitude.id = "svfpl_altitude";
            p.altitude.setAttribute("placeholder","080");
            p.altitude.setAttribute("pattern","(FL)?[0-9]*");
            p.altitude.setAttribute("tabindex","-1");
            p.div.appendChild(p.altitude);
            p.altitude.onchange = function(){
                sv.fpl({'cmd':'altitude','altitude':p.altitude.value});
                try {
                    ga_event('send', 'event', 'FPL', 'setAltitude', p.altitude.value);
                } catch (e) { 
                    //console.log(e); 
                } ;
            }

            addLabel(p.div, "Fuel",25,"right");
            p.fuel = this.ce("input","svfpl_input small");
            p.fuel.id = "svfpl_fuel";
            p.fuel.setAttribute("placeholder","0");
            p.fuel.setAttribute("pattern","[0-9\.]*");
            p.fuel.setAttribute("tabindex","-1");
            p.div.appendChild(p.fuel);
            p.fuel.onchange = function(){
                sv.fpl({'cmd':'fuel','fuel':p.fuel.value});
                try {
                    ga_event('send', 'event', 'FPL', 'setRampFuel', p.fuel.value);
                } catch (e) { } ;
            }
            var airportWrapper = this.ce("div", "svfpl_showhide"); 
            if (p.minilog){
                airportWrapper.style.height = "0px";
            }else{
                airportWrapper.style.height = "42px";
            }
            p.div.appendChild(airportWrapper);

            var depdiv = this.ce("div", "svfpl_row");
            airportWrapper.appendChild(depdiv);
            addLabel(depdiv, "Departure", 70,"right");
            
            p.departure = this.ce("input", "svfpl_input");
            p.departure.id = "svfpl_dep";
            depdiv.appendChild(p.departure);
            p.departureName = this.ce("div", "svfpl_airportlink");
            depdiv.appendChild(p.departureName);
            
            var dstdiv = this.ce("div", "svfpl_row");
            airportWrapper.appendChild(dstdiv);
            addLabel(dstdiv,"Destination", 70,"right");
            p.destination = this.ce("input", "svfpl_input");
            p.destination.id = "svfpl_dst";
            dstdiv.appendChild(p.destination);
            p.destinationName = this.ce("div", "svfpl_airportlink");
            dstdiv.appendChild(p.destinationName);

            p.setDepData = function(data) {
                while (p.departureName.firstChild) {
                    p.departureName.removeChild(p.departureName.firstChild);
                    p.depData = {};
                    p.departure.value = "";
                }
                if (data){
                    p.depData = {
                        ident: data[0],
                        name: data[1],
                        city: data[2],
                        url: data[3],
                        tz: data[4]                 
                    }

                    p.departure.value = p.depData.ident;
                    var a = sv.ce("a", "svfpl_aptlink");
                    a.href = p.depData.url;
                    a.setAttribute("tabindex","-1");
                    a.appendChild(document.createTextNode(p.depData.name));
                    p.departureName.appendChild(a);
                    if (data[5]){
                        var tpp = data[5];
                        var tpphover = function(event){
                            var pos = sv.getPos(a);
                            sv.tppMenu(data[0],tpp,pos.x + 120, pos.y);
                        }
                        a.ontouchstart = tpphover;
                        a.onmouseover = tpphover;
                        a.onmouseout = function(){ sv.tppMenuHide(); };
                    }
                }
            }
            p.setDstData = function(data){
                while (p.destinationName.firstChild) {
                    p.destinationName.removeChild(p.destinationName.firstChild);
                    p.dstData = {};
                    p.destination.value = "";
                }
                if (data){
                    p.dstData = {
                        ident: data[0],
                        name: data[1],
                        city: data[2],
                        url: data[3],
                        tz: data[4]
                    }
                    p.destination.value = p.dstData.ident;
                    var a = sv.ce("a", "svfpl_aptlink");
                    a.href = p.dstData.url;
                    a.setAttribute("tabindex","-1");
                    a.appendChild(document.createTextNode(p.dstData.name));
                    p.destinationName.appendChild(a);
                    if (data[5]){
                        var tpp = data[5];
                        var tpphover = function(event){
                            var pos = sv.getPos(a);
                            sv.tppMenu(data[0],tpp,pos.x + 120, pos.y);
                        }
                        a.ontouchstart = tpphover;
                        a.onmouseover = tpphover;
                        a.onmouseout = function(){ sv.tppMenuHide(); };
                    }
                }
            }
            
            var showAirportPicker = function(input,data,callback){
                if (data.length == 0) return;
                var pdiv = input.parentElement;
                var pickMask = sv.ce("div","svfpl_routemask");
                pdiv.insertBefore(pickMask,input);
                var pick = sv.ce("div","svfpl_airportpicker");
                pdiv.insertBefore(pick,input);
                var remove = function(){
                    pdiv.removeChild(pick);
                    pdiv.removeChild(pickMask); 
                }
                for (var i=0; i < data.length; i++){
                    (function(){
                        var d = data[i];
                        var o = sv.ce("div","svfpl_airportpickeroption");
                        o.innerHTML = "<b>"+d[0] + "</b> " + d[1];
                        o.onclick = function(){
                            try {
                                ga_event('send', 'event', 'FPL', 'pickAirport');
                            } catch (e) { } ;
                            callback(d);
                            remove();
                        }
                        pick.appendChild(o)
                    })();
                }
                pickMask.onclick = remove;
            }

            p.departure.onchange = function() {
                while (p.departureName.firstChild) {
                    p.departureName.removeChild(p.departureName.firstChild);
                }                    
                var val = this.value;
                if (val.length){
                    var r = sv.request(sv.data.perldir + "/aptSearch?s=" + escape(this.value));
                    r.onload = function(data) {
                        if (data instanceof Array) {
                            if (data.length == 0) {
                                p.departureName.innerHTML = "invalid airport";
                            }else if (data.length == 1) {
                                p.setDepData(data[0]);
                                sv.fpl({cmd:'dep',dep:data[0][0]});
                            } else {
                                showAirportPicker(p.destination,data,function(d){p.setDepData(d);sv.fpl({cmd:'dep',dep:d[0]});});
                                //showAirportPicker(p.departure,data,p.setDepData);
                            }
                        }
                    }
                }else{
                    sv.fpl({"cmd":"dep","dep":""});
                }
                try {
                    ga_event('send', 'event', 'FPL', 'typeDeparture', val);
                } catch (e) { } ;
            }
            p.destination.onchange = function(){
                while (p.destinationName.firstChild) {
                    p.destinationName.removeChild(p.destinationName.firstChild);
                }    
                var val = this.value;
                if (val.length){
                    var r = sv.request(sv.data.perldir + "/aptSearch?s=" + escape(this.value));
                    r.onload = function(data) {
                        if (data instanceof Array) {
                            if (data.length == 0) {
                                p.destinationName.innerHTML = "invalid airport";    
                            }else if (data.length == 1) {
                                p.setDstData(data[0]);
                                sv.fpl({cmd:'dst',dst:data[0][0]});
                            } else {
                                showAirportPicker(p.destination,data,function(d){p.setDstData(d);sv.fpl({cmd:'dst',dst:d[0]});});
                            }
                        }
                    }                
                }else{
                    sv.fpl({"cmd":"dst","dst":""});
                }
                try {
                    ga_event('send', 'event', 'FPL', 'typeDestination', val);
                } catch (e) { } ;
            }
            p.departure.onclick = function(){
                if (sv.data.FPL && sv.data.FPL.dep && sv.data.FPL.dep.lat && sv.data.FPL.dep.lon){
                    sv.data.lat = sv.data.FPL.dep.lat;
                    sv.data.lon = sv.data.FPL.dep.lon;
                    sv.reset();
                }
            }
            p.destination.onclick = function(){
                if (sv.data.FPL && sv.data.FPL.dst && sv.data.FPL.dst.lat && sv.data.FPL.dst.lon){
                    sv.data.lat = sv.data.FPL.dst.lat;
                    sv.data.lon = sv.data.FPL.dst.lon;
                    sv.reset();
                }
            }

            var tdiv = this.ce("div", "svfpl_row");
            p.div.appendChild(tdiv);
            addLabel(tdiv,"ETD",30,"right");
            addLabel(tdiv,"Zulu",34,"right");
            p.etdz = this.ce("input", "svfpl_input");
            p.etdz.id = "svfpl_etdz";
            p.etdz.style.width = "50px";
            p.etdz.setAttribute("placeholder","hhmm");
            p.etdz.setAttribute("pattern","[0-9]*");
            tdiv.appendChild(p.etdz);

            p.eddz = this.ce("input", "svfpl_input");
            p.eddz.id = "svfpl_eddz";
            p.eddz.setAttribute("tabindex","-1");
            p.eddz.style.width = "50px";
            p.eddz.setAttribute("placeholder","mm/dd");
            p.eddz.setAttribute("pattern","[0-9\/]*");
            tdiv.appendChild(p.eddz);
            var cal1 = this.ce("a","svfpl_iconlink");
            cal1.appendChild(this.ce("span","fa fa-calendar"));

            var updateEtdz = function(){
                sv.fpl({
                        'cmd':'etdz', 
                        'etdz':p.etdz.value,
                        'eddz':p.eddz.value
                        });
                try {
                    ga_event('send', 'event', 'FPL', 'setETDZulu');
                } catch (e) { } ;
            }
            p.etdz.onchange = updateEtdz;
            p.eddz.onchange = updateEtdz;

            cal1.onclick = function(){
                if (sv.data.FPL.etd){
                    var currentVal = new Date(sv.data.FPL.etd * 1000);
                    sv.calendarPop(this,currentVal,function(y,m,d){
                        var mon = m.toFixed();
                        if (mon.length == 1){
                            mon = "0"+mon;
                        }
                        var day = d.toFixed();
                        if (day.length == 1){
                            day = "0"+day;
                        }
                        p.eddz.value = mon+"/"+day;
                        updateEtdz();
                    });
                }
                try {
                    ga_event('send', 'event', 'FPL', 'cal1Click');
                } catch (e) { } ;
            }
            tdiv.appendChild(cal1);

            addLabel(tdiv,"Local",40,"right");
            p.etdl = this.ce("input", "svfpl_input");
            p.etdl.id = "svfpl_etdl";
            p.etdl.setAttribute("tabindex","-1");
            p.etdl.style.width = "50px";
            p.etdl.setAttribute("placeholder","hhmm");
            p.etdl.setAttribute("pattern","[0-9]*");
            tdiv.appendChild(p.etdl);

            p.eddl = this.ce("input", "svfpl_input");
            p.eddl.id = "svfpl_eddl";
            p.eddl.setAttribute("tabindex","-1");
            p.eddl.style.width = "50px";
            p.eddl.setAttribute("placeholder","mm/dd");
            p.eddl.setAttribute("pattern","[0-9\/]*");
            tdiv.appendChild(p.eddl);
            var cal2 = this.ce("a","svfpl_iconlink");
            cal2.appendChild(this.ce("span","fa fa-calendar"));
            var updateEtdl = function(){
                sv.fpl({ cmd:'etdl',etdl:p.etdl.value,eddl:p.eddl.value});
                try {
                    ga_event('send', 'event', 'FPL', 'setETDLocal');
                } catch (e) { } ;
            }
            p.etdl.onchange = updateEtdl;
            p.eddl.onchange = updateEtdl;
            cal2.onclick = function(){
                if (sv.data.FPL.etd && sv.data.FPL.dep){
                    var currentVal = new Date(sv.data.FPL.etd * 1000 + sv.data.FPL.tz*1000);
                    sv.calendarPop(this,currentVal,function(y,m,d){
                        var mon = m.toFixed();
                        if (mon.length == 1){
                            mon = "0"+mon;
                        }
                        var day = d.toFixed();
                        if (day.length == 1){
                            day = "0"+day;
                        }
                        p.eddl.value = mon+"/"+day;
                        updateEtdl();
                    });
                }
                try {
                    ga_event('send', 'event', 'FPL', 'cal1Click');
                } catch (e) { } ;
            }
            tdiv.appendChild(cal2);

            p.plansubmit = function(){
                if (!p.minilog){
                    if (p.depElem){
                        try {
                            p.edit.removeChild(p.depElem);
                        }catch(e) {};
                    }
                    if (p.dstElem){
                        try {
                            p.edit.removeChild(p.dstElem);
                        }catch(e) {};
                    }
                }

                var routeHTML = p.edit.innerHTML;
                var routeTxt=routeHTML.replace(/<.*?>|&\S+;/g,' ').replace(/\s+/g,' ').replace(/\s\//g,'/');
                sv.fpl({"cmd":"route","route":routeTxt,"mnl":p.minilog ? 1 : 0});
                try {
                    ga_event('send', 'event', 'FPL', 'parseRouteEnter');
                } catch (e) { } ;
            }

            var totals = this.ce("div","svfpl_totals");
            p.div.appendChild(totals);

            p.routeLink = this.ce("a","svfpl_link");
            p.routeLink.style.color='#888';
            p.routeLink.appendChild(document.createTextNode("Routes "));
            p.routeIcon = this.ce("span","fa fa-arrow-circle-down");
            p.routeSpinner = this.ce("span","fa fa-spinner fa-pulse nounderline");
            p.routeSpinner.style.display = 'none';
            p.routeLink.appendChild(p.routeIcon);
            p.routeLink.appendChild(p.routeSpinner);
            this.routeLinkState('disabled');
            p.routeLink.onclick = function(){ sv.showRoutes(); return false; };

            addLabel(totals,"Dist:");
            p.tdist = this.ce("div","svfpl_total");
            totals.appendChild(p.tdist);
            addLabel(totals,"ETE:");
            p.ete = this.ce("div","svfpl_total");
            totals.appendChild(p.ete);
            addLabel(totals,"Burn:");
            p.tfuel = this.ce("div","svfpl_total");
            totals.appendChild(p.tfuel);

            totals.appendChild(p.routeLink);
            
            p.routeList = this.ce("div","svfpl_routeList");
            p.div.appendChild(p.routeList);

          
            p.edit = this.ce("div","svfpl_showhide");
            p.edit.id = "sv_planEditField";
            if (p.minilog){
                p.edit.style.height = "13px";
            }
            p.edit.contentEditable = true;
            p.edit.setAttribute("spellcheck",false);
            p.div.appendChild(p.edit);
            p.saveText = ""
            p.edit.onfocus = function() {
                var routeHTML = p.edit.innerHTML;
                p.saveText = routeHTML.replace(/<.*?>|&\S+;/g,' ').replace(/\s+/g,' ').replace(/\s\//g,'/');
                p.helpMessage.style.visibility = 'hidden';
            }
            p.edit.onblur = function() {
                var routeHTML = p.edit.innerHTML;
                var routeTxt=routeHTML.replace(/<.*?>|&\S+;/g,' ').replace(/\s+/g,' ').replace(/\s\//g,'/');
                if (routeTxt != p.saveText){
                    if (!p.minilog){
                        if (p.depElem){
                            try {
                                p.edit.removeChild(p.depElem);
                            }catch(e) {};
                        }
                        if (p.dstElem){
                            try {
                                p.edit.removeChild(p.dstElem);
                            }catch(e) {};
                        }
                    }

                    routeHTML = p.edit.innerHTML;
                    routeTxt=routeHTML.replace(/<.*?>|&\S+;/g,' ').replace(/\s+/g,' ').replace(/\s\//g,'/');
                    sv.fpl({"cmd":"route","route":routeTxt,"mnl":p.minilog ? 1 : 0});
                    try {
                        ga_event('send', 'event', 'FPL', 'parseRouteBlur');
                    } catch (e) { } ;
                }
            }

            p.mininavlog = this.ce("div","svfpl_showhide");
            p.mininavlog.id = "svfpl_minilog";
            if (p.minilog){
                p.mininavlog.style.margin = "8px 0px";
            }
            p.div.appendChild(p.mininavlog);

            p.helpMessage = this.ce("div","svfpl_helpmessage svfpl_showhide");
            if (p.minilog){
                p.helpMessage.style.marginTop = "-36px";
            }
            p.div.appendChild(p.helpMessage);
            p.helpMessage.appendChild(this.ct("Enter your waypoints here."));
            p.helpMessage.onclick = function(){
                p.helpMessage.style.visibility = 'hidden';
                p.edit.focus();
            }
            p.statusDiv = this.ce("div","svfpl_statuslabel svfpl_showhide");
            if (p.minilog){
                p.statusDiv.style.height = "0px";
            }
            p.div.appendChild(p.statusDiv);
            p.statusDiv.appendChild(this.ct("Status:"));
            p.fplStatus = this.ce("span","svfpl_statusmessage");
            p.statusDiv.appendChild(p.fplStatus);


            var bdiv = this.ce("div","svfpl_showhide");
            bdiv.style.textAlign = "right";
            bdiv.style.width = "380px";
            if (p.minilog){
                bdiv.style.height = "0px";
            }else{
                bdiv.style.height = "27px";
            }
        

            p.btnBrief = this.fplButton("fa fa-file-text-o fa-fw","Brief",undefined,"Receive official briefing from FSS");
            p.btnBrief.style.display = "none";
            bdiv.appendChild(p.btnBrief);
            p.btnBrief.onclick = function(){
                p.btnBrief.setEnabled(false,true);
                if (sv.data.permfpl){
                    var r = sv.request(sv.data.perldir + "/brief");
                    r.onload = function(data){
                        p.btnBrief.setEnabled(true);
                        if (data.err){
                            sv.simpleDialog("exclamation-triangle","red",data.err);
                        }else{
                            sv.showBriefing(data.text);
                        }
                    }
                }else{
                    sv.login("You must sign in to obtain a briefing.");
                }
            }

            p.btnFile = this.fplButton("fa fa-inbox","Briefing & Filing",undefined,"View Filing Form");
            bdiv.appendChild(p.btnFile);
            p.btnFile.onclick = function(){
                if (sv.data.uid){
                    if (sv.data.permfpl){
                        var r = sv.request(sv.data.perldir + '/fileInfo?');
                        r.onload = function(data){
                            if (data.info){
                                sv.showFileForm(data.info);
                            }
                        }
                    }else{
                        sv.eula();
                    }
                }else{
                    sv.login("You must sign in to file flight plans.");
                }
                try {
                    ga_event('send', 'event', 'FPL', 'openBriefingFiling');
                } catch (e) { } ;
            }
            p.btnAmend = this.fplButton("fa fa-edit","Brief & Amend",undefined,"Amend or Cancel Flight Plan");
            p.btnAmend.style.display = "none";
            bdiv.appendChild(p.btnAmend);
            p.btnAmend.onclick = function(){
                if (sv.data.uid){
                    if (sv.data.permfpl){
                        var r = sv.request(sv.data.perldir + '/fileInfo?');
                        r.onload = function(data){
                            if (data.info){
                                sv.showFileForm(data.info);
                            }
                        }
                    }else{
                        sv.eula();
                    }
                }else{
                    sv.login("You must sign in to file flight plans.");
                }
            }

            p.btnNavlog = this.fplButton("fa fa-list-ul","Nav Log",undefined,"Download PDF Trip Kit");
            bdiv.appendChild(p.btnNavlog);

            p.btnNavlog.onclick = function(){
                window.open(sv.data.perldir + "/navlog?" + Math.random().toFixed(5).substr(2),"_blank");
                try {
                    ga_event('send', 'event', 'FPL', 'NavLog');
                } catch (e) { } ;
            }

            p.planItemCount = 0;
            p.depElem = undefined;
            p.dstElem = undefined;
            p.resizeForm = function(){
                if (p.minilog){
                    p.bg.style.height = (136 + (p.planItemCount*40)) + "px";
                    p.mininavlog.style.height = 1+ p.planItemCount * 40 + "px";
                    p.mininavlog.style.margin = "8px 0px";
                }else{
                    p.bg.style.height = "248px";
                    p.mininavlog.style.height = "0px";
                    p.mininavlog.style.margin = "0px 0px";
                }
            }
            p.toggleNavLog = function(showNavlog){
                if (showNavlog){
                    p.minilog = true;
                    nlswitch.style.backgroundPosition = "0px 0px";
                    airportWrapper.style.height = "0";
                    p.edit.style.height = "13px";
                    bdiv.style.height = "0px";
                    p.statusDiv.style.height = "0px";
                    p.helpMessage.style.marginTop = "-36px";
                    if (p.depElem) p.depElem.style.display = 'inline';
                    if (p.dstElem) p.dstElem.style.display = 'inline';
                    sv.updateMiniNavLog();
                }else{
                    p.minilog = false;
                    nlswitch.style.backgroundPosition = "-25px 0px";
                    airportWrapper.style.height = "42px";
                    p.edit.style.height = "70px";
                    bdiv.style.height = "27px";
                    p.statusDiv.style.height = "20px";
                    p.helpMessage.style.marginTop = "-50px";
                    if (p.depElem) p.depElem.style.display = 'none';
                    if (p.dstElem) p.dstElem.style.display = 'none';
                }
                p.resizeForm();
            }
            nlswitch.onclick = function(){
                if (p.minilog){
                    p.toggleNavLog(false);
                }else{
                    p.toggleNavLog(true);
                }
                sv.setPref("miniNavLog",p.minilog);
            }
            
            p.div.appendChild(bdiv);
            
            this.data.div.chart.appendChild(p.div);
            this.dragEnable(p.div, p.bg);
            this.dragEnable(p.div, h1);
            p.div.style.visibility = "visible";
        }

        // load plan stuff
        if (FPL){
            p.depElem = undefined;
            p.dstElem = undefined;
            p.helpMessage.style.visibility = 'hidden';
            while (p.edit.firstChild) {
                p.edit.removeChild(p.edit.firstChild);
            }
            if (FPL.afssFlightId){
                if (FPL.status != 'CANCELLED' && FPL.status != 'DELETED'){
                    p.btnAmend.style.display = "inline-block";
                    p.btnBrief.style.display = "none";
                }else{
                    p.btnAmend.style.display = "none";
                    p.btnBrief.style.display = "inline-block";
                }
                p.btnFile.style.display = "none";
            }else{
                p.btnAmend.style.display = "none";
                p.btnFile.style.display = "inline-block";
                p.btnBrief.style.display = "none";
            }
            if (FPL.afssFlightId){
                p.statusDiv.style.display = 'inline';
                while (p.fplStatus.firstChild){
                    p.fplStatus.removeChild(p.fplStatus.firstChild);
                }
                p.fplStatus.style.color = "#666";
                if (FPL.status == 'CANCELLED'){
                    p.fplStatus.appendChild(this.ct("Cancelled"));
                    p.fplStatus.style.color = "#666";
                }else if (FPL.status == 'DELETED'){
                    p.fplStatus.appendChild(this.ct("Deleted"));
                    p.fplStatus.style.color = "#666";
                }else{
                    p.fplStatus.appendChild(this.ct("Filed"));
                    p.fplStatus.style.color = "#090";
                }
            }else{
                if (false && FPL.dep && FPL.dst){
                    while (p.fplStatus.firstChild){
                        p.fplStatus.removeChild(p.fplStatus.firstChild);
                    }
                    p.fplStatus.style.color = "#666";
                    p.statusDiv.style.display = 'inline';
                    p.fplStatus.appendChild(this.ct("Not filed"));
                }else{
                    p.statusDiv.style.display = 'none';
                }
            }
            /*
            if (FPL.syncEnabled){
                p.btnSync.style.display = "inline-block";
            }else{
                p.btnSync.style.display = "none";
            }
            */
            this.data.permfpl = FPL.permfpl;
            if (FPL.aircraft && FPL.aircraft.ident){ 
                p.enablePlane(true);
                p.aircraft.value = FPL.aircraft.ident; 
            }else{ 
                p.enablePlane(false);
                p.aircraft.value = ""
            }
            if (FPL.alt){ p.altitude.value = FPL.alt; }else{ p.altitude.value = ""};
            if (FPL.speed){ p.spd.value = FPL.speed; }else{ p.spd.value = ""; };
            if (FPL.rampFuel){ p.fuel.value = FPL.rampFuel; }else{ p.fuel.value = ""};
            if (FPL.dep){
                p.setDepData([FPL.dep.ident,FPL.dep.name,FPL.dep.city,FPL.dep.url,FPL.dep.timezone,FPL.dep.tpp]);
            }else{
                p.setDepData();
            }
            if (FPL.dst){
                p.setDstData([FPL.dst.ident,FPL.dst.name,FPL.dst.city,FPL.dst.url,FPL.dst.timezone,FPL.dst.tpp]);
            }else{
                p.setDstData();
            }
            if (FPL.etdz) { p.etdz.value = FPL.etdz; }else{ p.etdz.value = "" };
            if (FPL.eddz) { p.eddz.value = FPL.eddz; }else{ p.eddz.value = "" };
            if (FPL.etdl) { p.etdl.value = FPL.etdl; }else{ p.etdl.value = "" };
            if (FPL.eddl) { p.eddl.value = FPL.eddl; }else{ p.eddl.value = "" };
            if (FPL.distance) { p.tdist.innerHTML = FPL.distance; }else{ p.tdist.innerHTML="";};
            if (FPL.ete) { p.ete.innerHTML = FPL.ete; }else{ p.ete.innerHTML="";};
            if (FPL.fuel) { p.tfuel.innerHTML = FPL.fuel; }else{ p.tfuel.innerHTML="";};        
            FPL.planPE = {};
            if (FPL && FPL.route && FPL.route.length){
                FPL.route = FPL.route.filter(function (r) { // remove bad (undefined) route points
                    return r.ident && r.t !== 'X';
                });
                p.planItemCount = FPL.route.length;
                if (p.planItemCount > 6) p.planItemCount=6;
                p.resizeForm();
                for (var i=0; i < FPL.route.length; i++){
                    var wp = FPL.route[i];
                    if (wp.via && wp.pe != 'dep') {
                        wp.viaspan = this.ce("span");
                        FPL.planPE[wp.pe] = wp;
                        if (wp.vt == "sid") {
                            wp.viaspan.className = "sv_plantpp";
                            if (false && wp.rwy) {
                                wp.viaspan.appendChild(document.createTextNode("(" + wp.rwy + ")" + wp.via));
                            } else {
                                wp.viaspan.appendChild(document.createTextNode(wp.via));
                            }
                        } else if (wp.vt == "star") {
                            wp.viaspan.className = "sv_plantpp";
                            if (false && wp.rwy) {
                                wp.viaspan.appendChild(document.createTextNode(wp.via + "(" + wp.rwy + ")"));
                            } else {
                                wp.viaspan.appendChild(document.createTextNode(wp.via));
                            }
                        } else if (wp.vt == "ats") {
                            var classlist = "sv_planats";
                            if (wp.wrongWay) {
                                classlist += " sv_wrongway";
                            }
                            if (wp.wrongLevel) {
                                classlist += " sv_wronglevel";
                            }
                            wp.viaspan.className = classlist;
                            wp.viaspan.appendChild(document.createTextNode(wp.via));
                        } else if (wp.vt == "dct") {
                            wp.viaspan.className = "sv_plandirectwrap fa fa-arrow-right";
                            //wp.viaspan.appendChild(document.createTextNode(wp.via));
                            //wp.viaspan.className = "sv_plandirectwrap";
                            //var d = this.ce("span","sv_plandirectd");
                            //d.appendChild(document.createTextNode(wp.via));
                            //var arrow = this.ce("span","fa fa-long-arrow-right");
                            //wp.viaspan.appendChild(d);
                            //wp.viaspan.appendChild(arrow);
                        } else if (wp.vt == "opt") {
                            wp.viaspan.className = "sv_planopt";
                            wp.viaspan.appendChild(document.createTextNode(" "));
                        } else {
                            wp.viaspan.className = "sv_planunk";
                            wp.viaspan.appendChild(document.createTextNode(wp.via));
                        }
                        
                        p.edit.appendChild(wp.viaspan);
                        if (wp.sDist){
                            this.viaHoverTip(wp.viaspan,wp.sDist,wp.sTime);
                        }
                        //wp.pulldown = this.makeViaPulldown(wp.vias, wp.via, i);
                        p.edit.appendChild(document.createTextNode(' '));
                    
                    }
                    //if (wp.pe != 'dep' && wp.pe != 'dst') {

                        wp.span = this.ce("span");
                        if (wp.pe == 'dep'){
                            p.depElem = wp.span;
                            if (!p.minilog){
                                p.depElem.style.display = 'none';
                            }
                        }
                        if (wp.pe == 'dst'){
                            p.dstElem = wp.span;
                            if (!p.minilog){
                                p.dstElem.style.display = 'none';
                            }
                        }
                        wp.span.className = "sv_planpoint";
                        wp.span.appendChild(document.createTextNode(" "+wp.ident));
                        p.edit.appendChild(wp.span);
                        if (wp.newalt || wp.newspeed) {
                            wp.flspan = this.ce("span");
                            wp.flspan.className = "sv_planfl";
                            var mod = "";
                            if (wp.newspeed) mod += wp.newspeed.mod;
                            if (wp.newalt) mod += wp.newalt.mod;
                            wp.flspan.appendChild(document.createTextNode("/" + mod));
                            p.edit.appendChild(wp.flspan);
                        }
                        p.edit.appendChild(document.createTextNode(' '));
                    //html += "<span class=\"sv_planpoint\">"+wp.id+"</span> ";
                    //}
                    this.addPlanHovers(wp);
                
                }
                p.edit.appendChild(document.createTextNode('\u00A0'));
                var routeHTML = p.edit.innerHTML;
                p.saveText = routeHTML.replace(/<.*?>|&\S+;/g,' ').replace(/\s+/g,' ').replace(/\s\//g,'/');
            }else{
                p.planItemCount = 0;
            }
            if (FPL.message instanceof Array){
                var msg = FPL.message.join(" ");
                sv.simpleDialog("warning","#ffaa00",msg);
            }
        }else{
            p.enablePlane(false);
        }
        p.resizeForm();
        sv.updateMiniNavLog();

        p.keypress = function(e) {
            if (!e)
                e = window.event;
            if (e.keyCode == 13 && p.redrawon) {
                p.plansubmit();
                //p.btnRedraw.onclick();
                return false;
            }
            try {
                if (window.getSelection) {
                    var div = window.getSelection().anchorNode.parentNode;
                } else {
                    var range = document.selection.createRange();
                    for (var i = 1; i < sv.data.FPL.length; i++) {
                        var cNode = sv.data.FPL[i].viaspan;
                        if (cNode) {
                            var cpos = sv.getPos(cNode);
                            if (
                            range.offsetLeft >= cpos.x && 
                            range.offsetLeft <= (cpos.x + cNode.offsetWidth) && 
                            range.offsetTop >= cpos.y && 
                            range.offsetTop <= (cpos.y + cNode.offsetHeight)) {
                                var div = cNode;
                                i = 999999;
                            }
                        }
                    }
                }
                if (div) {
                    if (div.className == "sv_plandirect" || 
                    div.className.indexOf("sv_planats") != -1 || 
                    div.className.indexOf("sv_plandirect") != -1 || 
                    div.className == "sv_plantpp" || 
                    div.className == "sv_planfl" || 
                    div.className == "sv_planunk" || 
                    div.className == "sv_planopt") {
                        div.className = "sv_planpoint";
                    }
                }
            } catch (e) {
            }
            p.updateon = false;
            p.redrawon = true;
        }
        p.edit.onkeypress = p.keypress;
        p.edit.onpaste = p.keypress;
        p.edit.oncut = p.keypress;
        p.edit.oninput = p.keypress;
        p.updateon = true;
        p.redrawon = false;
    },
    updateMiniNavLog: function(){
        var sv = this;
        var p = sv.data.div.planEdit;
        var FPL = sv.data.FPL;
        var pointList = [];
        var dragon = false;
        while (p.mininavlog.firstChild) {
            p.mininavlog.removeChild(p.mininavlog.firstChild);
        }
        var dragon = false;;
        if (FPL && FPL.route && FPL.route.length){
            var len = FPL.route.length;
            for (var i=0; i < len; i++){
                (function(){
                    var wp = FPL.route[i];
                    var r = {};
                    var position = i*40;
                    var myIndex = i;
                    var row = sv.ce("div","sv_panelrow");
                    pointList[i] = row;
                    row.style.top = position + "px";
                    p.mininavlog.appendChild(row);
                    var icon = sv.ce("div","sv_panelicon");
                    var img = sv.ce("img","sv_panelicon");
                    icon.appendChild(img);
                    var icontext = sv.ce("div","sv_panelicontxt");
                    icon.appendChild(icontext);
                    row.appendChild(icon);
                    var handle = sv.ce("div","sv_panelhandle");
                    if (sv.data.isIE) {
                        var himg = sv.ce("img");
                        himg.style.height = "38px";
                        himg.style.width = "38px";
                        himg.src = sv.data.images + "/clear.gif";
                        handle.appendChild(himg);
                    }
                    row.appendChild(handle);
                    var newpos = myIndex;
                    var offset;
                    var hasmoved = false;
                    handle.ondrag = function(){
                         return false;
                    }
                    handle.onselectstart = function(){
                        return false;
                    }
                    var hmove = function(e){
                        if (!e) e = window.event;
                        hasmoved = true;
                        var y1 = e.clientY - offset.y;
                        if (offset.sh > offset.ch) {
                            if (e.clientY > offset.starty) {
                                p.mininavlog.scrollTop = Math.round(offset.startScroll + ((y1 - offset.starty2) / (offset.ch - offset.starty2)) * ((offset.sh - offset.ch) - offset.startScroll));
                            } else {
                                p.mininavlog.scrollTop = Math.round(offset.startScroll * y1 / offset.starty2);
                            }
                        }
                        var y2 = y1 + p.mininavlog.scrollTop + offset.adjust;
                        var pos = Math.round(y2 / 40);
                        if (pos < 0)
                            pos = 0;
                        if (pos >= len)
                            pos = len-1;
                        if (pos != newpos){
                            newpos = pos;
                            for (var j=0; j < len; j++){
                                if (j < myIndex){
                                    if (j < pos){
                                        pointList[j].style.top = j*40 + "px";
                                    }else{
                                        pointList[j].style.top = (j+1)*40 + "px";
                                    }
                                }else if (j > myIndex){
                                    if (j <= pos){
                                        pointList[j].style.top = (j-1)*40 + "px";
                                    }else{
                                        pointList[j].style.top = (j)*40 + "px";
                                    }
                                }else{
                                    row.style.top = pos*40 + "px";
                                }
                            }
                        }
                    }
                    var hup = function(e) {
                        if (!e) e = window.event;
                        dragon = false;
                        handle.style.cursor = "pointer";
                        row.className="sv_panelrow";
                        if (document.removeEventListener){
                            document.removeEventListener("mousemove", hmove, false);
                            document.removeEventListener("mouseup", hup, false);
                        }else{
                            document.detachEvent("onmousemove", hmove);
                            document.detachEvent("onmouseup", hup);
                        }
                        if (newpos != myIndex){
                            sv.fpl({"cmd":"swap","pos":myIndex,"newpos":newpos});
                        }
                        return false;
                    }
                    handle.onmousedown = function(e){
                        if (!e) e = window.event;
                        hasmoved = false;
                        dragon = true;
                        offset = sv.getPos(p.mininavlog);
                        offset.startx = e.clientX;
                        offset.starty = e.clientY;
                        offset.starty2 = e.clientY - offset.y;
                        offset.startScroll = p.mininavlog.scrollTop;
                        offset.ch = p.mininavlog.clientHeight;
                        offset.sh = p.mininavlog.scrollHeight;
                        offset.adjust = position - (offset.starty2 + offset.startScroll);
                        row.className="sv_panelrow floating";
                        if (document.addEventListener){
                            e.stopPropagation();
                            document.addEventListener("mousemove", hmove, false);
                            document.addEventListener("mouseup", hup, false);
                        }else{
                            e.cancelBubble = true;
                            document.attachEvent("onmousemove", hmove);
                            document.attachEvent("onmouseup", hup);
                        }
                        return false;
                    }
                    handle.onclick = function(){
                        if (!hasmoved){
                            sv.data.lat = wp.lat;
                            sv.data.lon = wp.lon;
                            sv.reset();
                        }
                    }

                    var title = sv.ce("div", "sv_panelt");
                    row.appendChild(title);
                   
                    var type;
                    var json
                    if (wp.json){
                        try{
                            eval('json=' + wp.json);
                        }catch(e){
                            alert(e)
                        };
                        if (json.n){
                            wp.name = json.n;
                        }
                        if (json.f){
                            wp.f = json.f;
                        }
                        if (json.t){
                            wp.t2 = json.t;
                        }
                    }
                    var ident = wp.ident;
                    var name = wp.name || wp.n;
                    if (wp.t == 'A'){
                        type = 'APT';
                    }else if (wp.t == 'C'){
                        type = 'GPS';
                        ident = 'GPS';
                        var llf = sv.llf(wp.lat,wp.lon);
                        name = llf.lat + " " + llf.lon;
                    }else if (wp.t == 'V'){
                        if (wp.t2 == 'D'){
                            type='VOD';
                        }else if (wp.t2 == 'T'){
                            type ='VOT';
                        }else{
                            type ='VOR';
                        }
                    }else if (wp.t == 'N'){
                        type = 'NDB';
                    }else if (wp.t == 'W'){
                        name = wp.ident;
                        type = 'FIX';
                    }
                    img.src = sv.data.images + "/" + type +".png";
                    icontext.appendChild(sv.ct(ident));
                    if (wp.f){
                        name = name.concat(" (", wp.f, " ", ident, ")");
                    }
                    if (wp.url){
                        name = "<a href=\"" + wp.url + "\">" + name + "</a>";
                    }
                    title.innerHTML = name;


                    if (i > 0){
                        var pp = FPL.route[i-1];
                        var hdg = sv.ce("div", "sv_paneldata sv_pd1");
                        row.appendChild(hdg);
                        hdg.innerHTML = sv.df(parseFloat(pp.track) + parseFloat(pp.magvar)) + " <span style=\"font-size: 70%\">(" + sv.df(pp.track) + "T)</span>";
                        var via = sv.ce("div", "sv_paneldata sv_pd2");
                        row.appendChild(via);
                        var vias = [];
                        if (wp.vt == 'dct'){
                            via.innerHTML = "DCT";
                            if (wp.vias){
                                for (var j=0; j < wp.vias.length; j++){
                                    vias.push(wp.vias[j].ident);
                                }
                            }
                        }else{
                            via.innerHTML = wp.via;
                            vias.push('DCT');
                            if (wp.vias){
                                for (var j=0; j < wp.vias.length; j++){
                                    if (wp.via !== wp.vias[j].ident)
                                        vias.push(wp.vias[j].ident);
                                }
                            }
                        }
                        if (vias.length){
                            var pdpd = sv.ce("div","sv_pdpd");
                            row.appendChild(pdpd);
                            var pop = sv.ce("div","sv_pdviapd");
                            row.appendChild(pop);
                            var isOpen=false;
                            var uniq = {};
                            for (var j=0; j < vias.length; j++){
                                (function(){
                                    var newvia = vias[j];
                                    if(!uniq[newvia]){
                                        uniq[newvia]=true;
                                        var vrow=sv.ce("div","sv_pdviarow");
                                        vrow.appendChild(sv.ct(newvia));
                                        vrow.onclick = function(){
                                            sv.fpl({"cmd":"setvia","pos":myIndex,"via":newvia});
                                            isOpen = false;
                                            pop.style.visibility = 'hidden';
                                        }
                                        pop.appendChild(vrow);
                                    }
                                })();
                            }
                            via.style.cursor = "pointer";
                            via.onmouseover = function(){
                                pdpd.style.visibility='visible';
                            }
                            via.onmouseout = function(){
                                pdpd.style.visibility='hidden';
                            }
                            via.onclick = function(){
                                if (isOpen){
                                    isOpen = false;
                                    pop.style.visibility='hidden';
                                }else{
                                    isOpen = true;
                                    pop.style.visibility='visible';
                                }
                            }
                        }
                        var dst = sv.ce("div", "sv_paneldata sv_pd3");
                        row.appendChild(dst);
                        dst.innerHTML = (Math.round(wp.sDist * 10) / 10) + "<span class=\"half\">nm</span>";
                        var ete = sv.ce("div", "sv_paneldata sv_pd4");
                        row.appendChild(ete);
                        ete.innerHTML = sv.formatTime(wp.sTime);
                        var fuel = sv.ce("div", "sv_paneldata sv_pd5");
                        row.appendChild(fuel);
                        fuel.innerHTML = parseFloat(wp.sFuel).toFixed(1);

                    }
                    var ximg = sv.ce("img", "sv_panelximg");
                    ximg.src = sv.data.images + "/delete.png";
                    row.appendChild(ximg);
                    row.onmouseover = function() {
                        if (dragon) {
                            handle.style.cursor = "move";
                        } else {
                            ximg.style.visibility = "visible";
                            handle.style.cursor = "pointer";
                        }
                        sv.pointHL(wp.lineid +1, true);
                    }
                    row.onmouseout = function() {
                        ximg.style.visibility = "hidden";
                        sv.pointHL(wp.lineid +1, false);
                    }
                    ximg.onclick = function() {
                        sv.planDel({pos:wp.pe});
                    }
                    


                })();
            }
        }
    },
    setWindFromFPL: function(FPL){
        if (FPL){
            var time = undefined;
            var dt = new Date();
            var utcnow = Math.round( ( dt.getTime()-this.data.timeDelta ) / 1000 );
            if (FPL.etd){
                time = FPL.etd;
                if (time < utcnow){
                    time = utcnow;
                }
            }else{
                time = utcnow + 3600;
            }
            var alt = undefined;
            if (FPL.route && FPL.route[0] && FPL.route[0].alt){
                alt = parseInt(FPL.route[0].alt);
            }else if (FPL.alt){
                var fa = FPL.alt;
                fa = fa.replace("FL","");
                alt = parseInt(fa)*100;
            }
            if (time){
                this.data.prefs.windZulu = time;
            }
            if (alt){
                this.data.prefs.windMB = this.getWindMBFromAlt(alt);
                this.data.prefs.cloudAltitude = alt;
            }
            if (time || alt){
                this.updateWindLabel();
                if (this.data.div.settings.enabled.winds){
                    this.datalayer();
                }
            }
        }
    },
    altitudeToMB: function(alt){
        var mb;
        if (alt < 36089.24){
            mb = 1013.25 * Math.pow((1-(0.0000068755856 * alt)),5.2558797);
        }else{
            mb =  226.320431925*Math.exp(-0.00004806346*(alt-36089.24));
        }
        return mb;
    },
    getWindMBFromAlt: function(alt){
        var mb = this.altitudeToMB(alt);
        var level = undefined;
        var dist = 9999;
        for (var i = 0; i < this.data.windLevels.length; i++) {
            var distance = Math.abs(this.data.windLevels[i][0] - mb);
            if (!level || distance < dist){
                level = this.data.windLevels[i][0];
                dist = distance;
            }
        }
        return level;
    },
    price: function(a, b) {
        a = a ^ b;
        var g = a & 1;
        a = a >>> 6;
        var c = "";
        while (a) {
            var d = a % 13;
            a = (a - d) / 13;
            if (d > 10) {
                c += ".";
            } else {
                c += (d % 10).toString();
            }
        }
        d = parseFloat(c);
        if (this.data.fuel.currValue) {
            d *= this.data.fuel.currValue;
        }
        if (this.data.fuel.cval) {
            d /= this.data.fuel.cval;
        }
        if (this.data.fuel.qty) {
            d *= this.data.fuel.qty;
        }
        if (d > 100) {
            var e = d.toFixed(0).toString();
        } else {
            var e = d.toFixed(2).toString();
            if (this.data.fuel.dp) {
                e = e.replace('.', this.data.fuel.dp);
            }
        }
        return [g, e];
    },
    viaMouseOut: function() {
        var sv = SkyVector;
        var FPL = sv.data.FPL;
        if (FPL) {
            for (var i = 1; i < FPL.length; i++) {
                var wp = FPL[i];
                if (wp.pulldown) {
                    if (!wp.pulldown.hover && !wp.pulldown.on && !wp.viahover) {
                        wp.pulldown.arrowon = false;
                        try {
                            sv.data.div.planEdit.pdowns.removeChild(wp.pulldown.arrow);
                        } catch (e) {
                        }
                    }
                }
            }
        }
    },
    hideViaPulldowns: function(pd) {
        var FPL = this.data.FPL;
        if (FPL) {
            for (var i = 1; i < FPL.length; i++) {
                var wp = FPL[i];
                if (wp.pulldown && wp.pulldown != pd) {
                    wp.pulldown.on = false;
                    while (wp.pulldown.arrow.firstChild) {
                        wp.pulldown.arrow.removeChild(wp.pulldown.arrow.firstChild);
                    }
                    wp.pulldown.arrowon = false;
                }
            }
        }
        
        if (this.data.div.planEdit && this.data.div.planEdit.pdowns) {
            var p = this.data.div.planEdit.pdowns;
            for (var i = p.childNodes.length - 1; i >= 0; i--) {
                var cn = p.childNodes[i];
                if (!pd || cn != pd) {
                    p.removeChild(cn);
                }
            }
        }
    
    
    },
    makeViaPulldown: function(vias, currentvia, fplIndex) {
        var sv = this;
        var pd = {};
        pd.on = false;
        pd.hover = false;
        pd.arrowon = false;
        var sv = this;
        pd.arrow = this.ce("span");
        pd.arrow.className = "sv_pulldownarrow";
        pd.arrow.contentEditable = false;
        pd.arrow.onclick = function(e) {
            if (pd.on) {
                pd.hover = false;
                sv.hideViaPulldowns();
            } else {
                sv.hideViaPulldowns(pd.arrow);
                pd.on = true;
                //pd.arrow.style.visibility="visible";
                if (!e)
                    e = window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = "true";
                }
                
                pd.menu = sv.ce("div");
                pd.menu.className = "sv_pulldownmenu";
                pd.menu.appendChild(sv.makeViaPulldownOption(sv.makeFakeVia(true, fplIndex), false, fplIndex));
                if (vias) {
                    for (i = 0; i < vias.length; i++) {
                        var selected = vias[i].id == currentvia ? true : false;
                        if (vias[i].rwyTran) {
                            pd.menu.style.width = "120px";
                        }
                        pd.menu.appendChild(sv.makeViaPulldownOption(vias[i], selected, fplIndex));
                    }
                }
                pd.menu.appendChild(sv.makeViaPulldownOption(sv.makeFakeVia(false, fplIndex), false, fplIndex));
                pd.arrow.appendChild(pd.menu);
            }
            return false;
        }
        pd.arrow.onmouseover = function() {
            pd.hover = true;
            pd.arrow.style.backgroundPosition = "-13px 0px";
        }
        pd.arrow.onmouseout = function() {
            pd.hover = false;
            pd.arrow.style.backgroundPosition = "2px 0px";
            window.setTimeout(SkyVector.viaMouseOut, 20);
        }
        return pd;
    },
    makeFakeVia: function(isDirect, fplIndex) {
        var p = this.data.FPL.route[fplIndex];
        return {
            "wrongLevel": 0,
            "wrongWay": 0,
            "route": [{"id": p.id,"icao": p.icao,"t": p.t}],
            "t": isDirect ? 'dct' : 'opt',
            "id": isDirect ? "direct" : "optimize"
        };
    },
    makeViaPulldownOption: function(via, selected, fplIndex) {
        var sv = this;
        var div = this.ce("div");
        div.className = "sv_pulldownopt";
        if (via.rwyTran) {
            if (via.t == 'sid') {
                div.appendChild(document.createTextNode("(" + via.rwyTran + ")" + via.id));
            } else {
                div.appendChild(document.createTextNode(via.id + "(" + via.rwyTran + ")"));
            }
        } else {
            div.appendChild(document.createTextNode(via.id));
        }
        div.onmouseover = function() {
            div.style.backgroundColor = "#4D7FA5";
            div.style.color = "white";
        }
        div.onmouseout = function() {
            div.style.backgroundColor = "transparent";
            div.style.color = "black";
        }
        div.onclick = function() {
            if (via.t == 'dct') {
                sv.data.FPL.route[fplIndex].via = 'D';
            } else if (via.t == 'opt') {
                sv.data.FPL.route[fplIndex].via = ' ';
            } else {
                sv.data.FPL.route[fplIndex].via = via.id;
            }
            sv.data.FPL.route[fplIndex].vt = via.t;
            sv.data.FPL.route[fplIndex].rwy = via.rwyTran;
            sv.data.FPL.route[fplIndex].route = via.route;
            sv.data.FPL.route[fplIndex].wrongWay = via.wrongWay;
            sv.data.FPL.route[fplIndex].wrongLevel = via.wrongLevel;
            if (via.append || via.prepend) {
                sv.data.FPL.route[fplIndex].viaspan.innerHTML = via.id;
                sv.data.div.planEdit.redrawon = true;
                sv.data.div.planEdit.btnRedraw.onclick();
            } else {
                sv.loadPlan();
            }
            sv.data.nowheel = false;
        }
        return div;
    },
    addPlanHovers: function(wp) {
        var sv = this;
        if (wp.viaspan) {
            wp.viahover = false;
            wp.viaspan.onmouseover = function() {
                wp.viahover = true;
                var lines = sv.data.div.planlines[wp.lineid];
                if (lines) {
                    var line = lines[0];
                    if (sv.data.isIE) {
                        line.strokecolor = "#ff0080";
                        line.strokeweight = "8px";
                        var stroke = sv.getChild(line, "v:stroke");
                        if (stroke) {
                            try {
                                stroke.opacity = "1.0";
                            } catch (err) {
                            }
                            ;
                        }
                    } else {
                        line.setAttribute("stroke-width", "8px");
                        line.setAttribute("stroke", "#ff0080");
                        line.setAttribute("opacity", "1.0")
                    }
                }
                if (wp.pulldown && !wp.pulldown.arrowon) {
                    wp.pulldown.arrowon = true;
                    //wp.viaspan.appendChild(wp.pulldown.arrow);
                    var l = wp.viaspan.offsetLeft + wp.viaspan.offsetWidth - 1;
                    var t = wp.viaspan.offsetTop + 3 - sv.data.div.planEdit.edit.scrollTop;
                    wp.pulldown.arrow.style.left = l + "px";
                    wp.pulldown.arrow.style.top = t + "px";
                    sv.data.div.planEdit.pdowns.appendChild(wp.pulldown.arrow);
                //sv.addPlanHovers(wp);
                //wp.pulldown.arrow.style.visibility="visible";
                }
            }
            wp.viaspan.onmouseout = function() {
                wp.viahover = false;
                var lines = sv.data.div.planlines[wp.lineid];
                if (lines) {
                    var line = lines[0];
                    if (sv.data.isIE) {
                        line.strokecolor = "#ff00ff";
                        line.strokeweight = "6px";
                        var stroke = sv.getChild(line, "v:stroke");
                        if (stroke) {
                            try {
                                stroke.opacity = "0.5";
                            } catch (err) {
                            }
                            ;
                        }
                    } else {
                        line.setAttribute("stroke-width", "6px");
                        line.setAttribute("stroke", "#ff00ff");
                        line.setAttribute("opacity", "0.5")
                    }
                }
                if (wp.pulldown && !wp.pulldown.on && !wp.pulldown.hover) {
                    window.setTimeout(SkyVector.viaMouseOut, 20);
                //wp.pulldown.arrow.style.visibility="hidden";
                }
            }
        }
        if (wp.span) {
            wp.span.onmouseover = function() {
                var point = sv.data.div.planpoints[wp.lineid + 1];
                if (point) {
                    if (sv.data.isIE) {
                        point.circle.strokecolor = "#ff0080";
                        point.circle.strokeweight = "4px";
                    } else {
                        point.circle.setAttribute("stroke", "#ff0080");
                        point.circle.setAttribute("stroke-width", "4px");
                    }
                }
            }
            wp.span.onmouseout = function() {
                var point = sv.data.div.planpoints[wp.lineid + 1];
                if (point) {
                    if (sv.data.isIE) {
                        point.circle.strokecolor = "#bb44bb";
                        point.circle.strokeweight = "2px";
                    } else {
                        point.circle.setAttribute("stroke", "#bb44bb");
                        point.circle.setAttribute("stroke-width", "2px");
                    }
                }
            }
            wp.span.onclick = function() {
                sv.data.lat = wp.lat;
                sv.data.lon = wp.lon;
                sv.reset();
            }
        }
    },
    snapEnd: function(e, planLineIndex, snapPoint, isPoint) {
        var sv = this;
        var planIndex = this.data.plan.points[planLineIndex].ix;
        if (snapPoint) {
            var mx = e.clientX;
            var my = e.clientY;
            var qs = {};
            qs.snap = snapPoint.id + ":" + snapPoint.icao + ":" + snapPoint.t;
            if (isPoint) {
                var prevPoint = this.data.FPL[planIndex - 1];
                var prevVia = this.data.FPL[planIndex].via;
                var nextPoint = this.data.FPL[planIndex + 1];
                var nextVia = this.data.FPL[planIndex + 1].via;
            } else {
                var prevPoint = this.data.FPL[planIndex];
                var prevVia = this.data.FPL[planIndex + 1].via;
                var nextPoint = this.data.FPL[planIndex + 1];
                var nextVia = prevVia;
            }
            qs.prev = prevPoint.id + ":" + prevPoint.icao + ":" + prevPoint.t;
            qs.next = nextPoint.id + ":" + nextPoint.icao + ":" + nextPoint.t;
            qs.ct = this.data.chartSubtype;
            var querystring = this.mkQS(qs);
            var r = this.request(this.data.perldir + "/editPlan" + querystring);
            this.throbber(true, 'snap');
            r.onerror = function() {
                sv.throbber(false, 'snap');
                alert("AJAX Error");
            }
            r.onload = function(data) {
                sv.throbber(false, 'snap');
                sv.confirmSnap(mx, my, data, planIndex, prevPoint, prevVia, nextPoint, nextVia, snapPoint, isPoint);
            }
        } else {
            sv.showSnap(false);
            sv.drawPlan();
        }
    },
    confirmSnapHide: function() {
        if (this.data.div.confirmSnap) {
            if (this.data.div.confirmSnap.div.style.visibility = 'visible') {
                this.drawPlan();
            }
            this.data.div.confirmSnap.div.style.visibility = 'hidden';
        }
        this.showSnap(false);
    },
    confirmSnap: function(mx, my, data, planIndex, prevPoint, prevVia, nextPoint, nextVia, snapPoint, isPoint) {
        var sv = this;
        var p;
        var autopick = true;
        if (this.data.div.planEdit.awyselect.selectedIndex == 1) {
            autopick = false;
        }
        if (this.data.div.confirmSnap) {
            p = this.data.div.confirmSnap;
        } else {
            p = new Object;
            this.data.div.confirmSnap = p;
            p.div = this.ce("div");
            p.div.id = "sv_confirmsnap";
            p.bg = this.ce("div");
            p.bg.id = "sv_confirmsnapbg";
            p.bg.className = "xlucent80";
            p.div.appendChild(p.bg);
            var h1 = this.ce("h1");
            h1.className = "sv sv_panel";
            h1.appendChild(document.createTextNode("Confirm Route Edit"));
            p.div.appendChild(h1);
            var table = this.ce("table");
            table.id = "sv_confirmsnaptable";
            var tbody = this.ce("tbody");
            table.appendChild(tbody);
            var tr1 = this.ce("tr");
            var th1 = this.ce("td");
            th1.appendChild(document.createTextNode("Previous Waypoint"));
            tr1.appendChild(th1);
            var td1 = this.ce("td");
            p.prev = this.ce("div");
            p.prev.className = "sv_snapconfirmLabel";
            td1.appendChild(p.prev);
            tr1.appendChild(td1);
            tbody.appendChild(tr1);
            var tr2 = this.ce("tr");
            var th2 = this.ce("td");
            th2.appendChild(document.createTextNode("via"));
            tr2.appendChild(th2);
            var td2 = this.ce("td");
            p.via1 = this.ce("select");
            p.via1.className = "sv_snapconfirmSelect";
            td2.appendChild(p.via1);
            tr2.appendChild(td2);
            tbody.appendChild(tr2);
            var tr3 = this.ce("tr");
            var th3 = this.ce("td");
            th3.appendChild(document.createTextNode("New Waypoint"));
            tr3.appendChild(th3);
            var td3 = this.ce("td");
            p.newpt = this.ce("div");
            p.newpt.className = "sv_snapconfirmLabel";
            p.newpt.style.borderColor = "#bb44bb";
            td3.appendChild(p.newpt);
            tr3.appendChild(td3);
            tbody.appendChild(tr3);
            var tr4 = this.ce("tr");
            var th4 = this.ce("td");
            th4.appendChild(document.createTextNode("via"));
            tr4.appendChild(th4);
            var td4 = this.ce("td");
            p.via2 = this.ce("select");
            p.via2.className = "sv_snapconfirmSelect";
            td4.appendChild(p.via2);
            tr4.appendChild(td4);
            tbody.appendChild(tr4);
            var tr5 = this.ce("tr");
            var th5 = this.ce("td");
            th5.appendChild(document.createTextNode("Next Waypoint"));
            tr5.appendChild(th5);
            var td5 = this.ce("td");
            p.next = this.ce("div");
            p.next.className = "sv_snapconfirmLabel";
            td5.appendChild(p.next);
            tr5.appendChild(td5);
            tbody.appendChild(tr5);
            p.div.appendChild(table);
            var btnCancel = this.ce("input");
            btnCancel.type = "submit";
            btnCancel.value = "Cancel";
            btnCancel.textContent = "Cancel";
            btnCancel.onclick = function() {
                p.div.style.visibility = "hidden";
                sv.drawPlan();
            }
            p.div.appendChild(btnCancel);
            p.btnAccept = this.ce("input");
            p.btnAccept.type = "submit";
            p.btnAccept.value = "OK";
            p.btnAccept.textContent = "OK";
            p.div.appendChild(p.btnAccept);
            this.data.div.chart.appendChild(p.div);
            this.dragEnable(p.div, p.bg);
            this.dragEnable(p.div, h1);
        }
        if (my + 200 > this.data.height) {
            my -= 230;
        }
        p.div.style.top = (my + 10) + "px";
        p.div.style.left = (mx - 100) + "px";
        if (!autopick) {
            p.div.style.visibility = "visible";
        }
        var prevpt = this.lookupWaypoint(prevPoint);
        p.prev.innerHTML = prevPoint.id;
        p.prev.style.backgroundPosition = "2px " + (-2 - 20 * prevpt.t) + "px";
        p.newpt.innerHTML = snapPoint.id;
        p.newpt.style.backgroundPosition = "2px " + (-2 - 20 * snapPoint.t) + "px";
        var nextpt = this.lookupWaypoint(nextPoint);
        p.next.innerHTML = nextPoint.id;
        p.next.style.backgroundPosition = "2px " + (-2 - 20 * nextpt.t) + "px";
        while (p.via1.firstChild) {
            p.via1.removeChild(p.via1.firstChild);
        }
        if (data.prevVia) {
            var opt = this.ce("option");
            opt.value = "D";
            opt.innerHTML = "direct";
            p.via1.appendChild(opt);
            var selected = false;
            for (var i = 0; i < data.prevVia.length; i++) {
                var v = data.prevVia[i];
                v.opt = this.ce("option");
                v.opt.value = i;
                v.opt.innerHTML = v.id;
                if ((!selected && v.wrongWay != 1 && v.wrongLevel != 1) || v.id == prevVia) {
                    v.opt.selected = true;
                    selected = true;
                }
                p.via1.appendChild(v.opt);
            }
            p.via1.disabled = false;
            p.via1.style.backgroundColor = "#ffffff";
            p.via1.style.color = "#000000";
        } else {
            var opt = this.ce("option");
            opt.value = "D";
            opt.innerHTML = "direct";
            p.via1.appendChild(opt);
            p.via1.disabled = true;
            p.via1.style.backgroundColor = "#eeeeee";
            p.via1.style.color = "#999999";
        }
        while (p.via2.firstChild) {
            p.via2.removeChild(p.via2.firstChild);
        }
        if (data.nextVia) {
            var opt = this.ce("option");
            opt.value = "D";
            opt.innerHTML = "direct";
            p.via2.appendChild(opt);
            var selected = false;
            for (var i = 0; i < data.nextVia.length; i++) {
                var v = data.nextVia[i];
                v.opt = this.ce("option");
                v.opt.value = i;
                v.opt.innerHTML = v.id;
                if ((!selected && v.wrongWay != 1 && v.wrongLevel != 1) || v.id == nextVia) {
                    v.opt.selected = true;
                    selected = true;
                }
                p.via2.appendChild(v.opt);
            }
            p.via2.disabled = false;
            p.via2.style.backgroundColor = "#ffffff";
            p.via2.style.color = "#000000";
        } else {
            var opt = this.ce("option");
            opt.value = "D";
            opt.innerHTML = "direct";
            p.via2.appendChild(opt);
            p.via2.disabled = true;
            p.via2.style.backgroundColor = "#eeeeee";
            p.via2.style.color = "#999999";
        }
        p.btnAccept.onclick = function() {
            p.div.style.visibility = "hidden";
            sv.showSnap(false);
            var route1 = [];
            var route2 = [];
            var via1val;
            var via2val;
            var vt1;
            var vt2;
            var rwy1 = false;
            var rwy2 = false;
            var wrongWay1;
            var wrongWay2;
            var wrongLevel1;
            var wrongLevel2;
            var appendpts = [];
            var prependpts = [];
            var via1sel = p.via1.selectedIndex;
            if (via1sel > 0) {
                if (data.prevVia[via1sel - 1].append) {
                    appendpts = data.prevVia[via1sel - 1].append;
                }
                route1 = data.prevVia[via1sel - 1].route;
                via1val = data.prevVia[via1sel - 1].id;
                rwy1 = data.prevVia[via1sel - 1].rwyTran;
                wrongWay1 = data.prevVia[via1sel - 1].wrongWay;
                wrongLevel1 = data.prevVia[via1sel - 1].wrongLevel;
                if (data.prevVia[via1sel - 1].t == "sid") {
                    vt1 = 'sid';
                } else {
                    vt1 = 'ats';
                }
            } else {
                route1.push({"id": snapPoint.id,"icao": snapPoint.icao,"t": sv.typemap(snapPoint.t)});
                via1val = 'D';
                vt1 = 'dct';
            }
            var via2sel = p.via2.selectedIndex;
            if (via2sel > 0) {
                if (data.nextVia[via2sel - 1].prepend) {
                    prependpts = data.nextVia[via2sel - 1].prepend;
                }
                route2 = data.nextVia[via2sel - 1].route;
                via2val = data.nextVia[via2sel - 1].id;
                rwy2 = data.nextVia[via2sel - 1].rwyTran;
                wrongWay2 = data.nextVia[via2sel - 1].wrongWay;
                wrongLevel2 = data.nextVia[via2sel - 1].wrongLevel;
                if (data.nextVia[via2sel - 1].t == "star") {
                    vt2 = 'star';
                } else {
                    vt2 = 'ats';
                }
            } else {
                route2.push(nextPoint);
                via2val = 'D';
                vt2 = 'dct';
            }
            if (appendpts.length > 0) {
                var route1copy = [];
                for (var ix = 0; ix < route1.length; ix++) {
                    route1copy.push(route1[ix]);
                }
                for (var ix = 0; ix < appendpts.length; ix++) {
                    if (isPoint) {
                        sv.data.FPL.splice(planIndex, 1);
                        isPoint = false;
                    } else {
                        planIndex++;
                    }
                    var pt = appendpts[ix];
                    if (ix == 0) {
                        sv.data.FPL.splice(planIndex, 0, {
                            "id": pt.id,
                            "icao": pt.icao,
                            "t": pt.t,
                            "via": via1val,
                            "rwy": rwy1,
                            "vt": vt1,
                            "route": route1copy,
                            "vias": data.prevVia
                        });
                    } else {
                        sv.data.FPL.splice(planIndex, 0, {
                            "id": pt.id,
                            "icao": pt.icao,
                            "t": pt.t,
                            "via": 'D',
                            "vt": 'dct',
                            "route": [{"id": pt.id,"icao": pt.icao,"t": pt.t}]
                        });
                    }
                }
                route1 = [{"id": snapPoint.id,"icao": snapPoint.icao,"t": sv.typemap(snapPoint.t)}];
                via1val = 'D';
                vt1 = false;
            }
            if (isPoint) {
                sv.data.FPL[planIndex] = {
                    "id": snapPoint.id,
                    "icao": snapPoint.icao,
                    "t": sv.typemap(snapPoint.t),
                    "via": via1val,
                    "rwy": rwy1,
                    "vt": vt1,
                    "vias": data.prevVia,
                    "wrongWay": wrongWay1,
                    "wrongLevel": wrongLevel1,
                    "route": route1};
                sv.data.FPL[planIndex + 1].route = route2;
                sv.data.FPL[planIndex + 1].via = via2val;
                sv.data.FPL[planIndex + 1].rwy = rwy2;
                sv.data.FPL[planIndex + 1].vt = vt2;
                sv.data.FPL[planIndex + 1].vias = data.nextVia;
                sv.data.FPL[planIndex + 1].wrongWay = wrongWay2;
                sv.data.FPL[planIndex + 1].wrongLevel = wrongLevel2;
            } else {
                sv.data.FPL[planIndex + 1].route = route2;
                sv.data.FPL[planIndex + 1].via = via2val;
                sv.data.FPL[planIndex + 1].rwy = rwy2;
                sv.data.FPL[planIndex + 1].vt = vt2;
                sv.data.FPL[planIndex + 1].vias = data.nextVia;
                sv.data.FPL[planIndex + 1].wrongWay = wrongWay2;
                sv.data.FPL[planIndex + 1].wrongLevel = wrongLevel2;
                sv.data.FPL.splice(planIndex + 1, 0, {
                    "id": snapPoint.id,
                    "icao": snapPoint.icao,
                    "t": sv.typemap(snapPoint.t),
                    "via": via1val,
                    "rwy": rwy1,
                    "vias": data.prevVia,
                    "vt": vt1,
                    "wrongWay": wrongWay1,
                    "wrongLevel": wrongLevel1,
                    "route": route1});
                planIndex++;
            
            }
            if (prependpts) {
                var insertStart = planIndex + 1;
                for (var ix = 0; ix < prependpts.length; ix++) {
                    var pt = prependpts[ix];
                    sv.data.FPL.splice(insertStart, 0, {
                        "id": pt.id,
                        "icao": pt.icao,
                        "t": pt.t,
                        "via": 'D',
                        "vt": 'dct',
                        "route": [{"id": pt.id,"icao": pt.icao,"t": pt.t}]
                    });
                    insertStart++;
                }
            }
            sv.loadPlan();
        
        }
        if (autopick) {
            p.btnAccept.onclick();
        }
    },
    dragEnable: function(div, handle) {
        var sv = this;
        var startx = 0;
        var starty = 0;
        var starttop = div.offsetTop;
        var startleft = div.offsetLeft;
        var mintop = 44;
        var maxtop = (sv.data.height - (div.offsetHeight + 19));
        var minleft = 19;
        var maxleft = (sv.data.width - (div.offsetWidth));
        
        var mdrag = function(e) {
            if (!e)
                e = window.event;
            var newx = e.clientX;
            var newy = e.clientY;
            var newtop = starttop + (newy - starty);
            var newleft = startleft + (newx - startx);
            if (newtop > maxtop)
                newtop = maxtop;
            if (newtop < mintop)
                newtop = mintop;
            if (newleft < minleft)
                newleft = minleft;
            if (newleft > maxleft)
                newleft = maxleft;
            div.style.top = Math.round(newtop) + "px";
            div.style.left = Math.round(newleft) + "px";
        }
        var mup = function(e) {
            if (document.detachEvent) {
                document.detachEvent("onmousemove", mdrag);
                document.detachEvent("onmouseup", mup);
            } else {
                document.removeEventListener("mousemove", mdrag, false);
                document.removeEventListener("mouseup", mup, false);
            }
        }
        handle.onmousedown = function(e) {
            if (sv.data.stopdrag) {
                return;
            }
            if (!e)
                e = window.event;
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            starttop = div.offsetTop;
            startleft = div.offsetLeft;
            startx = e.clientX;
            starty = e.clientY;
            maxtop = (sv.data.height - (div.offsetHeight + 19));
            maxleft = (sv.data.width - (div.offsetWidth));
            if (document.attachEvent) {
                document.attachEvent("onmousemove", mdrag);
                document.attachEvent("onmouseup", mup);
            } else {
                document.addEventListener("mousemove", mdrag, false);
                document.addEventListener("mouseup", mup, false);
            }
            return false;
        }
    /*
        handle.onselectstart = function() {
            return false
        };
        handle.onselect = function() {
            return false
        };
        handle.ondrag = function() {
            return false
        };*/
    },
    debug: function(obj) {
        var txt = '';
        for (i in obj) {
            txt += i + ": " + obj[i] + "\n";
        }
        return txt;
    },
    hideDeleteDialog: function() {
        if (this.data.div.deleteDialog) {
            this.data.div.deleteDialog.div.style.visibility = "hidden";
        }
    },
    deleteDialog: function(planLineIndex, clientX, clientY) {
        var sv = this;
        var x = clientX + document.body.scrollLeft + document.documentElement.scrollLeft - this.data.mouse.ox;
        var y = clientY + document.body.scrollTop + document.documentElement.scrollTop - this.data.mouse.oy;
        var sv = this;
        var fplIndex = this.data.plan.points[planLineIndex].ix;
        if (fplIndex > 0 && fplIndex < this.data.FPL.length - 1) {
            var d = this.data.div.deleteDialog;
            if (!d) {
                this.data.div.deleteDialog = new Object;
                d = this.data.div.deleteDialog;
                d.div = this.ce("div");
                d.div.id = "sv_deleteDialog";
                d.link = this.ce("div");
                d.link.id = "sv_deleteDialogLink";
                d.link.appendChild(document.createTextNode("Delete Waypoint"));
                d.div.appendChild(d.link);
                this.data.div.chart.appendChild(d.div);
            }
            d.link.onclick = function() {
                sv.deletePoint(d.fplIndex);
                sv.hideDeleteDialog();
            }
            
            d.fplIndex = fplIndex;
            var newx = x;
            if (newx > this.data.width - (d.div.offsetWidth + 5)) {
            //   newx=x-(d.div.offsetWidth+5);
            }
            var newy = y;
            if (newy > this.data.height - (d.div.offsetHeight + 5)) {
            //    newy=y-(d.div.offsetHeight+5);
            }
            d.div.style.left = Math.round(newx) + "px";
            d.div.style.top = Math.round(newy) + "px";
            d.div.style.visibility = "visible";
        }
    },
    deletePoint: function(fplIndex) {
        var sv = this;
        if (this.data.FPL && this.data.FPL.length > fplIndex + 1 && fplIndex > 0) {
            var FPL = this.data.FPL;
            var via1 = FPL[fplIndex].via;
            var via2 = FPL[fplIndex + 1].via;
            //FPL.splice(fplIndex,1);
            var qs = {};
            qs.snap = FPL[fplIndex + 1].id + ":" + FPL[fplIndex + 1].icao + ":" + FPL[fplIndex + 1].t;
            qs.prev = FPL[fplIndex - 1].id + ":" + FPL[fplIndex - 1].icao + ":" + FPL[fplIndex - 1].t;
            qs.ct = this.data.chartSubtype;
            var querystring = this.mkQS(qs);
            var r = this.request(this.data.perldir + "/editPlan" + querystring);
            this.throbber(true, 'deletePoint');
            r.onerror = function() {
                sv.throbber(false, 'deletePoint');
                alert("AJAX Error");
            }
            r.onload = function(data) {
                sv.throbber(false, 'deletePoint');
                sv.confirmDelete(data, fplIndex, via1, via2);
            }
        }
    },
    confirmDeleteHide: function() {
        if (this.data.div.confirmDelete) {
            this.data.div.confirmDelete.div.style.visibility = 'hidden';
        }
        this.showSnap(false);
    },
    confirmDelete: function(data, fplIndex, prevVia, nextVia) {
        var sv = this;
        var p;
        var autopick = true;
        if (this.data.div.planEdit.awyselect.selectedIndex == 1) {
            autopick = false;
        }
        if (this.data.div.confirmDelete) {
            p = this.data.div.confirmDelete;
        } else {
            p = new Object;
            this.data.div.confirmDelete = p;
            p.div = this.ce("div");
            p.div.id = "sv_confirmdelete";
            p.bg = this.ce("div");
            p.bg.id = "sv_confirmdeletebg";
            p.bg.className = "xlucent80";
            p.div.appendChild(p.bg);
            var h1 = this.ce("h1");
            h1.className = "sv sv_panel";
            h1.appendChild(document.createTextNode("Select Via"));
            p.div.appendChild(h1);
            var table = this.ce("table");
            table.id = "sv_confirmsnaptable";
            var tbody = this.ce("tbody");
            table.appendChild(tbody);
            var tr1 = this.ce("tr");
            var th1 = this.ce("td");
            th1.appendChild(document.createTextNode("Previous Waypoint"));
            tr1.appendChild(th1);
            var td1 = this.ce("td");
            p.prev = this.ce("div");
            p.prev.className = "sv_snapconfirmLabel";
            td1.appendChild(p.prev);
            tr1.appendChild(td1);
            tbody.appendChild(tr1);
            var tr2 = this.ce("tr");
            var th2 = this.ce("td");
            th2.appendChild(document.createTextNode("via"));
            tr2.appendChild(th2);
            var td2 = this.ce("td");
            p.via1 = this.ce("select");
            p.via1.className = "sv_snapconfirmSelect";
            td2.appendChild(p.via1);
            tr2.appendChild(td2);
            tbody.appendChild(tr2);
            var tr5 = this.ce("tr");
            var th5 = this.ce("td");
            th5.appendChild(document.createTextNode("Next Waypoint"));
            tr5.appendChild(th5);
            var td5 = this.ce("td");
            p.next = this.ce("div");
            p.next.className = "sv_snapconfirmLabel";
            td5.appendChild(p.next);
            tr5.appendChild(td5);
            tbody.appendChild(tr5);
            p.div.appendChild(table);
            var btnCancel = this.ce("input");
            btnCancel.type = "submit";
            btnCancel.value = "Cancel";
            btnCancel.textContent = "Cancel";
            btnCancel.onclick = function() {
                p.div.style.visibility = "hidden";
                sv.drawPlan();
            }
            p.div.appendChild(btnCancel);
            p.btnAccept = this.ce("input");
            p.btnAccept.type = "submit";
            p.btnAccept.value = "OK";
            p.btnAccept.textContent = "OK";
            p.div.appendChild(p.btnAccept);
            this.data.div.chart.appendChild(p.div);
            this.dragEnable(p.div, p.bg);
            this.dragEnable(p.div, h1);
        }
        var mx = this.data.mouse.x;
        var my = this.data.mouse.y;
        if (my + 200 > this.data.height) {
            my -= 230;
        }
        p.div.style.top = (my + 10) + "px";
        p.div.style.left = (mx - 100) + "px";
        if (!autopick) {
            p.div.style.visibility = "visible";
        }
        var prevPoint = this.data.FPL[fplIndex - 1];
        var prevpt = this.lookupWaypoint(prevPoint);
        p.prev.innerHTML = prevPoint.id;
        p.prev.style.backgroundPosition = "2px " + (-2 - 20 * prevpt.t) + "px";
        var nextPoint = this.data.FPL[fplIndex + 1];
        var nextpt = this.lookupWaypoint(nextPoint);
        p.next.innerHTML = nextPoint.id;
        p.next.style.backgroundPosition = "2px " + (-2 - 20 * nextpt.t) + "px";
        while (p.via1.firstChild) {
            p.via1.removeChild(p.via1.firstChild);
        }
        if (data.prevVia) {
            var opt = this.ce("option");
            opt.value = "D";
            opt.innerHTML = "direct";
            p.via1.appendChild(opt);
            var selected = false;
            for (var i = 0; i < data.prevVia.length; i++) {
                var v = data.prevVia[i];
                v.opt = this.ce("option");
                v.opt.value = i;
                v.opt.innerHTML = v.id;
                if ((!selected && v.wrongWay != 1 && v.wrongLevel != 1) || v.id == prevVia) {
                    v.opt.selected = true;
                    selected = true;
                }
                p.via1.appendChild(v.opt);
            }
            p.via1.disabled = false;
            p.via1.style.backgroundColor = "#ffffff";
            p.via1.style.color = "#000000";
        } else {
            var opt = this.ce("option");
            opt.value = "D";
            opt.innerHTML = "direct";
            p.via1.appendChild(opt);
            p.via1.disabled = true;
            p.via1.style.backgroundColor = "#eeeeee";
            p.via1.style.color = "#999999";
        }
        
        p.btnAccept.onclick = function() {
            p.div.style.visibility = "hidden";
            sv.showSnap(false);
            var route1 = [];
            var via1val;
            var rwy1 = false;
            var vt1;
            var wrongWay1;
            var wrongLevel1;
            var appendpts = [];
            var prependpts = [];
            var via1sel = p.via1.selectedIndex;
            if (via1sel > 0) {
                if (data.prevVia[via1sel - 1].append) {
                    appendpts = data.prevVia[via1sel - 1].append;
                }
                route1 = data.prevVia[via1sel - 1].route;
                via1val = data.prevVia[via1sel - 1].id;
                rwy1 = data.prevVia[via1sel - 1].rwyTran;
                wrongWay1 = data.prevVia[via1sel - 1].wrongWay;
                wrongLevel1 = data.prevVia[via1sel - 1].wrongLevel;
                if (data.prevVia[via1sel - 1].t == "sid") {
                    vt1 = 'sid';
                } else if (data.prevVia[via1sel - 1].t == "star") {
                    vt1 = 'star';
                } else {
                    vt1 = 'ats';
                }
            } else {
                route1.push({"id": nextPoint.id,"icao": nextPoint.icao,"t": nextPoint.t});
                via1val = 'D';
                vt1 = 'dct';
            }
            sv.data.FPL.splice(fplIndex, 1);
            sv.data.FPL[fplIndex].route = route1;
            sv.data.FPL[fplIndex].via = via1val;
            sv.data.FPL[fplIndex].rwy = rwy1;
            sv.data.FPL[fplIndex].vt = vt1;
            sv.data.FPL[fplIndex].vias = data.prevVia;
            sv.data.FPL[fplIndex].wrongWay = wrongWay1;
            sv.data.FPL[fplIndex].wrongLevel = wrongLevel1;
            sv.loadPlan();
        }
        if (autopick) {
            p.btnAccept.onclick();
        }
    },
    message: function(text, timer) {
        var p = this.data.div.message;
        if (!p) {
            p = new Object;
            this.data.div.message = p;
            p.div = this.ce("div");
            p.div.id = "sv_message";
            this.data.div.chart.appendChild(p.div);
        }
        p.div.style.top = Math.round(-30 + this.data.height / 2) + "px";
        p.div.style.left = Math.round(-100 + this.data.width / 2) + "px";
        p.div.innerHTML = text;
        p.div.style.visibility = "visible";
        var hide = function() {
            p.div.style.visibility = "hidden";
        }
        window.setTimeout(hide, 1000 * timer);
    },
    fboid: function(O) {
        return ((O & 255) * 16777216) + ((O & 65280) * 256) + ((O & 4080) * 16) + ((O & 1044480) / 4096);
    },
    bigeditbtnShowHide: function() {
        var ison = false;
        /*
        if(this.data.param.allowEdit){
            for (var i=0; i < this.data.settings.routes.length ; i++){
                if(this.data.settings.routes[i].on){
                    ison=true;
                    break;
                }
            }
        }*/
        if (ison) {
            this.data.div.bigeditbtn.style.visibility = '';
        } else {
            this.data.div.bigeditbtn.style.visibility = 'hidden';
        }
    },
    disablePrint: function() {
    //    var sv = this;
    //    this.data.div.tb_print.innerHTML = "<img style=\"width: 16px; height: 16px\" src=\"" + this.data.images + "/printicon_gray.png\"/>Print";
    //    this.data.div.tb_print.style.color = "#aaaaaa";
    //    this.data.div.tb_print.onclick = function() {
    //        sv.message("Printing is disabled while we make it better.", 4);
    //    }
    },
    enablePrint: function() {
    //    var sv = this;
    //    this.data.div.tb_print.innerHTML = "<img style=\"width: 16px; height: 16px\" src=\"" + this.data.images + "/printicon.png\"/>Print";
    //    this.data.div.tb_print.style.color = "#FFFFFF";
    //    this.data.div.tb_print.onclick = function() {
    //        sv.showPrint();
    //    }
    },
    showInfoBox: function(text) {
        var p = this.data.div.infoBox;
        var sv = this;
        if (!p) {
            p = new Object;
            this.data.div.infoBox = p;
            p.div = this.ce("div");
            p.div.id = "sv_infoBox";
            p.div2 = this.ce("div");
            p.div2.className = "sv_infoBoxTxt";
            p.div.appendChild(p.div2);
            p.pre = this.ce("pre");
            p.div2.appendChild(p.pre);
            this.data.div.chart.appendChild(p.div);
            var mdown = function(e) {
                sv.data.stopdrag = true;
            }
            var mup = function(e) {
                sv.data.stopdrag = undefined;
            }
            p.div.onmouseover = function() {
                sv.data.nowheel = true;
            }
            p.div.onmouseout = function() {
                sv.data.nowheel = false;
            }
            p.div.onmousewheel = function(e) {
                if (!e)
                    e = window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = "true";
                }
            }
            if (p.pre.attachEvent) {
                p.div2.attachEvent("onmousedown", mdown);
                p.div2.attachEvent("onmouseup", mup);
                p.pre.attachEvent("onmousedown", mdown);
                p.pre.attachEvent("onmouseup", mup);
            } else {
                p.div2.addEventListener("mousedown", mdown, false);
                p.div2.addEventListener("mouseup", mup, false);
                p.pre.addEventListener("mousedown", mdown, false);
                p.pre.addEventListener("mouseup", mup, false);
            }
            
            p.div.style.top = Math.round(-100 + this.data.height / 2) + "px";
            p.div.style.left = Math.round(-250 + this.data.width / 2) + "px";
            this.dragEnable(p.div, p.div);
            var btn = this.ce("input");
            btn.type = "button";
            btn.value = "Close";
            btn.className = "sv_messageOkBtn";
            btn.onclick = function() {
                p.div.style.visibility = "hidden";
            }
            p.div.appendChild(btn);
        }
        p.pre.innerHTML = text;
        p.div.style.visibility = "visible";
        try {
            ga_event('send', 'event', 'Map', 'InfoBox');
        } catch (e) {
        }
        ;
    },
    makeIcon: function(borderColor, fillColor, width, height) {
        var icon = this.ce("div");
        icon.className = "sv_settingsLegend";
        if (borderColor) {
            icon.style.borderColor = borderColor;
        }
        if (fillColor) {
            icon.style.backgroundColor = fillColor;
        }
        if (width) {
            icon.style.width = width;
        }
        if (height) {
            icon.style.height = height;
        }
        return icon;
    },
    makeSetting: function(name, label, icon) {
        var sv = this;
        var s = sv.data.div.settings;
        var ck = this.ce("input");
        ck.type = "checkbox";
        var div = this.ce("div");
        var span = this.ce("span");
        span.className = "sv_settingsd";
        span.appendChild(ck);
        if (icon) {
            span.appendChild(icon);
        }
        var labelText = document.createTextNode(label);
        span.appendChild(labelText);
        sv.data.div.settingsLabels[name] = labelText;
        div.appendChild(span);
        span.onclick = function() {
            var valueTxt = "_off";
            if (s.enabled[name]) {
                s.enabled[name] = false;
                ck.checked = false;
            } else {
                s.enabled[name] = true;
                ck.checked = true;
                valueTxt = "_on";
            }
            sv.datalayer();
            try {
                ga_event('send', 'event', 'Map', 'Setting', name + valueTxt);
            } catch (e) {
            }
            ;
        }
        div.setCheck = function() {
            if (s.enabled[name]) {
                ck.checked = true;
            } else {
                ck.checked = false;
            }
        }
        if (!sv.data.div.setChecks)
            sv.data.div.setChecks = {};
        sv.data.div.setChecks[name] = div;
        return div;
    },
    makeSettingEx: function(name, label, tag, icon) {
        var sv = this;
        var s = sv.data.div.settings;
        var ck = this.ce("input");
        ck.type = "checkbox";
        var div = this.ce("div");
        var span = this.ce("span");
        span.className = "sv_settingsd";
        span.appendChild(ck);
        if (icon) {
            span.appendChild(icon);
        }
        span.appendChild(document.createTextNode(label));
        div.appendChild(span);
        span.onclick = function() {
            if (ck.disabled)
                return;
            for (var i = 0; i < sv.data.div.setEx[tag].length; i++) {
                var ck2 = sv.data.div.setEx[tag][i];
                if (ck2[0] != name) {
                    s.enabled[ck2[0]] = false;
                    ck2[1].checked = false;
                }
            }
            var valueTxt = "_off";
            if (s.enabled[name]) {
                s.enabled[name] = false;
                ck.checked = false;
            } else {
                s.enabled[name] = true;
                ck.checked = true;
                valueTxt = "_on";
            }
            sv.draw.labelca = [];
            sv.draw.labelpc = {};
            sv.draw.labeldup = {};
            sv.datalayer();
            try {
                ga_event('send', 'event', 'Map', 'Setting', name + valueTxt);
            } catch (e) {
            }
            ;
        }
        div.setCheck = function() {
            if (s.enabled[name]) {
                ck.checked = true;
            } else {
                ck.checked = false;
            }
        }
        div.setEnabled = function(isEnabled) {
            if (isEnabled) {
                ck.disabled = false;
                span.style.cursor = "pointer";
                span.style.color = "black";
            } else {
                ck.disabled = true;
                span.style.cursor = "default";
                span.style.color = "#AAAAAA";
            }
        }
        if (!sv.data.div.setEx)
            sv.data.div.setEx = {};
        if (!sv.data.div.setEx[tag])
            sv.data.div.setEx[tag] = [];
        sv.data.div.setEx[tag].push([name, ck]);
        return div;
    },
    clearBoth: function() {
        var div = this.ce("div");
        div.className = "clearboth";
        return div;
    },
    addSvgLayer: function() {
        this.data.div.svgLayer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.data.div.svgLayer.id = "sv_svgLayer";
        this.data.div.slider.insertBefore(this.data.div.svgLayer, this.data.div.slider.firstChild);
        
        this.data.div.shapes = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.data.div.shapes.id = "sv_shapes";
        this.data.div.svgLayer.appendChild(this.data.div.shapes);
        
        this.data.div.plan = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.data.div.plan.id = "sv_plan";
        this.data.div.svgLayer.appendChild(this.data.div.plan);
    },
    moveSvgLayer: function(noclear) {
        var svg = this.data.div.svgLayer;
        svg.setAttribute("width", this.data.width + "px");
        svg.setAttribute("height", this.data.height + "px");
        var xoff = Math.round(this.data.p.x - (this.data.width / 2));
        var yoff = Math.round(this.data.p.y - (this.data.height / 2));
        svg.style.top = Math.round(yoff - this.data.slideroffsety) + "px";
        svg.style.left = Math.round(xoff - this.data.slideroffsetx) + "px";
        svg.setAttribute("viewBox", xoff + " " + yoff + " " + this.data.width + " " + this.data.height);
        this.moveCanvas(xoff, yoff, noclear);
    },
    setMapCredit: function(html) {
        if (!this.data.div.mapCredit) {
            this.data.div.mapCredit = new Object;
            var m = this.data.div.mapCredit;
            m.div = this.ce("div");
            m.div.id = "sv_mapCredit";
            this.data.div.chart.appendChild(m.div);
        }
        if (html) {
            this.data.div.mapCredit.div.innerHTML = html;
            this.data.div.mapCredit.div.style.visibility = 'visible';
        } else {
            this.data.div.mapCredit.div.style.visibility = 'hidden';
        }
    },
    saveLayers: function() {
        var masks = [];
        var all_layers = this.data.settings.layers_vector.concat(this.data.settings.layers_raster);
        for (var i = 0; i < all_layers.length; i++) {
            var layerName = all_layers[i];
            var bit = (i % 30) + 1;
            var block = Math.floor(i / 30);
            if (!masks[block]) {
                masks[block] = 1;
            }
            if (this.data.div.settings.enabled[layerName]) {
                masks[block] = masks[block] | (1 << bit);
            }
        }
        var retval = "";
        for (var i = 0; i < masks.length; i++) {
            var str = masks[i].toString(16);
            while (str.length < 8) {
                str = "0" + str;
            }
            retval += str;
        }
        return retval;
    },
    restoreLayers: function(cookieVal) {
        var crumbs = cookieVal.split(",");
        var mask = crumbs[4];
        var masks = [];
        if (mask) {
            var all_layers = this.data.settings.layers_vector.concat(this.data.settings.layers_raster);
            if (!this.param('layers_on')) {
                this.data.settings.layers_on = [];
                for (var i = 0; i < Math.ceil(mask.length / 8); i++) {
                    masks[i] = parseInt(mask.substr(i * 8, 8), 16);
                }
                for (var i = 0; i < all_layers.length; i++) {
                    var bit = (i % 30) + 1;
                    var block = Math.floor(i / 30);
                    if (masks[block] & (1 << bit)) {
                        this.data.settings.layers_on.push(all_layers[i]);
                    }
                }
            }
        }
        var fuel = crumbs[5];
        if (fuel) {
            var fdata = fuel.split("-");
            this.data.fuel.curr = fdata[0];
            this.data.fuel.qty = fdata[1];
            this.data.fuel.unit = fdata[2];
            for (var i = 0; i < this.data.selectlist.currency.length; i++) {
                var curr = this.data.selectlist.currency[i];
                if (curr[0] == fdata[0]) {
                    this.data.fuel.dp = curr[2];
                    break;
                }
            }
            for (var i = 0; i < this.data.selectlist.units.length; i++) {
                var unit = this.data.selectlist.units[i];
                if (unit[0] == fdata[2]) {
                    this.data.fuel.cval = parseFloat(unit[2]);
                    break;
                }
            }
        }
    },
    showJeta: function() {
        this.showSettings(2);
        this.data.div.settings.enabled.metar = false;
        this.data.div.setChecks.metar.setCheck();
        for (var i = 0; i < this.data.div.setEx.fuel.length; i++) {
            var ck2 = this.data.div.setEx.fuel[i];
            if (ck2[0] == 'jeta') {
                if (!ck2[1].checked) {
                    ck2[1].click();
                }
            }
        }
    },
    showAvgas: function() {
        this.showSettings(2);
        this.data.div.settings.enabled.metar = false;
        this.data.div.setChecks.metar.setCheck();
        for (var i = 0; i < this.data.div.setEx.fuel.length; i++) {
            var ck2 = this.data.div.setEx.fuel[i];
            if (ck2[0] == 'avgas') {
                if (!ck2[1].checked) {
                    ck2[1].click();
                }
            }
        }
    },
    showNogas: function(){
        for (var i = 0; i < this.data.div.setEx.fuel.length; i++) {
            var ck2 = this.data.div.setEx.fuel[i];
            if (ck2[1].checked) {
                ck2[1].click();
            }
        }
    },
    showDrotam: function(type){
        if (type == 'none'){
            for (var i = 0; i < this.data.div.setEx.drotam.length; i++) {
                var ck2 = this.data.div.setEx.drotam[i];
                if (ck2[1].checked) {
                    ck2[1].click();
                }
            }
        }else if (type == 'all'){
            this.showSettings(1);
            for (var i = 0; i < this.data.div.setEx.drotam.length; i++) {
                var ck2 = this.data.div.setEx.drotam[i];
                if (ck2[0] == 'drotam'){
                    if (!ck2[1].checked) {
                        ck2[1].click();
                    }
                }
            }
        }else if (type == 'some'){
            this.showSettings(1);
            for (var i = 0; i < this.data.div.setEx.drotam.length; i++) {
                var ck2 = this.data.div.setEx.drotam[i];
                if (ck2[0] == 'drotam200'){
                    if (!ck2[1].checked) {
                        ck2[1].click();
                    }
                }
            }
        }
    },
    canvasRoundRect: function(ctx, x, y, width, height, radius) {
        x -= 0.5;
        y -= 0.5;
        width += 1;
        height += 1;
        ctx.beginPath()
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
    },
    moveCanvas: function(xoff, yoff, noclear) {
        if (this.data.div.ctx) {
            if (this.data.div.canvas.clientHeight == this.data.height && 
            this.data.div.canvas.clientWidth == this.data.width) {
                this.data.div.ctx.translate(-1 * this.data.canvasTranslate[0], -1 * this.data.canvasTranslate[1]);
                if (!noclear) {
                    this.data.div.ctx.clearRect(0, 0, this.data.div.canvas.clientWidth * 2, this.data.div.canvas.clientHeight * 2);
                }
                this.data.canvasTranslate = [-1 * xoff, -1 * yoff];
                this.data.div.ctx.translate(this.data.canvasTranslate[0], this.data.canvasTranslate[1]);
                this.data.div.canvas.style.top = Math.round(yoff - this.data.slideroffsety) + "px";
                this.data.div.canvas.style.left = Math.round(xoff - this.data.slideroffsetx) + "px";
            } else {
                this.data.div.canvas.parentElement.removeChild(this.data.div.canvas);
                delete this.data.div.ctx;
                delete this.data.div.canvas;
            }
        }
        if (this.data.div.labelctx) {
            if (this.data.div.labels.clientHeight == this.data.height && 
            this.data.div.labels.clientWidth == this.data.width) {
                this.data.div.labelctx.translate(-1 * this.data.canvasTranslateLabel[0], -1 * this.data.canvasTranslateLabel[1]);
                if (!noclear) {
                    this.data.div.labelctx.clearRect(0, 0, this.data.div.labels.width * 2, this.data.div.labels.height * 2);
                }
                this.data.canvasTranslateLabel = [-1 * xoff, -1 * yoff];
                this.data.div.labelctx.translate(this.data.canvasTranslateLabel[0], this.data.canvasTranslateLabel[1]);
                this.data.div.labels.style.top = Math.round(yoff - this.data.slideroffsety) + "px";
                this.data.div.labels.style.left = Math.round(xoff - this.data.slideroffsetx) + "px";
            } else {
                this.data.div.labels.parentElement.removeChild(this.data.div.labels);
                delete this.data.div.labelctx;
                delete this.data.div.labels;
            }
        }
        this.data.canvasTargets = {hover: [],click: []};
        this.data.canvasHoverId = undefined;
    },
    drawCanvasBarb: function(lat, lon, dir, speed) {
        var p = this.ll2xy(lat, lon);
        var canvas = this.shape.canvas();
        var ctx = this.data.div.ctx;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(1, -1);
        ctx.rotate(dir * this.data.proj.deg2rad * -1);
        ctx.beginPath();
        
        speed = Math.round(speed / 5) * 5;
        
        var position = 24;
        var lineend = position;
        if (speed < 10) {
            position = lineend - 4;
        } else if (speed > 50) {
            lineend = 27;
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, 1.5, 0, 6.283);
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = "4";
        ctx.stroke();
        
        if (speed > 0) {
            ctx.moveTo(0, 0);
            ctx.lineTo(0, lineend);
            
            var flags = Math.floor(speed / 50);
            speed -= flags * 50;
            for (var i = 0; i < flags; i++) {
                ctx.moveTo(0, position + 3);
                ctx.lineTo(8, position + 3);
                ctx.lineTo(0, position - 3);
                ctx.closePath();
                position -= 6;
            }
            
            var lines = Math.floor(speed / 10);
            speed -= lines * 10;
            for (var i = 0; i < lines; i++) {
                ctx.moveTo(0, position);
                ctx.lineTo(9, position + 6);
                position -= 3;
            }
            
            if (speed > 0) {
                ctx.moveTo(0, position);
                ctx.lineTo(4, position + 3);
            }
        }
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = "4";
        ctx.stroke();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = "1";
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, 1.5, 0, 6.283);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = "1";
        ctx.stroke();
        ctx.restore();
    },
    sliderControl: function(handle, x1, y1, width, height, moveCallback, setCallback, ix, iy) {
        var sv = this;
        var startx;
        var starty;
        var dragx;
        var dragy;
        var handlex;
        var handley;
        var x = 0;
        var y = 0;
        var drag = false;
        var didDrag = false;
        handlex = Math.round(x1 + (width * ix));
        handley = Math.round(y1 + (height * iy));
        handle.style.top = handley + "px";
        handle.style.left = handlex + "px";
        var h_height = handle.scrollHeight || 19;
        var h_width = handle.scrollWidth || 15;
        var bar = handle.parentElement;
        var onclick = function(e) {
            if (!e)
                e = window.event;
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            var bp = sv.getPosScroll(bar);
            var cx = e.clientX - (bp.x + x1);
            var cy = e.clientY - (bp.y + y1);
            if (didDrag) {
                didDrag = false;
            } else {
                if (cx >= -0.5 * h_width && cx <= width + 1.5 * h_width && cy >= -0.5 * h_height && cy <= height + 1.5 * h_height) {
                    if (width > 0)
                        x = (cx - h_width / 2) / width;
                    if (height > 0)
                        y = (cy - h_height / 2) / height;
                    if (x < 0) {
                        x = 0;
                    } else if (x > 1) {
                        x = 1;
                    }
                    if (y < 0) {
                        y = 0;
                    } else if (y > 1) {
                        y = 1;
                    }
                    var newpos = false;
                    try {
                        newpos = moveCallback(x, y);
                    } catch (err) {
                    }
                    if (newpos) {
                        x = newpos[0];
                        y = newpos[1];
                    }
                    handlex = Math.round(x1 + (width * x));
                    handley = Math.round(y1 + (height * y));
                    handle.style.top = handley + "px";
                    handle.style.left = handlex + "px";
                    try {
                        setCallback(x, y);
                    } catch (err) {
                    }
                }
            }
        }
        var onmove = function(e) {
            if (!e)
                e = window.event;
            if (drag) {
                didDrag = true;
                var cx = dragx + e.clientX - startx - x1;
                var cy = dragy + e.clientY - starty - y1;
                var oldx = x;
                var oldy = y;
                if (width > 0)
                    x = cx / width;
                if (height > 0)
                    y = cy / height;
                if (x < 0) {
                    x = 0;
                } else if (x > 1) {
                    x = 1;
                }
                if (y < 0) {
                    y = 0;
                } else if (y > 1) {
                    y = 1;
                }
                var newpos = false;
                try {
                    newpos = moveCallback(x, y);
                } catch (err) {
                }
                if (newpos) {
                    x = newpos[0];
                    y = newpos[1];
                }
                if (oldx != x || oldy != y) {
                    handlex = Math.round(x1 + (width * x));
                    handley = Math.round(y1 + (height * y));
                    handle.style.top = handley + "px";
                    handle.style.left = handlex + "px";
                }
            }
        }
        var onup = function(e) {
            drag = false;
            if (document.detachEvent) {
                document.detachEvent("onmousemove", onmove);
                document.detachEvent("onmouseup", onup);
            } else {
                document.removeEventListener("mousemove", onmove);
                document.removeEventListener("mouseup", onup);
            }
            try {
                setCallback(x, y);
            } catch (err) {
            }
            return false;
        }
        handle.ondrag = function() {
            return false;
        }
        handle.onmousedown = function(e) {
            if (!e)
                e = window.event;
            drag = true;
            startx = e.clientX;
            starty = e.clientY;
            dragx = handlex;
            dragy = handley;
            if (document.attachEvent) {
                e.cancelBubble = true;
                document.attachEvent("onmousemove", onmove);
                document.attachEvent("onmouseup", onup);
            } else {
                e.stopPropagation();
                document.addEventListener("mousemove", onmove, false);
                document.addEventListener("mouseup", onup, false);
            }
            return false;
        }
        if (bar.attachEvent) {
            bar.attachEvent("onclick", onclick);
        } else {
            bar.addEventListener("click", onclick, true);
        }
        var obj = {
            getX: function() {
                return x;
            },
            getY: function() {
                return y;
            },
            setX: function(newx, callback) {
                if (newx < 0)
                    newx = 0;
                if (newx > 1)
                    newx = 1;
                x = newx;
                handlex = Math.round(x1 + (width * x));
                handley = Math.round(y1 + (height * y));
                handle.style.top = handley + "px";
                handle.style.left = handlex + "px";
                if (callback) {
                    var newpos = false;
                    try {
                        newpos = moveCallback(x, y);
                    } catch (err) {
                    }
                    if (newpos) {
                        x = newpos[0];
                        y = newpos[1];
                    }
                    try {
                        setCallback(x, y);
                    } catch (err) {
                    }
                    return false;
                }
            },
            setY: function(newy, callback) {
                if (newy < 0)
                    newy = 0;
                if (newy > 1)
                    newy = 1;
                y = newy;
                handlex = Math.round(x1 + (width * x));
                handley = Math.round(y1 + (height * y));
                handle.style.top = handley + "px";
                handle.style.left = handlex + "px";
                if (callback) {
                    var newpos = false;
                    try {
                        newpos = moveCallback(x, y);
                    } catch (err) {
                    }
                    if (newpos) {
                        x = newpos[0];
                        y = newpos[1];
                    }
                    try {
                        setCallback(x, y);
                    } catch (err) {
                    }
                    return false;
                }
            }
        };
        return obj;
    },
    updateWindLabel: function() {
        if (this.data.div.windLabel) {
            var level = undefined;
            for (var i = 0; i < this.data.windLevels.length; i++) {
                if (this.data.windLevels[i][0] == this.data.prefs.windMB) {
                    level = this.data.windLevels[i];
                }
            }
            var now = new Date()
            var utcms = now.getTime();
            var startms = Math.floor(utcms / 10800000) * 10800000;
            var i = Math.round((this.data.prefs.windZulu - (startms / 1000)) / 10800)
            var t = new Date(startms + i * 10800000);
            var day = t.getUTCDate().toFixed(0);
            var hour = t.getUTCHours().toFixed(0);
            if (day.length == 1)
                day = "0" + day;
            if (hour.length == 1)
                hour = "0" + hour;
            var hrs = "+" + (i * 3).toFixed(0) + " hrs";
            
            if (this.data.prefs.windMB > 0) {
                this.data.div.windLabel.innerHTML = level[0] + "mb (" + level[1] + ") at " + day + hour + "z (" + hrs + ")";

            } else {
                this.data.div.windLabel.innerHTML = "Surface at " + day + hour + "z (" + hrs + ")";
            }
        }
        if (this.data.div.settingsLabels["cloudtopfilter"]){
            var calt = this.data.prefs.cloudAltitude;
            if (!calt || calt<26000){
                calt = 26000;
            }
            this.data.div.settingsLabels["cloudtopfilter"].nodeValue="Hide below "+calt.toFixed()+"ft";
        }
    },
    mkActiveTime: function(shape) {
        var nowDate = new Date();
        var now = nowDate.getTime() - this.data.timeDelta;
        now /= 1000;
        var valid = false;
        ;
        var message;
        if (now < shape.fs) {
            //future
            message = "Will be live in " + this.niceTimeDelta(now - shape.fs);
        } else {
            if (shape.ts > 0 && now > shape.ts) {
                message = "Expired " + this.niceTimeDelta(now - shape.ts) + " ago.";
            //past
            } else {
                //present
                valid = true;
                if (shape.ts > 0) {
                    message = "Valid for " + this.niceTimeDelta(shape.ts - now);
                } else {
                    message = "Valid until further notice";
                }
            }
        }
        return {"valid": valid,"message": message};
    },
    niceTimeDelta: function(seconds) {
        seconds = Math.abs(seconds);
        var retval = "";
        if (seconds < 60) {
            retval = seconds.toFixed(0) + " seconds";
        } else if (seconds < 3600) {
            retval = (seconds / 60).toFixed(0) + " minutes";
        } else if (seconds < 10000) {
            var h = Math.floor(seconds / 3600);
            var m = Math.round((seconds - (h * 3600)) / 60);
            retval = h.toFixed(0) + "h " + m.toFixed(0) + "m";
        } else if (seconds < 100000) {
            var h = Math.round(seconds / 3600);
            retval = h.toFixed(0) + " hours";
        } else if (seconds < 160000) {
            var d = Math.floor(seconds / 86400);
            var h = Math.round((seconds - (d * 86400)) / 3600);
            retval = d.toFixed(0) + "d " + h.toFixed(0) + "h";
        } else {
            var d = Math.round(seconds / 86400);
            retval = d.toFixed(0) + " days";
        }
        return retval;
    },
    makeSettingsBox: function(label, items) {
        var box = this.ce("div");
        box.className = "sv_settingboxholder";
        var shade = this.ce("div");
        shade.className = "sv_settingsshade";
        var settingBox = this.ce("div");
        settingBox.className = "sv_settingsboxac";
        var ldiv = this.ce("div");
        ldiv.className = "sv_settingsboxlabelac";
        ldiv.appendChild(document.createTextNode(label));
        box.appendChild(ldiv);
        var triangle = this.ce("div");
        triangle.className = "sv_settingsboxtriangle";
        triangle.innerHTML = "▶";
        box.appendChild(triangle);
        box.appendChild(shade);
        shade.style.height = "0px";
        shade.style.padding = "0";
        shade.appendChild(settingBox);
        var displayed = false;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var setting = this.makeSettingEx(item[0], item[1], label);
            setting.className = "sv_settingsinline";
            if (!item[2]) {
                setting.setEnabled(false);
            }
            settingBox.appendChild(setting);
            setting.setCheck();
            if (this.data.div.settings.enabled[item[0]]) {
                displayed = true;
            }
        }
        settingBox.appendChild(this.clearBoth());
        ldiv.onclick = function() {
            if (displayed) {
                shade.style.height = "0px";
                displayed = false;
                triangle.className = "sv_settingsboxtriangle";
            } else {
                var h = settingBox.offsetHeight;
                shade.style.height = h + "px";
                displayed = true;
                triangle.className = "sv_settingsboxtriangle sv_settingsboxtrianglerot";
            }
        }
        box.setDisplayed = function() {
            if (displayed) {
                var h = settingBox.offsetHeight;
                shade.style.height = h + "px";
                triangle.className = "sv_settingsboxtriangle sv_settingsboxtrianglerot";
            } else {
                shade.style.height = "0px";
                triangle.className = "sv_settingsboxtriangle";
            }
        }
        return box;
    },
    addOptions: function(select, data) {
        if (data instanceof Array) {
            for (var i = 0; i < data.length; i++) {
                var o = this.ce("option");
                o.value = data[i];
                o.appendChild(document.createTextNode(data[i]));
                select.appendChild(o);
            }
        } else {
            for (var key in data) {
                var o = this.ce("option");
                o.value = key;
                o.appendChild(document.createTextNode(data[key]));
                select.appendChild(o);
            }
        }
    },
    calendarPop: function(launcher,selectedDate,callback){
        var sv=this;
        var currentDate = new Date();
        currentDate = new Date(Date.UTC(
                        currentDate.getUTCFullYear(),
                        currentDate.getUTCMonth(),
                        currentDate.getUTCDate(),
                        12,0,0));
        if (selectedDate){
            selectedDate = new Date(Date.UTC(
                        selectedDate.getUTCFullYear(),
                        selectedDate.getUTCMonth(),
                        selectedDate.getUTCDate(),
                        12,0,0));
        }else{
            selectedDate = new Date(currentDate.getTime());
        }

        var calDate = new Date(selectedDate.getTime());
        var mon = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        var div = this.ce("div","sv_calendar");

        
        var backbtn = this.ce("div");
        backbtn.style.float="left";
        backbtn.appendChild(this.ce("span","fa fa-arrow-circle-left svdarkblue"));
        div.appendChild(backbtn);
        var nextbtn = this.ce("div");
        nextbtn.style.float="right";
        nextbtn.appendChild(this.ce("span","fa fa-arrow-circle-right svdarkblue"));
        div.appendChild(nextbtn);
        var hrow = this.ce("div","sv_calendar_head");

        //hrow.appendChild(document.createTextNode(mon[calDate.getUTCMonth()]));


        div.appendChild(hrow);
        var wrow = this.ce("div");
        var makeDay = function(txt){
           var d = sv.ce("div","sv_calendardayh");
           d.appendChild(document.createTextNode(txt));
           return d;
        }
        wrow.appendChild(makeDay('Sun'));
        wrow.appendChild(makeDay('Mon'));
        wrow.appendChild(makeDay('Tue'));
        wrow.appendChild(makeDay('Wed'));
        wrow.appendChild(makeDay('Thu'));
        wrow.appendChild(makeDay('Fri'));
        wrow.appendChild(makeDay('Sat'));
        div.appendChild(wrow);
        var table = this.ce("div");
        div.appendChild(table);
        var left = launcher.offsetLeft;
        div.style.marginLeft= (left-150 ) + "px";
        launcher.parentElement.insertBefore(div,launcher);

        var remove = function(){
            div.parentElement.removeChild(div);
            if (document.removeEventListener){
                document.removeEventListener("click",remove);
            }else if (document.detachEvent){
                document.detachEvent("onclick",remove);
            }
        }


        var drawDays = function(cDate){
            hrow.innerHTML = mon[cDate.getUTCMonth()] +" " + cDate.getUTCFullYear();
            while (table.firstChild){
                table.removeChild(table.firstChild);
            }
            var day1 = cDate.getUTCDay() + Math.ceil((cDate.getUTCDate() - cDate.getUTCDay())/7)*7;
            var thismonth = cDate.getUTCMonth()+1;
            var firstday = new Date(cDate.getTime() - (day1 *86400000));
            cDate.setDate(15);
            var lastDate = new Date(cDate.getTime()+30*86400000);
            lastDate.setDate(1);
            lastDate.setHours(1);
            var day = new Date(firstday.getTime());
            var week=-1;
            while (day.getTime() < lastDate.getTime()){
                var row=sv.ce("div");
                table.appendChild(row);
                week++;
                for (var i = 0; i < 7; i++){
                   var d = (week*7)+i;
                   day = new Date(firstday.getTime() + d*86400000);
                   (function(){
                      var dyear = day.getUTCFullYear();
                      var dmon = day.getUTCMonth()+1;
                      var ddate = day.getUTCDate();
                      var box = sv.ce("div","sv_calendarday");
                      var dow = day.getUTCDay();
                      if (dow == 0 || dow == 6 || dmon != thismonth){
                          box.style.color="#999999";
                      }
                      if (dyear == selectedDate.getUTCFullYear() &&
                          dmon  == selectedDate.getUTCMonth()+1 &&
                          ddate == selectedDate.getUTCDate()){
                          box.style.backgroundColor="#4D7FA5";
                          box.style.color="#FFFFFF";            
                      }
                      box.appendChild(document.createTextNode(day.getUTCDate()));
                      box.onclick = function(){
                          callback(dyear,dmon,ddate);
                          remove();
                      }
                      row.appendChild(box);           
                   })()
                }
            }
        }

        backbtn.onclick = function(e){
            e.stopPropagation();
            calDate.setDate(15);
            calDate = new Date(calDate.getTime() - 30*86400000);
            drawDays(calDate);
        }
        nextbtn.onclick = function(e){
            e.stopPropagation();
            calDate.setDate(15);
            calDate = new Date(calDate.getTime() + 30*86400000);
            drawDays(calDate);
        }

        drawDays(calDate);
        window.setTimeout(function(){
            if (document.addEventListener){
                document.addEventListener("click",remove);        
            }else if (document.attachEvent){
                document.attachEvent("onclick",remove);
            }
        },100)
        
    },
    showAircraftEdit: function(aircraft){
        var p;
        var sv = this;
        if (this.data.div.aircraftEdit){
            p = this.data.div.aircraftEdit;
        }else{
            this.data.div.aircraftEdit = {};
            p = this.data.div.aircraftEdit;
            p.div = this.ce("div");
            p.div.onmouseover = function() {
                sv.data.nowheel = true;
            }
            p.div.onmouseout = function() {
                sv.data.nowheel = false;
            }
            p.div.onmousewheel = function(e) {
                if (!e)
                    e = window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = "true";
                }
            }
            p.div.id = "sv_aircraftEdit";
            var ci = this.ce("img");
            ci.className = "sv_panelx";
            ci.style.marginTop = "-3px";
            ci.style.marginRight = "-3px";
            ci.src = this.data.images + "/planclose.png";
            ci.onclick = function() {
                p.div.style.visibility = 'hidden';
            }
            p.div.appendChild(ci);
            var h1 = this.ce("h1","sv sv_panel");
            
            h1.appendChild(document.createTextNode("Edit Aircraft"));
            p.div.appendChild(h1);
            var addLabel = function(div, text, width, align, size) {
                var span = sv.ce("span");
                span.className = "svfpl_label";
                span.appendChild(document.createTextNode(text));
                if (width){
                    span.style.width = width + "px";
                }
                if (align){
                    span.style.textAlign = align;
                }
                if (size){
                    span.style.fontSize = size;
                }
                div.appendChild(span);
            }
            var ultab = this.ce("ul","sv_tabs");
            ultab.style.position = "absolute";
            ultab.style.marginTop = "-18px";
            ultab.style.marginLeft = "120px";
            var t1 = this.ce("li","sv_tabs sv_tabon");
            t1.appendChild(document.createTextNode("Performance"));
            var t2 = this.ce("li","sv_tabs");
            t2.appendChild(document.createTextNode("Filing Info"));
            ultab.appendChild(t1);
            ultab.appendChild(t2);
            p.div.appendChild(ultab);
            var page1 = this.ce("div","sv_tabpage sv_tabon");
            var page2 = this.ce("div","sv_tabpage");
            p.div.appendChild(page1);
            p.div.appendChild(page2);
            var pageback = this.ce("div");
            pageback.style.height="332px";
            pageback.style.border="1px solid #808080";
            pageback.style.margin="3px 0px 5px 0px";
            pageback.style.backgroundColor="white";
            p.div.appendChild(pageback);
            t1.onclick = function(){
                t1.className = "sv_tabs sv_tabon";
                page1.className = "sv_tabpage sv_tabon";
                t2.className = "sv_tabs";
                page2.className = "sv_tabpage";
            }
            t2.onclick = function(){
                t2.className = "sv_tabs sv_tabon";
                page2.className = "sv_tabpage sv_tabon";
                t1.className = "sv_tabs";
                page1.className = "sv_tabpage";
            }

            addLabel(page1,"Cruise Speed",110,"right");
            p.cruiseSpeed = this.ce("input","svfpl_input");
            page1.appendChild(p.cruiseSpeed);
            addLabel(page1,"TAS (110) or Mach (M082)");
            page1.appendChild(this.ce("br"));
            addLabel(page1,"Cruising Altitude",110,"right");
            p.cruiseAlt = this.ce("input","svfpl_input");
            page1.appendChild(p.cruiseAlt);
            addLabel(page1,"100s of feet. (060, FL350)");
            page1.appendChild(this.ce("br"));
            addLabel(page1,"Cruise Fuel Flow",110,"right");
            p.cruiseFuel = this.ce("input","svfpl_input");
            page1.appendChild(p.cruiseFuel);
            addLabel(page1,"Gal or lb per hour");
            page1.appendChild(this.ce("div","sv_divhr"));
            addLabel(page1,"Climb Speed",110,"right");
            p.climbSpeed = this.ce("input","svfpl_input");
            page1.appendChild(p.climbSpeed);
            addLabel(page1,"IAS or IAS/Mach e.g. 320/M076",undefined,undefined,"11px");
            page1.appendChild(this.ce("br"));
            addLabel(page1,"Vertical Speed",110,"right");
            p.climbVS = this.ce("input","svfpl_input");
            page1.appendChild(p.climbVS);
            addLabel(page1,"Feet per minute at Sea Level");
            page1.appendChild(this.ce("br"));
            addLabel(page1,"Climb Fuel Flow",110,"right");
            p.climbFuel = this.ce("input","svfpl_input");
            page1.appendChild(p.climbFuel);
            addLabel(page1,"Gal or lb per hour");
            page1.appendChild(this.ce("div","sv_divhr"));
            addLabel(page1,"Descent Speed",110,"right");
            p.descentSpeed = this.ce("input","svfpl_input");
            page1.appendChild(p.descentSpeed);
            addLabel(page1,"IAS or IAS/Mach e.g. 320/M076",undefined,undefined,"11px");
            page1.appendChild(this.ce("br"));
            addLabel(page1,"Vertical Speed",110,"right");
            p.descentVS = this.ce("input","svfpl_input");
            page1.appendChild(p.descentVS);
            addLabel(page1,"Feet per minute descent");
            page1.appendChild(this.ce("br"));
            addLabel(page1,"Descent Fuel Flow",110,"right");
            p.descentFuel = this.ce("input","svfpl_input");
            page1.appendChild(p.descentFuel);
            addLabel(page1,"Gal or lb per hour");
            page1.appendChild(this.ce("div","sv_divhr"));
            addLabel(page1,"Fuel Capacity",110,"right");
            p.rampFuel = this.ce("input","svfpl_input");
            page1.appendChild(p.rampFuel);
            addLabel(page1,"Total Fuel Capacity");
            page1.appendChild(this.ce("br"));
            addLabel(page1,"Taxi Fuel",110,"right");
            p.taxiFuel = this.ce("input","svfpl_input");
            page1.appendChild(p.taxiFuel);
            addLabel(page1,"Fuel used in startup, taxi, and runup",undefined,undefined,"11px");
            addLabel(page1,"Takeoff Extra Fuel",110,"right");
            p.depBiasFuel = this.ce("input","svfpl_input");
            p.depBiasFuel.setAttribute("placeholder","G or lb");
            page1.appendChild(p.depBiasFuel);
            p.depBiasTime = this.ce("input","svfpl_input");
            p.depBiasTime.setAttribute("placeholder","mins");
            page1.appendChild(p.depBiasTime);
            addLabel(page1,"Extra Time for Takeoff");
            addLabel(page1,"Arrival Extra Fuel",110,"right");
            p.arrBiasFuel = this.ce("input","svfpl_input");
            p.arrBiasFuel.setAttribute("placeholder","G or lb");
            page1.appendChild(p.arrBiasFuel);
            p.arrBiasTime = this.ce("input","svfpl_input");
            p.arrBiasTime.setAttribute("placeholder","mins");
            page1.appendChild(p.arrBiasTime);
            addLabel(page1,"Extra Time for Arrival");

            page1.appendChild(this.ce("div","sv_divhr"));
            addLabel(page1,"Hide Aircraft",110,"right");
            p.radioHide = this.ce("input");
            p.radioHide.type="checkbox";
            page1.appendChild(p.radioHide);
            addLabel(page1,"Do not display aircraft in tail list.")

    
            addLabel(page2,"Tail Number",80,"right");
            p.tailNumber = this.ce("input","svfpl_input");
            p.tailNumber.setAttribute("placeholder","N10SV");
            p.tailNumber.setAttribute("maxlength","10");
            page2.appendChild(p.tailNumber);

            addLabel(page2,"Type",40,"right");
            p.acftType = this.ce("input","svfpl_input");
            p.acftType.setAttribute("placeholder","C172");
            p.acftType.setAttribute("maxlength","10");
            page2.appendChild(p.acftType);

            addLabel(page2," / ");
            p.acftEquip = this.ce("input","svfpl_input");
            p.acftEquip.style.width = "14px";
            p.acftEquip.setAttribute("placeholder","G");
            p.acftEquip.setAttribute("maxlength","1");
            page2.appendChild(p.acftEquip);
            addLabel(page2,"FAA Equipment");

            page2.appendChild(this.ce("br"));
            addLabel(page2,"Color",80,"right");
            p.acftColor = this.ce("input","svfpl_input");
            p.acftColor.style.position="relative";
            p.acftColor.setAttribute("placeholder","W/R");
            page2.appendChild(p.acftColor);
            this.addColorPicker(p.acftColor);

            addLabel(page2,"Wake Turbulence Category",160,"right");
            p.heavy = this.ce("select");
            p.heavy.style.width="60px";
            var opt1 = this.ce("option");
            opt1.appendChild(document.createTextNode("Light"));
            p.heavy.appendChild(opt1);
            var opt2 = this.ce("option");
            opt2.appendChild(document.createTextNode("Medium"));
            p.heavy.appendChild(opt2);
            var opt3 = this.ce("option");
            opt3.appendChild(document.createTextNode("Heavy"));
            p.heavy.appendChild(opt3);
            page2.appendChild(p.heavy);

            page2.appendChild(this.ce("div","sv_divhr"));

            addLabel(page2,"ICAO Equipment Code",160,"right");
            p.icaoEquip = this.ce("input","svfpl_input");
            p.icaoEquip.style.width = "160px";
            page2.appendChild(p.icaoEquip);
            p.icaoEquip.onchange = function(){};


            page2.appendChild(this.ce("br"));
            addLabel(page2,"Surveillance Equipment",160,"right");
            p.survEquip = this.ce("input","svfpl_input");
            p.survEquip.style.width = "160px";
            page2.appendChild(p.survEquip);
            this.addIcaoSurvPicker(p.survEquip);
            p.survEquip.onchange = function(){};

            page2.appendChild(this.ce("br"));
            addLabel(page2,"RNAV and RNP PBN/",160,"right");
            p.icaoPbn = this.ce("input","svfpl_input");
            p.icaoPbn.style.width = "160px";
            page2.appendChild(p.icaoPbn);

            this.addIcaoEquipPicker(p.icaoEquip,p.icaoPbn);
            this.addIcaoPbnPicker(p.icaoPbn,p.icaoEquip);
            p.icaoPbn.onchange=function(){};

            page2.appendChild(this.ce("br"));
            addLabel(page2,"Performance Cat. PER/",160,"right");
            p.icaoPerf = this.ce("select");
            p.icaoPerf.style.width = "160px";
            var o;
            o = this.ce("option");
            p.icaoPerf.appendChild(o);
            o = this.ce("option");
            o.appendChild(document.createTextNode("A: 0 - 90 KIAS"));
            p.icaoPerf.appendChild(o);
            o = this.ce("option");
            o.appendChild(document.createTextNode("B: 91 - 120 KIAS"));
            p.icaoPerf.appendChild(o);
            o = this.ce("option");
            o.appendChild(document.createTextNode("C: 121 - 140 KIAS"));
            p.icaoPerf.appendChild(o);
            o = this.ce("option");
            o.appendChild(document.createTextNode("D: 141 - 165 KIAS"));
            p.icaoPerf.appendChild(o);
            o = this.ce("option");
            o.appendChild(document.createTextNode("E: 166 - 210 KIAS"));
            p.icaoPerf.appendChild(o);
            o = this.ce("option");
            o.appendChild(document.createTextNode("H: Helicopter"));
            p.icaoPerf.appendChild(o);
            page2.appendChild(p.icaoPerf);

            page2.appendChild(this.ce("br"));
            addLabel(page2,"Other Information",160,"right");
            p.otherInfo = this.ce("input","svfpl_input");
            p.otherInfo.style.width = "160px";
            page2.appendChild(p.otherInfo);


            page2.appendChild(this.ce("div","sv_divhr"));

            addLabel(page2,"Emergency Radios",130,"right");
            
            p.radioVHF = this.ce("input");
            p.radioVHF.type="checkbox";
            page2.appendChild(p.radioVHF);
            addLabel(page2,"VHF",50);

            p.radioUHF = this.ce("input");
            p.radioUHF.type="checkbox";
            page2.appendChild(p.radioUHF);
            addLabel(page2,"UHF",50);

            p.radioELT = this.ce("input");
            p.radioELT.type="checkbox";
            page2.appendChild(p.radioELT);
            addLabel(page2,"ELT");

            page2.appendChild(this.ce("div","sv_divhr"));
            addLabel(page2,"Survival Equipment",130,"right");

            p.survivalPolar = this.ce("input");
            p.survivalPolar.type = "checkbox";
            page2.appendChild(p.survivalPolar);
            addLabel(page2,"Polar",50);

            p.survivalDesert = this.ce("input");
            p.survivalDesert.type = "checkbox";
            page2.appendChild(p.survivalDesert);
            addLabel(page2,"Desert",50);

            page2.appendChild(this.ce("br"));
            addLabel(page2,"",130);
            p.survivalMaritime = this.ce("input");
            p.survivalMaritime.type = "checkbox";
            page2.appendChild(p.survivalMaritime);
            addLabel(page2,"Maritime",50);

            p.survivalJungle = this.ce("input");
            p.survivalJungle.type = "checkbox";
            page2.appendChild(p.survivalJungle);
            addLabel(page2,"Jungle",50);

            page2.appendChild(this.ce("div","sv_divhr"));
            addLabel(page2,"Jackets",130,"right");

            p.jacketsLight = this.ce("input");
            p.jacketsLight.type = "checkbox";
            page2.appendChild(p.jacketsLight);
            addLabel(page2,"Light",50);

            p.jacketsFloures = this.ce("input");
            p.jacketsFloures.type = "checkbox";
            page2.appendChild(p.jacketsFloures);
            addLabel(page2,"Floures",50);

            p.jacketsUHF = this.ce("input");
            p.jacketsUHF.type = "checkbox";
            page2.appendChild(p.jacketsUHF);
            addLabel(page2,"UHF",30);

            p.jacketsVHF = this.ce("input");
            p.jacketsVHF.type = "checkbox";
            page2.appendChild(p.jacketsVHF);
            addLabel(page2,"VHF");
    
            page2.appendChild(this.ce("div","sv_divhr"));
            addLabel(page2,"Dinghies",130,"right");
            addLabel(page2,"Count",55,"right");
            p.dinghiesCount = this.ce("input","svfpl_input");
            p.dinghiesCount.style.width = "40px";
            page2.appendChild(p.dinghiesCount);
            addLabel(page2,"Capacity",55,"right")
            p.dinghiesCapacity = this.ce("input","svfpl_input");
            p.dinghiesCapacity.style.width = "40px";
            page2.appendChild(p.dinghiesCapacity);

            page2.appendChild(this.ce("br"));
            addLabel(page2,"",130);
            addLabel(page2,"Color",55,"right")
            p.dinghiesColor = this.ce("input","svfpl_input");
            p.dinghiesColor.style.width = "40px";
            page2.appendChild(p.dinghiesColor);
            this.addColorPicker(p.dinghiesColor);

            addLabel(page2,"Covered",55,"right");
            p.dinghiesCovered = this.ce("input");
            p.dinghiesCovered.type = "checkbox";
            page2.appendChild(p.dinghiesCovered);
            
            addLabel(p.div,"",110);
            p.cancel = this.fplButton("fa fa-close","Cancel");
            p.div.appendChild(p.cancel);
            p.save = this.fplButton("fa fa-save","Save");
            p.div.appendChild(p.save);
            p.cancel.onclick = function(){
                p.div.style.visibility='hidden';
            }
            var saveAction = function(){
                var radioStr = "";
                if (p.radioUHF.checked) radioStr += "U";
                if (p.radioVHF.checked) radioStr += "V";
                if (p.radioELT.checked) radioStr += "E";
                var survStr = "";
                if (p.survivalPolar.checked) survStr += "P";
                if (p.survivalDesert.checked) survStr += "D";
                if (p.survivalMaritime.checked) survStr += "M";
                if (p.survivalJungle.checked) survStr += "J";
                var jackStr = "";
                if (p.jacketsLight.checked) jackStr += "L";
                if (p.jacketsFloures.checked) jackStr += "F";
                if (p.jacketsUHF.checked) jackStr += "U";
                if (p.jacketsVHF.checked) jackStr += "V";
                var dinghieStr = parseInt(p.dinghiesCount.value) +" " +
                                 parseInt(p.dinghiesCapacity.value) + " " +
                                 (p.dinghiesCovered.checked ? "C " : "") +
                                 p.dinghiesColor.value;

                var qparms = {
                    cmd: 'set',
                    cruiseSpeed: p.cruiseSpeed.value,
                    cruiseFuel: p.cruiseFuel.value,
                    cruiseAlt: p.cruiseAlt.value,
                    climbSpeed: p.climbSpeed.value,
                    climbVS: p.climbVS.value,
                    climbFuel: p.climbFuel.value,
                    descentSpeed: p.descentSpeed.value,
                    descentVS: p.descentVS.value,
                    descentFuel: p.descentFuel.value,
                    rampFuel: p.rampFuel.value,
                    taxiFuel: p.taxiFuel.value,
                    depBiasFuel: p.depBiasFuel.value,
                    depBiasTime: p.depBiasTime.value,
                    arrBiasFuel: p.arrBiasFuel.value,
                    arrBiasTime: p.arrBiasTime.value,
                    ident: p.tailNumber.value,
                    type: p.acftType.value,
                    faaEquip: p.acftEquip.value,
                    color: p.acftColor.value,
                    waketurbcat: p.heavy.selectedIndex,
                    icaoEquip: p.icaoEquip.value,
                    survEquip: p.survEquip.value,
                    pbnEquip: p.icaoPbn.value,
                    perfcat: p.icaoPerf.selectedIndex,
                    otherinfo: p.otherInfo.value,
                    radios: radioStr,
                    survival: survStr,
                    jackets: jackStr,
                    dinghies: dinghieStr,
                    hidden: p.radioHide.checked ? 1 : 0
                };
                var qs = sv.mkQS(qparms);
                var r = sv.request(sv.data.perldir + '/aircraft' + qs);
                var saveResponse;
                saveResponse = function(data){
                    if (data.err){
                        var dialog = sv.modalDialog(300);
                        var icon = sv.ce("span","fa fa-exclamation-triangle");
                        icon.style.color = "#EE9900";
                        icon.style.fontSize = "40px";
                        icon.style.padding = "10px";
                        var table = sv.ce("table");
                        var tbody = sv.ce("tbody");
                        var trow = sv.ce("tr");
                        var td = sv.ce("td");
                        td.appendChild(icon);
                        var td2 = sv.ce("td");
                        td2.style.verticalAlign = "middle";
                        td2.appendChild(sv.ct(data.err));
                        trow.appendChild(td);
                        trow.appendChild(td2);
                        tbody.appendChild(trow);
                        table.appendChild(tbody);
                        dialog.appendChild(table);
                        var btnRow = sv.ce("div");
                        btnRow.style.textAlign = "center";
                        btnRow.style.clear = "both";
                        var btnDelete = sv.fplButton("fa fa-refresh","Replace Aircraft");
                        var btnCancel = sv.fplButton("fa fa-close","Cancel");
                        btnRow.appendChild(btnDelete);
                        btnRow.appendChild(btnCancel);
                        dialog.appendChild(btnRow);
                        btnDelete.onclick = function(){
                            dialog.closeme();
                            qparms["delete_duplicate"] = 1;            
                            var qs = sv.mkQS(qparms);
                            var r = sv.request(sv.data.perldir + '/aircraft' + qs);
                            r.onload=saveResponse;
                        }
                        btnCancel.onclick = function(){
                            dialog.closeme();
                        }
                    }else{
                        if (data.fpl){
                            sv.data.FPL = data.fpl;
                            sv.loadPlan();
                        }
                        sv.datalayer();
                        p.div.style.visibility='hidden';
                    }
                }
                r.onload=saveResponse;
            }
            p.save.onclick = function(){
                var pbnCheck = sv.validatePBN(p.icaoEquip.value.toUpperCase(),p.icaoPbn.value.toUpperCase());
                if (pbnCheck[0]){
                    saveAction();
                }else{
                    sv.simpleDialog("exclamation-triangle","#e90",pbnCheck[1].join("<br/>"));
                }
            }


            this.data.div.chart.appendChild(p.div);
            this.dragEnable(p.div, h1);
        }
        p.div.style.visibility = 'visible';
        p.cruiseSpeed.value = aircraft.cruiseSpeed;
        p.cruiseFuel.value = aircraft.cruiseFuel;
        p.cruiseAlt.value = aircraft.cruiseAlt;
        p.climbSpeed.value = aircraft.climbSpeed;
        p.climbVS.value = aircraft.climbVS;
        p.climbFuel.value = aircraft.climbFuel;
        p.descentSpeed.value = aircraft.descentSpeed;
        p.descentVS.value = aircraft.descentVS;
        p.descentFuel.value = aircraft.descentFuel;
        p.rampFuel.value = aircraft.rampFuel;
        p.taxiFuel.value = aircraft.taxiFuel;
        p.depBiasFuel.value = aircraft.depBiasFuel;
        p.depBiasTime.value = aircraft.depBiasTime;
        p.arrBiasFuel.value = aircraft.arrBiasFuel;
        p.arrBiasTime.value = aircraft.arrBiasTime;
        p.radioHide.checked = aircraft.hidden ? true : false;
        p.tailNumber.value = aircraft.ident;
        p.acftType.value = aircraft.type;
        p.acftEquip.value = aircraft.faaEquip;
        p.acftColor.value = aircraft.color;
        p.heavy.selectedIndex = aircraft.waketurbcat;
        p.icaoEquip.value = aircraft.icaoEquip;
        p.survEquip.value = aircraft.survEquip;
        p.icaoPbn.value = aircraft.pbnEquip;
        p.icaoPerf.selectedIndex = aircraft.perfcat;
        p.otherInfo.value = aircraft.otherinfo;

        if (aircraft.radios && aircraft.radios.indexOf("V") > -1){
            p.radioVHF.checked = true;
        }else{
            p.radioVHF.checked = false;
        }
        if (aircraft.radios && aircraft.radios.indexOf("U") > -1){
            p.radioUHF.checked = true;
        }else{
            p.radioUHF.checked = false;
        }
        if (aircraft.radios && aircraft.radios.indexOf("E") > -1){
            p.radioELT.checked = true;
        }else{
            p.radioELT.checked = false;
        }
        if (aircraft.survival && aircraft.survival.indexOf("P") > -1){
            p.survivalPolar.checked = true;
        }else{
            p.survivalPolar.checked = false;
        }
        if (aircraft.survival && aircraft.survival.indexOf("D") > -1){
            p.survivalDesert.checked = true;
        }else{
            p.survivalDesert.checked = false;
        }
        if (aircraft.survival && aircraft.survival.indexOf("M") > -1){
            p.survivalMaritime.checked = true;
        }else{
            p.survivalMaritime.checked = false;
        }
        if (aircraft.survival && aircraft.survival.indexOf("J") > -1){
            p.survivalJungle.checked = true;
        }else{
            p.survivalJungle.checked = false;
        }
        if (aircraft.jackets && aircraft.jackets.indexOf("L") > -1){
            p.jacketsLight.checked = true;
        }else{
            p.jacketsLight.checked = false;
        }
        if (aircraft.jackets && aircraft.jackets.indexOf("F") > -1){
            p.jacketsFloures.checked = true;
        }else{
            p.jacketsFloures.checked = false;
        }
        if (aircraft.jackets && aircraft.jackets.indexOf("U") > -1){
            p.jacketsUHF.checked = true;
        }else{
            p.jacketsUHF.checked = false;
        }
        if (aircraft.jackets && aircraft.jackets.indexOf("V") > -1){
            p.jacketsVHF.checked = true;
        }else{
            p.jacketsVHF.checked = false;
        }
        if (aircraft.dinghies){
            p.dinghiesCount.value = aircraft.dinghies.number;
            p.dinghiesCapacity.value = aircraft.dinghies.capacity;
            p.dinghiesColor.value = aircraft.dinghies.color;
            p.dinghiesCovered.checked = (aircraft.dinghies.covered > 0 ? true : false);
        }else{
            p.dinghiesCount.value = "";
            p.dinghiesCapacity.value = "";
            p.dinghiesColor.value = "";
            p.dinghiesCovered.checked = false;
        }

    },
    addColorPicker: function(elem){
        var sv = this;
        var colorPicker = this.ce("div","svfpl_colorpicker");
        elem.parentElement.appendChild(colorPicker);
        colorPicker.style.left = elem.offsetLeft + "px";
        var colors = [['W','#FFF'],
                    ['R','#F00'],
                    ['O','#F80'],
                    ['A','#FB0'],
                    ['Y','#FF0'],
                    ['G','#0A0'],
                    ['TQ','#0AF'],
                    ['B','#00F'],
                    ['P','#80F'],
                    ['V','#A0A'],
                    ['M','#B06'],
                    ['GY','#AAA'],
                    ['BK','#000'],
                    ['BR','#A52'],
                    ['T','#D2B48C'],
                    ['BE','#F5F5DC'],
                    ['PK','#FAA'],
                    ['GD','#FF9'],
                    ['S','#CCC']
                    ];

        for (var i=0; i < colors.length; i++){
            (function(){
                var square = sv.ce("div","svfpl_colorsquare");
                var color = colors[i][0];
                square.style.backgroundColor = colors[i][1];
                square.onmousedown = function(e){
                    var val = elem.value;
                    if (val && val.length && val.slice(-1) != '/'){
                        val += "/" + color;
                    }else{
                        val += color;
                    }
                    
                    elem.value = val;
                    e.preventDefault()
                }
                colorPicker.appendChild(square);
            })();
        }
        elem.onfocus = function(){
            colorPicker.style.display = "block";
        }
        elem.onblur = function(e){
            colorPicker.style.display = 'none';
            if (elem.onchange) elem.onchange();
        }
    },
    addIcaoSurvPicker: function(elem){
        var sv = this;
        var picker = this.ce("div","svfpl_icaoEquipPicker");
        elem.parentElement.appendChild(picker);
        var vals = [
            ['N','Nil'],
            ['A','Mode A'],
            ['C','Mode A/C'],
            ['E','Mode S, ID, Alt and Squitter'],
            ['H','Mode S, ID, Alt and Enhanced Squitter'],
            ['I','Mode S, ID, no Alt'],
            ['L','Mode S, ID, Alt, Squitter, and Enhanced Surv'],
            ['P','Mode S, Alt, no ID'],
            ['S','Mode S, ID and Alt'],
            ['X','Mode S, no ID no Alt'],
            ['B1','ADS-B, 1090 mHz Out'],
            ['B2','ADS-B, 1090 mHz Out and In'],
            ['U1','ADS-B, 978 mHz UAT Out'],
            ['U2','ADS-B, 978 mHz UAT Out and In'],
            ['V1','ADS-B, VDL Mode 4 Out'],
            ['V2','ADS-B, VDL Mode 4 Out and In'],
            ['D1','ADS-C, FANS'],
            ['G2','ADS-C, ATN']
            ];
        var values = {};
        var checkBoxes = {};
        var setString = function(){
            var string = "";
            var isNil = true;
            for (var i=0; i < vals.length; i++){
                var code = vals[i][0];
                if (code != 'N'){
                    if (values[code]){
                        isNil = false;
                        string += code;
                    }
                }
            }
            if (isNil){
                elem.value = 'N';
            }else{
                elem.value = string;
            }
        };
        for (var i=0; i < vals.length; i++){
            (function(){
                var code = vals[i][0];
                var message = vals[i][1];
                if (code == 'A' || code == 'B1' || code == 'U1' || code == 'V1' || code == 'D1'){
                    picker.appendChild(sv.ce("div","sv_divhr"));
                }
                var checkbox = sv.ce("input");
                checkbox.type = "checkbox";
                checkBoxes[code] = checkbox;
                var div = sv.ce("div");
                div.style.cursor="pointer";
                div.appendChild(checkbox);
                div.appendChild(document.createTextNode(code + ": " + message));
                picker.appendChild(div);
                div.onmousedown = function(e){
                    e.preventDefault();
                    if (values[code]){
                        values[code] = false;
                        checkbox.checked = false;
                    }else{
                        values[code] = true;
                        checkbox.checked = true;
                        for (var j=0; j < vals.length; j++){
                            var jcode = vals[j][0];
                            if (code != jcode && (code == 'N' || jcode == 'N' || (
                                code.length == 1 ? jcode.length == 1 : code.substring(0,1) == jcode.substring(0,1)))){
                                    values[jcode] = false;
                                    checkBoxes[jcode].checked = false;
                                
                            }
                        }
                    }
                    setString();
                    return false;
                }
                checkbox.onclick = function() { return false; }
            })();
        }
        var parseString = function(){
            var val = elem.value.toUpperCase();
            var isNil;
            for (var i=0; i < vals.length; i++){
                var code = vals[i][0];
                if (val && val.length && val.indexOf(code) > -1){
                    isNil = false;
                    if (!values[code]){
                        values[code] = true;
                        checkBoxes[code].checked = true;
                    }
                }else{
                    if (values[code]){
                        values[code] = false;
                        checkBoxes[code].checked = false;
                    }
                }
            }
        }
        elem.onfocus = function(){
            picker.style.display = "block";
            parseString();
        }
        elem.onkeyup = function(){
            //elem.value = elem.value.toUpperCase();
            parseString();
        }
        elem.onblur = function(){
            picker.style.display = "none";
            elem.onchange();
        }
    },
    addIcaoEquipPicker: function(elem){
        var sv = this;
        var picker = this.ce("div","svfpl_icaoEquipPicker");
        elem.parentElement.appendChild(picker);
        var vals = [
            ['N','Nil'],
            ['S','Standard: VOR, ILS, VHF Radio Comm'],
            ['A','GBAS Landing System'],
            ['B','LPV (APV/SBAS)'],
            ['C','LORAN C'],
            ['D','DME'],
            ['E1','FMC Waypoint Reporting (FMC WPR)'],
            ['E2','Flight Information services (D-FIS)'],
            ['E3','Pre-departure Clearance (PDC)'],
            ['F','ADF - Automatic Direction Finder'],
            ['G','GNSS - Global Navigation Satellite System'],
            ['H','HF RTF - High Frequency Radio Telephone'],
            ['I','Inertial Navigation'],
            ['J1','ATN VDL Mode 2'],
            ['J2','FANS 1/A HFDL'],
            ['J3','FANS 1/A VDL Mode A'],
            ['J4','FANS 1/A VDL Mode 2'],
            ['J5','FANS 1/A INMARSAT'],
            ['J6','FANS 1/A MTSAT'],
            ['J7','FANS 1/A Iridium'],
            ['K','Microwave Landing System MLS'],
            ['L','Instrument Landing System ILS'],
            ['M1','ATC RTF INMARSAT'],
            ['M2','ATC RTF MTSTAT'],
            ['M3','ATC RTF Iridium'],
            ['O','VOR'],
            ['R','RNAV / RNP Capable (PBN)'],
            ['T','TACAN'],
            ['U','UHF Radio Comm'],
            ['V','VHF Radio Comm'],
            ['W','RVSM'],
            ['X','MNPS'],
            ['Y','VHF 8.33 kHz Radio Channel Spacing'],
            ['Z','Other']
        ];
        var slist = ['V','O','L'];
        var values = {};
        var checkBoxes = {};
        var setString = function(){
            var string = "";
            var isNil = true;
            for (var i=0; i < vals.length; i++){
                var code = vals[i][0];
                if (code != 'N'){
                    if (values[code]){
                        isNil = false;
                        if (code == 'V' || code == 'O' || code == 'L'){
                            if (!values['S']){
                                string += code;
                            }
                        }else{
                            string += code;
                        }
                    }
                }
            }
            if (isNil){
                elem.value = 'N';
            }else{
                elem.value = string;
            }
        }
        for (var i=0; i < vals.length; i++){
            (function(){
                var code = vals[i][0];
                var message = vals[i][1];
                if (code == 'S' || code == 'F' || code == 'K' || code == 'O'){
                    picker.appendChild(sv.ce("div","sv_divhr"));
                }else if (code == 'E1'){
                    picker.appendChild(sv.ce("div","sv_divhr"));
                    var h = sv.ce("h1","svfpl_picker");
                    h.appendChild(document.createTextNode("ACARS Data Link"));
                    picker.appendChild(h);
                }else if (code == 'J1'){
                    picker.appendChild(sv.ce("div","sv_divhr"));
                    var h = sv.ce("h1","svfpl_picker");
                    h.appendChild(document.createTextNode("CPDLC - Controller Pilot Data Link"));
                    picker.appendChild(h);
                }else if (code == 'M1'){
                    picker.appendChild(sv.ce("div","sv_divhr"));
                    var h = sv.ce("h1","svfpl_picker");
                    h.appendChild(document.createTextNode("ATC RTF SATCOM - Satellite Phone"));
                    picker.appendChild(h);
                }
                var checkbox = sv.ce("input");
                checkbox.type = "checkbox";
                checkBoxes[code] = checkbox;
                var div = sv.ce("div");
                div.style.cursor="pointer";
                div.appendChild(checkbox);
                div.appendChild(document.createTextNode(code + ": " + message));
                picker.appendChild(div);
                div.onmousedown = function(e){
                    e.preventDefault();
                    if (values[code]){
                        values[code] = false;
                        checkbox.checked = false;
                        for (var j=0; j < slist.length; j++){
                            var jcode = slist[j];
                            if (code == jcode){
                                if (values['S']){
                                    values['S'] = false;
                                    checkBoxes['S'].checked = false;
                                }
                            }
                        }
                    }else{
                        values[code] = true;
                        checkbox.checked = true;
                        if (code == 'N'){
                            for (var j=0; j < vals.length; j++){
                                var jcode = vals[j][0];
                                if (jcode != 'N' && values[jcode]){
                                    values[jcode] = false;
                                    checkBoxes[jcode].checked = false;
                                }
                            }
                        }else{
                            if(values['N']){
                                values['N'] = false;
                                checkBoxes['N'].checked = false;
                            }
                        }
                        if (code == 'S'){
                            for (var j=0; j < slist.length; j++){
                                var jcode = slist[j]
                                if (!values[jcode]){
                                    values[jcode] = true;
                                    checkBoxes[jcode].checked = true;
                                }
                            }
                        }else if (!values['S']){
                            var sOn = 0;
                            for (var j=0; j < slist.length; j++){
                                var jcode = slist[j];
                                if (values[jcode]){
                                    sOn++;
                                }
                            }
                            if (sOn == slist.length){
                                values['S'] = true;
                                checkBoxes['S'].checked = true;
                            }
                        }
                    }
                    setString();
                    return false;
                }
                checkbox.onclick = function(){ return false;}
            })();
        }
        var parseString = function(){
            var val = elem.value.toUpperCase();
            var isNil = true;
            var overrides = {};
            for (var i=0; i < vals.length; i++){
                var code = vals[i][0];
                if (val && val.length && val.indexOf(code) > -1){
                    isNil = false;
                    if (!values[code]){
                        values[code] = true;
                        checkBoxes[code].checked = true;
                    }
                    if (code == 'S'){
                        for (var j=0; j < slist.length; j++){
                            var jcode = slist[j]
                            if (!values[jcode]){
                                values[jcode] = true;
                                checkBoxes[jcode].checked = true;
                                overrides[jcode] = true;
                            }
                        }
                    }
                }else{
                    if (values[code] && !overrides[code]){
                        values[code] = false;
                        checkBoxes[code].checked = false;
                    }
                }
            }
            if (isNil){
                if (!values['N']){
                    values['N'] = true;
                    checkBoxes['N'].checked = true;
                }
            }else{
                if (values['N']){
                    values['N'] = false;
                    checkBoxes['N'].checked = false;
                }
            }
        }

        elem.onfocus = function(){
            picker.style.display = "block";
            parseString();
        }
        elem.onkeyup = function(){
            //elem.value = elem.value.toUpperCase();
            parseString();
        }
        elem.onblur = function(){
            picker.style.display = "none";
            elem.onchange();
            var val = elem.value.toUpperCase();
            if (val == 'G'){
                sv.simpleDialog("exclamation-triangle","#e90","'G' means GPS only.<br/>You should include 'S' if you have standard<br/> COM / NAV / ILS.");
            }else if (val.indexOf('S') < 0 && val.indexOf('V') < 0 && val.indexOf('U') < 0){
                sv.simpleDialog("exclamation-triangle","#e90","Are you NORDO?<br/>If you have a VHF radio you should include 'S' or 'V'");
            }
        }
    },
    addIcaoPbnPicker: function(elem,equipElem){
        var sv = this;
        var picker = this.ce("div","svfpl_icaoEquipPicker");
        elem.parentElement.appendChild(picker);
        var vals = [
                    ['A1','RNAV 10 (RNP 10)'],
                    ['B2','RNAV 5 - GNSS'],
                    ['B3','RNAV 5 - DME/DME'],
                    ['B4','RNAV 5 - VOR/DME'],
                    ['B5','RNAV 5 - INS or IRS'],
                    ['B6','RNAV 5 - LORAN-C'],
                    ['C2','RNAV 2 - GNSS'],
                    ['C3','RNAV 2 - DME/DME'],
                    ['C4','RNAV 2 - DME/DME/IRU'],
                    ['D2','RNAV 1 - GNSS'],
                    ['D3','RNAV 1 - DME/DME'],
                    ['D4','RNAV 1 - DME/DME/IRU'],
                    ['L1','RNP 4'],
                    ['O2','Basic RNP 1 - GNSS'],
                    ['O3','Basic RNP 1 - DME/DME'],
                    ['O4','Basic RNP 1 - DME/DME/IRU'],
                    ['S1','RNP Approach'],
                    ['S2','RNP Approach with Baro-VNAV'],
                    ['T1','RNP AR Approach with RF'],
                    ['T2','RNP AR Approache without RF']
        ];
        var values = {};
        var checkBoxes = {};
        var setString = function(){
            var string = "";
            for (var i=0; i < vals.length; i++){
                var code = vals[i][0];
                if (values[code]){
                    isNil = false;
                    string += code;
                }
            }
            elem.value = string;
        };
        var makeCheckbox = function(code,txt,callback){
            var checkbox = sv.ce("input");
            checkbox.type = "checkbox";
            checkBoxes[code] = checkbox;
            var div = sv.ce("div");
            div.style.cursor = "pointer";
            div.appendChild(checkbox);
            if (txt){
                div.appendChild(document.createTextNode(txt));
            }
            picker.appendChild(div);
            div.onmousedown = function(e){
                e.preventDefault();
                if (values[code]){
                    values[code] = false;
                    checkbox.checked = false;
                }else{
                    values[code] = true;
                    checkbox.checked = true;
                }
                if (callback) callback(code);
            }
            checkbox.onclick = function() { return false; }
            return div;
        };
        var rnavClick = function(code){
            if (code == 'A1' && values['A1'] && values['L1']){
                values['L1'] = false;
                checkBoxes['L1'].checked = false;
            }
            if (code == 'L1' && values['A1'] && values['L1']){
                values['A1'] = false;
                checkBoxes['A1'].checked = false;
            }
            if (code == 'S1' && values['S1'] && values['S2']){
                values['S2'] = false;
                checkBoxes['S2'].checked = false;
            }
            if (code == 'S2' && values['S1'] && values['S2']){
                values['S1'] = false;
                checkBoxes['S1'].checked = false;
            }
            if (code == 'T1' && values['T1'] && values['T2']){
                values['T2'] = false;
                checkBoxes['T2'].checked = false;
            }
            if (code == 'T2' && values['T1'] && values['T2']){
                values['T1'] = false;
                checkBoxes['T1'].checked = false;
            }
            var string = "";
            if (values['A1']) string += 'A1';
            if (values['L1']) string += 'L1';

            if (values['B2'] && values['B3'] && values['B4'] && values['B5'] && values ['B6']){
                string += 'B1';
            }else{
                if (values['B2']) string += 'B2';
                if (values['B3']) string += 'B3';
                if (values['B4']) string += 'B4';
                if (values['B5']) string += 'B5';
                if (values['B6']) string += 'B6';
            }
            if (values['C2'] && values['C4']){
                string += 'C1';
            }else{
                if (values['C2']) string += 'C2';
                if (values['C4']){
                    string += 'C4';
                }else if(values['C3']){
                    string += 'C3';
                }
            }
            if (values['D2'] && values['D4']){
                string += 'D1';
            }else{
                if (values['D2']) string += 'D2';
                if (values['D4']){
                    string += 'D4';
                }else if(values['D3']){
                    string += 'D3';
                }
            }
            if (values['O2'] && values['O4']){
                string += 'O1';
            }else{
                if (values['O2']) string += 'O2';
                if (values['O4']){
                    string += 'O4';
                }else if(values['O3']){
                    string += 'O3';
                }
            }
            if (values['S1']) string += 'S1';
            if (values['S2']) string += 'S2';
            if (values['T1']) string += 'T1';
            if (values['T2']) string += 'T2';
            elem.value = string;
        }
        var h = sv.ce("h1","svfpl_picker");
        h.appendChild(document.createTextNode("Select all capabilities"));
        picker.appendChild(h);

        var table = this.ce("table");
        table.id = "svfpl_rnavpickertable";
        var tbody = this.ce("tbody");
        table.appendChild(tbody);
        picker.appendChild(table);
        var header = this.ce("tr");
        tbody.appendChild(header);
        header.appendChild(this.ce("th"));
        var h1 = this.ce("th");
        h1.appendChild(document.createTextNode("RNAV 5"));
        header.appendChild(h1);
        var h2 = this.ce("th");
        h2.appendChild(document.createTextNode("RNAV 2"));
        header.appendChild(h2);
        var h3 = this.ce("th");
        h3.appendChild(document.createTextNode("RNAV 1"));
        header.appendChild(h3);
        var h4 = this.ce("th");
        h4.innerHTML="Basic<br/>RNP 1";
        header.appendChild(h4);
        var row1 = this.ce("tr");
        tbody.appendChild(row1);
        var row1a = this.ce("th");
        row1.appendChild(row1a);
        row1a.appendChild(document.createTextNode("GNSS"));
        var row1b = this.ce("td");
        row1.appendChild(row1b);
        row1b.appendChild(makeCheckbox('B2',false,rnavClick));
        var row1c = this.ce("td");
        row1.appendChild(row1c);
        row1c.appendChild(makeCheckbox('C2',false,rnavClick));
        var row1d = this.ce("td");
        row1.appendChild(row1d);
        row1d.appendChild(makeCheckbox('D2',false,rnavClick));
        var row1e = this.ce("td");
        row1.appendChild(row1e);
        row1e.appendChild(makeCheckbox('O2',false,rnavClick));
        var row2 = this.ce("tr");
        tbody.appendChild(row2);
        var row2a = this.ce("th");
        row2a.appendChild(document.createTextNode("DME/DME"));
        row2.appendChild(row2a);
        var row2b = this.ce("td");
        row2.appendChild(row2b);
        row2b.appendChild(makeCheckbox('B3',false,rnavClick));
        var row2c = this.ce("td");
        row2.appendChild(row2c);
        row2c.appendChild(makeCheckbox('C3',false,rnavClick));
        var row2d = this.ce("td");
        row2.appendChild(row2d);
        row2d.appendChild(makeCheckbox('D3',false,rnavClick));
        var row2e = this.ce("td");
        row2.appendChild(row2e);
        row2e.appendChild(makeCheckbox('O3',false,rnavClick));
        var row3 = this.ce("tr");
        tbody.appendChild(row3);
        var row3a = this.ce("th");
        row3a.appendChild(document.createTextNode("DME/DME/IRU"));
        row3.appendChild(row3a);
        row3.appendChild(this.ce("th"));
        var row3c = this.ce("td");
        row3.appendChild(row3c);
        row3c.appendChild(makeCheckbox('C4',false,rnavClick));
        var row3d = this.ce("td");
        row3.appendChild(row3d);
        row3d.appendChild(makeCheckbox('D4',false,rnavClick));
        var row3e = this.ce("td");
        row3.appendChild(row3e);
        row3e.appendChild(makeCheckbox('O4',false,rnavClick));
        var row4 = this.ce("tr");
        tbody.appendChild(row4);
        var row4a = this.ce("th");
        row4a.appendChild(document.createTextNode("VOR/DME"));
        row4.appendChild(row4a);
        var row4b = this.ce("td");
        row4.appendChild(row4b);
        row4b.appendChild(makeCheckbox('B4',false,rnavClick));
        var row5 = this.ce("tr");
        tbody.appendChild(row5);
        var row5a = this.ce("th");
        row5a.appendChild(document.createTextNode("INS or IRS"));
        row5.appendChild(row5a);
        var row5b = this.ce("td");
        row5.appendChild(row5b);
        row5b.appendChild(makeCheckbox('B5',false,rnavClick));
        var row6 = this.ce("tr");
        tbody.appendChild(row6);
        var row6a = this.ce("th");
        row6a.appendChild(document.createTextNode("LORAN-C"));
        row6.appendChild(row6a);
        var row6b = this.ce("td");
        row6.appendChild(row6b);
        row6b.appendChild(makeCheckbox('B6',false,rnavClick));

        picker.appendChild(sv.ce("div","sv_divhr"));
        var h = sv.ce("h1","svfpl_picker");
        h.appendChild(document.createTextNode("Oceanic / Remote Area Operations"));
        picker.appendChild(h);
        var cA1 = makeCheckbox('A1','RNAV 10 (RNP 10)',rnavClick)
        cA1.style.display = "inline-block";
        cA1.style.padding = "0px 30px";
        picker.appendChild(cA1);
        var cL1 = makeCheckbox('L1','RNP 4',rnavClick);
        cL1.style.display = "inline-block";
        picker.appendChild(cL1);

        picker.appendChild(sv.ce("div","sv_divhr"));
        var h = sv.ce("h1","svfpl_picker");
        h.appendChild(document.createTextNode("RNP Approach Procedures"));
        picker.appendChild(h);
        var cS1 = makeCheckbox('S1','RNP Apch',rnavClick);
        cS1.style.display = "inline-block";
        cS1.style.padding = "0 30px";
        picker.appendChild(cS1);
        var cS2 = makeCheckbox('S2','RNP Apch w/Baro-VNAV',rnavClick);
        cS2.style.display = "inline-block";
        picker.appendChild(cS2);

        picker.appendChild(sv.ce("div","sv_divhr"));
        var h = sv.ce("h1","svfpl_picker");
        h.appendChild(document.createTextNode("RNP Authorization Required Approach Procedures"));
        picker.appendChild(h);
        var cT1 = makeCheckbox('T1','RNP AR Apch w/RF',rnavClick);
        cT1.style.display = "inline-block";
        cT1.style.padding = "0 20px";
        picker.appendChild(cT1);
        var cT2 = makeCheckbox('T2','RNP AR Apch wo/RF',rnavClick);
        cT2.style.display = "inline-block";
        picker.appendChild(cT2);

        
        var parseString = function(){
            var val = elem.value.toUpperCase();
            for (var i=0; i < vals.length; i++){
                var code = vals[i][0];
                if (checkBoxes[code]) checkBoxes[code].checked = false;
                values[code] = false;
            }
            if (val && val.length){
                val = val.toUpperCase();
                if (val != elem.value) elem.value = val;
                if (val.indexOf('B1') > -1){
                    ['B2','B3','B4','B5','B6'].map(function(a){ 
                            if (checkBoxes[a]) checkBoxes[a].checked = true;
                            values[a] = true;
                        });
                }
                if (val.indexOf('C1') > -1){
                    ['C2','C3','C4'].map(function(a){ 
                            if (checkBoxes[a]) checkBoxes[a].checked = true;
                            values[a] = true;
                        });
                }
                if (val.indexOf('D1') > -1){
                    ['D2','D3','D4'].map(function(a){ 
                            if (checkBoxes[a]) checkBoxes[a].checked = true;
                            values[a] = true;
                        });
                }
                if (val.indexOf('O1') > -1){
                    ['O2','O3','O4'].map(function(a){ 
                            if (checkBoxes[a]) checkBoxes[a].checked = true;
                            values[a] = true;
                        });
                }
                for (var i=0; i < vals.length; i++){
                    var code = vals[i][0];
                    if (val.indexOf(code) > -1){
                        if (checkBoxes[code]) checkBoxes[code].checked = true;
                        values[code] = true;
                    }
                }
                
            }
        }

        elem.onfocus = function(){
            picker.style.display = "block";
            parseString();
        }
        elem.onkeyup = function(){
            //elem.value = elem.value.toUpperCase();
            parseString();
        }
        elem.onblur = function(){
            picker.style.display = "none";
            elem.onchange();
            var pbnval = elem.value.toUpperCase();
            var equip = equipElem.value.toUpperCase();
            if (pbnval && equip.indexOf('R') < 0){
                equipElem.value  = equip + "R";
            }else if (!pbnval && equip.indexOf('R') > -1){
                equipElem.value = equip.replace("R","");
            }
        }
    },
    setFileInfo: function(p){
        var sv = this;
        var qs = sv.mkQS(p);
        sv.disableFileForm();
        var r = sv.request(sv.data.perldir + "/fileInfo" + qs);
        r.onload = function(data){
            if (data.info){
                sv.showFileForm(data.info);
                sv.showPlanEdit(data.info);
                sv.disableFileForm(true);
            }
        }
    },
    disableFileForm: function(enabled){
        var sv=this;
        var fields = "flightRules ident faaType faaEquip faaTAS faaDep faaETD faaEDD faaAlt faaRoute faaDst faaETE faaRemarks faaEndurance faaAlt1 faaAlt2 faaPilot faaSouls faaColor faaNumAcft faaHeavy icaoFType icaoNumAcft icaoType icaoWake icaoEquip icaoSurvEquip icaoDep icaoETD icaoEDD icaoTAS icaoAlt icaoRoute icaoDst icaoETE icaoAlt1 icaoAlt2 specHandle icaoPbn icaoPerf otherInfo icaoEndurance icaoSouls survP survD survM survJ radioVHF radioUHF radioELT jackL jackF jackU jackV dingNum dingCap dingCovered dingColor icaoColor icaoRemark icaoPilot".split(" ");
        for (var i=0; i < fields.length; i++){
            var elem = sv.data.div.fileForm[fields[i]];
            if (enabled){
                elem.disabled = false;
            }else{
                elem.disabled = true;
            }
        }
    },
    showFileForm: function(fileInfo){
        var p;
        var sv = this;
        if (this.data.div.fileForm){
            p = this.data.div.fileForm;
        }else{
            this.data.div.fileForm = {};
            p = this.data.div.fileForm;
            p.div = this.ce("div");
            p.div.id = "sv_fileForm";
            this.data.div.chart.appendChild(p.div);
            p.div.onmouseover = function() {
                sv.data.nowheel = true;
            }
            p.div.onmouseout = function() {
                sv.data.nowheel = false;
            }
            p.div.onmousewheel = function(e) {
                if (!e)
                    e = window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = "true";
                }
            }
            var ci = this.ce("img");
            ci.className = "sv_panelx";
            ci.style.marginTop = "-3px";
            ci.style.marginRight = "-3px";
            ci.src = this.data.images + "/planclose.png";
            ci.onclick = function() {
                p.div.style.visibility = 'hidden';
            }
            p.div.appendChild(ci);
            var h1 = this.ce("h1","sv sv_panel");
            
            h1.appendChild(document.createTextNode("File Flight Plan"));
            p.div.appendChild(h1);
            var addLabel = function(div,text,width,align,size){
                var span = sv.ce("div","svfpl_filelabel");
                span.appendChild(document.createTextNode(text));
                span.style.left = div.offsetLeft + "px";
                span.style.top = "-12px";
                if (width){
                    span.style.width = width + "px";
                }else{
                    span.style.width = div.offsetWidth + "px";
                }
                if (align){
                    span.style.textAlign = align;
                    span.style.marginLeft = "10px";
                    span.style.marginRight = "10px";
                }else{
                    span.style.textAlign = "center";
                }
                if (size){
                    span.style.fontSize = size;
                }
                div.parentElement.appendChild(span);
            }
            p.row1a = this.ce("div","svfpl_fileRow");
            p.row1a.style.position = "absolute";
            p.div.appendChild(p.row1a);

            var fspan = this.ce("span","svfpl_planspan");
            p.row1a.appendChild(fspan);
            p.flightRules = this.ce("select");
            p.flightRules.style.width="58px";
            p.flightRules.style.fontFamily="Menlo, DejaVu Sans Mono, fixed-width";
            p.flightRules.onchange = function(){
            //    if (p.flightRules.selectedIndex < 2){
            //        p.showForm(false);
            //    }else{
            //        p.showForm(true);
            //    }
                sv.setFileInfo({k:"flightRules",v:(p.flightRules.selectedIndex+2)});
            }
            fspan.appendChild(p.flightRules);
            addLabel(fspan,"Flight Rule");
            var opt1 = this.ce("option","svfpl_wideoption");
            opt1.appendChild(document.createTextNode("VFR -- FAA Format VFR"));
            //p.flightRules.appendChild(opt1);
            var opt2 = this.ce("option","svfpl_wideoption");
            opt2.appendChild(document.createTextNode("MVFR -- FAA Format Military VFR"));
            //p.flightRules.appendChild(opt2);
            var opt3 = this.ce("option","svfpl_wideoption");
            opt3.appendChild(document.createTextNode("VFR"));
            p.flightRules.appendChild(opt3);
            var opt4 = this.ce("option","svfpl_wideoption");
            opt4.appendChild(document.createTextNode("IFR"));
            p.flightRules.appendChild(opt4);

            fspan = this.ce("span","svfpl_planspan");
            p.row1a.appendChild(fspan);
            p.ident = this.ce("input","svfpl_input");
            p.ident.setAttribute("maxlength","10");
            fspan.appendChild(p.ident);
            addLabel(fspan,"Aircraft ID");
            p.ident.onchange = function(){
                sv.setFileInfo({k:"ident",v:p.ident.value});
            }

            p.row1d = this.ce("div","svfpl_fileRow");
            p.row1d.style.marginLeft = "135px";
            p.div.appendChild(p.row1d);
            fspan = this.ce("span","svfpl_planspan");
            p.row1d.appendChild(fspan);
            p.faaType = this.ce("input","svfpl_input small");
            p.faaType.setAttribute("maxlength","10");
            fspan.appendChild(p.faaType);
            fspan.appendChild(document.createTextNode("/"));
            p.faaEquip = this.ce("input","svfpl_input");
            p.faaEquip.style.width="14px";
            fspan.appendChild(p.faaEquip);
            addLabel(fspan,"Aircraft Type");
            p.faaType.onchange = function(){
                sv.setFileInfo({k:"type",v:p.faaType.value});
            }
            p.faaEquip.onchange = function(){
                sv.setFileInfo({k:"faaEquip",v:p.faaEquip.value});
            }


            fspan = this.ce("span","svfpl_planspan");
            p.row1d.appendChild(fspan);
            p.faaTAS = this.ce("input","svfpl_input small");
            fspan.appendChild(p.faaTAS);
            addLabel(fspan,"TAS");
            p.faaTAS.onchange = function(){
                sv.setFileInfo({k:'TAS',v:p.faaTAS.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row1d.appendChild(fspan);
            p.faaDep = this.ce("input","svfpl_input");
            fspan.appendChild(p.faaDep);
            addLabel(fspan,"Departure");
            p.faaDep.onchange = function(){
                sv.setFileInfo({k:"dep",v:p.faaDep.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row1d.appendChild(fspan);
            p.faaETD = this.ce("input","svfpl_input small");
            p.faaETD.style.width = "50px";
            fspan.appendChild(p.faaETD);
            p.faaEDD = this.ce("input","svfpl_input small");
            p.faaEDD.style.width = "50px";
            fspan.appendChild(p.faaEDD);
            addLabel(fspan,"Dep Time & Date (Z)");
            p.faaETD.onchange = function(){
                sv.setFileInfo({k:"etd",v:p.faaETD.value,v2:p.faaEDD.value});
            }
            p.faaEDD.onchange = function(){
                sv.setFileInfo({k:"etd",v:p.faaETD.value,v2:p.faaEDD.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row1d.appendChild(fspan);
            p.faaAlt = this.ce("input","svfpl_input small");
            fspan.appendChild(p.faaAlt);
            addLabel(fspan,"Altitude");
            p.faaAlt.onchange = function(){
                sv.setFileInfo({k:"alt",v:p.faaAlt.value});
            }

            p.row2d = this.ce("div","svfpl_fileRow");
            p.div.appendChild(p.row2d);
            p.row2d.style.height = "70px";
            fspan = this.ce("span","svfpl_planspan");
            p.row2d.appendChild(fspan);
            p.faaRoute = this.ce("textarea");
            //p.faaRoute.type = "textarea";
            p.faaRoute.style.width = "470px";
            p.faaRoute.style.height = "60px";
            fspan.appendChild(p.faaRoute);
            addLabel(fspan,"Route of Flight - (Do not include departure and destination)",undefined,"left");
            p.faaRoute.onchange = function(){
                sv.setFileInfo({k:"route",v:p.faaRoute.value});
            }

            p.row3d = this.ce("div","svfpl_fileRow");
            p.div.appendChild(p.row3d);
            fspan = this.ce("span","svfpl_planspan");
            p.row3d.appendChild(fspan);
            p.faaDst = this.ce("input","svfpl_input");
            fspan.appendChild(p.faaDst);
            addLabel(fspan,"Destination");
            p.faaDst.onchange = function(){
                sv.setFileInfo({k:"dst",v:p.faaDst.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row3d.appendChild(fspan);
            p.faaETE = this.ce("input","svfpl_input small");
            fspan.appendChild(p.faaETE);
            addLabel(fspan,"ETE");
            p.faaETE.onchange = function(){
                sv.setFileInfo({k:"ete",v:p.faaETE.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row3d.appendChild(fspan);
            p.faaRemarks = this.ce("input","svfpl_input");
            p.faaRemarks.style.width = "357px";
            p.faaRemarks.style.textAlign = "left";
            fspan.appendChild(p.faaRemarks);
            addLabel(fspan,"Remarks",50);
            p.faaRemarks.onchange = function(){
                sv.setFileInfo({k:"rem",v:p.faaRemarks.value});
            }


            p.row4d = this.ce("div","svfpl_fileRow");
            p.div.appendChild(p.row4d);

            fspan = this.ce("span","svfpl_planspan");
            p.row4d.appendChild(fspan);
            p.faaEndurance = this.ce("input","svfpl_input small");
            fspan.appendChild(p.faaEndurance);
            addLabel(fspan,"Fuel");
            p.faaEndurance.onchange = function() {
                sv.setFileInfo({k:"endur",v:p.faaEndurance.value});
            }
            
            fspan = this.ce("span","svfpl_planspan");
            p.row4d.appendChild(fspan);
            p.faaAlt1 = this.ce("input","svfpl_input");
            fspan.appendChild(p.faaAlt1);
            addLabel(fspan,"1st Alternate");
            p.faaAlt1.onchange = function(){
                sv.setFileInfo({k:"alt1",v:p.faaAlt1.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row4d.appendChild(fspan);
            p.faaAlt2 = this.ce("input","svfpl_input");
            fspan.appendChild(p.faaAlt2);
            addLabel(fspan,"2nd Alternate");
            p.faaAlt2.onchange = function(){
                sv.setFileInfo({k:"alt2",v:p.faaAlt2.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row4d.appendChild(fspan);
            p.faaPilot = this.ce("input","svfpl_input");
            p.faaPilot.style.width = "241px";
            p.faaPilot.style.textAlign = "left";
            fspan.appendChild(p.faaPilot);
            addLabel(fspan,"Pilot's Name, Phone Number, Aircraft Home Base");
            p.faaPilot.onchange = function(){
                sv.setFileInfo({k:"pilot",v:p.faaPilot.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row4d.appendChild(fspan);
            p.faaSouls = this.ce("input","svfpl_input small");
            fspan.appendChild(p.faaSouls);
            addLabel(fspan,"# Aboard");
            p.faaSouls.onchange = function(){
                sv.setFileInfo({k:"souls",v:p.faaSouls.value});
            }

            p.row5d = this.ce("div","svfpl_fileRow");
            p.div.appendChild(p.row5d);

            fspan = this.ce("span","svfpl_planspan");
            p.row5d.appendChild(fspan);
            p.faaColor = this.ce("input","svfpl_input");
            p.faaColor.style.width = "80px";
            fspan.appendChild(p.faaColor);
            addLabel(fspan,"Aircraft Color");
            this.addColorPicker(p.faaColor);
            p.faaColor.onchange = function(){
                sv.setFileInfo({k:"color",v:p.faaColor.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row5d.appendChild(fspan);
            p.faaNumAcft = this.ce("input","svfpl_input");
            fspan.appendChild(p.faaNumAcft);
            addLabel(fspan,"# of Aircraft");
            p.faaNumAcft.onchange = function(){
                sv.setFileInfo({k:"numAcft",v:p.faaNumAcft.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row5d.appendChild(fspan);
            p.faaHeavy = this.ce("input");
            p.faaHeavy.style.margin = "3px 10px";
            p.faaHeavy.type="checkbox";
            fspan.appendChild(p.faaHeavy);
            addLabel(fspan,"Heavy");
            p.faaHeavy.onchange = function(){
                sv.setFileInfo({k:"heavy",v:p.faaHeavy.checked});
            }

            p.row1i = this.ce("div","svfpl_fileRow");
            p.row1i.style.marginLeft = "135px";
            p.div.appendChild(p.row1i);

            fspan = this.ce("span","svfpl_planspan");
            p.row1i.appendChild(fspan);
            p.icaoFType = this.ce("select");
            p.icaoFType.style.width = "120px";
            var o=this.ce("option");
            p.icaoFType.appendChild(o);
            o=this.ce("option");
            o.appendChild(document.createTextNode("Scheduled"));
            p.icaoFType.appendChild(o);
            o=this.ce("option");
            o.appendChild(document.createTextNode("Non-Scheduled"));
            p.icaoFType.appendChild(o);
            o=this.ce("option");
            o.appendChild(document.createTextNode("General"));
            p.icaoFType.appendChild(o);
            o=this.ce("option");
            o.appendChild(document.createTextNode("Military"));
            p.icaoFType.appendChild(o);
            o=this.ce("option");
            o.appendChild(document.createTextNode("Other"));
            p.icaoFType.appendChild(o);
            fspan.appendChild(p.icaoFType);
            addLabel(fspan,"Flight Type");
            p.icaoFType.onchange = function(){
                sv.setFileInfo({k:"ftype",v:p.icaoFType.selectedIndex});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row1i.appendChild(fspan);
            p.icaoNumAcft = this.ce("input","svfpl_input");
            fspan.appendChild(p.icaoNumAcft);
            addLabel(fspan,"# of Aircraft");
            p.icaoNumAcft.onchange = function(){
                sv.setFileInfo({k:"numAcft",v:p.icaoNumAcft.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row1i.appendChild(fspan);
            p.icaoType = this.ce("input","svfpl_input");
            p.icaoType.setAttribute("maxlength","10");
            fspan.appendChild(p.icaoType);
            addLabel(fspan,"Aircraft Type");
            p.icaoType.onchange = function(){
                sv.setFileInfo({k:"type",v:p.icaoType.value});
            }

            p.row2i = this.ce("div","svfpl_fileRow");
            p.div.appendChild(p.row2i);

            fspan = this.ce("span","svfpl_planspan");
            p.row2i.appendChild(fspan);
            p.icaoWake = this.ce("select");
            p.icaoWake.style.width = "120px";
            fspan.appendChild(p.icaoWake);
            o = this.ce("option");
            o.appendChild(document.createTextNode("Light"));
            p.icaoWake.appendChild(o);
            o = this.ce("option");
            o.appendChild(document.createTextNode("Medium"));
            p.icaoWake.appendChild(o);
            o = this.ce("option");
            o.appendChild(document.createTextNode("Heavy"));
            p.icaoWake.appendChild(o);
            addLabel(fspan,"Wake Turbulence Cat");
            p.icaoWake.onchange = function(){
                sv.setFileInfo({k:"wake",v:p.icaoWake.selectedIndex});
            }


            fspan = this.ce("span","svfpl_planspan");
            p.row2i.appendChild(fspan);
            p.icaoEquip = this.ce("input","svfpl_input");
            p.icaoEquip.style.width = "120px";
            fspan.appendChild(p.icaoEquip);
            addLabel(fspan,"ICAO Equipment Code");
            p.icaoEquip.onchange = function(){
                sv.setFileInfo({k:"icaoEquip",v:p.icaoEquip.value});
            }

            p.row2i.appendChild(document.createTextNode("/"));

            fspan = this.ce("span","svfpl_planspan");
            p.row2i.appendChild(fspan);
            p.icaoSurvEquip = this.ce("input","svfpl_input");
            p.icaoSurvEquip.style.width = "120px";
            fspan.appendChild(p.icaoSurvEquip);
            addLabel(fspan,"Surveillance Equipment");
            this.addIcaoSurvPicker(p.icaoSurvEquip);
            p.icaoSurvEquip.onchange = function(){
                sv.setFileInfo({k:"survEquip",v:p.icaoSurvEquip.value});
            }

            p.row3i = this.ce("div","svfpl_fileRow");
            p.div.appendChild(p.row3i);

            fspan = this.ce("span","svfpl_planspan");
            p.row3i.appendChild(fspan);
            p.icaoDep = this.ce("input","svfpl_input");
            fspan.appendChild(p.icaoDep);
            addLabel(fspan,"Departure");
            p.icaoDep.onchange = function(){
                sv.setFileInfo({k:"dep",v:p.icaoDep.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row3i.appendChild(fspan);
            p.icaoETD = this.ce("input","svfpl_input");
            fspan.appendChild(p.icaoETD);
            p.icaoEDD = this.ce("input","svfpl_input");
            fspan.appendChild(p.icaoEDD);
            addLabel(fspan,"Dep Time & Date (Z)");
            p.icaoETD.onchange = function(){
                sv.setFileInfo({k:"etd",v:p.icaoETD.value,v2:p.icaoEDD.value});
            }
            p.icaoEDD.onchange = function(){
                sv.setFileInfo({k:"etd",v:p.icaoETD.value,v2:p.icaoEDD.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row3i.appendChild(fspan);
            p.icaoTAS = this.ce("input","svfpl_input");
            fspan.appendChild(p.icaoTAS);
            addLabel(fspan,"Speed");
            p.icaoTAS.onchange = function(){
                sv.setFileInfo({k:"TAS",v:p.icaoTAS.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row3i.appendChild(fspan);
            p.icaoAlt = this.ce("input","svfpl_input");
            fspan.appendChild(p.icaoAlt);
            addLabel(fspan,"Level");
            p.icaoAlt.onchange = function(){
                sv.setFileInfo({k:"alt",v:p.icaoAlt.value});
            }

            p.row4i = this.ce("div","svfpl_fileRow");
            p.row4i.style.height = "70px";
            p.div.appendChild(p.row4i);
            fspan = this.ce("span","svfpl_planspan");
            p.row4i.appendChild(fspan);
            p.icaoRoute = this.ce("textarea");
            p.icaoRoute.style.width = "440px";
            p.icaoRoute.style.height = "60px";
            fspan.appendChild(p.icaoRoute);
            addLabel(fspan,"Route of Flight (Do not include Departure and Destination)",undefined,"left");
            p.icaoRoute.onchange = function(){
                sv.setFileInfo({k:"route",v:p.icaoRoute.value});
            }

            p.row5i = this.ce("div","svfpl_fileRow");
            p.div.appendChild(p.row5i);

            fspan = this.ce("span","svfpl_planspan");
            p.row5i.appendChild(fspan);
            p.icaoDst = this.ce("input","svfpl_input");
            fspan.appendChild(p.icaoDst);
            addLabel(fspan,"Destination");
            p.icaoDst.onchange = function(){
                sv.setFileInfo({k:"dst",v:p.icaoDst.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row5i.appendChild(fspan);
            p.icaoETE = this.ce("input","svfpl_input");
            fspan.appendChild(p.icaoETE);
            addLabel(fspan,"ETE");
            p.icaoETE.onchange = function(){
                sv.setFileInfo({k:"ete",v:p.icaoETE.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row5i.appendChild(fspan);
            p.icaoAlt1 = this.ce("input","svfpl_input");
            fspan.appendChild(p.icaoAlt1);
            addLabel(fspan,"1st Alternate");
            p.icaoAlt1.onchange = function(){
                sv.setFileInfo({k:"alt1",v:p.icaoAlt1.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row5i.appendChild(fspan);
            p.icaoAlt2 = this.ce("input","svfpl_input");
            fspan.appendChild(p.icaoAlt2);
            addLabel(fspan,"2nd Alternate");
            p.icaoAlt2.onchange = function(){
                sv.setFileInfo({k:"alt2",v:p.icaoAlt2.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row5i.appendChild(fspan);
            p.specHandle = this.ce("select");
            p.specHandle.style.width = "140px";
            o =  this.ce("option");
            p.specHandle.appendChild(o);
            o =  this.ce("option");
            o.appendChild(document.createTextNode("ALTRV - Flight Operated in accordance with an altitude reservation"));
            p.specHandle.appendChild(o);
            o =  this.ce("option");
            o.appendChild(document.createTextNode("ATFMX - Flight approved for exemption from ATFM measures"));
            p.specHandle.appendChild(o);
            o =  this.ce("option");
            o.appendChild(document.createTextNode("FFR - Fire Fighting"));
            p.specHandle.appendChild(o);
            o =  this.ce("option");
            o.appendChild(document.createTextNode("FLTCK - Flight check for calibration of Navaids"));
            p.specHandle.appendChild(o);
            o =  this.ce("option");
            o.appendChild(document.createTextNode("HAZMAT - Flight carrying hazardous materials"));
            p.specHandle.appendChild(o);
            o =  this.ce("option");
            o.appendChild(document.createTextNode("HEAD - Flight with Head of State status"));
            p.specHandle.appendChild(o);
            o =  this.ce("option");
            o.appendChild(document.createTextNode("HOSP - Medical flight declared by medical authorities"));
            p.specHandle.appendChild(o);
            o =  this.ce("option");
            o.appendChild(document.createTextNode("HUM - Flight operating on a humanitarian mission"));
            p.specHandle.appendChild(o);
            o =  this.ce("option");
            o.appendChild(document.createTextNode("MARSA - Flight for which a military entity assumes responsibility for separation of military aircraft"));
            p.specHandle.appendChild(o);
            o =  this.ce("option");
            o.appendChild(document.createTextNode("MEDEVAC - Life critical medical emergency evacuation"));
            p.specHandle.appendChild(o);
            o =  this.ce("option");
            o.appendChild(document.createTextNode("NONRVSM - Non-RVSM capable flight intending to operate in RVSM airspace"));
            p.specHandle.appendChild(o);
            o =  this.ce("option");
            o.appendChild(document.createTextNode("SAR - Flight engaged in a search and rescue mission"));
            p.specHandle.appendChild(o);
            o =  this.ce("option");
            o.appendChild(document.createTextNode("STATE - Flight engaged in military, customs, or police services"));
            p.specHandle.appendChild(o);
            fspan.appendChild(document.createTextNode("STS/"));
            fspan.appendChild(p.specHandle);
            addLabel(fspan,"Special Handling");
            p.specHandle.onchange = function(){
                sv.setFileInfo({k:"sts",v:p.specHandle.selectedIndex});
            }

            p.row6i = this.ce("div","svfpl_fileRow");
            p.div.appendChild(p.row6i);

            fspan = this.ce("span","svfpl_planspan");
            p.row6i.appendChild(fspan);
            p.icaoPbn = this.ce("input","svfpl_input"); 
            p.icaoPbn.style.width = "140px";
            fspan.appendChild(document.createTextNode("PBN/"));
            fspan.appendChild(p.icaoPbn);
            addLabel(fspan,"RNAV / RNP Capabilities");
            this.addIcaoEquipPicker(p.icaoEquip,p.icaoPbn);
            this.addIcaoPbnPicker(p.icaoPbn,p.icaoEquip);
            p.icaoPbn.onchange = function(){
                sv.setFileInfo({k:"pbn",v:p.icaoPbn.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row6i.appendChild(fspan);
            p.icaoPerf = this.ce("select");
            p.icaoPerf.style.width = "140px";
            var o;
            o = this.ce("option");
            p.icaoPerf.appendChild(o);
            o = this.ce("option");
            o.appendChild(document.createTextNode("A: 0 - 90 KIAS"));
            p.icaoPerf.appendChild(o);
            o = this.ce("option");
            o.appendChild(document.createTextNode("B: 91 - 120 KIAS"));
            p.icaoPerf.appendChild(o);
            o = this.ce("option");
            o.appendChild(document.createTextNode("C: 121 - 140 KIAS"));
            p.icaoPerf.appendChild(o);
            o = this.ce("option");
            o.appendChild(document.createTextNode("D: 141 - 165 KIAS"));
            p.icaoPerf.appendChild(o);
            o = this.ce("option");
            o.appendChild(document.createTextNode("E: 166 - 210 KIAS"));
            p.icaoPerf.appendChild(o);
            o = this.ce("option");
            o.appendChild(document.createTextNode("H: Helicopter"));
            p.icaoPerf.appendChild(o);
            fspan.appendChild(document.createTextNode("PER/"));
            fspan.appendChild(p.icaoPerf);
            addLabel(fspan,"Performance Category");
            p.icaoPerf.onchange = function(){
                sv.setFileInfo({k:"perf",v:p.icaoPerf.selectedIndex});
            }
 
            p.row7i = this.ce("div","svfpl_fileRow");
            p.row7i.style.height = "50px";
            p.div.appendChild(p.row7i);
            fspan = this.ce("span","svfpl_planspan");
            p.row7i.appendChild(fspan);
            p.otherInfo = this.ce("textarea");
            p.otherInfo.style.width = "440px";
            p.otherInfo.style.height = "40px";
            fspan.appendChild(p.otherInfo);
            addLabel(fspan,"Other Information (NAV/ COM/ DAT/ SUR/ DEP/ DEST/ REG/ etc.)",null,"left");
            p.otherInfo.onchange = function(){
                sv.setFileInfo({k:"otherInfo",v:p.otherInfo.value});
            }

            p.row8i = this.ce("div","svfpl_fileRow");
            p.div.appendChild(p.row8i);
            p.row9i = this.ce("div","svfpl_fileRow");
            p.div.appendChild(p.row9i);

            fspan = this.ce("span","svfpl_planspan");
            p.row8i.appendChild(fspan);
            p.icaoEndurance = this.ce("input","svfpl_input");
            fspan.appendChild(p.icaoEndurance);
            addLabel(fspan,"Endurance");
            p.icaoEndurance.onchange = function(){
                sv.setFileInfo({k:"endur",v:p.icaoEndurance.value});
            }
 
            fspan = this.ce("span","svfpl_planspan");
            p.row8i.appendChild(fspan);
            p.icaoSouls = this.ce("input","svfpl_input");
            fspan.appendChild(p.icaoSouls);
            addLabel(fspan,"# Aboard");
            p.icaoSouls.onchange = function(){
                sv.setFileInfo({k:"souls",v:p.icaoSouls.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            fspan.style.padding = "0px 8px";
            fspan.style.border = "1px solid #999";
            p.row9i.appendChild(fspan);
            p.radioUHF = this.ce("input");
            p.radioUHF.type = "checkbox";
            fspan.appendChild(document.createTextNode(" UHF"));
            fspan.appendChild(p.radioUHF);
            p.radioVHF = this.ce("input");
            p.radioVHF.type = "checkbox";
            fspan.appendChild(document.createTextNode(" VHF"));
            fspan.appendChild(p.radioVHF);
            p.radioELT = this.ce("input");
            p.radioELT.type = "checkbox";
            fspan.appendChild(document.createTextNode(" ELT"));
            fspan.appendChild(p.radioELT);
            addLabel(fspan,"Emergency Radios");

            fspan = this.ce("span","svfpl_planspan");
            fspan.style.padding = "0px 8px";
            fspan.style.border = "1px solid #999";
            p.row8i.appendChild(fspan);
            p.survP = this.ce("input");
            p.survP.type = "checkbox";
            fspan.appendChild(document.createTextNode(" Polar"));
            fspan.appendChild(p.survP);
            p.survD = this.ce("input");
            p.survD.type = "checkbox";
            fspan.appendChild(document.createTextNode(" Desert"));
            fspan.appendChild(p.survD);
            p.survM = this.ce("input");
            p.survM.type = "checkbox";
            fspan.appendChild(document.createTextNode(" Maritime"));
            fspan.appendChild(p.survM);
            p.survJ = this.ce("input");
            p.survJ.type = "checkbox";
            fspan.appendChild(document.createTextNode(" Jungle"));
            fspan.appendChild(p.survJ);
            addLabel(fspan,"Survival Equipment");

            fspan = this.ce("span","svfpl_planspan");
            fspan.style.padding = "0px 8px";
            fspan.style.border = "1px solid #999";
            p.row9i.appendChild(fspan);
            p.jackL = this.ce("input");
            p.jackL.type = "checkbox";
            fspan.appendChild(document.createTextNode(" Light"));
            fspan.appendChild(p.jackL);
            p.jackF = this.ce("input");
            p.jackF.type = "checkbox";
            fspan.appendChild(document.createTextNode(" Floures"));
            fspan.appendChild(p.jackF);
            p.jackU = this.ce("input");
            p.jackU.type = "checkbox";
            fspan.appendChild(document.createTextNode(" UHF"));
            fspan.appendChild(p.jackU);
            p.jackV = this.ce("input");
            p.jackV.type = "checkbox";
            fspan.appendChild(document.createTextNode(" VHF"));
            fspan.appendChild(p.jackV);
            addLabel(fspan,"Jackets");
            var ckList = ["survP","survD","survM","survJ",
            "radioVHF","radioUHF","radioELT",
            "jackL","jackF","jackU","jackV"];
            for (var i=0; i < ckList.length; i++){
                (function(){
                    var ckName = ckList[i]
                    var elem = p[ckName];
                    elem.onchange = function(){
                        sv.setFileInfo({k:ckName,v:elem.checked});
                    }
                })();
            }

            p.row10i = this.ce("div","svfpl_fileRow");
            p.div.appendChild(p.row10i);
            fspan = this.ce("span","svfpl_planspan");
            p.row10i.appendChild(fspan);
            p.dingNum = this.ce("input","svfpl_input");
            fspan.appendChild(p.dingNum);
            addLabel(fspan,"# Dinghies");
            p.dingNum.onchange = function(){
                sv.setFileInfo({k:"dingNum",v:p.dingNum.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row10i.appendChild(fspan);
            p.dingCap = this.ce("input","svfpl_input small");
            fspan.appendChild(p.dingCap);
            addLabel(fspan,"Capacity");
            p.dingCap.onchange = function(){
                sv.setFileInfo({k:"dingCap",v:p.dingCap.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            fspan.style.width = "40px";
            fspan.style.textAlign = "center";
            p.row10i.appendChild(fspan);
            p.dingCovered = this.ce("input");
            p.dingCovered.type = "checkbox";
            fspan.appendChild(p.dingCovered);
            addLabel(fspan,"Covered");
            p.dingCovered.onchange = function(){
                sv.setFileInfo({k:"dingCovered",v:p.dingCovered.checked});
            }

            fspan = this.ce("span","svfpl_planspan");
            p.row10i.appendChild(fspan);
            p.dingColor = this.ce("input","svfpl_input");
            fspan.appendChild(p.dingColor);
            addLabel(fspan,"Color");
            this.addColorPicker(p.dingColor);
            p.dingColor.onchange = function(){
                sv.setFileInfo({k:"dingColor",v:p.dingColor.value});
            }

            fspan = this.ce("span","svfpl_planspan");
            fspan.style.width = "50px";
            p.row10i.appendChild(fspan);
            fspan = this.ce("span","svfpl_planspan");
            p.row10i.appendChild(fspan);
            p.icaoColor = this.ce("input","svfpl_input");
            p.icaoColor.style.width = "100px";
            fspan.appendChild(p.icaoColor);
            addLabel(fspan,"Aircraft Color");
            this.addColorPicker(p.icaoColor);
            p.icaoColor.onchange = function(){
                sv.setFileInfo({k:"color",v:p.icaoColor.value});
            }

            p.row11i = this.ce("div","svfpl_fileRow");
            p.div.appendChild(p.row11i);
            fspan = this.ce("span","svfpl_planspan");
            p.row11i.appendChild(fspan);
            p.icaoRemark = this.ce("input","svfpl_input");
            p.icaoRemark.style.width = "440px";
            p.icaoRemark.style.textAlign = "left";
            fspan.appendChild(p.icaoRemark);
            addLabel(fspan,"Remarks",null,"left");
            p.icaoRemark.onchange = function(){
                sv.setFileInfo({k:"rem",v:p.icaoRemark.value});
            }

            p.row12i = this.ce("div","svfpl_fileRow");
            p.div.appendChild(p.row12i);
            fspan = this.ce("span","svfpl_planspan");
            p.row12i.appendChild(fspan);
            p.icaoPilot = this.ce("input","svfpl_input");
            p.icaoPilot.style.width = "440px";
            p.icaoPilot.style.textAlign = "left";
            fspan.appendChild(p.icaoPilot);
            addLabel(fspan,"Pilot in Command",null,"left");
            p.icaoPilot.onchange = function(){
                sv.setFileInfo({k:"pilot",v:p.icaoPilot.value});
            }

            p.formType = undefined;
            p.showForm = function(icaoType){
                if (icaoType){
                    p.formType = "I";
                    p.div.style.width = "465px";
                    p.row1i.style.display = "block";
                    p.row2i.style.display = "block";
                    p.row3i.style.display = "block";
                    p.row4i.style.display = "block";
                    p.row5i.style.display = "block";
                    p.row6i.style.display = "block";
                    p.row7i.style.display = "block";
                    p.row8i.style.display = "block";
                    p.row9i.style.display = "block";
                    p.row10i.style.display = "block";
                    p.row11i.style.display = "block";
                    p.row12i.style.display = "block";
                    p.row1d.style.display = "none";
                    p.row2d.style.display = "none";
                    p.row3d.style.display = "none";
                    p.row4d.style.display = "none";
                    p.row5d.style.display = "none";
                }else{
                    p.formType = "D";
                    p.div.style.width = "492px";
                    p.row1d.style.display = "block";
                    p.row2d.style.display = "block";
                    p.row3d.style.display = "block";
                    p.row4d.style.display = "block";
                    p.row5d.style.display = "block";
                    p.row1i.style.display = "none";
                    p.row2i.style.display = "none";
                    p.row3i.style.display = "none";
                    p.row4i.style.display = "none";
                    p.row5i.style.display = "none";
                    p.row6i.style.display = "none";
                    p.row7i.style.display = "none";
                    p.row8i.style.display = "none";
                    p.row9i.style.display = "none";
                    p.row10i.style.display = "none";
                    p.row11i.style.display = "none";
                    p.row12i.style.display = "none";
                }

            }
            var checkLength = function(elem,min,max,pattern){
                var val = elem.value;
                var valid = true;
                if (val.length < min || val.length > max){
                    valid = false;
                }
                if (pattern){
                    var re = new RegExp(pattern);
                    if (val.search(re) == -1){
                        valid = false;
                    }
                }
                if (valid){ 
                    elem.style.border = "1px solid #999";
                    return true;
                }else{
                    elem.style.border = "1px solid red";
                    return false;
                }
            }
            p.validateDomestic = function(){
                var valid = true;
                if (!checkLength(p.ident,2,7)) valid = false;
                if (!checkLength(p.faaType,2,4)) valid = false;
                if (!checkLength(p.faaEquip,1,1,'[A-Za-z]')) valid = false;
                if (!checkLength(p.faaTAS,1,5)) valid = false;
                if (!checkLength(p.faaDep,3,4)) valid = false;
                if (!checkLength(p.faaETD,4,4,'\\d{4}')) valid = false;
                if (!checkLength(p.faaEDD,5,5)) valid = false;
                if (!checkLength(p.faaAlt,3,5,'(FL)?\\d{3}')) valid = false;
                if (!checkLength(p.faaDst,3,4)) valid = false;
                if (!checkLength(p.faaETE,4,4)) valid = false;
                if (!checkLength(p.faaEndurance,4,4,'\\d{4}')) valid = false;
                if (!checkLength(p.faaPilot,5,9999)) valid = false;
                if (!checkLength(p.faaSouls,1,3)) valid = false;
                if (!checkLength(p.faaColor,1,99)) valid = false;
                if (!checkLength(p.faaNumAcft,1,3)) valid = false;
                p.file.setEnabled(valid)
                return valid;
            }
            p.validateICAO = function(){
                var valid = true;
                if (!checkLength(p.ident,2,7)) valid = false;
                if (!checkLength(p.icaoType,2,4)) valid = false;
                if (!checkLength(p.icaoEquip,1,100)) valid = false;
                if (!checkLength(p.icaoSurvEquip,1,100)) valid = false;
                if (!checkLength(p.icaoTAS,1,5)) valid = false;
                if (!checkLength(p.icaoDep,3,4)) valid = false;
                if (!checkLength(p.icaoETD,4,4)) valid = false;
                if (!checkLength(p.icaoEDD,5,5)) valid = false;
                if (!checkLength(p.icaoAlt,3,5)) valid = false;
                if (!checkLength(p.icaoDst,3,4)) valid = false;
                if (!checkLength(p.icaoETE,4,4)) valid = false;
                if (!checkLength(p.icaoEndurance,4,4)) valid = false;
                if (!checkLength(p.icaoPilot,5,9999)) valid = false;
                if (!checkLength(p.icaoSouls,1,3)) valid = false;
                if (!checkLength(p.icaoColor,1,99)) valid = false;
                if (!checkLength(p.icaoNumAcft,1,3)) valid = false;
                p.file.setEnabled(valid)
                return valid;
            }

            var bdiv = this.ce("div");
            bdiv.style.textAlign = "center";
            /*p.cancel = this.fplButton("fa fa-close", "Exit");
            p.cancel.onclick = function(){
                p.div.style.visibility = 'hidden';
            }
            */
            p.file = this.fplButton("fa fa-inbox", "File Flight Plan");
            p.file.onclick = function(){
                if ( (p.formType == "D" && p.validateDomestic() ) ||
                     (p.formType == 'I' && p.validateICAO())  ){
                    var pbnCheck = sv.validatePBN(p.icaoEquip.value.toUpperCase(),p.icaoPbn.value.toUpperCase());
                    if (pbnCheck[0]){
                        var wait = sv.modalDialog(180,20,true);
                        wait.style.textAlign = "center";
                        wait.style.fontSize = "20px";

                        wait.appendChild(sv.ce("span","fa fa-spinner fa-pulse"));
                        wait.appendChild(sv.ct(" Submitting..."));
                        var r = sv.request(sv.data.perldir + '/file?cmd=file');
                        r.onload = function(data){
                            wait.closeme();
                            if (data.err){
                                sv.simpleDialog("exclamation-triangle","red",data.err);
                            }else{
                                sv.simpleDialog("thumbs-up","green",data.data);
                                sv.fpl({});
                                p.div.style.visibility = 'hidden'; 
                            }
                        }
                    }else{
                        sv.simpleDialog("exclamation-triangle","#e90",pbnCheck[1].join("<br/>"));
                    }
                }
                try {
                    ga_event('send', 'event', 'FPL', 'FileFlightPlan');
                } catch (e) { } ;
            }
            p.amend = this.fplButton("fa fa-edit","Amend Filing");
            p.amend.style.display = "none";
            p.amend.onclick = function(){
                if ( (p.formType == "D" && p.validateDomestic() ) ||
                     (p.formType == 'I' && p.validateICAO())  ){
                    var wait = sv.modalDialog(180,20,true);
                    wait.style.textAlign = "center";
                    wait.style.fontSize = "20px";

                    wait.appendChild(sv.ce("span","fa fa-spinner fa-pulse"));
                    wait.appendChild(sv.ct(" Submitting..."));
                    var r = sv.request(sv.data.perldir + '/file?cmd=amend');
                    r.onload = function(data){
                        wait.closeme();
                        if (data.err){
                            sv.simpleDialog("exclamation-triangle","red",data.err);
                        }else{
                            sv.simpleDialog("thumbs-up","green",data.data);
                            sv.fpl({});
                            p.div.style.visibility = 'hidden'; 
                        }
                    }
                }
                try {
                    ga_event('send', 'event', 'FPL', 'AmendFlightPlan');
                } catch (e) { } ;
            }
            p.cancelPlan = this.fplButton("fa fa-trash","Cancel Plan");
            p.cancelPlan.style.display = "none";
            p.cancelPlan.onclick = function(){
                var wait = sv.modalDialog(180,20,true);
                wait.style.textAlign = "center";
                wait.style.fontSize = "20px";

                wait.appendChild(sv.ce("span","fa fa-spinner fa-pulse"));
                wait.appendChild(sv.ct(" Submitting..."));
                var r = sv.request(sv.data.perldir + '/file?cmd=cancel');
                r.onload = function(data){
                    wait.closeme();
                    if (data.err){
                        sv.simpleDialog("exclamation-triangle","red",data.err);
                    }else{
                        sv.simpleDialog("thumbs-up","green",data.data);
                        sv.fpl({});
                        p.div.style.visibility = 'hidden'; 
                    }
                }
                try {
                    ga_event('send', 'event', 'FPL', 'CancelFlightPlan');
                } catch (e) { } ;
            }
            p.btnSync = this.fplButton("fa fa-refresh","Sync",undefined,"Check for changes made by FSS");
            bdiv.appendChild(p.btnSync);
            p.btnSync.style.display = "none";
            p.btnSync.onclick = function(){
                sv.setFileInfo({k:"sync"});
                try {
                    ga_event('send', 'event', 'FPL', 'SyncFlightPlan');
                } catch (e) { } ;
            }

            p.btnBrief = this.fplButton("fa fa-file-text-o fa-fw","Brief",undefined,"Receive official briefing from FSS");
            bdiv.appendChild(p.btnBrief);
            p.btnBrief.onclick = function(){
                p.btnBrief.setEnabled(false,true);
                if (sv.data.permfpl){
                    var r = sv.request(sv.data.perldir + "/brief");
                    r.onload = function(data){
                        p.btnBrief.setEnabled(true);
                        if (data.err){
                            sv.simpleDialog("exclamation-triangle","red",data.err);
                        }else{
                            sv.showBriefing(data.text);
                        }
                    }
                }else{
                    sv.login("You must sign in to obtain a briefing.");
                }
                try {
                    ga_event('send', 'event', 'FPL', 'GetBriefing');
                } catch (e) { } ;
            }

            //bdiv.appendChild(p.cancel);
            bdiv.appendChild(p.btnBrief);
            bdiv.appendChild(p.btnSync);
            bdiv.appendChild(p.amend);
            bdiv.appendChild(p.cancelPlan);
            bdiv.appendChild(p.file);
            p.div.appendChild(bdiv);

            this.dragEnable(p.div, h1);
        }
        if (fileInfo.syncEnabled){
            p.btnSync.style.display = "inline-block";
        }else{
            p.btnSync.style.display = "none";
        }
        if (fileInfo.afssFlightId){
            if (fileInfo.status != 'CANCELLED' && fileInfo.status != 'DELETED'){
                p.amend.style.display = "inline-block";
                p.cancelPlan.style.display = "inline-block";
            }else{
                p.amend.style.display = "none";
                p.cancelPlan.style.display = "none";
            }
            p.file.style.display = "none";
            p.flightRules.disabled = true;
        }else{
            p.amend.style.display = "none";
            p.cancelPlan.style.display = "none";
            p.file.style.display = "inline-block";
            p.flightRules.disabled = false;
        }


        p.div.style.visibility = 'visible';
        p.div.style.maxHeight = (this.data.height-80) + "px";
        // set all values
        p.flightRules.selectedIndex = fileInfo.flightRules - 2
        //if (p.flightRules.selectedIndex < 2){
        //    p.showForm(false);
        //}else{
            p.showForm(true);
        //}
        if (fileInfo.aircraft.ident){
            p.ident.value = fileInfo.aircraft.ident;
        }else{
            p.ident.value = "";
        }
        p.icaoFType.selectedIndex = fileInfo.typeOfFlight;
        if (fileInfo.aircraft.type){
            p.faaType.value = fileInfo.aircraft.type;
            p.icaoType.value = fileInfo.aircraft.type;
        }else{
            p.faaType.value = "";
            p.icaoType.value = "";
        }
        if (fileInfo.aircraft.faaEquip){
            p.faaEquip.value = fileInfo.aircraft.faaEquip;
        }else{
            p.faaEquip.value = ""
        }
        if (fileInfo.aircraft.icaoEquip){
            p.icaoEquip.value = fileInfo.aircraft.icaoEquip;
        }else{
            p.icaoEquip.value = "";
        }
        if (fileInfo.aircraft.surveillanceEquip){
            p.icaoSurvEquip.value = fileInfo.aircraft.surveillanceEquip;
        }else{
            p.icaoSurvEquip.value = "";
        }
        if (fileInfo.speed){
            p.faaTAS.value = fileInfo.speed;
            p.icaoTAS.value = fileInfo.speed;
        }else{
            p.faaTAS.value = "";
            p.icaoTAS.value = "";
        }
        if (fileInfo.dep && fileInfo.dep.ident){
            p.faaDep.value = fileInfo.dep.ident;
            p.icaoDep.value = fileInfo.dep.ident;
        }else{
            p.faaDep.value = "";
            p.icaoDep.value = "";
        }
        if (fileInfo.etdz){
            p.faaETD.value = fileInfo.etdz;
            p.icaoETD.value = fileInfo.etdz;
        }else{
            p.faaETD.value = "";
            p.icaoETD.value = "";
        }
        if (fileInfo.eddz){
            p.faaEDD.value = fileInfo.eddz;
            p.icaoEDD.value = fileInfo.eddz;
        }else{
            p.faaEDD.value = "";
            p.icaoEDD.value = "";
        }
        if (fileInfo.alt){
            p.faaAlt.value = fileInfo.alt;
            p.icaoAlt.value = fileInfo.alt;
        }else{
            p.faaAlt.value = "";
            p.icaoAlt.value = "";
        }
        if (fileInfo.routeStrip){
            p.faaRoute.value = fileInfo.routeStrip;
            p.icaoRoute.value = fileInfo.routeStrip;
        }else{
            p.faaRoute.value = "";
            p.icaoRoute.value = "";
        }
        if (fileInfo.dst && fileInfo.dst.ident){
            p.faaDst.value = fileInfo.dst.ident;
            p.icaoDst.value = fileInfo.dst.ident;
        }else{
            p.faaDst.value = "";
            p.icaoDst.value = "";
        }
        if (fileInfo.planETE){
            p.faaETE.value = fileInfo.planETE;
            p.icaoETE.value = fileInfo.planETE;
        }else{
            p.faaETE.value = "";
            p.icaoETE.value = "";
        }
        if (fileInfo.remarks){
            p.faaRemarks.value = fileInfo.remarks;
            p.icaoRemark.value = fileInfo.remarks;
        }else{
            p.faaRemarks.value = "";
            p.icaoRemark.value = "";
        }
        p.specHandle.selectedIndex = fileInfo.specHandle;
        if (fileInfo.otherInfo){
            p.otherInfo.value = fileInfo.otherInfo;
        }else{
            p.otherInfo.value = "";
        }
        if (fileInfo.aircraft.survival){
            if (fileInfo.aircraft.survival.indexOf("P") > -1){
                p.survP.checked = true;
            }else{
                p.survP.checked = false;
            }
            if (fileInfo.aircraft.survival.indexOf("D") > -1){
                p.survD.checked = true;
            }else{
                p.survD.checked = false;
            }
            if (fileInfo.aircraft.survival.indexOf("M") > -1){
                p.survM.checked = true;
            }else{
                p.survM.checked = false;
            }
            if (fileInfo.aircraft.survival.indexOf("J") > -1){
                p.survJ.checked = true;
            }else{
                p.survJ.checked = false;
            }
        }else{
            p.survP.checked = false;
            p.survD.checked = false;
            p.survM.checked = false;
            p.survJ.checked = false;
        }
        if (fileInfo.aircraft.radios){
            if (fileInfo.aircraft.radios.indexOf("U") > -1){
                p.radioUHF.checked = true;
            }else{
                p.radioUHF.checked = false; 
            }
            if (fileInfo.aircraft.radios.indexOf("V") > -1){
                p.radioVHF.checked = true;
            }else{
                p.radioVHF.checked = false; 
            }
            if (fileInfo.aircraft.radios.indexOf("E") > -1){
                p.radioELT.checked = true;
            }else{
                p.radioELT.checked = false; 
            }
        }else{
            p.radioUHF.checked = false; 
            p.radioVHF.checked = false; 
            p.radioELT.checked = false; 
        }
        if (fileInfo.aircraft.jackets){
            if (fileInfo.aircraft.jackets.indexOf("L") > -1){
                p.jackL.checked = true;
            }else{
                p.jackL.checked = false;
            }
            if (fileInfo.aircraft.jackets.indexOf("F") > -1){
                p.jackF.checked = true;
            }else{
                p.jackF.checked = false;
            } 
            if (fileInfo.aircraft.jackets.indexOf("U") > -1){
                p.jackU.checked = true;
            }else{
                p.jackU.checked = false;
            }
            if (fileInfo.aircraft.jackets.indexOf("V") > -1){
                p.jackV.checked = true;
            }else{
                p.jackV.checked = false;
            }
        }else{
            p.jackL.checked = false;
            p.jackF.checked = false;
            p.jackU.checked = false;
            p.jackV.checked = false;
        }

        if (fileInfo.aircraft.pbnEquip){
            p.icaoPbn.value = fileInfo.aircraft.pbnEquip;
        }else{
            p.icaoPbn.value = "";
        }
        p.icaoPerf.selectedIndex = fileInfo.aircraft.perfCat;
        p.icao
        if (fileInfo.endur){
            p.faaEndurance.value = fileInfo.endur;
            p.icaoEndurance.value = fileInfo.endur;
        }else{
            p.faaEndurance.value = "";
            p.icaoEndurance.value = "";
        }
        if (fileInfo.alt1 && fileInfo.alt1.ident){
            p.faaAlt1.value = fileInfo.alt1.ident;
            p.icaoAlt1.value = fileInfo.alt1.ident;
        }else{
            p.faaAlt1.value = "";
            p.icaoAlt1.value = "";
        }
        if (fileInfo.alt2 && fileInfo.alt2.ident){
            p.faaAlt2.value = fileInfo.alt2.ident;
            p.icaoAlt2.value = fileInfo.alt2.ident;
        }else{
            p.faaAlt2.value = "";
            p.icaoAlt2.value = "";
        }
        if (fileInfo.pilot){
            p.faaPilot.value = fileInfo.pilot;
            p.icaoPilot.value = fileInfo.pilot;
        }else{
            p.faaPilot.value = "";
            p.icaoPilot.value = "";
        }
        if (fileInfo.peopleOnBoard){
            p.faaSouls.value = fileInfo.peopleOnBoard;
            p.icaoSouls.value = fileInfo.peopleOnBoard;
        }else{
            p.faaSouls.value = "";
            p.icaoSouls.value = "";
        }
        if (fileInfo.aircraft.dinghies_number){
            p.dingNum.value = fileInfo.aircraft.dinghies_number;
        }else{
            p.dingNum.value = "0";
        }
        if (fileInfo.aircraft.dinghies_capacity){
            p.dingCap.value = fileInfo.aircraft.dinghies_capacity;
        }else{
            p.dingCap.value = "0";
        }
        if (fileInfo.aircraft.dinghies_covered){
            p.dingCovered.checked = true;
        }else{
            p.dingCovered.checked = false;
        }
        if (fileInfo.aircraft.dinghies_color){
            p.dingColor.value = fileInfo.aircraft.dinghies_color;
        }else{
            p.dingColor.value = "";
        }


        if (fileInfo.aircraft.color){
            p.faaColor.value = fileInfo.aircraft.color;
            p.icaoColor.value = fileInfo.aircraft.color;
        }else{
            p.faaColor.value = "";
            p.icaoColor.value = "";
        }
        if (fileInfo.numAircraft){
            p.faaNumAcft.value = fileInfo.numAircraft;
            p.icaoNumAcft.value = fileInfo.numAircraft;
        }else{
            p.faaNumAcft.value = "";
            p.icaoNumAcft.value = "";
        }
        if (fileInfo.aircraft.wakeTurbCat > 1){
            p.faaHeavy.checked = true;
        }else{
            p.faaHeavy.checked = false;
        }
        p.icaoWake.selectedIndex = fileInfo.aircraft.wakeTurbCat;
        if (p.formType == "D"){
            p.validateDomestic();
        }else{
            p.validateICAO();
        }

    },
    fplButton: function(icon,name,width,help){
        var sv = this;
        var div = sv.ce("div","svfpl_button");
        if (icon){
            var i = sv.ce("span",icon);
            i.style.marginRight = "4px";
            div.appendChild(i);
        }
        div.appendChild(document.createTextNode(name));
        if (width){
            div.style.width = width + "px";
        }
        if (help){
            div.setAttribute("title",help);
        }
        div.isEnabled = true;
        div.setEnabled = function(enabled,busy){
            if (enabled){
                div.className="svfpl_button";
                div.isEnabled = true;
                if (i){
                    i.className = icon;
                }
            }else{
                div.className="svfpl_buttondisabled";
                div.isEnabled = false;
                if (i && busy){
                    i.className = "fa fa-spinner fa-pulse fa-fw";
                }
            }
        }
        var clickCheck = function(e){
            if (!e) e = window.event;
            if (!div.isEnabled){
                if (e.stopImmediatePropagation){
                    e.stopImmediatePropagation();
                }else{
                    e.cancelBubble = true;
                }
                return false;
            }
        }
        if (div.addEventListener){
            div.addEventListener("click",clickCheck,true);
        }else if(div.attachEvent){
            div.attachEvent("onclick",clickCheck);
        }
        return div;
    },
    modalDialog: function(width,height,nodismiss){
        var sv = this;
        var mask = sv.ce("div","svfpl_modalmaskdark xlucent25");
        sv.data.div.chart.appendChild(mask);
        var dialog = sv.ce("div","svfpl_modaldialog");
        if (width){
            dialog.style.width = width + "px";
            dialog.style.left = ((sv.data.width/2) - width/2).toFixed(0) + "px";
        }else{
            dialog.style.left = ((sv.data.width/2) - 200).toFixed(0) + "px";
        }
        if (height){
            dialog.style.height = height + "px";
            dialog.style.top = ((sv.data.height/2) - height/2).toFixed(0) + "px";
        }else{
            dialog.style.top = ((sv.data.height/2) - 100).toFixed(0) + "px";
        }
        sv.data.div.chart.appendChild(dialog);
        mask.onmouseover = function() {
            sv.data.nowheel = true;
        }
        mask.onmouseout = function() {
            sv.data.nowheel = false;
        }
        mask.onmousewheel = function(e) {
            if (!e)
                e = window.event;
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = "true";
            }
        }
        dialog.onmouseover = function() {
            sv.data.nowheel = true;
        }
        dialog.onmouseout = function() {
            sv.data.nowheel = false;
        }
        dialog.onmousewheel = function(e) {
            if (!e)
                e = window.event;
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = "true";
            }
        }
        if (!nodismiss){
            mask.onclick = function(){
                sv.data.div.chart.removeChild(mask);
                sv.data.div.chart.removeChild(dialog);
            }
        }
        dialog.closeme = function(){
            sv.data.div.chart.removeChild(mask);
            sv.data.div.chart.removeChild(dialog);
        }
        return dialog;
    },
    presentModal: function(dialog,nodismiss){
        var sv = this;
        var mask = sv.ce("div","svfpl_modalmaskdark xlucent25");
        mask.style.zIndex = '200';
        sv.data.div.chart.appendChild(mask);
        dialog.style.position = 'absolute';
        dialog.style.zIndex = '201';
        sv.data.div.chart.appendChild(dialog);

        mask.onmouseover = function(){
            sv.data.nowheel = true;
        }
        mask.onmouseout = function(){
            sv.data.nowheel = false;
        }
        mask.onmousewheel = function(e){
            if (!e) e = window.event;
            if  (e.stopPropagation){
                e.stopPropagation();
            }else{
                e.cancelBubble = true;
            }
        }
        dialog.onmouseover = function() {
            sv.data.nowheel = true;
        }
        dialog.onmouseout = function() {
            sv.data.nowheel = false;
        }
        dialog.onmousewheel = function(e) {
            if (!e)
                e = window.event;
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = "true";
            }
        }
        if (!nodismiss){
            mask.onclick = function(){
                sv.data.div.chart.removeChild(mask);
                sv.data.div.chart.removeChild(dialog);
            }
        }
        dialog.closeme = function(){
            sv.data.div.chart.removeChild(mask);
            sv.data.div.chart.removeChild(dialog);
        }
    },
    login: function(message){
        var div = this.modalDialog();
        var head = this.ce("div","svfpl_loginhead");
        head.appendChild(this.ct("Sign In"));
        div.appendChild(head);
        if (message){
            var mdiv = this.ce("div","svfpl_loginmessage");
            mdiv.appendChild(this.ct(message));
            div.appendChild(mdiv);
        }
        var form = this.ce("form");
        form.setAttribute("action","/user/login?destination=/");
        form.setAttribute("method","POST");
        form.setAttribute("autocomplete",true);
        form.id = "user-login";
        var div1 = this.ce("div","svfpl_inputgroup");
        div1.appendChild(this.ce("span","svfpl_inputicon fa fa-user"));
        var ilogin = this.ce("input","svfpl_inputgroup");
        ilogin.setAttribute("placeholder","username or email");
        ilogin.setAttribute("name","name");
        ilogin.id="edit-name";
        div1.appendChild(ilogin);
        form.appendChild(div1);
        var div2 = this.ce("div","svfpl_inputgroup");
        div2.appendChild(this.ce("span","svfpl_inputicon fa fa-key"));
        var ipass = this.ce("input","svfpl_inputgroup");
        ipass.setAttribute("placeholder","password");
        ipass.setAttribute("name","pass");
        ipass.type = "password";
        ipass.id = "edit-pass";
        div2.appendChild(ipass);
        form.appendChild(div2);

        var buttons = this.ce("div","svfpl_inputgroup");
        var btnCancel = this.fplButton("fa fa-close","Cancel");
        buttons.appendChild(btnCancel);
        var btnLogin = this.fplButton("fa fa-sign-in","Login");
        buttons.appendChild(btnLogin);
        btnCancel.onclick = function(){
            div.closeme();
        }
        btnLogin.onclick = function(){
            form.submit();
        }
        var submit = this.ce("input");
        submit.type="submit";
        submit.style.position="absolute";
        submit.style.visibility="hidden";
        form.appendChild(submit);
        var iformid = this.ce("input");
        iformid.type = "hidden";
        iformid.name = "form_id"
        iformid.value = "user_login";
        form.appendChild(iformid);
        form.appendChild(buttons);
        div.appendChild(form);
        
        var helpdiv = this.ce("div","svfpl_inputgroup");
        helpdiv.style.marginTop = "20px";
        var a1 = this.ce("a","svfpl_link");
        a1.setAttribute("href","/user/register");
        a1.appendChild(this.ce("span","fa fa-pencil-square-o fa-fw"));
        a1.appendChild(this.ct("Create Account"));
        helpdiv.appendChild(a1);
        var a2 = this.ce("a","svfpl_link");
        a2.setAttribute("href","/user/password");
        a2.appendChild(this.ce("span","fa fa-ban fa-fw"));
        a2.appendChild(this.ct("Forgot Password"));
        helpdiv.appendChild(a2);
        div.appendChild(helpdiv);
        

    },
    showSaveForm: function(){
        var sv = this;
        var div = this.modalDialog();
        var head = this.ce("div","svfpl_loginhead");
        head.appendChild(this.ct("Save Flight Plan"));
        div.appendChild(head);
        var mdiv = this.ce("div","svfpl_loginmessage");
        mdiv.appendChild(this.ct("Enter a name for this plan"));
        div.appendChild(mdiv);

        var div1 = this.ce("div","svfpl_inputgroup");
        div1.appendChild(this.ce("span","svfpl_inputicon fa fa-pencil"));
        var filename = this.ce("input","svfpl_inputgroup");
        filename.setAttribute("placeholder","Flight Plan Name");
        filename.value = this.data.FPL.planName;
        div1.appendChild(filename);
        div.appendChild(div1);

        var buttons = this.ce("div","svfpl_inputgroup");
        var btnCancel = this.fplButton("fa fa-close","Cancel");
        buttons.appendChild(btnCancel);
        var btnSave = this.fplButton("fa fa-save","Save");
        buttons.appendChild(btnSave);
        btnCancel.onclick = function(){
            div.closeme();
        }
        btnSave.onclick = function(){
            sv.fpl({cmd:"save",planName:filename.value});
            div.closeme();
        }
        div.appendChild(buttons);
    },
    showLoadForm: function(fpls){
        var sv = this;
        var div = this.modalDialog(400,300);
        var head = this.ce("div","svfpl_loginhead");
        head.appendChild(this.ct("Retrieve Saved Flight Plan"));
        div.appendChild(head);
        var mdiv = this.ce("div","svfpl_loginmessage");
        mdiv.appendChild(this.ct("Select a plan from your history"));
        div.appendChild(mdiv);
        var box = this.ce("div","svfpl_openListBox");
        var header = this.ce("div","svfpl_openListBoxHeader");
        var span = this.ce("span","svfpl_openListBoxCell1");
        span.appendChild(this.ct("Tail"));
        header.appendChild(span);
        span = this.ce("span","svfpl_openListBoxCell2");
        span.appendChild(this.ct("Name"));
        header.appendChild(span);
        span = this.ce("span","svfpl_openListBoxCell3");
        span.appendChild(this.ct("ETD(Z)"));
        header.appendChild(span);
        span = this.ce("span","svfpl_openListBoxCell4");
        span.appendChild(this.ct("Status"));
        header.appendChild(span);


        box.appendChild(header);
        var scroll = this.ce("div","svfpl_openListBoxScroll");
        box.appendChild(scroll);
        div.appendChild(box);

        var selectedFplId = 0;
        var selectedRowId = -1;

        var buttons = this.ce("div","svfpl_inputgroup");
        var btnCancel = this.fplButton("fa fa-close","Cancel");
        buttons.appendChild(btnCancel);
        var btnLoad = this.fplButton("fa fa-folder-open-o","Load Plan");
        btnLoad.setEnabled(false);
        buttons.appendChild(btnLoad);
        var btnCopy = this.fplButton("fa fa-copy","Create Copy");
        btnCopy.setEnabled(false);
        buttons.appendChild(btnCopy);
        btnCancel.onclick = function(){
            div.closeme();
        }
        btnLoad.onclick = function(fplid){
            if (btnLoad.isEnabled){
                if (selectedFplId){
                    sv.fpl({cmd:"load",fplid:selectedFplId});
                }
                div.closeme();
            }
        }
        btnCopy.onclick = function(fplid){
            if (btnCopy.isEnabled){
                if (selectedFplId){
                    sv.fpl({cmd:"copy",fplid:selectedFplId});
                }
                div.closeme();
            }
        }
        div.appendChild(buttons);
        var rows = [];
        for (var i=0; i < fpls.length; i++){
            (function(){
                var rowId = i
                var plan = fpls[rowId];
                var row = sv.ce("div","svfpl_openListBoxRow");
                span = sv.ce("span","svfpl_openListBoxCell1");
                span.appendChild(sv.ct(plan.tail));
                row.appendChild(span);
                span = sv.ce("span","svfpl_openListBoxCell2");
                span.appendChild(sv.ct(plan.name));
                row.appendChild(span);
                span = sv.ce("span","svfpl_openListBoxCell3");
                span.appendChild(sv.ct(plan.etd));
                row.appendChild(span);
                span = sv.ce("span","svfpl_openListBoxCell4");
                span.appendChild(sv.ct(plan.status));
                row.appendChild(span);
                rows[i] = row;
                scroll.appendChild(row);
                row.onclick = function(){
                    row.className="svfpl_openListBoxRowselected";
                    if (selectedRowId > -1){
                        rows[selectedRowId].className="svfpl_openListBoxRow";
                    }
                    selectedRowId = rowId;
                    selectedFplId = plan.id;
                    if (plan.age < 7200){
                        btnLoad.setEnabled(true);
                    }else{
                        btnLoad.setEnabled(false);
                    }
                    btnCopy.setEnabled(true);
                }
            })();
        }
    },
    userDialog: function(){
        var sv = this;
        var dialog = this.modalDialog(230);

        var icon = this.ce("span","fa fa-user");
        icon.style.color = "#999";
        icon.style.fontSize = "60px";
        icon.style.padding = "10px";
        dialog.appendChild(this.ct("You are signed in as: "+sv.data.username));
        var table = this.ce("table");
        var tbody = this.ce("tbody");
        var trow = this.ce("tr");
        var td = this.ce("td");
        td.style.verticalAlign = "middle";
        td.appendChild(icon);
        var td2 = this.ce("td");
        td2.style.verticalAlign = "middle";
        var b1 = this.fplButton("fa fa-edit","User Profile",120);
        td2.appendChild(b1);
        var b2 = this.fplButton("fa fa-sign-out","Sign Out",120);
        td2.appendChild(b2);

        trow.appendChild(td);
        trow.appendChild(td2);
        tbody.appendChild(trow);
        table.appendChild(tbody);
        dialog.appendChild(table);

        var btnRow = this.ce("div");
        btnRow.style.textAlign = "center";
        btnRow.style.clear = "both";
        var btn = this.fplButton("fa fa-close","Cancel");
        btnRow.appendChild(btn);
        dialog.appendChild(btnRow);
        btn.onclick = function(){
            dialog.closeme();
        }
        b1.onclick = function(){
            window.location = "/user/" + sv.data.uid + "/edit";
        }
        b2.onclick = function(){
            window.location = "/user/logout?destination=/";
        }
    },
    simpleDialog: function(icon,iconColor,message){
        var dialog;
        if (message && message.length > 200){
            dialog = this.modalDialog(360);
        }else{
            dialog = this.modalDialog(230);
        }
        var icon = this.ce("span","fa fa-"+icon);
        icon.style.color = iconColor;
        icon.style.fontSize = "40px";
        icon.style.padding = "10px";
        var table = this.ce("table");
        var tbody = this.ce("tbody");
        var trow = this.ce("tr");
        var td = this.ce("td");
        td.appendChild(icon);
        var td2 = this.ce("td");
        td2.style.verticalAlign = "middle";
        if (message.indexOf("<") > -1){
            var messagespan = this.ce("span");
            messagespan.innerHTML=message;
            td2.appendChild(messagespan);
        }else{
            td2.appendChild(this.ct(message));
        }
        trow.appendChild(td);
        trow.appendChild(td2);
        tbody.appendChild(trow);
        table.appendChild(tbody);
        dialog.appendChild(table);

        var btnRow = this.ce("div");
        btnRow.style.textAlign = "center";
        btnRow.style.clear = "both";
        var btn = this.fplButton("fa fa-check","Okay");
        btnRow.appendChild(btn);
        dialog.appendChild(btnRow);
        btn.onclick = function(){
            dialog.closeme();
        }
    },
    showBriefing: function(text){
        var p;
        var sv = this;
        if (this.data.div.briefing){
            p = this.data.div.briefing;
        }else{
            this.data.div.briefing = {};
            p = this.data.div.briefing;
            p.div = this.ce("div");
            p.div.id = "sv_briefing";
            this.data.div.chart.appendChild(p.div);
            p.div.onmouseover = function() {
                sv.data.nowheel = true;
            }
            p.div.onmouseout = function() {
                sv.data.nowheel = false;
            }
            p.div.onmousewheel = function(e) {
                if (!e)
                    e = window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = "true";
                }
            }
            p.text = this.ce("div","sv_briefingtext");
            p.div.appendChild(p.text);
            var bdiv = this.ce("div");
            bdiv.style.textAlign = "center";
            p.div.appendChild(bdiv);
            var btnClose = this.fplButton("fa fa-close","Close");
            btnClose.onclick = function(){
                p.div.style.visibility = "hidden";
            }
            bdiv.appendChild(btnClose);
        }
        p.text.innerHTML = text;
        p.div.style.visibility = "visible";
        p.text.style.height = (sv.data.height - 120) + "px";
    },
    eula: function(){
        var sv = this;
        if (sv.data.isMobile){
            window.location = '/eula.html';
            return;
        }
        var height = sv.data.height - 120;
        var width = sv.data.width - 60;
        if (width > 900){
            width = 900;
        }
        var dialog = sv.modalDialog(width, height, true);
        var div = this.ce("div","svscroll_wrapper");
        var frame = this.ce("iframe");
        frame.style.height = height + "px";
        frame.style.width = width + "px";
        frame.style.border = "none";
        frame.src = "/eula.html";
        div.appendChild(frame);
        dialog.appendChild(div);
        
    },
    showTailPicker: function(input){
        var sv = this;
        if (sv.data.tails && sv.data.tails instanceof Array && sv.data.tails.length) {
            var p;
            if (sv.data.div.tailPicker){
                p = sv.data.div.tailPicker;
            }else{
                var p = {};
                p.div = this.ce("div");
                p.div.id = "svfpl_tailpicker";
                sv.data.div.tailPicker = p;
                input.parentElement.insertBefore(p.div,input);
                p.div.style.left = input.offsetLeft + "px";
                input.onblur = function(){
                    p.div.style.visibility = "hidden";
                }
            }
            while (p.div.firstChild){
                p.div.removeChild(p.div.firstChild);
            }
            for (var i=0; i<sv.data.tails.length; i++){
                (function(){
                    var ident = sv.data.tails[i];
                    var row = sv.ce("div","svfpl_tailpickerrow");
                    row.appendChild(sv.ct(ident));
                    p.div.appendChild(row);
                    row.onmousedown = function(e){
                        input.value = ident;
                        input.onchange();
                    }
                })();
            } 
            p.div.style.visibility = "visible";
        }
    },
    viaHoverTip: function(elem, distance, time){
        var d;
        if (this.data.div.viaHoverTip){
            d = this.data.div.viaHoverTip;
        }else{
            this.data.div.viaHoverTip = {};
            d = this.data.div.viaHoverTip;
            d.table = this.ce("table","sv_viahovertip");
            d.table.id = "sv_viahovertip";
            var tbody = this.ce("tbody");
            d.table.appendChild(tbody);
            var r1 = this.ce("tr");
            var h1 = this.ce("th");
            h1.appendChild(this.ct("Distance"));
            r1.appendChild(h1);
            var h2 = this.ce("th");
            h2.appendChild(this.ct("Time"));
            r1.appendChild(h2);
            tbody.appendChild(r1);
            var r2 = this.ce("tr");
            var d1 = this.ce("td");
            d.dist = this.ce("span");
            d1.appendChild(d.dist);
            var nm = this.ce("span");
            nm.style.fontSize = "8px";
            nm.appendChild(this.ct("NM"));
            d1.appendChild(nm);
            r2.appendChild(d1);
            var d2 = this.ce("td");
            d.time = this.ce("span");
            d2.appendChild(d.time);
            r2.appendChild(d2);
            tbody.appendChild(r2);
            elem.parentElement.parentElement.appendChild(d.table); 
        }
        var fDist = parseFloat(distance).toFixed(1);
        var fTime;
        var mins = Math.round(time/60);
        var hrs = Math.floor(mins/60);
        mins-=hrs*60;
        if (mins < 10){
            mins = "0" + mins.toFixed();
        }
        var fTime = hrs + ":" + mins;
        var show = function(e){
            d.dist.innerHTML=fDist;
            d.time.innerHTML=fTime;
            d.table.style.visibility = 'visible';
            d.table.style.top = (elem.offsetTop + 20) + "px";
            d.table.style.left = (elem.offsetLeft+20) + "px";
        }
        var hide = function(e){
            d.table.style.visibility = 'hidden';
        }
        if (elem.addEventListener){
            elem.addEventListener("mouseover",show);
            elem.addEventListener("mouseout",hide);
        }else if (elem.attachEvent){
            elem.attachEvent("onmouseover",show);
            elem.attachEvent("onmouseout",hide);
        }
    },
    formatTime: function(seconds){
        var mins = (Math.round(seconds/6)/10);
        var hrs = Math.floor(mins/60);
        mins-=hrs*60;
        if (hrs){
            return hrs.toFixed(0) +"<span class=\"half\">h</span>"+mins.toFixed(1)+"<span class=\"half\">m</span>";
        }else{
            return mins.toFixed(1) + "<span class=\"half\">min</span>";
        }
    },
    showShareForm: function(){
        var sv = this;
        var div = sv.data.div.shareForm;
        if (!div){
            sv.data.div.shareForm = sv.ce("div","svfpl_shareform");
            div = sv.data.div.shareForm;
            var title = sv.ce("h1","sv sv_sharepanel");
            title.appendChild(sv.ct("Export Flight Plan"));
            var privacylink = sv.ce("a","svfpl_privacylink");
            privacylink.appendChild(sv.ce("span","fa fa-info-circle"));
            privacylink.appendChild(sv.ct(" Privacy Info"));
            privacylink.setAttribute("href","#");
            div.appendChild(title);
            privacylink.onclick = function(){
                sv.simpleDialog("info-circle","#4d7faf","When you export your flight plan to another person, you are sharing nearly all of the information that is a part of your flight plan. This includes your tail number, departure time, destination, performance details, number on board, fuel on board, etc. If you are looking to share your route of flight without personal details like your tail number, try the \"Link\" tool in the upper right corner.");
            }
            div.appendChild(privacylink);
            var icons = sv.ce("div","svfpl_shareicons");
            var selicon = sv.ce("div","svfpl_shareiconson");
            div.appendChild(icons);
            var area1 = sv.ce("div","svfpl_sharearea");
            var area2 = sv.ce("div","svfpl_sharearea");
            area2.style.top="40px";
            var area3 = sv.ce("div","svfpl_sharearea");
            area3.style.top="80px";
            var area4 = sv.ce("div","svfpl_sharearea");
            area4.style.top="120px";
            icons.appendChild(area1);
            icons.appendChild(area2);
            icons.appendChild(area3);
            icons.appendChild(area4);
            icons.appendChild(selicon);
            var pane1 = sv.ce("div","svfpl_sharepane");
            var pane2 = sv.ce("div","svfpl_sharepane");
            var pane3 = sv.ce("div","svfpl_sharepane");
            var pane4 = sv.ce("div","svfpl_sharepane");
            var apppane1 = sv.ce("div","svfpl_sharepane");
            var apppane2 = sv.ce("div","svfpl_sharepane");
            var apppane3 = sv.ce("div","svfpl_sharepane");
            var apppane4 = sv.ce("div","svfpl_sharepane");
            var apppane5 = sv.ce("div","svfpl_sharepane");
            var apppane6 = sv.ce("div","svfpl_sharepane");
            var allpanes = [pane1,pane2,pane3,pane4,apppane1,apppane2,apppane3,apppane4,apppane5,apppane6];
            var currentPane = [area1,0,pane1];
            var showPane = function(area,vIndex,pane,noUpdate){
                for (var i=0; i < allpanes.length; i++){
                    allpanes[i].style.zIndex=0;
                }
                pane.style.zIndex = 1;
                selicon.style.top= (40*vIndex) + "px";
                selicon.style.backgroundPosition="0px "+(-40 * vIndex)+"px";
                if (!noUpdate){
                    currentPane = [area,vIndex,pane];
                }
            }
            selicon.onclick = function(){showPane(currentPane[0],currentPane[1],currentPane[2])};
            area1.onclick = function(){showPane(area1,0,pane1)};
            area2.onclick = function(){showPane(area1,1,pane2)};
            area3.onclick = function(){showPane(area1,2,pane3)};
            area4.onclick = function(){showPane(area1,3,pane4)};
            
            var makeEmail = function(noprefill){
                var ediv = sv.ce("div","svfpl_inputgroup");
                ediv.appendChild(sv.ce("span","svfpl_inputicon fa fa-envelope"));
                var elogin = sv.ce("input","svfpl_inputgroup");
                elogin.style.width = "180px";
                    elogin.setAttribute("placeholder","email address");
                if (sv.data.uid && sv.data.useremail && sv.data.useremail.length && !noprefill){
                    elogin.value = sv.data.useremail;
                }

                elogin.setAttribute("name","email");
                ediv.appendChild(elogin);
                ediv.value = function(){
                    return elogin.value;
                }
                return ediv;
            }
            var makeHR = function(){
                var div = sv.ce("div");
                var hr = sv.ce("div","svfpl_sharehr");
                div.appendChild(hr);
                var label = sv.ce("div","svfpl_sharehrlabel");
                label.appendChild(sv.ct("or"));
                div.appendChild(label);
                return div;
            }
            //mobile
            var makeIcon = function(imgpos,name,pane){
                var div = sv.ce("div","sv_blueapp");
                var icon = sv.ce("div","sv_blueappicon");
                icon.style.backgroundPosition = (-48 * imgpos) + "px 0px";
                div.appendChild(icon);
                var label = sv.ce("div","svdarkblue");
                label.appendChild(sv.ct(name));
                div.appendChild(label);
                div.onclick=function(){
                    showPane(area1,0,pane,true);
                }
                return div;
            }
            var icon1 = makeIcon(2,"ForeFlight",apppane1);
            var icon2 = makeIcon(4,"WingX",apppane2);
            var icon3 = makeIcon(1,"FlyQ",apppane3);
            var icon4 = makeIcon(3,"Oz RWY",apppane4);
            var icon5 = makeIcon(0,"AvPlan EFB",apppane5);
            var icon6 = makeIcon(5,"Garmin Pilot",apppane6);
            icon1.style.left="130px"; //8
            icon2.style.left="193px"; // 69
            icon3.style.left="252px"; //130
            icon4.style.left="193px";
            icon4.style.top="80px";
            icon5.style.left="252px";
            icon5.style.top="80px";
            icon6.style.left="130px";
            icon6.style.top="80px";
            pane1.style.backgroundColor = "#ccc";
            pane1.appendChild(icon1);
            pane1.appendChild(icon2);
            pane1.appendChild(icon3);
            pane1.appendChild(icon4);
            pane1.appendChild(icon5);
            pane1.appendChild(icon6);
            var pane1label = sv.ce("h3","sv_sharepanel");
            pane1label.innerHTML="Select<br/>Destination<br/>App";
            pane1.appendChild(pane1label);

            //foreflight
            var openff = sv.fplButton("fa fa-external-link","Open in ForeFlight",undefined,"Open flight plan in ForeFlight Mobile.");
            openff.style.margin="15px";
            openff.setEnabled(false);
            if (sv.data.fflink){
                openff.setEnabled(true);
            }else{
                openff.setEnabled(false);
            }
            openff.onclick = function(){
                window.location = sv.data.fflink;
                div.closeme();
            }
            sv.data.fflinkbtn = openff;
            apppane1.appendChild(openff);
            apppane1.appendChild(makeHR());
            var ffemail = makeEmail();
            apppane1.appendChild(ffemail);
            var emailff = sv.fplButton("fa fa-arrow-right","Email Flight Plan",undefined,"Send email containing ForeFlight link.");
            emailff.onclick = function(){
                var qs = sv.mkQS({"cmd":"emailff","email":ffemail.value()}); 
                var r = sv.request(sv.data.perldir + "/share" + qs);
                r.onload = function(data){
                    if (data.err){
                        sv.simpleDialog("exclamation-triangle","red",data.err);
                    }else{
                        sv.simpleDialog("thumbs-up","green",data.data);
                        div.closeme();
                    }
                }
            }
            apppane1.appendChild(emailff);

            //wingx
            var openwingx = sv.fplButton("fa fa-external-link", "Open in WingX",undefined,"Open flight plan in WingX.");
            openwingx.style.margin = "15px";
            openwingx.setEnabled(false);
            if (sv.data.wingxlink){
                openwingx.setEnabled(true);
            }
            openwingx.onclick = function(){
                window.location = sv.data.wingxlink;
                div.closeme();
            }
            sv.data.wingxlinkbtn = openwingx;
            apppane2.appendChild(openwingx);
            apppane2.appendChild(makeHR());
            var wingxemail = makeEmail();
            apppane2.appendChild(wingxemail);
            var emailwingx = sv.fplButton("fa fa-arrow-right","Email Flight Plan",undefined,"Send email containing WingX link.");
            emailwingx.onclick = function(){
                var qs = sv.mkQS({"cmd":"emailwingx","email":wingxemail.value()}); 
                var r = sv.request(sv.data.perldir + "/share" + qs);
                r.onload = function(data){
                    if (data.err){
                        sv.simpleDialog("exclamation-triangle","red",data.err);
                    }else{
                        sv.simpleDialog("thumbs-up","green",data.data);
                        div.closeme();
                    }
                }
            }
            apppane2.appendChild(emailwingx);

            //flyq
            var openflyq = sv.fplButton("fa fa-external-link", "Open in FlyQ EFB",undefined,"Open flight plan in FlyQ EFB.");
            openflyq.style.margin = "15px";
            openflyq.setEnabled(false);
            if (sv.data.flyqlink){
                openflyq.setEnabled(true);
            }
            openflyq.onclick = function(){
                window.location = sv.data.flyqlink;
                div.closeme();
            }
            sv.data.flyqlinkbtn = openflyq;
            apppane3.appendChild(openflyq);
            apppane3.appendChild(makeHR());
            var flyqemail = makeEmail();
            apppane3.appendChild(flyqemail);
            var emailflyq = sv.fplButton("fa fa-arrow-right","Email Flight Plan",undefined,"Send email containing FlyQ link.");
            emailflyq.onclick = function(){
                var qs = sv.mkQS({"cmd":"emailflyq","email":flyqemail.value()}); 
                var r = sv.request(sv.data.perldir + "/share" + qs);
                r.onload = function(data){
                    if (data.err){
                        sv.simpleDialog("exclamation-triangle","red",data.err);
                    }else{
                        sv.simpleDialog("thumbs-up","green",data.data);
                        div.closeme();
                    }
                }
            }
            apppane3.appendChild(emailflyq);

            //ozrwy
            var openozrwy = sv.fplButton("fa fa-cloud-download", "Download .ozpln file",undefined,"Download Flight Plan as .ozpln file.");
            openozrwy.style.margin = "15px";
            openozrwy.onclick = function(){
                window.location = sv.data.perldir + "/ozpln/skyvector.ozpln?" + Math.random().toFixed(5).substr(2);
                div.closeme();
            }
            apppane4.appendChild(openozrwy);
            apppane4.appendChild(makeHR());
            var ozrwyemail = makeEmail();
            apppane4.appendChild(ozrwyemail);
            var emailozrwy = sv.fplButton("fa fa-arrow-right","Email Flight Plan",undefined,"Send email containing OzRunways .ozplan file.");
            emailozrwy.onclick = function(){
                var qs = sv.mkQS({"cmd":"emailozrwy","email":ozrwyemail.value()}); 
                var r = sv.request(sv.data.perldir + "/share" + qs);
                r.onload = function(data){
                    if (data.err){
                        sv.simpleDialog("exclamation-triangle","red",data.err);
                    }else{
                        sv.simpleDialog("thumbs-up","green",data.data);
                        div.closeme();
                    }
                }
            }
            apppane4.appendChild(emailozrwy);

            //avplan
            var openavplan = sv.fplButton("fa fa-flash", "Beam to AvPlan EFB",undefined,"Transmit Plan to AvPlan EFB");
            openavplan.style.margin = "15px";
            openavplan.onclick = function(){
                var qs = sv.mkQS({"cmd":"beamavplan"}); 
                var r = sv.request(sv.data.perldir + "/share" + qs);
                r.onload = function(data){
                    if (data.err){
                        sv.simpleDialog("exclamation-triangle","red",data.err);
                    }else{
                        sv.simpleDialog("thumbs-up","green",data.data);
                        div.closeme();
                    }
                }
            }
            apppane5.appendChild(openavplan);
            var avplanhelp = this.ce("div","sv_sharehelp");
            avplanhelp.appendChild(this.ce("span","fa fa-exclamation-triangle fa-fw"));
            avplanhelp.appendChild(this.ct("Enable \"Sync Flight Plans\" in AvPlan User Settings."));
            apppane5.appendChild(avplanhelp);
            apppane5.appendChild(makeHR());
            var avplanemail = makeEmail();
            apppane5.appendChild(avplanemail);
            var emailavplan = sv.fplButton("fa fa-arrow-right","Email Flight Plan",undefined,"Send email containing AvPlan GPX file.");
            emailavplan.onclick = function(){
                var qs = sv.mkQS({"cmd":"emailavplan","email":avplanemail.value()}); 
                var r = sv.request(sv.data.perldir + "/share" + qs);
                r.onload = function(data){
                    if (data.err){
                        sv.simpleDialog("exclamation-triangle","red",data.err);
                    }else{
                        sv.simpleDialog("thumbs-up","green",data.data);
                        div.closeme();
                    }
                }
            }
            apppane5.appendChild(emailavplan);

            //gp
            var opengp = sv.fplButton("fa fa-external-link", "Open in Garmin Pilot",undefined,"Open flight plan in Garmin Pilot.");
            opengp.style.margin = "15px";
            opengp.setEnabled(false);
            if (sv.data.gplink){
                opengp.setEnabled(true);
            }
            opengp.onclick = function(){
                window.location = sv.data.gplink;
                div.closeme();
            }
            sv.data.gplinkbtn = opengp;
            apppane6.appendChild(opengp);
            apppane6.appendChild(makeHR());
            var gpemail = makeEmail();
            apppane6.appendChild(gpemail);
            var emailgp = sv.fplButton("fa fa-arrow-right","Email Flight Plan",undefined,"Send email containing Garmin Pilot link.");
            emailgp.onclick = function(){
                var qs = sv.mkQS({"cmd":"emailgp","email":gpemail.value()}); 
                var r = sv.request(sv.data.perldir + "/share" + qs);
                r.onload = function(data){
                    if (data.err){
                        sv.simpleDialog("exclamation-triangle","red",data.err);
                    }else{
                        sv.simpleDialog("thumbs-up","green",data.data);
                        div.closeme();
                    }
                }
            }
            apppane6.appendChild(emailgp);

            //garmin
            var downloadfpl = sv.fplButton("fa fa-cloud-download","Download Garmin .fpl file",undefined,"Download .fpl file to local disk.");
            downloadfpl.style.margin="15px";
            downloadfpl.onclick = function(){
                window.location = sv.data.perldir + "/garminfpl?" + Math.random().toFixed(5).substr(2)
            }
            pane2.appendChild(downloadfpl);
            pane2.appendChild(makeHR());
            var fplemail = makeEmail();
            pane2.appendChild(fplemail);
            var emailfpl = sv.fplButton("fa fa-arrow-right","Email .fpl File",undefined,"Send email containing Garmin .fpl file.");
            emailfpl.onclick = function(){
                var qs = sv.mkQS({"cmd":"emailfpl","email":fplemail.value()}); 
                var r = sv.request(sv.data.perldir + "/share" + qs);
                r.onload = function(data){
                    if (data.err){
                        sv.simpleDialog("exclamation-triangle","red",data.err);
                    }else{
                        sv.simpleDialog("thumbs-up","green",data.data);
                        div.closeme();
                    }
                }
            }
            pane2.appendChild(emailfpl);
            //dynon
            var downloadgpx = sv.fplButton("fa fa-cloud-download","Download Dynon .GPX file",undefined,"Download .GPX file to local disk.");
            downloadgpx.style.margin="15px";
            downloadgpx.onclick = function(){
                window.location = sv.data.perldir + "/gpx?" + Math.random().toFixed(5).substr(2)
            }
            pane3.appendChild(downloadgpx);
            pane3.appendChild(makeHR());
            var gpxemail = makeEmail();
            pane3.appendChild(gpxemail);
            var emailgpx = sv.fplButton("fa fa-arrow-right","Email .GPX File",undefined,"Send email containing Dynon .GPX file.");
            emailgpx.onclick = function(){
                var qs = sv.mkQS({"cmd":"emailgpx","email":gpxemail.value()}); 
                var r = sv.request(sv.data.perldir + "/share" + qs);
                r.onload = function(data){
                    if (data.err){
                        sv.simpleDialog("exclamation-triangle","red",data.err);
                    }else{
                        sv.simpleDialog("thumbs-up","green",data.data);
                        div.closeme();
                    }
                }
            }
            pane3.appendChild(emailgpx);
            //email
            var spacer = sv.ce("div");
            spacer.style.margin = "1em auto 1em auto";
            spacer.appendChild(sv.ct("Send an email containing the flight plan with the navlog attached."));
            pane4.appendChild(spacer);
            var navemail = makeEmail(1);
            pane4.appendChild(navemail);
            var emailnav = sv.fplButton("fa fa-arrow-right","Email Flight Plan",undefined,"Send email containing Flight Plan.");
            emailnav.onclick = function(){
                var qs = sv.mkQS({
                    "cmd":"email",
                    "email":navemail.value(),
                    "c":sv.data.protoid,
                    "z":sv.data.scale,
                    "lat":sv.data.lat.toFixed(5),
                    "lon":sv.data.lon.toFixed(5)
                }); 
                var r = sv.request(sv.data.perldir + "/share" + qs);
                r.onload = function(data){
                    if (data.err){
                        sv.simpleDialog("exclamation-triangle","red",data.err);
                    }else{
                        sv.simpleDialog("thumbs-up","green",data.data);
                        div.closeme();
                    }
                }
            }
            pane4.appendChild(emailnav);

            div.appendChild(apppane1);
            div.appendChild(apppane2);
            div.appendChild(apppane3);
            div.appendChild(apppane4);
            div.appendChild(apppane5);
            div.appendChild(apppane6);

            div.appendChild(pane4);
            div.appendChild(pane3);
            div.appendChild(pane2);
            div.appendChild(pane1);

        }
        div.style.top = (sv.data.div.planEdit.div.offsetTop + 30) + "px";
        div.style.left = (sv.data.div.planEdit.div.offsetLeft + 60) + "px";
        var getFF = sv.request(sv.data.perldir + '/mobileLinks?');
        getFF.onload = function(data){
            if (data.mobilelink){
                sv.data.fflink = data.mobilelink.ff;
                sv.data.fflinkbtn.setEnabled(true);
                sv.data.flyqlink = data.mobilelink.fq;
                sv.data.flyqlinkbtn.setEnabled(true);
                sv.data.wingxlink = data.mobilelink.wx;
                sv.data.wingxlinkbtn.setEnabled(true);
                sv.data.gplink = data.mobilelink.gp;
                sv.data.gplinkbtn.setEnabled(true);
            }
        }
        sv.presentModal(div);
    },
    validatePBN: function(equip,pbn){
        var sv=this;
        var retval = true;
        var msgs = [];
        var gps = pbn.match(/([BCDO][12])/);
        if (gps && !/G/.test(equip)){
            retval = false;
            msgs.push("PBN code '" + gps[0] + "' requires 'G' in ICAO Equipment.");
        }
        var dme = pbn.match(/([BCDO][13])/);
        if (dme && !/D/.test(equip)){
            retval = false;
            msgs.push("PBN code '" + dme[0] + "' requires 'D' in ICAO Equipment.");
        }
        var iru = pbn.match(/([CDO][14])/);
        if (iru){
            if (/D/.test(equip) && /I/.test(equip)){
            }else{
                retval = false;
                msgs.push("PBN code '" + iru[0] + "' requires 'I' and 'D' in ICAO Equipment.");
            }
        }
        var vordme = pbn.match(/(B[14])/);
        if (vordme){
            if (/[SO]/.test(equip) && /D/.test(equip)){
            }else{
                retval = false;
                msgs.push("PBN code '" + vordme[0] + "' requires 'D' and either 'S' or 'O' in ICAO Equipment.");
            }
        }
        var ins = pbn.match(/(B[15])/);
        if (ins && !/[I]/.test(equip)){
            retval = false;
            msgs.push("PBN code '" + ins[0] + "' requires 'I' in ICAO Equipment.");
        }
        var loran = pbn.match(/(B[16])/);
        if (loran && !/[C]/.test(equip)){
            retval = false;
            msgs.push("PBN code '" + loran[0] + "' requires 'C' in ICAO Equipment.");
        }
        return [retval,msgs];
    },
    canvasHover: function(event){
        var sv = this;
        var x = sv.data.p.x + (event.pageX - sv.data.mouse.ox) - sv.data.width/2;
        var y = sv.data.p.y + (event.pageY - sv.data.mouse.oy) - sv.data.height/2;
        if (sv.data.canvasHoverId) {
            var t = sv.data.canvasTargets.hover[sv.data.canvasHoverId -1];
            if (t && !sv.data.nowheel){
                if (x < t[0] || y < t[1] || x > t[0]+t[2] || y > t[1] + t[3]){
                    sv.data.canvasHoverId = undefined;
                    t[5](event);
                }
            }else{
                sv.hoveroff();
                sv.data.canvasHoverId = undefined;
                sv.data.canvasUrl = undefined;
            }
        }
        if (!sv.data.canvasHoverId){
            for (var i=0; i < sv.data.canvasTargets.hover.length; i++){
                var t = sv.data.canvasTargets.hover[i];
                if (x >= t[0] && y >= t[1] && x <= t[0] + t[2] && y <= t[1] + t[3]){
                    sv.data.canvasHoverId = i + 1;
                    t[4](event);
                    break;
                }
            }
        }
    },
    countKeys: function(object){
        var count = 0;
        for (var key in object){
            if (object.hasOwnProperty(key)){
                count++;
            }
        }
        return count;
    },
    tppMenu: function(ident,tpp,x,y){
        var sv = this;
        sv.tppMenuNoHide();
        var d;
        if (sv.data.div.tppMenu){
            d = sv.data.div.tppMenu;
        }else{
            d = new Object;
            sv.data.div.tppMenu = d;
            d.div = sv.ce("div","tppMenu");
            d.table = sv.ce("table","tppMenu");
            d.tbody = sv.ce("tbody");
            d.table.appendChild(d.tbody);
            d.div.appendChild(d.table);
            d.div.onmouseover = function(){sv.tppMenuNoHide();};
            d.div.onmouseout = function(){sv.tppMenuHide();};
        }
        while(d.tbody.firstChild){
            d.tbody.removeChild(d.tbody.firstChild);
        }
        var cycle = tpp.cycle;
        var addHeader = function(title){
            var tr = sv.ce("tr","tppMenu");
            var th = sv.ce("th","tppMenu");
            th.setAttribute("colspan","2");
            th.appendChild(sv.ct(title));
            tr.appendChild(th);
            d.tbody.appendChild(tr);
        }
        var addRow = function(name,file,compare){
            var tr = sv.ce("tr","tppMenu");
            var d1 = sv.ce("td","tppMenu");
            d1.appendChild(sv.ct(name));
            if (compare)
                d1.appendChild(sv.ct("*"));
            d1.onclick = function(){
                if (window.SVGPopOverCodePresent){
                    SVGPopOver.showSVG('/files/tpp/'+cycle+'/svg/'+file+'.svg',
                        387,594,ident +" - " +name,x,y,compare);
                }else{
                    sv.message("Popup disabled by ad blocker.",2);
                }
            }
            tr.appendChild(d1);
            var d2 = sv.ce("td","tppMenuPdf");
            var a2 = sv.ce("a","fa fa-file-pdf-o tppMenuPdf");
            a2.setAttribute("target","_blank");
            a2.setAttribute("href",'/files/tpp/'+cycle+'/pdf/'+file+'.PDF');
            a2.appendChild(sv.ct(""));
            d2.appendChild(a2);
            tr.appendChild(d2);
            d.tbody.appendChild(tr);
        }
        var sections = [
            ["APD","Airport/Taxiway Diagrams"],
            ["IAP","Instrument Approach Procedures"],
            ["DP","Departure Procedures"],
            ["ODP","Obstacle Departure Procedures"],
            ["STAR","Standardized Terminal Arrival"]
        ];
        for (var i=0; i < sections.length; i++){
            if (tpp[sections[i][0]]){
                addHeader(sections[i][1]);
                for (var j=0; j < tpp[sections[i][0]].length; j++){
                    var doc = tpp[sections[i][0]][j];
                    addRow(doc.n,doc.f,doc.c);
                }
            }
        }
        document.body.insertBefore(d.div,document.body.firstChild);
        d.div.style.top = y + "px";
        d.div.style.left = x + "px";
    },
    tppMenuHide: function(){
        var sv=this;
        if (!sv.data.tppMenuTimer){
            sv.data.tppMenuTimer = window.setTimeout(function(){sv.tppMenuDohide();}, 300);
        }
    },
    tppMenuDohide: function(){
        var sv=this;
        sv.data.tppMenuTimer = undefined;
        if(sv.data.div.tppMenu){
            try {
                document.body.removeChild(sv.data.div.tppMenu.div);
            }catch(e){};
        }
    },
    tppMenuNoHide: function(){
        if (this.data.tppMenuTimer){
            window.clearTimeout(this.data.tppMenuTimer);
            this.data.tppMenuTimer = undefined;
        }
    },
    showAnimationControls: function(showHide){
        var sv = this;
        var control;
        if (sv.data.div.animationControl){
            control = sv.data.div.animationControl;
        }else{
            sv.data.div.animationControl = {};
            control = sv.data.div.animationControl;
            control.div = sv.ce("div");
            if (sv.data.maxframes > 1){
                control.div.id = "sv_animationControl";
                var backgroundDiv = sv.ce("div","sv_animationControlbg xlucent80");
                control.div.appendChild(backgroundDiv);
                sv.data.div.chart.appendChild(control.div);
                control.label1 = sv.ce("div","sv_animationTimestamp");
                control.div.appendChild(control.label1);
                control.onselectstart = function(){ return false; };
                control.label2 = sv.ce("div","sv_animationRange");
                control.div.appendChild(control.label2);
                control.label2.onselectstart = function(){ return false; };
                control.playBtn = sv.ce("div");
                control.playBtn.id = "sv_aniplay";
                control.div.appendChild(control.playBtn);
                control.speedBtn = sv.ce("div");
                control.speedBtn.id = "sv_anispeed";
                control.speedBtn.className = "sv_anispeed1";
                control.div.appendChild(control.speedBtn);
                var cursor = sv.ce("div","sv_animatecursor");
                control.div.appendChild(cursor);

                var scrub = sv.ce("div","sv_animationscrubber");
                control.div.appendChild(scrub);
            }else{
                control.div.id = "sv_animationControlSmall";
                var backgroundDiv = sv.ce("div","sv_animationControlbgSmall xlucent80");
                control.div.appendChild(backgroundDiv);
                sv.data.div.chart.appendChild(control.div);
                control.label1 = sv.ce("div","sv_animationTimestampSmall");
                control.div.appendChild(control.label1);
                control.label2 = sv.ce("div","sv_animationRangeSmall");
                control.div.appendChild(control.label2);
                control.label2.onselectstart = function(){ return false; };
                control.playBtn = {style: {}};
                control.speedBtn = {style: {}};
                var cursor = {style: {}};
                var scrub = {style: {}};
            }
            control.visible = false;
            control.speed = 1.0;
            control.setAniRange = function(){
                sv.animate.state = 'play';
                if (sv.data.div.settings.enabled['nexrad']){
                    sv.animate.delay = 150/control.speed;
                    sv.animate.set('same',30, 30);
                    //sv.animate.set('same',30, 12);
                    control.label2.innerHTML = "60 min";
                }else{
                    sv.animate.delay = 300/control.speed;
                    sv.animate.set('same',12, 12);
                    //sv.animate.set('same',12, 6);
                    control.label2.innerHTML = "3 hr";
                }
                sv.animate.play();
            }
            control.playBtn.onclick = function(){
                if (sv.animate.state != 'play'){
                    control.setAniRange();
                    control.playBtn.className="sv_anipause";
                }else{
                    sv.animate.pause();
                    control.playBtn.className="sv_aniplay";
                }
            }
            control.speedBtn.onclick = function(){
                if (control.speed == 1.0){
                    control.speed = 2.0;
                    control.speedBtn.className="sv_anispeed2";
                }else if (control.speed == 2.0){
                    control.speed = 4.0;
                    control.speedBtn.className="sv_anispeed3";
                }else if (control.speed == 4.0){
                    control.speed = 1.0;
                    control.speedBtn.className="sv_anispeed1";
                }
                if (sv.animate.state != 'play'){
                    control.playBtn.className="sv_anipause";
                }
                control.setAniRange();
            }

            var frames = [];
            var moveOffsetX = 0;
            var scrubMove = function(e){
                if (e.type == 'click'){ 
                    var x = (e.offsetX-6) / 180;
                }else{
                    var x = (e.clientX-moveOffsetX-6) / 180;
                }
                var frameIx = Math.round((1-x)*sv.animate.frames);
                if (frameIx < 0){
                    frameIx = 0;
                }else if (frameIx >= sv.animate.frames){
                    frameIx = sv.animate.frames - 1;
                }
                if (sv.animate.frame != frameIx){
                    sv.animate.pause();
                    sv.animate.jump(frameIx);
                }
                control.playBtn.className="sv_aniplay";

            }
            scrub.onclick = scrubMove;
            scrub.onmousedown = function(e){
                moveOffsetX = e.clientX - e.offsetX;
                document.addEventListener('mousemove',scrubMove,false);
                document.addEventListener('mouseup',function(){
                    document.removeEventListener('mousemove',scrubMove);
                },false);
            }
            var touch = {
                "on": false
            };
            var touchStart = function(event){
                if (event.touches.length == event.changedTouches.length){ // first touch
                    var t = event.changedTouches.item(0);
                    touch.touchid = t.identifier;
                    touch.x = t.pageX;
                    touch.y = t.pageY;
                    touch.on = true;
                    var pos = sv.getPos(scrub);
                    touch.offsetx = pos.x;
                    touch.offsety = pos.y;
                    scrub.addEventListener('touchmove', touchMove, true);
                    scrub.addEventListener('touchend', touchEnd, true);
                }
            }
            var touchMove = function(event){
                for (var i=0; i < event.changedTouches.length; i++){
                    var t = event.changedTouches[i];
                    if (t.identifier == touch.touchid){
                        var e = {type: 'click',offsetX: event.pageX-touch.offsetx};
                        scrubMove(e);
                    }
                }
                event.preventDefault();
            }
            var touchEnd = function(event){
                touch.on = false;
                scrub.removeEventListener('touchmove', touchMove);
                scrub.removeEventListener('touchend', touchEnd);
            }
            scrub.ontouchstart=touchStart;

            scrub.ondrag = function(){ return false; };
            scrub.onselectstart = function(){ return false; };

            control.updateTimestampTimeout = function(){
                control.timestampTO = undefined;
                if (control.visible){
                    control.setTimestamp(sv.animate.frame);
                }
            }
            control.setTimestamp = function(frameIx){
                if (sv.animate && sv.animate.images && sv.animate.images[frameIx]){
                    var age = sv.animate.images[frameIx].age;
                }
                if (sv.data.rtimestamps && sv.data.rtimestamps[age]){
                    var milliseconds = 1000*parseInt(sv.data.rtimestamps[age]);
                    var date = new Date(milliseconds);
                    var now = new Date();
                    var age = ((now.getTime() - sv.data.timeDelta) - milliseconds)/1000;
                    var hours = date.getUTCHours().toFixed(0);
                    if (hours.length < 2){
                        hours = "0" + hours;
                    }
                    var mins = date.getUTCMinutes().toFixed(0);
                    if (mins.length < 2){
                        mins = "0" + mins;
                    }
                    control.label1.innerHTML = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getUTCDay()] + " " + hours +":"+ mins + " Z";
                    control.label2.innerHTML = sv.niceTimeDelta(age) + " ago";
                }
                if (control.timestampTO){
                    window.clearTimeout(control.timestampTO);
                }
                control.timestampTO = window.setTimeout(control.updateTimestampTimeout, 6000);
            }
            control.updatePlayer = function(step){
                if (step){
                    var frame = frames[sv.animate.frame];
                    if (frame){
                        cursor.style.left = (frame.left + frame.width/2 - 8).toFixed(0) + "px";        
                    }
                }else{
                    if (sv.animate.frames > 1 && frames.length != sv.animate.frames){
                        for (var i=0; i < frames.length; i++){
                            control.div.removeChild(frames[i].div);
                        }
                        frames = [];
                        var width = 180/sv.animate.frames;
                        //cursor.style.width = width.toFixed(0)+"px";
                        var startingLeft = 234;
                        var left = startingLeft;
                        for (var i=0; i < sv.animate.frames; i++){
                            var frame = {};
                            frame.div = sv.ce("div","sv_animatecontrolframe");
                            var width = left - Math.round(startingLeft - (i+1)*width);
                            left -= width;
                            frame.left = left;
                            frame.width = width;
                            frame.div.style.left = left.toFixed(0) + "px";
                            frame.div.style.width = width.toFixed(0) + "px";
                            control.div.appendChild(frame.div);
                            frames.push(frame);
                        }
                    }
                    for (var i=0; i < frames.length; i++){
                        var img = sv.animate.images[i];
                        //if (img && img.ready && (img.active || sv.animate.state == 'pause')){
                        if (img && img.ready){
                            frames[i].div.style.backgroundColor="#4d7faf";
                        }else{
                            frames[i].div.style.backgroundColor="#AAA";
                        }
                    }
                    var frame = frames[sv.animate.frame];
                    if (frame){
                        cursor.style.left = (frame.left + frame.width/2 - 8).toFixed(0) + "px";        
                    }
                }
                control.setTimestamp(sv.animate.frame);
            }
            control.setTimestamp(0);
            sv.animate.callback = control.updatePlayer;
        }
        if (showHide){
            if (sv.animate.state == 'play'){
                control.playBtn.className="sv_anipause";
            }else{
                control.playBtn.className="sv_aniplay";
            }
            control.visible = true;
            control.div.style.visibility='visible';
        }else{
            control.div.style.visibility='hidden';
            control.visible = false;
        }
    }
}









