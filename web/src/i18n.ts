// English ⇄ हिन्दी. The page is authored in English; Hindi replaces each translatable element's
// innerHTML by looking up its (whitespace-normalised) English HTML. Verses in Hindi are a free
// rendering (भावानुवाद) made for this site from Ryder's English, with Kalidasa's own Sanskrit for
// the tagline.

export type Lang = 'en' | 'hi';

export const SELECTOR = '.skip,.th-sub,.th-mm .th-note,#enter-sound,#enter-quiet,.th-hint,.arr-k,.arr-h,.ladder .lt,.load-k,.hold-hint,.kicker,.mega-sub,.tag,.scroll-cue,.eyebrow,.verse p,.verse cite,.prose,.note h3,.note p,.fine,.try,.letter-k,.letter-n,.letter button,.gloss,.g-title,.g-item figcaption,.coda-t,.coda-actions .btn,.colophon p,.lang-k';

const C = (n: string) => `पूर्वमेघ, ${n}`;
const L = (n: string) => `उत्तरमेघ, ${n}`;

const PAIRS: [string, string][] = [
  ['Skip to the story', 'सीधे कहानी पर जाएँ'],
  ['Barsaat · The Cloud Messenger', 'बरसात · मेघदूत'],
  ['— a hundred in an hour is a cloudburst', '— एक घंटे में सौ, तो बादल फटा'],
  ['Enter with sound', 'आवाज़ के साथ चलें'],
  ['Enter in silence', 'चुपचाप चलें'],
  ['Best with headphones. Scroll to fly north.', 'हेडफ़ोन के साथ सबसे अच्छा। उत्तर की ओर उड़ने के लिए स्क्रॉल करें।'],
  ['A cloud has brought you a message.', 'एक बादल तुम्हारे लिए संदेश लाया है।'],
  ['It came the long way, the way the rains come.', 'वह लंबी राह से आया है, जैसे बारिश आती है।'],
  ['first drops', 'पहली बूँदें'],
  ['spray', 'फुहार'],
  ['steady rain', 'लय में बारिश'],
  ['slanting rain', 'तिरछी बारिश'],
  ['unending rain', 'न थमने वाली'],
  ['downpour', 'मूसलाधार'],
  ['it has cleared', 'आसमान खुला'],
  ['cloud', 'बादल'],
  ['Press and hold to thunder', 'गरजने के लिए दबाकर रखें'],
  ["After Kalidasa's <em>Meghaduta</em>, c. 5th century", 'कालिदास के <em>मेघदूत</em> पर आधारित, लगभग पाँचवीं सदी'],
  ['The Cloud Messenger', 'बादल, जो संदेश ले गया'],
  ['“Even happy hearts thrill strangely to the cloud.”', '“मेघालोके भवति सुखिनोऽप्यन्यथावृत्ति चेतः”<br><span class="tag-sub">बादल को देखकर सुखी मन भी कुछ और हो जाता है।</span>'],
  ['<span></span>scroll', '<span></span>स्क्रॉल'],
  ["Prologue · रामगिरि · Rama's peak", 'आरंभ · रामगिरि'],
  ["On Rama's shady peak where hermits roam,<br>Mid streams by Sita's bathing sanctified,<br>An erring Yaksha made his hapless home,<br>Doomed by his master humbly to abide,<br>And spend a long, long year of absence from his bride.",
    'रामगिरि के छायादार शिखर पर, जहाँ तपस्वी विचरते हैं,<br>सीता के स्नान से पावन हुए झरनों के बीच,<br>एक भूला-भटका यक्ष आ बसा,<br>स्वामी के शाप से विवश,<br>अपनी प्रिया से एक लंबे, लंबे बरस के बिछोह में।'],
  ['Former Cloud, I', C('१')],
  ['An attendant of the god of wealth is exiled for a year, to a hill in the middle of India. His young wife is half a subcontinent away, in a city on the slopes of Kailasa. Eight months pass. Then, at the edge of summer, a dark shape comes over the ridge.',
    'धन के देवता कुबेर का एक सेवक एक बरस के लिए निर्वासित है, भारत के बीचोंबीच एक पहाड़ी पर। उसकी नवविवाहिता पत्नी आधे उपमहाद्वीप दूर है, कैलास की ढलानों पर बसे एक नगर में। आठ महीने बीत जाते हैं। फिर, गर्मी के आख़िरी छोर पर, एक साँवली आकृति पहाड़ी के ऊपर से उभरती है।'],
  ["Some months were gone; the lonely lover's pain<br>Had loosed his golden bracelet day by day<br>Ere he beheld the harbinger of rain,<br>A cloud that charged the peak in mimic fray,<br>As an elephant attacks a bank of earth in play.",
    'कुछ महीने बीत गए; विरही की पीड़ा ने<br>दिन-ब-दिन उसके सोने के कंगन ढीले कर दिए,<br>तब उसने देखा वर्षा का अग्रदूत,<br>एक बादल, जो खेल-खेल में शिखर से जा टकराया,<br>जैसे कोई हाथी क्रीड़ा में मिट्टी के टीले पर टूट पड़े।'],
  ['Former Cloud, II', C('२')],
  ['He offers it fresh blossoms, and asks it to carry a message north. <strong>You are that cloud.</strong>',
    'वह उसे ताज़े फूल अर्पित करता है, और उत्तर तक एक संदेश ले जाने की विनती करता है। <strong>वह बादल तुम हो।</strong>'],
  ['Before you leave, take a message of your own to someone far away.', 'चलने से पहले, किसी दूर बैठे अपने के लिए अपना भी एक संदेश ले लो।'],
  ['<span id="msg-n">0</span>/140 · it never leaves this device', '<span id="msg-n">0</span>/140 · यह इस डिवाइस से बाहर नहीं जाता'],
  ['Carry it north', 'उत्तर ले चलो'],
  ['<em>boonda-baandi</em> · the first scattered drops', 'पहली, बिखरी हुई बूँदें'],
  ["Nor did it pass the lovelorn Yaksha's mind<br>How all unfitly might his message mate<br>With a cloud, mere fire and water, smoke and wind—<br>Ne'er yet was lover could discriminate<br>'Twixt life and lifeless things, in his love-blinded state.",
    'विरही यक्ष के मन में यह बात न आई<br>कि उसका संदेश बादल से कैसे मेल खाएगा,<br>जो बस आग और पानी, धुआँ और हवा है—<br>प्रेम में अंधा कोई प्रेमी कब पहचान पाया है<br>जीवित और निर्जीव का भेद।'],
  ['Former Cloud, V', C('५')],
  ['The smell of the first rain', 'पहली बारिश की गंध'],
  ["The first drops on hot dust release a smell scientists named <em>petrichor</em> in 1964. In Kannauj, perfumers had already been bottling it for generations as <em>mitti attar</em>, “earth's perfume”: baked clay distilled for days into sandalwood oil. Kalidasa had a line for it too: <em>“Scenting the sweet, sweet smell of forest earth.”</em>",
    'तपती धूल पर गिरी पहली बूँदें जो गंध छोड़ती हैं, उसे वैज्ञानिकों ने 1964 में <em>पेट्रिकोर</em> नाम दिया। कन्नौज के इत्र बनाने वाले पीढ़ियों से उसे <em>मिट्टी अत्तर</em> के रूप में शीशियों में भर रहे थे: पकी हुई मिट्टी, कई दिनों तक चंदन के तेल में आसवित। कालिदास के पास भी इसके लिए एक पंक्ति थी: <em>“वन की मिट्टी की मीठी, मीठी गंध।”</em>'],
  ['<em>phuhaar</em> · a fine spray you walk through', 'महीन बौछार, जिसमें से होकर तुम चलते हो'],
  ["Learn first, O cloud, the road that thou must go,<br>Then hear my message ere thou speed away;<br>Before thee mountains rise and rivers flow:<br>When thou art weary, on the mountains stay,<br>And when exhausted, drink the rivers' driven spray.",
    'पहले, हे मेघ, वह राह जान लो जिस पर तुम्हें जाना है,<br>फिर मेरा संदेश सुनकर उड़ चलना;<br>आगे पर्वत उठेंगे, नदियाँ बहेंगी:<br>थक जाओ तो पर्वतों पर ठहर जाना,<br>और रीत जाओ तो नदियों की उछलती फुहार पी लेना।'],
  ['Former Cloud, XIII', C('१३')],
  ['The route the exile gives is real: north-west to the Narmada, to Ujjain, then north across the plains to the Ganga and the Himalaya. It is also, near enough, the path the monsoon takes every year. The rains reach Kerala around the first of June and cover the whole country by the eighth of July.',
    'यक्ष जो राह बताता है, वह असली है: उत्तर-पश्चिम में नर्मदा तक, उज्जैन तक, फिर उत्तर में मैदानों को पार करते हुए गंगा और हिमालय तक। लगभग यही राह मानसून भी हर साल लेता है। बारिश जून की पहली तारीख़ के आसपास केरल पहुँचती है और आठ जुलाई तक पूरे देश पर छा जाती है।'],
  ['While favouring breezes waft thee gently forth,<br>And while upon thy left the plover sings<br>His proud, sweet song, the cranes who know thy worth<br>Will meet thee in the sky on joyful wings.',
    'जब अनुकूल हवाएँ तुम्हें धीरे-धीरे आगे ले चलें,<br>और तुम्हारी बाईं ओर पपीहा<br>अपना गर्वीला, मीठा गीत गाए, तब तुम्हारा मोल जानने वाले सारस<br>आनंद के पंखों पर आकाश में तुमसे आ मिलेंगे।'],
  ['Former Cloud, IX', C('९')],
  ["Map: the poem's route in gold. Dashed lines: approximate normal monsoon onset dates, after the India Meteorological Department (2020 normals).",
    'नक़्शा: कविता की राह सुनहरे रंग में। टूटी रेखाएँ: मानसून के आगमन की सामान्य तिथियाँ, लगभग, भारत मौसम विज्ञान विभाग के आधार पर (2020 के मानक)।'],
  ['<em>rimjhim</em> · steady rain with a rhythm in it', 'लय में बरसती, थमी-थमी बारिश'],
  ["Then fly, rain-quickened, to the Reva river<br>Which gaily breaks on Vindhya's rocky side,<br>Like painted streaks upon an elephant's dingy hide.",
    'फिर, वर्षा से नई जान पाकर, रेवा नदी की ओर उड़ना,<br>जो विंध्य की चट्टानी ढलानों पर उल्लास से टूटती है,<br>जैसे किसी हाथी की धूसर देह पर रंगी हुई धारियाँ।'],
  ['Former Cloud, XIX', C('१९')],
  ['Spying the madder on the banks, half brown,<br>Half green with shoots that struggle to the birth,<br>Nibbling where early plantain-buds hang down,<br>Scenting the sweet, sweet smell of forest earth,<br>The deer will trace thy misty track that ends the dearth.',
    'किनारों पर आधी भूरी, आधी हरी मजीठ को निहारते,<br>जन्म को आतुर कोंपलों के बीच,<br>लटकती केले की कलियों को कुतरते,<br>वन की मिट्टी की मीठी, मीठी गंध सूँघते,<br>हिरण तुम्हारी धुँधली राह का पीछा करेंगे, जो सूखे का अंत है।'],
  ['Former Cloud, XXI', C('२१')],
  ['Paper boats', 'काग़ज़ की कश्ती'],
  ['Every monsoon childhood has the same engineering project: a page torn from a notebook, folded into a <em>kaagaz ki kashti</em>, and launched into the gutter the moment the lane floods. Most sink by the second corner. That is not the point.',
    'हर बरसाती बचपन का एक ही इंजीनियरिंग प्रोजेक्ट होता है: कॉपी से फाड़ा एक पन्ना, मोड़कर बनी <em>काग़ज़ की कश्ती</em>, और गली में पानी भरते ही नाली में उतार दी गई। ज़्यादातर दूसरे मोड़ तक डूब जाती हैं। बात वह नहीं है।'],
  ['Yet I foresee delay on every hill<br>Where jasmines blow, and where the peacock-train<br>Cries forth with joyful tears a welcome shrill.',
    'फिर भी मुझे हर पहाड़ी पर देर होती दिखती है,<br>जहाँ चमेली खिलती है, और जहाँ मोरों की टोली<br>खुशी के आँसुओं के साथ ऊँची पुकार में स्वागत करती है।'],
  ['Former Cloud, XXII', C('२२')],
  ['<em>bauchhaar</em> · rain the wind throws sideways', 'वह बारिश, जिसे हवा तिरछा फेंकती है'],
  ['Ujjain, at dusk', 'उज्जैन, साँझ के समय'],
  ["Clothing thyself in twilight's rose-red glory,<br>Embrace the dancing Shiva's tree-like arm;<br>He will prefer thee to his mantle gory.",
    'संध्या की गुलाबी-लाल आभा ओढ़कर,<br>नाचते शिव की वृक्ष-सी भुजा से लिपट जाना;<br>वे अपने रक्त-सने चर्म के बदले तुम्हें ही ओढ़ना चाहेंगे।'],
  ['Former Cloud, XXXVI', C('३६')],
  ["Where women steal to rendezvous by night<br>Through darkness that a needle might divide,<br>Show them the road with lightning-flashes bright<br>As golden streaks upon the touchstone's side—<br>But rain and thunder not, lest they be terrified.",
    'जहाँ स्त्रियाँ रात में मिलन को चुपके से निकलती हैं<br>ऐसे घने अँधेरे में, जिसे सुई से काटा जा सके,<br>उन्हें बिजली की चमक से राह दिखाना,<br>कसौटी पर खिंची सोने की लकीरों जैसी—<br>पर गरजना-बरसना नहीं, कहीं वे डर न जाएँ।'],
  ['Former Cloud, XXXVII', C('३७')],
  ['The raga that brings rain', 'वह राग, जो बारिश लाता है'],
  ['The story goes that Tansen, a singer at Akbar\'s court, sang Raag Deepak until every lamp lit itself and his own body burned, and that he was cooled when Raag Megh Malhar was sung and the rain came. It is a legend. Musicians still sing Malhar every monsoon, just in case. The music you may be hearing is Malhar itself, from recordings of the raga.',
    'कहते हैं, अकबर के दरबार के गायक तानसेन ने राग दीपक इस तरह गाया कि हर दीया अपने आप जल उठा और उनका अपना शरीर जलने लगा, और जब राग मेघ मल्हार गाया गया, तब बारिश आई और उन्हें शीतलता मिली। यह एक किंवदंती है। फिर भी संगीतकार हर मानसून में मल्हार गाते हैं, क्या पता। जो संगीत तुम शायद सुन रहे हो, वह स्वयं मल्हार है, इसी राग की रिकॉर्डिंग से।'],
  ['<span>Press and hold anywhere</span> to thunder.', '<span>कहीं भी दबाकर रखो</span>, बादल गरजेगा।'],
  ['Interlude', 'मध्यांतर'],
  ['The rain in paint', 'रंगों में बारिश'],
  ['For three hundred years, Indian painters gave the monsoon its own vocabulary: skies of ink instead of blue, lightning drawn as a gold snake, a row of white cranes across the dark, peacocks crying on the rooftops. These are the real thing.',
    'तीन सौ बरसों तक भारतीय चित्रकारों ने मानसून को अपनी अलग भाषा दी: नीले की जगह स्याही-से आसमान, सोने के साँप-सी खिंची बिजली, अँधेरे के पार सफ़ेद सारसों की क़तार, छतों पर पुकारते मोर। ये असली चित्र हैं।'],
  ['<b>Royal lovers watching rain clouds: the month of Bhadon</b> Pahari, Kangra school, c. 1790. The Cleveland Museum of Art, CC0.', '<b>बादलों को निहारते राजसी प्रेमी: भादों का महीना</b> पहाड़ी, कांगड़ा शैली, लगभग 1790। क्लीवलैंड म्यूज़ियम ऑफ़ आर्ट, CC0।'],
  ['<b>Setmalar Ragini</b> Malwa, c. 1630–40. The Metropolitan Museum of Art, public domain.', '<b>सेतमलार रागिनी</b> मालवा, लगभग 1630–40। मेट्रोपॉलिटन म्यूज़ियम ऑफ़ आर्ट, सार्वजनिक।'],
  ['<b>Krishna and the Gopis take shelter from the rain</b> Jaipur, 1760. The Metropolitan Museum of Art, public domain.', '<b>बारिश से बचते कृष्ण और गोपियाँ</b> जयपुर, 1760। मेट्रोपॉलिटन म्यूज़ियम ऑफ़ आर्ट, सार्वजनिक।'],
  ['<b>Madhumadhavi Ragini</b> Marwar, c. 1640–50. The Metropolitan Museum of Art, public domain.', '<b>मधुमाधवी रागिनी</b> मारवाड़, लगभग 1640–50। मेट्रोपॉलिटन म्यूज़ियम ऑफ़ आर्ट, सार्वजनिक।'],
  ['<b>Watching girls swinging at the Teej festival</b> Marwar. The Cleveland Museum of Art, CC0.', '<b>तीज के झूलों पर झूलती लड़कियाँ</b> मारवाड़। क्लीवलैंड म्यूज़ियम ऑफ़ आर्ट, CC0।'],
  ['<em>jhadi</em> · rain that will not stop', 'वह बारिश, जो थमती ही नहीं'],
  ["Fly then where Ganges o'er the king of mountains<br>Falls like a flight of stairs from heaven let down<br>For the sons of men; she hurls her billowy fountains<br>Like hands to grasp the moon on Shiva's crown<br>And laughs her foamy laugh at Gauri's jealous frown.",
    'फिर उड़ना वहाँ, जहाँ गंगा पर्वतराज से<br>स्वर्ग से उतारी गई सीढ़ियों-सी उतरती है<br>मनुष्यों के लिए; वह अपनी लहरें ऊपर उछालती है<br>जैसे शिव के मुकुट पर चंद्रमा को पकड़ने बढ़े हाथ,<br>और गौरी की ईर्ष्या भरी भौंहों पर झागदार हँसी हँसती है।'],
  ['Former Cloud, L', C('५०')],
  ["If thou, like some great elephant of the sky,<br>Shouldst wish from heaven's eminence to bend<br>And taste the crystal stream, her beauties high—<br>As thy dark shadows with her whiteness blend—<br>Would be what Jumna's waters at Prayaga lend.",
    'यदि तुम, आकाश के किसी विशाल हाथी-से,<br>स्वर्ग की ऊँचाई से झुककर<br>उसकी निर्मल धारा चखना चाहो—<br>तो तुम्हारी साँवली छाया उसकी धवलता में घुलकर<br>वैसी लगेगी, जैसी प्रयाग में यमुना की धारा।'],
  ['Former Cloud, LI', C('५१')],
  ['<em>Saawan ki jhadi</em> is the rain of the monsoon month that goes on for days. It is also what you call tears that will not stop. The language has always known the two are related.',
    '<em>सावन की झड़ी</em> उस बारिश को कहते हैं जो दिनों तक चलती रहती है। उन आँसुओं को भी यही कहते हैं जो थमते नहीं। भाषा हमेशा से जानती है कि दोनों का रिश्ता है।'],
  ['<em>mooslaadhaar</em> · rain in streams as thick as a pestle', 'मूसल जितनी मोटी धारों में बरसती बारिश'],
  ["If, born from friction of the deodars,<br>A scudding fire should prove the mountain's bane,<br>Singeing the tails of yaks with fiery stars,<br>Quench thou the flame with countless streams of rain—<br>The great have power that they may soothe distress and pain.",
    'यदि देवदारों की रगड़ से जन्मी<br>कोई भागती आग पर्वत पर विपदा बन जाए,<br>चिनगारियों से याकों की पूँछें झुलसाती हुई,<br>तो अनगिनत धाराओं से उस लौ को बुझा देना—<br>बड़ों के पास शक्ति इसीलिए होती है कि वे दुख और पीड़ा हरें।'],
  ['Former Cloud, LIII', C('५३')],
  ["The breeze is piping on the bamboo-tree;<br>And choirs of heaven sing in union sweet<br>O'er demon foe of Shiva's victory;<br>If thunders in the caverns drumlike beat,<br>Then surely Shiva's symphony will be complete.",
    'बाँस के झुरमुटों में हवा बाँसुरी बजा रही है;<br>और स्वर्ग के गायक मधुर स्वर में मिलकर<br>असुर पर शिव की विजय गा रहे हैं;<br>यदि गुफाओं में तुम्हारी गर्जना मृदंग-सी गूँजे,<br>तो शिव का संगीत पूरा हो जाएगा।'],
  ['Former Cloud, LVI', C('५६')],
  ['<span class="dev" lang="hi">बादल फटना</span> · the cloud tears', '<span class="dev" lang="hi">बादल फटना</span>'],
  ['A cloudburst is a hundred millimetres of rain in an hour: a hundred litres poured on every square metre of ground. In the mountains it comes without warning, and the rivers rise in minutes.',
    'बादल फटना यानी एक घंटे में सौ मिलीमीटर बारिश: ज़मीन के हर वर्ग मीटर पर सौ लीटर पानी। पहाड़ों में यह बिना चेतावनी के आता है, और नदियाँ मिनटों में चढ़ जाती हैं।'],
  ['<em>khul gaya</em> · it has cleared', 'आसमान खुल गया है'],
  ["Then, in familiar Alaka find rest,<br>Down whom the Ganges' silken river swirls,<br>Whose towers cling to her mountain lover's breast,<br>While clouds adorn her face like glossy curls<br>And streams of rain like strings of close-inwoven pearls.",
    'फिर, अपनी जानी-पहचानी अलका में विश्राम करना,<br>जिसके नीचे गंगा की रेशमी धारा लहराती है,<br>जिसकी अटारियाँ अपने पर्वत-प्रिय के वक्ष से लगी हैं,<br>जबकि बादल उसके मुख को चमकीली लटों-से सजाते हैं<br>और वर्षा की धाराएँ घने गुँथे मोतियों की लड़ियों-सी।'],
  ['Former Cloud, LXIII', C('६३')],
  ['She is at the window, counting the days left with flowers laid on the sill. The cloud settles against the glass and does what it came to do.',
    'वह खिड़की पर है, देहरी पर रखे फूलों से बचे हुए दिन गिन रही है। बादल शीशे से आ लगता है और वही करता है जिसके लिए आया था।'],
  ['So she will know the cloud is a true messenger, he gives it a secret only the two of them could know:',
    'ताकि वह जान सके कि बादल सच्चा दूत है, यक्ष उसे एक ऐसा रहस्य देता है जो केवल वे दोनों जानते हैं:'],
  ['And one thing more: thou layest once asleep,<br>Clasping my neck, then wakening with a scream;<br>And when I wondered why, thou couldst but weep<br>A while, and then a smile began to beam:<br>“Rogue! Rogue! I saw thee with another girl in dream.”',
    'और एक बात और: एक बार तुम सो रही थीं,<br>मेरे गले में बाँहें डाले, फिर चीख़कर जाग उठीं;<br>और जब मैंने कारण पूछा, तो तुम बस रोती रहीं<br>कुछ देर, और फिर एक मुस्कान खिल उठी:<br>“छलिया! छलिया! मैंने सपने में तुम्हें किसी और लड़की के साथ देखा।”'],
  ['Latter Cloud, XLVIII', L('४८')],
  ['When Vishnu rises from his serpent bed<br>The curse is ended; close thine eyelids tight<br>And wait till only four months more are sped;<br>Then we shall taste each long-desired delight<br>Through nights that the full autumn moon illumines bright.',
    'जब विष्णु अपनी शेष-शय्या से उठेंगे,<br>शाप का अंत होगा; आँखें कसकर मूँद लो<br>और बस चार महीने और बीतने दो;<br>फिर हम हर चिर-प्रतीक्षित सुख चखेंगे<br>उन रातों में, जिन्हें शरद का पूरा चाँद उजला करता है।'],
  ['Latter Cloud, XLVII', L('४७')],
  ['…then wander free<br>In rainy loveliness, and ne\'er abide<br>One moment\'s separation from thy lightning bride.',
    '…फिर स्वच्छंद विचरना<br>वर्षा के सौंदर्य में, और कभी न सहना<br>अपनी बिजली-दुल्हन से एक पल का भी बिछोह।'],
  ['Latter Cloud, LII', L('५२')],
  ['Send this cloud', 'यह बादल भेजो'],
  ['Somebody is far away from somebody, every monsoon. Send them a cloud. Your message travels inside the link and nowhere else.',
    'हर मानसून, कोई किसी से दूर होता है। उन्हें एक बादल भेजो। तुम्हारा संदेश बस लिंक के भीतर यात्रा करता है, और कहीं नहीं।'],
  ['Fly again', 'फिर से उड़ो'],
  ['Read the whole poem', 'पूरी कविता पढ़ो'],
  ['<b>Words</b> Kalidasa, <em>Meghaduta</em> (c. 5th century), translated by Arthur W. Ryder (1912), public domain via Project Gutenberg.',
    '<b>शब्द</b> कालिदास, <em>मेघदूत</em> (लगभग पाँचवीं सदी)। हिंदी पंक्तियाँ इस साइट के लिए आर्थर डब्ल्यू. राइडर (1912) के अंग्रेज़ी अनुवाद से किया गया भावानुवाद हैं।'],
  ['<b>Chapter paintings</b> made for this site with image generation, after the Pahari masters of Kangra. <b>The rain in paint</b> The Metropolitan Museum of Art (Open Access) and The Cleveland Museum of Art (CC0).',
    '<b>अध्यायों के चित्र</b> इस साइट के लिए इमेज जनरेशन से बनाए गए, कांगड़ा के पहाड़ी उस्तादों की शैली में। <b>रंगों में बारिश</b> मेट्रोपॉलिटन म्यूज़ियम ऑफ़ आर्ट (ओपन एक्सेस) और क्लीवलैंड म्यूज़ियम ऑफ़ आर्ट (CC0)।'],
  ['<span class="dev" lang="hi">सावन की झड़ी</span>', '<span class="dev" lang="hi">सावन की झड़ी</span>'],
  ["<b>Onset lines</b> approximate, after India Meteorological Department normals. <b>Sound</b> Raag Megh Malhar and Miyan ki Malhar from NCERT's <em>Rag Ras Barse</em> (CC BY 3.0); rain and thunder recordings by ezwa (public domain) and RHumphries (CC BY 3.0); koel by Jappalang (CC BY-SA 3.0), via Wikimedia Commons.",
    '<b>आगमन रेखाएँ</b> लगभग, भारत मौसम विज्ञान विभाग के मानकों के आधार पर। <b>ध्वनि</b> राग मेघ मल्हार और मियाँ की मल्हार, NCERT के <em>राग रस बरसे</em> से (CC BY 3.0); बारिश और गर्जन की रिकॉर्डिंग ezwa (सार्वजनिक) और RHumphries (CC BY 3.0) की; कोयल Jappalang (CC BY-SA 3.0) की, विकिमीडिया कॉमन्स से।'],
  ['Made by <b>hapybeing</b>', '<b>hapybeing</b> की रचना'],
];

const norm = (s: string) => s.replace(/\s+/g, ' ').replace(/<br\s*\/?>/g, '<br>').trim();
const DICT = new Map(PAIRS.map(([e, h]) => [norm(e), h]));

/** strings set from code */
export const UI: Record<string, Record<Lang, string>> = {
  soundOn: { en: 'Sound on', hi: 'आवाज़ चालू' },
  soundOff: { en: 'Sound off', hi: 'आवाज़ बंद' },
  carrying: { en: 'Carrying it', hi: 'ले जा रहा हूँ' },
  carry: { en: 'Carry it north', hi: 'उत्तर ले चलो' },
  flyNorth: { en: 'Fly north', hi: 'उत्तर उड़ो' },
  arrivedK: { en: 'This cloud is carrying a message for you. It will be delivered at the end of the road.', hi: 'यह बादल तुम्हारे लिए एक संदेश ला रहा है। राह के अंत में वह तुम्हें मिलेगा।' },
  placeholder: { en: 'I am well. The rains have come. I think of you.', hi: 'मैं ठीक हूँ। बारिश आ गई है। तुम्हारी याद आती है।' },
  shareSent: { en: 'The cloud is on its way.', hi: 'बादल रास्ते में है।' },
  shareCopied: { en: 'Link copied. Send it to someone far away.', hi: 'लिंक कॉपी हो गया। किसी दूर बैठे अपने को भेजो।' },
  shareTitle: { en: 'A cloud has brought you a message', hi: 'एक बादल तुम्हारे लिए संदेश लाया है' },
  writtenOn: { en: 'Written on the glass: ', hi: 'शीशे पर लिखा है: ' },
};

let originals: Map<Element, string> | null = null;
export let lang: Lang = 'en';

export function applyLang(next: Lang) {
  lang = next;
  document.documentElement.lang = next;
  document.documentElement.dataset.lang = next;
  const els = [...document.querySelectorAll(SELECTOR)];
  if (!originals) originals = new Map(els.map(e => [e, e.innerHTML]));
  const missing: string[] = [];
  for (const el of els) {
    const en = originals.get(el) ?? el.innerHTML;
    if (next === 'en') { if (el.innerHTML !== en) el.innerHTML = en; continue; }
    const hi = DICT.get(norm(en));
    if (hi) el.innerHTML = hi; else missing.push(norm(en).slice(0, 60));
  }
  try { localStorage.setItem('barsaat-lang', next); } catch { /* private mode */ }
  if (missing.length && new URL(location.href).searchParams.has('debug')) console.warn('i18n missing', missing);
  document.dispatchEvent(new CustomEvent('langchange'));
}

export function initialLang(): Lang {
  const q = new URL(location.href).searchParams.get('lang');
  if (q === 'hi' || q === 'en') return q;
  try { const s = localStorage.getItem('barsaat-lang'); if (s === 'hi' || s === 'en') return s; } catch { /* */ }
  return (navigator.languages || [navigator.language]).some(l => l.toLowerCase().startsWith('hi')) ? 'hi' : 'en';
}
export const t = (k: keyof typeof UI) => UI[k][lang];
