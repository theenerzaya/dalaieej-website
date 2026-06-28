# Cabin Source Of Truth Correction Sheet

Generated: 2026-06-18

Purpose: one place to correct cabin facts before we rewrite the website copy.

Important: Cloudbeds is currently treated as the booking source of truth for live booking names/descriptions. This sheet includes a read-only pull from `getRoomTypes`, then the scattered website copy that can disagree with it.

## Files / Sources Checked

- Cloudbeds API: `getRoomTypes` with current property credentials, read-only
- `lib/cabinCatalog.ts`: canonical slugs, local fallback names, Cloudbeds IDs, priceFrom
- `app/[locale]/cabins/page.tsx`: `/cabins` cards
- `app/[locale]/[room]/page.tsx`: dynamic cabin detail pages
- `app/[locale]/superior-cabin/page.tsx`: older dedicated Superior Cabin page
- `messages/en.json` and `messages/mn.json`: old room groups, home featured rooms, map labels
- `app/[locale]/accommodation/page.tsx`: old accommodation landing cards

## How To Correct

For each bookable unit below, fill or revise:

- Final English name:
- Final Mongolian name:
- Max guests:
- Beds:
- Bathroom / toilet:
- Shower:
- Heating:
- View / location:
- Quantity:
- Short card description:
- Long detail description:
- Included services:
- Notes / warnings:

---

## 1. superior-cabin

Stable slug: `superior-cabin`

Cloudbeds:
- ID: `198039847624896`
- Current name: `Ерөнхийлөгчийн Хаус`
- maxGuests: `5`
- Description: ТАНЫ ЗАХИАЛГАД БАГТСАН ҮЙЛЧИЛГЭЭНҮҮД: Өглөөний цай | Саун болон Сэлүүрт завиар хязгааргүй үйлчлүүлэх эрх | Иогийн хичээл | "Далай ээж" хойгт нэвтрэх эрх. Олуулаа яваа гэр бүлд тохиромжтой. Цор ганц загвар. Тав тух, орон зайг эрхэмлэдэг том гэр бүлд зориулан тусгайлан бэлтгэсэн манай хамгийн том байр. 5 хүн чөлөөтэй багтах зайтай, дотроо бие засах суултуур, угаалтууртай. Давуу тал: хамгийн том зай талбайтай + дотроо "00"-тэй.
- Features: Галлагаатай зуух; Дотроо 00, угаалтууртай; Сэлүүрт завь үнэгүй; Нийтийн шүршүүр ашиглана; Нуурын харууцтай; Саун үнэгүй; Өглөөний иог; Минибар; Өглөөний цай багтсан

Local catalog:
- EN fallback name: `Ерөнхийлөгчийн Хаус`
- MN fallback name: `Ерөнхийлөгчийн Хаус`
- priceFrom: `300`

`/cabins` card:
- Area: `50 m²`
- Guests: `3 adults · 4 child`
- Quantity: `1 cabin`
- Intro EN: Wood-fired warmth, handwoven textiles and a private forest view — our entry-level cabin, sized for couples and small families.
- Intro MN: Галын зуухны дулаан, гар нэхмэл эдлэл, ойн хувийн харагдацтай — хос болон жижиг гэр бүлд зориулсан анхны шатны модон байшин.

Dynamic detail page:
- Eyebrow: `Designed for natural living`
- Area / size: `30 m²`
- Guests: `2 adults · 1 child`
- Bed: `1 Queen Bed`
- View: `Forest View`
- Intro EN: Wood-fired warmth, handwoven textiles and a private forest view define the Superior Cabin. It is a quiet base for couples and small families who want to stay close to the lake and larch line.

Old dedicated `/superior-cabin` page:
- Area / size: `30 m²`
- Guests: `2 adults · 1 child`
- Bed: `1 Queen Bed`
- View: `Forest View`
- Intro explicitly says placeholder copy.

Likely conflicts to correct:
- Cloudbeds says biggest 5-person family unit with toilet/washbasin; local pages say smaller couples/small-family cabin.
- Area differs: `50 m²` vs `30 m²`.
- Guest capacity differs: `5` vs `3 adults · 4 child` vs `2 adults · 1 child`.

---

## 2. triple-traditional-cabin

Stable slug: `triple-traditional-cabin`

Cloudbeds:
- ID: `196467430240449`
- Current name: `Тухтай Хаус (Галлагаатай)`
- maxGuests: `3`
- Description: ТАНЫ ЗАХИАЛГАД БАГТСАН ҮЙЛЧИЛГЭЭНҮҮД: Өглөөний цай | Саун болон Сэлүүрт завиар хязгааргүй үйлчлүүлэх эрх | Иогийн хичээл | "Далай ээж" хойгт нэвтрэх эрх. Тав тухыг эрхэмлэгч хосууд болон цөөн ам бүлтэй гэр бүлүүдэд тохиромжтой. Тав тух, хувийн орон зайг бүрэн мэдрэх сонголт. Энэхүү байр нь дотроо ариун цэврийн өрөө тул танд гэртээ байгаа мэт тав тухыг мэдрүүлнэ. Нэг өргөн ор болон нэг нарийн ортой. Багтаамж: 3 хүн. Давуу тал: хувийн ариун цэврийн өрөөтэй.
- Features: Галлагаатай зуух; Дотроо 00, угаалтууртай; Сэлүүрт завь үнэгүй; Нуурын харууцтай; Саун үнэгүй; Өглөөний иог; Минибар; Өглөөний цай багтсан

Local catalog:
- EN fallback name: `Triple Traditional Cabin`
- MN fallback name: `Тухтай Хаус (Галлагаатай)`
- priceFrom: `470`

`/cabins` card:
- Area: `30 m²`
- Guests: `3 adults · 2 child`
- Quantity: `5 cabins`
- Intro EN: A classic timber cabin layout with three full sleeping spaces, a warm hearth corner, and a sheltered deck for cool evenings by the trees.

Dynamic detail page:
- Eyebrow: `Traditional comfort, refined`
- Area / size: `58 m²`
- Guests: `3 adults · 1 child`
- Bed: `3 Sleeping Spaces`
- View: `Forest Deck View`
- Intro EN: A classic timber layout with three sleeping spaces, a warm hearth corner, and a sheltered deck for cool evenings by the trees.

Likely conflicts:
- Cloudbeds max is 3, but local pages imply 4-5 total guests.
- Area differs: `30 m²` vs `58 m²`.
- Cloudbeds says one double + one single, while local says three sleeping spaces.

---

## 3. lakeside-cabin

Stable slug: `lakeside-cabin`

Cloudbeds:
- ID: `198020352975040`
- Current name: `Эрэг дээрх Хаус`
- maxGuests: `2`
- Description: ТАНЫ ЗАХИАЛГАД БАГТСАН ҮЙЛЧИЛГЭЭНҮҮД: Өглөөний цай | Саун болон Сэлүүрт завиар хязгааргүй үйлчлүүлэх эрх | Иогийн хичээл | "Далай ээж" хойгт нэвтрэх эрх. Хосууд, байгальд дурлагсад тохиромжтой. Нуурын эрэгт хамгийн ойр байрлалтай модон хаусууд; цонхоороо байгалийн сайхныг тольдох хамгийн төгс харагдацтай. Ажилтан галлаж өгдөг уламжлалт модон зуухтай. Анхааруулга: дотроо ариун цэврийн өрөөгүй; нийтийн боловсон ариун цэврийн байгууламж ашиглана. Давуу тал: Хөвсгөл далайг хамгийн ойроос мэдрэх боломж + хэмнэлттэй үнэ.
- Features: Галлагаатай зуух; Сэлүүрт завь үнэгүй; Минибар; Нийтийн шүршүүр ашиглана; Нуурын харууцтай; Саун үнэгүй; Өглөөний иог; Өглөөний цай багтсан

Local catalog:
- EN fallback name: `Lakeside Cabin`
- MN fallback name: `Эрэг дээрх Хаус`
- priceFrom: `420`

`/cabins` card:
- Area: `40 m²`
- Guests: `2 adults · 1 child`
- Quantity: `2 cabins`
- Intro EN: A wider footprint at the shoreline — two sleeping spaces, a reading nook and a deck that steps straight toward Lake Khövsgöl.

Dynamic detail page:
- Eyebrow: `Closer to the waterline`
- Area / size: `55 m²`
- Guests: `3 adults · 1 child`
- Bed: `2 Sleeping Spaces`
- View: `Lake View`
- Intro EN: A wider shoreline footprint with two sleeping spaces, a reading nook, and a deck that steps directly toward Lake Khövsgöl.

Likely conflicts:
- Cloudbeds max is 2; local pages say 3 or 4 total.
- Area differs: `40 m²` vs `55 m²`.
- Cloudbeds says no private toilet; local copy does not consistently warn this.

---

## 4. triple-electric-cabin

Stable slug: `triple-electric-cabin`

Cloudbeds:
- ID: `198036698427584`
- Current name: `Тухтай Хаус (Цахилгаан халаалт)`
- maxGuests: `5`
- Description: ТАНЫ ЗАХИАЛГАД БАГТСАН ҮЙЛЧИЛГЭЭНҮҮД: Өглөөний цай | Саун болон Сэлүүрт завиар хязгааргүй үйлчлүүлэх эрх | Иогийн хичээл | "Далай ээж" хойгт нэвтрэх эрх. Тав тухыг эрхэмлэгч хосууд, цөөн ам бүлтэй гэр бүлд тохиромжтой. Дотроо бие засах суултуур болон угаалтууртай тул шөнө орой гадагшаа гарах шаардлагагүй. Шүршүүрт нийтийн боловсон ариун цэврийн байгууламжид орно. Давуу тал: дотроо "00"-тэй.
- Features: Дотроо 00, угаалтууртай; Сэлүүрт завь үнэгүй; Нуурын харууцтай; Саун үнэгүй; Телевиз; Өглөөний иог; Минибар; Өглөөний цай багтсан

Local catalog:
- EN fallback name: `Triple Electric Cabin`
- MN fallback name: `Тухтай Хаус (Цахилгаан халаалт)`
- priceFrom: `510`

`/cabins` card:
- Area: `30 m²`
- Guests: `3 adults · 2 children`
- Quantity: `1 cabin`
- Intro EN: Designed for longer family stays, with three sleeping zones, electric heating for stable comfort, and a brighter open-plan living area.

Dynamic detail page:
- Eyebrow: `Family-ready for longer stays`
- Area / size: `60 m²`
- Guests: `3 adults · 2 children`
- Bed: `3 Sleeping Zones`
- View: `Shoreline View`
- Intro EN: Designed for longer family stays with three sleeping zones, electric heating for stable comfort, and a brighter open-plan living area.

Likely conflicts:
- Area differs: `30 m²` vs `60 m²`.
- Cloudbeds says toilet/washbasin inside but shared shower; local pages do not clearly state bathroom/shower split.

---

## 5. signature-cabin

Stable slug: `signature-cabin`

Cloudbeds:
- ID: `197943412437120`
- Current name: `Энгийн Байр`
- maxGuests: `2`
- Description: Таны захиалгад багтсан үйлчилгээнүүд: Өглөөний цай | Саун болон Сэлүүрт завиар хязгааргүй үйлчлүүлэх эрх | Иогийн хичээл | "Далай ээж" хойгт нэвтрэх эрх. Хосууд болон ганцаарчилсан аялагчид тохиромжтой. Хөвсгөл далайн байгалийн сайхныг мэдрэх хамгийн сонгодог сонголт. Модон хийцтэй, дулаахан энэхүү байр нь нуурын эрэгтэй ойр байрлалтай тул байгальтай ойр байхыг хүссэн аялагчдад тохиромжтой. Багтаамж: дээд тал нь 2 том хүн. Тав тух: тав тухтай ор, галлагаатай зуух, цэвэр цагаан хэрэглэл. Ариун цэвэр: нийтийн боловсон ариун цэврийн байгууламжтай, 24/7 халуун ус.
- Features: Сэлүүрт завь үнэгүй; Нийтийн шүршүүр ашиглана; Саун үнэгүй; Цахилгаан халаалт; Өглөөний иог; Өглөөний цай багтсан

Local catalog:
- EN fallback name: `Signature Cabin`
- MN fallback name: `Энгийн Байр`
- priceFrom: `560`

`/cabins` card:
- Area: `30 m²`
- Guests: `2 adults`
- Quantity: `5 cabins`
- Intro EN: Our most requested room — a separate living area, deep-soak tub, and a private terrace that opens onto the larch line.

Dynamic detail page:
- Eyebrow: `Our most requested stay`
- Area / size: `70 m²`
- Guests: `3 adults · 2 children`
- Bed: `2 Bedrooms`
- View: `Larch Line View`
- Intro EN: A separate living area, deep-soak tub, and private terrace opening onto the larch line make this the most requested room type.

Likely conflicts:
- Cloudbeds says simple/basic 2-person unit with shared facilities; local pages say signature/luxury, deep-soak tub, terrace, 70 m², 5 total guests.
- This one is probably the most dangerous misinformation.

---

## 6. quad-electric-cabin

Stable slug: `quad-electric-cabin`

Cloudbeds:
- ID: `198046100787328`
- Current name: `Гэр Бүлийн Хаус (Цахилгаан халаалт)`
- maxGuests: `5`
- Description: ТАНЫ ЗАХИАЛГАД БАГТСАН ҮЙЛЧИЛГЭЭНҮҮД: Өглөөний цай | Саун болон Сэлүүрт завиар хязгааргүй үйлчлүүлэх эрх | Иогийн хичээл | "Далай ээж" хойгт нэвтрэх эрх. ӨРӨӨНИЙ ТУХАЙ: Бага насны хүүхэдтэй гэр бүлд тохиромжтой. Талбайн хувьд бага боловч цахилгаан халаалттай тул шөнө гал түлэх шаардлагагүй, тогтмол дулаахан байна. Ор: 2 "дабл" хэмжээтэй ор. Онцлог: жижиг боловч дулаахан. Ариун цэвэр: дотроо "00"-тэй.
- Features: Дотроо 00, угаалтууртай; Сэлүүрт завь үнэгүй; Нуурын харууцтай; Саун үнэгүй; Цахилгаан халаалт; Өглөөний иог; Минибар; Өглөөний цай багтсан

Local catalog:
- EN fallback name: `Quad Electric Cabin`
- MN fallback name: `Гэр Бүлийн Хаус (Цахилгаан халаалт)`
- priceFrom: `540`

`/cabins` card:
- Area: `25 m²`
- Guests: `4 adults · 3 children`
- Quantity: `1 cabin`
- Intro EN: Our flexible mid-tier option for groups — four sleeping positions, full electric comfort systems, and a larger lounge facing the shoreline.

Dynamic detail page:
- Eyebrow: `Flexible for group travel`
- Area / size: `66 m²`
- Guests: `4 adults · 1 child`
- Bed: `4 Sleeping Positions`
- View: `Shoreline View`
- Intro EN: A flexible mid-tier option with four sleeping positions, full electric comfort systems, and a larger lounge facing the shoreline.

Likely conflicts:
- Area differs sharply: `25 m²` vs `66 m²`.
- Local card says 7 total guests, Cloudbeds max is 5.
- Cloudbeds says small but warm; local detail says larger lounge.

---

## 7. grand-peninsula-suite

Stable slug: `grand-peninsula-suite`

Cloudbeds:
- ID: `198038298677377`
- Current name: `Гэр Бүлийн Хаус (Галлагаатай)`
- maxGuests: `5`
- Description: ТАНЫ ЗАХИАЛГАД БАГТСАН ҮЙЛЧИЛГЭЭНҮҮД: Өглөөний цай | Саун болон Сэлүүрт завиар хязгааргүй үйлчлүүлэх эрх | Иогийн хичээл | "Далай ээж" хойгт нэвтрэх эрх. 4 ам бүлтэй гэр бүлд тохиромжтой. Гэр бүлээрээ нэг дор, халуун дулаан уур амьсгалд амарна. Хоёр том хос ортой. Дотроо бие засах суултуур, угаалтууртай тул хүүхэд багачуудтай явахад нэн тохиромжтой. Шүршүүрт нийтийн боловсон ариун цэврийн байгууламжид орно. Ариун цэвэр: дотроо "00"-тэй.
- Features: Галлагаатай зуух; Дотроо 00, угаалтууртай; Сэлүүрт завь үнэгүй; Нийтийн шүршүүр ашиглана; Нуурын харууцтай; Саун үнэгүй; Өглөөний иог; Минибар; Телевиз; Өглөөний цай багтсан

Local catalog:
- EN fallback name: `Grand Peninsula Suite`
- MN fallback name: `Гэр Бүлийн Хаус (Галлагаатай)`
- priceFrom: `1200`

`/cabins` card:
- Area: `35 m²`
- Guests: `4 adults · 3 children`
- Quantity: `1 suite`
- Intro EN: A standalone suite on its own peninsula — two bedrooms, a wood-panelled living room, and uninterrupted lake views on three sides.

Dynamic detail page:
- Eyebrow: `Our largest private stay`
- Area / size: `120 m²`
- Guests: `4 adults · 2 children`
- Bed: `2 Bedrooms`
- View: `Panoramic Lake View`
- Intro EN: A standalone suite on its own peninsula with two bedrooms, a wood-panelled living room, and uninterrupted lake views on three sides.

Legacy `messages.rooms.grandSuite`:
- EN says premier residence, sleeps up to 5, 2 double beds + 1 single bed, panoramic windows.
- MN says `"Өргөө" Тусгай Хаус`, 5 хүн хүртэл, 2 өргөн ор + 1 нарийн ор.

Likely conflicts:
- Cloudbeds name is family house, not Grand Peninsula Suite.
- Bed count differs: Cloudbeds says two double beds; old messages say two doubles + one single.
- Area differs: `35 m²` vs `120 m²`.
- Local says own peninsula / three-sided lake views; verify.

---

## 8. camping

Stable slug: `camping`

Cloudbeds:
- ID: `198042256253056`
- Current name: `Аялагчийн Отог`
- maxGuests: `12`
- Description: ТАНЫ ЗАХИАЛГАД БАГТСАН ҮЙЛЧИЛГЭЭНҮҮД: Өглөөний цай | Саун болон Сэлүүрт завиар хязгааргүй үйлчлүүлэх эрх | Иогийн хичээл | "Далай ээж" хойгт нэвтрэх эрх. Майхан болон машинтай аялагчид тохиромжтой. Та манай хувийн эзэмшлийн, харуул хамгаалалттай бүсэд аюулгүй хоноглох боломжтой. Бид танд халуун шүршүүр, цэвэр ус болон кемпийн бусад үйлчилгээг санал болгож байна. 3-с дээш хүний захиалга өгөхөөр бол холбогдоно уу.
- Features: "Далай Ээж" хойгт нэвтрэх эрх; Сэлүүрт завь үнэгүй; Нийтийн шүршүүр ашиглана; Саун үнэгүй; Өглөөний иог; Өглөөний цай багтсан

Local catalog:
- EN fallback name: `Camping`
- MN fallback name: `Аялагчийн Отог`
- priceFrom: `180`

`/cabins` card:
- Area: `Outdoor setup`
- Guests: `2 adults · 2 children`
- Quantity: `Limited spots`
- Intro EN: A nature-first stay under the open sky with essential camp comforts and direct access to the lakeside grounds.

Legacy messages:
- EN title: `Peninsula Camping`; capacity: `Verified upon arrival`; bedding: `Dedicated sites for Tents or Vehicles`
- MN title: `Өөрийн майханд отоглох`; capacity: `Майхан / Машин`

Likely conflicts:
- Cloudbeds max is 12 but also says contact for more than 3 people.
- Local `/cabins` says 4 total guests.

---

# Old Grouped / Legacy Accommodation Copy

These do not map cleanly to the eight current bookable slugs. Decide whether to delete, rewrite as map zones, or map each to a current Cloudbeds room.

## Home Featured Rooms (`messages.*.home.featured_rooms`)

EN:
- `Lakeside Cabin`: Traditional wood-fired experience with authentic furnishings. Price: From $300.
- `Ensuite Suite`: Added comfort with stunning lake views. Price: From $450.
- `Grand Peninsula Suite`: Commanding lake views with a private terrace. Price: From $600.

MN:
- `Нуурын эргийн байшин (нийтийн ариун цэврийн өрөөтэй)`: Уламжлалт галлагаатай, шүршүүр ба ариун цэврийн өрөөг нийтийн байраар ашигладаг. Үнэ: ₮850,000.
- `Тухтай хаус`: Өрөөндөө хувийн ариун цэврийн өрөөтэй, илүү тав тухтай амралт. Үнэ: ₮950,000.
- `"Өргөө" тусгай хаус`: Өрөөндөө хувийн ариун цэврийн өрөөтэй, өргөн зай ба онцгой харагдацтай байр. Үнэ: ₮1,175,000.

## `messages.*.rooms`

EN groups:
- `Grand Peninsula Suite`: premier residence; sleeps up to 5; 2 Double Beds + 1 Single Bed; panoramic lake views; in-room toilet/washbasin; wood stove; TV; shared hot showers nearby.
- `Family Ensuite Cabin`: sleeps up to 4; 2 Double Beds; private facilities; secluded veranda; wood stove or electric heating; shared hot showers nearby.
- `Comfort Ensuite Cabin`: sleeps up to 3; 1 Double + 1 Single; rustic privacy; private toilet/washbasin; wood stove or electric heating; shared hot showers nearby.
- `Standard Lakeside Cabin`: max 2 adults; 2 Double Beds; authentic wood-fired cabins near dining lodge; shared toilets and hot showers.
- `The Lodge Room`: max 2 adults; double or twin; main lodge, central heating, second floor, shared toilets/showers.
- `Peninsula Camping`: secure private grounds; tents/vehicles; hot showers/fresh water; restaurant/bar access.

MN groups:
- `"Өргөө" Тусгай Хаус`: 5 хүн хүртэл; 2 өргөн ор + 1 нарийн ор; нуурын панорам харагдац; өрөөндөө хувийн ариун цэврийн өрөөтэй; уламжлалт галлагаатай зуух; TV; нийтийн шүршүүр.
- `Гэр Бүлийн Хаус`: 4 хүн хүртэл; 2 өргөн ор; хувийн ариун цэврийн өрөө; галлагаатай зуух эсвэл цахилгаан халаагуур; хувийн саравч; нийтийн шүршүүр.
- `Тухтай Хаус`: 3 хүн хүртэл; 1 өргөн ор + 1 нарийн ор; хувийн ариун цэврийн өрөө; галлагаатай зуух эсвэл цахилгаан халаагуур; хувийн саравч; нийтийн шүршүүр.
- `Энгийн Модон Байшин`: 2 насанд хүрсэн хүн; 2 өргөн ор; төв хэсэгт, ресторанд ойр; нийтийн ариун цэврийн байгууламж.
- `Лодж Өрөө`: 2 насанд хүрсэн хүн; 1 өргөн эсвэл 2 нарийн ор; рестораны хажуугийн 2 давхар; төвийн халаалт; нийтийн ариун цэврийн байгууламж.
- `Өөрийн майханд отоглох`: майхан / машин; хамгаалалттай хойг; халуун шүршүүр, цэвэр ус, ресторан.

## Interactive Map Stay Zones (`messages.*.map`)

EN:
- `annex`: The Lodge Annex — Separate building housing the Lodge Rooms, adjacent to the restaurant.
- `ensuite`: Ensuite Cabins (Quiet Zone) — Private cabins featuring indoor facilities, set back from the shoreline for privacy.
- `heritage`: Heritage Cabins (Lakeside Zone) — Classic, wood-fired cabins positioned centrally along the water's edge.
- `grand`: Grand Peninsula Suite — Premier residence commanding the tip of the peninsula.
- `overland`: To Overland Grounds — Secure camping for tents and vehicles.

MN:
- `annex`: Энгийн байрнууд (нийтийн ариун цэврийн өрөөтэй) — Рестораны хажуу дахь тусдаа байр. Лодж өрөөнүүд энд байрлах бөгөөд ариун цэврийн өрөө, шүршүүрийг нийтийн байраар ашиглана.
- `ensuite`: Тухтай, гэр бүлийн хаус — Өрөө бүр дотроо хувийн ариун цэврийн өрөөтэй. Эргээс жаахан зайтай, нам гүм бүсэд байрладаг.
- `heritage`: Энгийн модон байшингууд (нийтийн ариун цэврийн өрөөтэй) — Уламжлалт галлагаатай модон байшингууд. Нуурын эрэг дагуу төв хэсэгт байрлах ба ариун цэврийн өрөө, шүршүүрийг нийтийн байраар ашиглана.
- `grand`: "Өргөө" Тусгай хаус — Хойгийн үзүүрт байрлах, өрөөндөө хувийн ариун цэврийн өрөөтэй дээд ангиллын хаус.
- `overland`: Отоглох газар — Майхан болон тээврийн хэрэгслээр ирсэн зочдод зориулсан хамгаалалттай кемпийн бүс.

## Old `/accommodation` Page

EN:
- `Forest Cabins`: Six private log cabins tucked into the larch forest. Each with a wood-burning stove and private terrace. Capacity: 2-4 Guests.
- `The Lodge`: Historic main lodge overlooking the lake. Rooms with panoramic views of Lake Khövsgöl. Capacity: 2-3 Guests.

MN:
- `Ойн байшингууд`: Шинэсэн ойн дунд байрлах 6 тусдаа модон байшин. Галын зуухтай, хувийн террастай. Capacity: 2-4 зочин.
- `Гол байшин`: Хөвсгөл нуурын эрэг дээрх түүхэн гол байшин. Нуурын харагдац бүхий өрөөнүүд. Capacity: 2-3 зочин.

---

# Biggest Contradictions To Resolve First

1. `signature-cabin` is the biggest mismatch: Cloudbeds says `Энгийн Байр`, max 2, shared bathroom/shower; website says Signature Cabin, deep-soak tub, private terrace, 70 m², 5 guests.
2. `superior-cabin` is also inverted: Cloudbeds says `Ерөнхийлөгчийн Хаус`, max 5, biggest space; website says entry-level/small family and 30-50 m².
3. `grand-peninsula-suite` may be misnamed against Cloudbeds: current Cloudbeds name is `Гэр Бүлийн Хаус (Галлагаатай)`.
4. Area data is inconsistent for almost every cabin.
5. Capacity data is inconsistent for almost every cabin.
6. Bathroom language needs strict rules: many rooms have toilet/washbasin inside but shared shower; some have no toilet inside.
7. Old grouped labels like `Family Ensuite Cabin`, `Comfort Ensuite Cabin`, `Standard Lakeside Cabin`, and `The Lodge Room` still exist in translation files.
8. The map is zone-based, not exact bookable-room-based. It should probably stay grouped, but the names need to align with the final taxonomy.
