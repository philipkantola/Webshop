from server.models import Category, SubCategory, Product
from server import db

cats = [
    Category(name="Hemmet"),
    Category(name="Elektronik"),
    Category(name="Kläder"),
    Category(name="Böcker"),
    Category(name="Spel"),
    Category(name="Hälsa"),
    Category(name="Sport")
]

for c in cats:
    db.session.add(c)

db.session.commit()


# cat1 = Category.query.get(1)
# cat2 = Category.query.get(2)

# SubCategory(name="subcat1", category=Category.query.filter(Category.name == 'Hemmet').all()[0]

subcats = [
    SubCategory(name="Köket", category=Category.query.filter(
        Category.name == 'Hemmet').all()[0]),
    SubCategory(name="Förvaring", category=Category.query.filter(
        Category.name == 'Hemmet').all()[0]),
    SubCategory(name="Inredning", category=Category.query.filter(
        Category.name == 'Hemmet').all()[0]),
    SubCategory(name="Kontor", category=Category.query.filter(
        Category.name == 'Hemmet').all()[0]),
    SubCategory(name="Batterier", category=Category.query.filter(
        Category.name == 'Elektronik').all()[0]),
    SubCategory(name="Belysning", category=Category.query.filter(
        Category.name == 'Elektronik').all()[0]),
    SubCategory(name="Musik & Ljud", category=Category.query.filter(
        Category.name == 'Elektronik').all()[0]),
    SubCategory(name="TV & Bild", category=Category.query.filter(
        Category.name == 'Elektronik').all()[0]),
    SubCategory(name="Skor", category=Category.query.filter(
        Category.name == 'Kläder').all()[0]),
    SubCategory(name="Kappor", category=Category.query.filter(
        Category.name == 'Kläder').all()[0]),
    SubCategory(name="Byxor", category=Category.query.filter(
        Category.name == 'Kläder').all()[0]),
    SubCategory(name="Fakta", category=Category.query.filter(
        Category.name == 'Böcker').all()[0]),
    SubCategory(name="Biografier", category=Category.query.filter(
        Category.name == 'Böcker').all()[0]),
    SubCategory(name="Äventyr", category=Category.query.filter(
        Category.name == 'Böcker').all()[0]),
    SubCategory(name="Klassiska", category=Category.query.filter(
        Category.name == 'Spel').all()[0]),
    SubCategory(name="För flera", category=Category.query.filter(
        Category.name == 'Spel').all()[0]),
    SubCategory(name="Under 20 minuter", category=Category.query.filter(
        Category.name == 'Spel').all()[0]),
    SubCategory(name="LMO", category=Category.query.filter(
        Category.name == 'Spel').all()[0]),
]

for c in subcats:
    db.session.add(c)

db.session.commit()

# Product(
#         name="",
#         desc="",
#         price=0.0,
#         img="",
#         sub_category=SubCategory.query.filter(
#         SubCategory.name == 'SUBCAT').all()[0]

#     ),

products = [
    Product(
        name="Fjäderblommor Gammelrosa 12-pack",
        desc="Tre vackra fjädrar som är formade som en blomma i ett knippe. Fina att fästa i påskriset eller annan kvist, i ett blomsterarrangemang eller bukett. Alla fjäderknippen är trådade och lätta att fästa. Fjädrarna är delvis äkta och plockade från döda djur där fjädrarna har lossnat.",
        price=69.9,
        img="https://media.fyndiq.se/product/58/3f/5f/0fc52b5789293ff5c09c533ce1e72e4c9d/original.png",
        sub_category=SubCategory.query.filter(
        SubCategory.name == 'Inredning').all()[0]

    ),
    Product(
        name="Doftljus Världens Bästa Mormor",
        desc="Ingen blir väl lika glad som mormor när hon överraskas med något från barnbarnen! Med detta doftljus kommer hon ständigt påminnas om hur mycket du tycker om henne. Doftljus Världens Bästa Mormor är ett vaxljus i en vacker glasbehållare. Glaset är rosafärgat och locket i trä sitter bra på plats tack vare den förslutande gummiringen. Efter att ljuset brunnit ut kan glasbehållaren sparas och användas till något annat. Ljuset har en god och mild doft som sprider sig när du tänder veken. Höjd: 10 cm",
        price=169,
        img="https://media.fyndiq.se/product/0a/a2/4f/cb4f7a943fac7aa4c618167d7014999d53/original.png",
        sub_category=SubCategory.query.filter(
        SubCategory.name == 'Inredning').all()[0]

    ),
    Product(
        name="Vindspel",
        desc="Sprid harmoi och stillhet! Ett härligt och ljust plingande vindspel av metallrör och med träkläpp. Rören är 13 och 21 cm långa.",
        price=49,
        img="https://media.fyndiq.se/product/fa/00/04/d13f6302ed17d176fbf682827584f9a492/original.png",
        sub_category=SubCategory.query.filter(
        SubCategory.name == 'Inredning').all()[0]

    ),
    Product(
        name="Royalty Line 3-pack Marblecoating stekpannor",
        desc="Snyggt och stilrent 3-pack med stekpannor från Royalty Line. Ny helgjuten botten som gör att dina stekpannor får en mindre energikrävande uppvärmning, samt att dina pannor blir varmare fortare. Passar till alla spisar, även induktion.",
        price=349,
        img="https://media.fyndiq.se/product/39/30/e0/cda12bc5f1423486a2b23411403f7917d2/original.png",
        sub_category=SubCategory.query.filter(
        SubCategory.name == 'Köket').all()[0]

    ),
    Product(
        name="Digital termometer/hygrometer i miniformat",
        desc="En digital termometer/hygrometer som passar perfekt för att visa både inomhustemp och utomhustemp. Att använda den i kylskpå, frys o.s.v. funkar lika bra. Ultraliten och lätt digital termometer/hygrometer för användande i kyl, frys, inne, ute, ja, nästan var som helst! Klarar fukt men bör ej utsättas för regn.",
        price=79,
        img="https://media.fyndiq.se/product/40/5b/3f/b508be3c0055aeef69c32d5e37bea19375/original.png",
        sub_category=SubCategory.query.filter(
        SubCategory.name == 'Köket').all()[0]

    ),
    Product(
        name="Pilot Frixion Clicker Raderbar Korsordspenna",
        desc="Raderbar kulspetspenna! Frixion Clicker 0.7 mm.",
        price=35,
        img="https://media.fyndiq.se/product/8e/ea/4d/41c7de9d2e96b2b66e14aa800977a216dc/original.png",
        sub_category=SubCategory.query.filter(
        SubCategory.name == 'Kontor').all()[0]

    ),
    Product(
        name="Hänglås kombinationslås 45mm",
        desc="Hänglås med kombinationslås Programmerbart hänglås. Programmerbara kombinationslås 4 siffror. Enkel användning. Låssystemet är av hög kvalitet och 100 rostfritt. Mått: H: 8cm B: 4, 5cm Djup: 1, 5cm Märke: DUGA",
        price=99,
        img="https://media.fyndiq.se/product/d5/e1/b9/5cf6991ef0d60d1685947ca7f2691c4e1f/original.png",
        sub_category=SubCategory.query.filter(
        SubCategory.name == 'Kontor').all()[0]

    ),
    Product(
        name="vidaXL Barstol äkta läder brun",
        desc="Den mjuka och bekväma barstolen i äkta läder har en ikonisk design i linje med den industriella stil som är på modet just nu. Stolen kommer inte bara att se fantastisk ut på restauranger och barer, utan även i din hall, i ditt vardagsrum eller i din matsal. Den unika designen påminner om den sortens vintagebockar som vi minns från vår barndoms gympasalar. Klädseln i äkta läder är mjuk att ta på och gör stolen mycket hållbar. Stoppningen ger en bekväm sittupplevelse medan de massiva järnbenen med fotstöd gör stolen stadig och hållbar.",
        price=879,
        img="https://media.fyndiq.se/product/f4/d5/f3/f4dd47c31e8d60a3db316e6bb88433dc9e/original.png",
        sub_category=SubCategory.query.filter(
        SubCategory.name == 'Inredning').all()[0]

    ),
    Product(
        name="Boklåda blom / Förvaring",
        desc="Vacker låda / ask i form av en bok i antik stil. Perfekt att gömma små saker i, eller varför inte TV dosan?",
        price=349,
        img="https://media.fyndiq.se/product/47/6a/b4/2613b6cd7831ba4f6b26157554f8f90d20/original.png",
        sub_category=SubCategory.query.filter(
        SubCategory.name == 'Förvaring').all()[0]

    ),
    Product(
        name="Korgset Rosa plast 4 delar ",
        desc="Vackra och praktiska korgar i rosa plast, 4 delar ingår. Material: Plast",
        price=339,
        img="https://media.fyndiq.se/product/b8/97/39/d80e1d03860c62e645b0cb3ea3fd514cb9/original.png",
        sub_category=SubCategory.query.filter(
        SubCategory.name == 'Förvaring').all()[0]

    ),
    Product(
        name="Bluetooth Högtalare RGB-Led + kabeluttag 3.5, microUSB, USB, TF",
        desc="Högtalaren är idealisk för långa promenader, för en stadsferie etc. Höjdfärg gör att högtalaren ser väldigt imponerande ut och kan fungera som nattljus. Möjligheten att ladda batteriet via USB-porten. Inbyggd FM-radio. Högtalaren har också en kortplats TF (microSD). I avsaknad av Bluetooth i din enhet (telefon, surfplatta etc.). Du kan ansluta högtalaren via en kabel via AUX-porten och standard 3,5 mm minijackkontakt (medföljande kabel). Med Bluetooth-högtalare kan du också ringa eftersom det var utrustad med en mikrofon. Markera högtalaren kan slås på eller av.",
        price=349,
        img="https://media.fyndiq.se/product/f4/01/1a/89caddd2ca192312e667d2d262f9767701/original.png",
        sub_category=SubCategory.query.filter(
        SubCategory.name == 'Musik & Ljud').all()[0]

    ),
    Product(
        name="Block CR-20 Internetradio med Multiroom funktion och Bluetooth",
        desc="Denna smarta bordsradio från Block med alla moderna funktioner. MultiRoom UPP TILL 6 RUM Färgdisplay och integrerade högtalare Streaming SPOTIFY | NAS | SERVER Denna smarta bordsradio från Block med alla moderna funktioner. CD, DAB +, Internetradio , FM, förstärkare, ljudspelare för nätverk och Bluetooth-spelare, och alla bilder som visas på en högupplöst färgskärm !",
        price=2990,
        img="https://media.fyndiq.se/product/ba/6d/fc/8685a4e5582098d889f70f8331716f3208/original.png",
        sub_category=SubCategory.query.filter(
        SubCategory.name == 'Musik & Ljud').all()[0]

    ),
    Product(
        name="48st Batteri AA Alkaliska Alkaline",
        desc="Alkaliska batterier (Alkaline) av högsta kvalitet från Kodak. Batterierna är helt fria från bly, kvicksilver och kadmium. Ej laddningsbara.",
        price=299,
        img="https://media.fyndiq.se/product/f9/f2/83/05f5082891528e7d32a2fb3538bd8037ed/original.png",
        sub_category=SubCategory.query.filter(
        SubCategory.name == 'Batterier').all()[0]

    ),
    Product(
        name="Smartline batteri Alkaline AAA LR03 1,5V, 4-pack",
        desc="SmartLine Alkaline är ett utmärkt allroundbatteri av mycket hög kvalitet. - 0% kvicksilver",
        price=39,
        img="https://media.fyndiq.se/product/5a/4f/90/1d1534953da4b13ec915fde066d58e67fe/original.png",
        sub_category=SubCategory.query.filter(
        SubCategory.name == 'Batterier').all()[0]

    )
]

for p in products:
    db.session.add(p)

db.session.commit()
