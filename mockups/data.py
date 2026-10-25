# Hotel data taken from HIGH_CLASS.xlsm
# rooms: (category, EP, CP, MAP, AP)  addons: (name, price)
H = {}

def add(name, mobile, email, addr, star, sea, pool, rooms, addons, extra_label="ADD ON BENEFITS"):
    H[name] = dict(name=name, mobile=mobile, email=email, addr=addr, star=star, sea=sea,
                   pool=pool, rooms=rooms, addons=addons, label=extra_label)

add("ISLANDS TOURISTER", "7063990194, 03192231788", "islandstourister@gmail.com", "Prem Nagar", "-", False, False,
    [("DELUXE ROOM", 0, 2300, 0, 0), ("SUPER DELUXE ROOM", 0, 2500, 0, 0), ("STANDARD ROOM", 0, 2000, 0, 0), ("HONEYMOON SUITE ROOM", 0, 2800, 0, 0)],
    [("MAP per person", 500), ("AP per person", 1000), ("Flower bed decoration", 3000), ("Candle light dinner", 4000),
     ("Child and pet friendly room", 2600), ("Extra person with mattress (above 5 yrs)", 1000), ("Extra person without mattress (above 5 yrs)", 800)])
add("SEA CLIFF", "9434287937", "reservations@seascapeportblair.com", "Nayagaon", "5", True, False,
    [("DELUXE SUITE ROOM", 0, 5250, 0, 0), ("PEAK SEASON DELUXE SUITE", 0, 6300, 0, 0), ("HONEYMOON SUITE ROOM", 0, 6825, 0, 0), ("PEAK SEASON HONEYMOON SUITE ROOM", 0, 8400, 0, 0)],
    [("Extra mattress per night", 2000), ("MAP plan per person per night", 850)])
add("HORNBILL NEST RESORT", "03192 227107, 03192 228137", "aniidco@gmail.com", "Corbyn's Cove Beach", "4", True, False,
    [("SEMI DELUXE", 0, 5000, 0, 0), ("DELUXE", 0, 5500, 0, 0), ("SUPER DELUXE", 0, 6000, 0, 0)],
    [("Extra mattress per person", 1300), ("Extra person without mattress", 880), ("Lunch / dinner", 987), ("Candle light dinner", 4200),
     ("Flower bed decoration", 2950), ("Flower bed decoration with cake", 4130)])
add("SEA HILLS HOTEL", "99332-80806, 8072934782, 9840183047", "reservation@seahillshotels.com", "Shadipur", "5", True, True,
    [("STANDARD ROOM", 0, 4500, 0, 0), ("PREMIUM DELUXE WITH BATHTUB", 0, 5000, 0, 0), ("PREMIUM SUITE POOL VIEW WITH BATHTUB", 0, 6500, 0, 0),
     ("PREMIUM SUITE SEA VIEW BATHTUB", 0, 7000, 0, 0), ("VIP LOUNGE ROOM, BATHTUB & SEA VIEW", 0, 9500, 0, 0)],
    [("Extra mattress", 1800), ("Extra person", 1400), ("Meal per person", 1050), ("Cake", 1200), ("Flower bed decoration", 3450), ("Candle light dinner (no wine)", 6100)])
add("BEYLEAF INN", "9531978999, 3192222799, 3192222899", "bookings@bayleafinn.com", "Atlanta Point", "5", False, False,
    [("STANDARD ROOM", 0, 3600, 0, 0), ("DELUXE ROOM", 0, 4200, 0, 0), ("PREMIUM ROOM", 0, 4700, 0, 0)],
    [("Extra adult with mattress", 1500), ("Extra child without mattress", 1000), ("Extra child with mattress", 1200), ("MAP 2 pax", 1400), ("AP 2 pax", 2800),
     ("Birthday / honeymoon / anniversary cake", 1575), ("Flower bed decoration", 2625), ("Candle light dinner", 3675)])
add("OLIVE HOTEL & SUITES", "9531880606, 7695010606", "reservation@olivehotelandsuites.com", "Phoenix Bay", "5", True, False,
    [("STUDIO ROOM", 0, 3800, 5300, 6800), ("CLASS SEA VIEW", 0, 4600, 6100, 7600), ("PRIVILEGED SEA VIEW", 0, 5400, 6900, 8400)],
    [("Child with mattress above 12 yrs / night", 1400), ("Child without mattress 5-12 yrs / night", 1000), ("Adult per night", 1400),
     ("Buffet lunch / dinner per person", 750), ("Cake on arrival", 1000), ("Flower bed decoration", 2500), ("Candle night dinner", 3500), ("Late checkout", 1500)])
add("HOTEL MANSHA PALACE", "7063994407, 03192-233772", "reservations@manshahotels.com", "Dilanipur", "5", False, True,
    [("DELUXE ROOM", 0, 6500, 8300, 10100), ("EXECUTIVE SUITE ROOM", 0, 7000, 8800, 10600), ("ELEGANT SUITE ROOM", 0, 7800, 9600, 11400),
     ("PALACE SUITE ROOM", 0, 9000, 10800, 12600), ("ROYAL SUITE ROOM", 0, 10000, 11800, 13600), ("FAMILY SUITE ROOM", 0, 11000, 14600, 18200)],
    [("Child 5-11 yrs, no extra bed - CP", 1600), ("Child 5-11 yrs, no extra bed - MAP", 2500), ("Child 5-11 yrs, no extra bed - AP", 3400),
     ("Child 5-11 yrs, with extra bed - CP", 2100), ("Child 5-11 yrs, with extra bed - MAP", 3000), ("Child 5-11 yrs, with extra bed - AP", 3900),
     ("Adult 12+ yrs - CP", 2100), ("Adult 12+ yrs - MAP", 3000), ("Adult 12+ yrs - AP", 3900), ("Flower bed decoration with cake", 2800),
     ("Room decoration", 2800), ("Honeymoon cake 1 kg", 1750), ("Candle light dinner - restaurant", 5900), ("Candle light dinner - rooftop", 7080)], "EXTRA RATE")
add("SALT LIFE", "9933223055", "info.saltlife@gmail.com", "Haddo", "5", True, False,
    [("DELUXE ROOM", 0, 4000, 0, 0), ("PREMIUM ROOM", 0, 5200, 0, 0), ("SEA VIEW ROOM WITH PRIVATE BALCONY", 0, 7300, 0, 0)],
    [("Extra person 5 yrs & above", 2000), ("Child on sharing, no bed (5 yrs+)", 1300), ("Meal per person", 1250), ("Half kg cake", 1500),
     ("Flower bed decoration", 3000), ("Flower bed decoration with cake", 4000)], "EXTRA RATE")
add("6IX HOTEL", "8653269069", "reservations@6ixhotels.com", "Haddo", "5", True, False,
    [("DELUXE OCEAN VIEW", 0, 8500, 0, 0), ("SUPERIOR OCEAN VIEW", 0, 10500, 0, 0), ("SUITE OCEAN VIEW", 0, 12000, 0, 0)],
    [("Per person meal plan", 1500), ("Candle light dinner for couple", 3999), ("Candle light dinner with wine for couple", 5999), ("Flower bed decoration", 2800)], "EXTRA RATE")
add("DA BAY INN", "9679569827, 03192-230674", "dabayinn126@gmail.com", "Sea Shore Road, Haddo", "4", True, False,
    [("JUNIOR ROOM SEA VIEW", 0, 2700, 0, 0), ("SENIOR ROOM SEA VIEW", 0, 3200, 0, 0), ("HONEYMOON SUITE ROOM", 0, 4200, 0, 0)],
    [("Extra mattress", 950), ("Child 5 to 11 years", 650)], "EXTRA RATE")
add("HILLTOP INTERNATIONAL", "7695091681", "reservations.hilltopbayview@gmail.com", "Haddo", "5", False, True,
    [("PREMIUM ROOM", 0, 5450, 0, 0), ("PEAK SEASON PREMIUM ROOM", 0, 6450, 0, 0), ("SUPERIOR ROOM", 0, 6450, 0, 0), ("PEAK SEASON SUPERIOR ROOM", 0, 7450, 0, 0)],
    [("Flower bed decoration", 2500), ("Pool side candle light dinner", 4500)], "EXTRA RATE")
add("SAND HEAVEN", "7063916902, 8001192930", "hotelsandheaven@gmail.com", "Lamba Line", "5", False, False,
    [("SUPER DELUXE  (1 Oct - 15 Dec)", 0, 5950, 0, 0), ("SUPER DELUXE  (16 Dec - 27 Jan)", 0, 7000, 0, 0), ("SUPER DELUXE  (16 Jan - 31 Mar)", 0, 5950, 0, 0)],
    [("Meals per person", 850), ("Extra 12 yrs above - CP", 1500), ("Extra child 5-11 yrs - CP", 1200), ("FOC policy: book 5 get 1 free (flower bed)", 2500),
     ("Candle light dinner (dinner for 2)", 5000), ("Birthday decoration, flowers & balloons", 2500), ("Cake", 1000),
     ("New Year gala dinner - adult (mandatory)", 3000), ("New Year gala dinner - child (mandatory)", 2400), ("Late checkout (3 hours)", 1000)], "EXTRA RATE")
add("CORAL REEF", "8447805618", "reservations@coralreefandaman.com", "Bathu Basti", "5", False, False,
    [("PREMIUM ROOM", 6199, 7499, 0, 0), ("DELUXE ROOM", 6899, 8199, 0, 0), ("SUITE ROOM", 7499, 8799, 0, 0)],
    [("Romantic dinner in the Mosaic Hall", 5000), ("Private movie experience in Mosaic Hall", 3000), ("Honeymoon bed decoration", 4000),
     ("Celebration cake (vanilla / chocolate)", 2500), ("Wine for romantic dinner (optional)", 2500), ("MAP adult", 1400), ("MAP child", 1000),
     ("AP adult", 2800), ("AP child", 2000), ("Extra bed and breakfast", 3099), ("Child 5-11 yrs with or without CNB", 1600)])
add("EASTERN GATE", "7094234111", "info@hoteleasterngate.com", "Lamba Line", "5", False, True,
    [("SUPERIOR ROOM  (Nov - Mar)", 0, 6000, 0, 0), ("PREMIUM ROOM", 0, 6900, 0, 0), ("EXECUTIVE ROOM", 0, 7840, 0, 0)],
    [("Birthday cake 1 kg / 2 kg", 1200), ("Candle light dinner", 3920), ("Christmas dinner - adult", 2000), ("Christmas dinner - kids 6-10 yrs", 1000),
     ("Extra child without mattress 5-10 yrs", 800), ("Extra person with mattress", 1680), ("Flower bed decoration", 3500), ("Meals per person", 950),
     ("New Year Eve dinner - adult", 2000), ("Peak season charge / room / night (15 Dec - 15 Jan 2027)", 1500)])
add("SYMPHONY", "9476060999, 9609508000", "reservations@symphonyresorts.com", "Chidiyatapu, Carbyn's Cove", "5", True, True,
    [("ANDAMAN GARDEN VIEW ROOM", 0, 4988, 0, 0), ("ANDAMAN SEA VIEW ROOM", 0, 6038, 0, 0), ("ANDAMAN COTTAGE GARDEN ACCESS WITH PATIO", 0, 7824, 0, 0)],
    [("Extra mattress above 12 yrs", 2360), ("Child without mattress 5-12 yrs", 1770), ("Extra meals", 1474), ("Cake on arrival", 2950),
     ("Flower bed decoration", 4130), ("Balloon room decoration", 3540), ("Wine", 3630), ("Late checkout 4 hours", 1652),
     ("Romantic candle light dinner / couple - veg", 8000), ("Romantic candle light dinner / couple - non-veg", 10000)], "EXTRA RATE")
add("SEA SHELL", "9933239625, 9679513121, 9932089942, 9531970999", "info@seashellhotels.net", "Marine Hill", "5", True, False,
    [("STANDARD ROOM", 0, 12000, 0, 0), ("EXECUTIVE ROOM", 0, 13000, 0, 0), ("DELUXE ROOM", 0, 14000, 0, 0)], [])
add("ZONE CONNECT", "03192252777, 8016700000", "reservations.pbr@zoneconnecthotels.com", "Jodakalan, Teylarabad", "5", False, True,
    [("CONNECT ROOM", 0, 6650, 0, 0), ("PREMIUM ROOM", 0, 7250, 0, 0), ("LUXE ROOM", 0, 7850, 0, 0)],
    [("Sofa cum bed above 12 yrs", 2000), ("Sofa cum bed 6-12 yrs", 1500), ("Child without bed 6-12 yrs", 1000), ("Meal charge per person", 950),
     ("Flower bed decoration with cake", 5000), ("Candle light dinner with wine", 7000), ("Candle light dinner without wine", 5000), ("Flower bed decoration", 4000)], "EXTRA RATE")

HOTEL_ORDER = list(H.keys())

def lo(h):
    p = [x for r in H[h]["rooms"] for x in r[1:] if x]
    return min(p)

def hi(h):
    p = [x for r in H[h]["rooms"] for x in r[1:] if x]
    return max(p)

RANGES = [("1500 TO 2000", 1500, 2000), ("2100 TO 3000", 2100, 3000), ("3100 TO 4000", 3100, 4000),
          ("4100 TO 5000", 4100, 5000), ("5100 TO 10000", 5100, 20000)]
BEST = ["6IX HOTEL", "ZONE CONNECT", "SEA SHELL", "BEYLEAF INN", "HOTEL MANSHA PALACE"]
AIRPORT = [("SAND HEAVEN", "0.7 KM"), ("EASTERN GATE", "0.7 KM"), ("SYMPHONY", "2 KM"), ("HOTEL MANSHA PALACE", "2 KM"), ("HILLTOP INTERNATIONAL", "4 KM")]
LOWP = [("DA BAY INN", 2700), ("BEYLEAF INN", 3600), ("OLIVE HOTEL & SUITES", 3800), ("SALT LIFE", 4000), ("SEA SHELL", 4500)]
SEA = ["SEA CLIFF", "6IX HOTEL", "OLIVE HOTEL & SUITES", "SEA SHELL", "SALT LIFE", "SEA HILLS HOTEL", "HORNBILL NEST RESORT", "DA BAY INN", "SYMPHONY"]
POOL = ["HOTEL MANSHA PALACE", "HILLTOP INTERNATIONAL", "EASTERN GATE", "ZONE CONNECT", "SYMPHONY", "SEA HILLS HOTEL"]
