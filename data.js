/* ============================================================
   CHILDSPHERE DATA LAYER — data.js
   Countries, translations, games, activities, opportunities
============================================================ */

// ============================================================
// COUNTRIES & CITIES
// ============================================================
window.COUNTRIES = [
  { code:'ZM', name:'Zambia', dial:'+260', cities:['Lusaka','Kitwe','Ndola','Livingstone','Kafue','Kabwe','Chipata','Solwezi','Kasama','Mongu','Choma','Mazabuka','Kapiri Mposhi','Mansa','Mpika','Petauke','Chinsali','Lundazi'] },
  { code:'ZW', name:'Zimbabwe', dial:'+263', cities:['Harare','Bulawayo','Mutare','Gweru','Kwekwe','Kadoma','Masvingo','Chinhoyi','Norton','Marondera'] },
  { code:'MW', name:'Malawi', dial:'+265', cities:['Lilongwe','Blantyre','Mzuzu','Zomba','Kasungu','Mangochi','Karonga'] },
  { code:'TZ', name:'Tanzania', dial:'+255', cities:['Dar es Salaam','Dodoma','Mwanza','Arusha','Mbeya','Morogoro','Zanzibar City','Tanga'] },
  { code:'MZ', name:'Mozambique', dial:'+258', cities:['Maputo','Beira','Nampula','Quelimane','Tete','Chimoio'] },
  { code:'BW', name:'Botswana', dial:'+267', cities:['Gaborone','Francistown','Molepolole','Serowe','Maun','Kanye'] },
  { code:'NA', name:'Namibia', dial:'+264', cities:['Windhoek','Rundu','Walvis Bay','Swakopmund','Oshakati','Katima Mulilo'] },
  { code:'KE', name:'Kenya', dial:'+254', cities:['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Malindi'] },
  { code:'UG', name:'Uganda', dial:'+256', cities:['Kampala','Gulu','Lira','Jinja','Mbale','Mbarara','Mukono'] },
  { code:'RW', name:'Rwanda', dial:'+250', cities:['Kigali','Butare','Gitarama','Ruhengeri','Gisenyi'] },
  { code:'ZA', name:'South Africa', dial:'+27', cities:['Johannesburg','Cape Town','Durban','Pretoria','Port Elizabeth','Bloemfontein','East London'] },
  { code:'GB', name:'United Kingdom', dial:'+44', cities:['London','Manchester','Birmingham','Leeds','Glasgow','Liverpool','Edinburgh'] },
  { code:'US', name:'United States', dial:'+1', cities:['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio'] },
  { code:'CA', name:'Canada', dial:'+1', cities:['Toronto','Montreal','Vancouver','Calgary','Ottawa','Edmonton','Quebec City'] },
  { code:'AU', name:'Australia', dial:'+61', cities:['Sydney','Melbourne','Brisbane','Perth','Adelaide','Gold Coast','Canberra'] },
  { code:'DE', name:'Germany', dial:'+49', cities:['Berlin','Hamburg','Munich','Cologne','Frankfurt','Stuttgart','Düsseldorf'] },
  { code:'FR', name:'France', dial:'+33', cities:['Paris','Marseille','Lyon','Toulouse','Nice','Nantes','Strasbourg'] },
  { code:'Other', name:'Other', dial:'', cities:['Other'] },
];

// ============================================================
// TRANSLATIONS (English & French)
// ============================================================
window.I18N = {
  en: {
    // Nav
    nav_about:'About', nav_whatwedo:'What We Do', nav_activities:'Activities',
    nav_impact:'Impact', nav_programs:'Programs', nav_partners:'Partners',
    nav_videos:'Videos', nav_gallery:'Gallery', nav_opps:'Opportunities',
    nav_stories:'Stories', nav_team:'Team', nav_emergency:'Emergency',
    nav_donate:'Donate', nav_login:'Login', nav_signup:'Sign Up', nav_logout:'Logout',
    nav_dashboard:'My Dashboard',
    // Hero
    hero_tag:'Youth-Led Movement · Global',
    hero_h1:'Every Child Has a Voice.',
    hero_accent:'We Amplify It.',
    hero_sub:"Childsphere champions children's rights, wellbeing and dignity — through education, creative programs, emergency support, and community action.",
    // Sections
    sec_about:'About Childsphere',
    sec_videos:'Educational Videos',
    sec_gallery:'Gallery',
    sec_opps:'Opportunities',
    sec_stories:'Stories',
    sec_team:'Our Team',
    sec_donate:'Support the Mission',
    sec_emergency:'Emergency Support',
    // Actions
    apply_now:'Apply Now',
    read_more:'Read story',
    subscribe:'Subscribe',
    donate_now:'Donate Now',
    get_involved:'Get Involved',
    watch_video:'Watch Video',
    // Auth
    login_title:'Welcome back',
    login_sub:'Login to access your dashboard.',
    signup_title:'Join Childsphere',
    signup_sub:'Create a free account to apply for programs worldwide.',
    // Forms
    full_name:'Full Name', age_label:'Age', country_label:'Country',
    city_label:'City / Town', password_label:'Password', email_label:'Email Address',
    phone_label:'Phone Number', contact_label:'Email or Phone Number',
    district_label:'City / District',
    // Dashboard
    dash_applications:'My Applications', dash_inbox:'Inbox',
    dash_saved_videos:'Saved Videos', dash_profile:'Profile',
    // Footer
    footer_org:'Organisation', footer_programs:'Programs', footer_involve:'Get Involved',
  },
  fr: {
    nav_about:'À propos', nav_whatwedo:'Ce que nous faisons', nav_activities:'Activités',
    nav_impact:'Impact', nav_programs:'Programmes', nav_partners:'Partenaires',
    nav_videos:'Vidéos', nav_gallery:'Galerie', nav_opps:'Opportunités',
    nav_stories:'Histoires', nav_team:'Équipe', nav_emergency:'Urgence',
    nav_donate:'Donner', nav_login:'Connexion', nav_signup:"S'inscrire", nav_logout:'Déconnexion',
    nav_dashboard:'Mon tableau de bord',
    hero_tag:'Mouvement Jeunesse · Mondial',
    hero_h1:'Chaque enfant a une voix.',
    hero_accent:'Nous l\'amplifions.',
    hero_sub:'Childsphere défend les droits des enfants, leur bien-être et leur dignité — à travers l\'éducation, des programmes créatifs, un soutien d\'urgence et une action communautaire.',
    sec_about:'À propos de Childsphere',
    sec_videos:'Vidéos éducatives',
    sec_gallery:'Galerie',
    sec_opps:'Opportunités',
    sec_stories:'Histoires',
    sec_team:'Notre équipe',
    sec_donate:'Soutenir la mission',
    sec_emergency:'Soutien d\'urgence',
    apply_now:'Postuler maintenant',
    read_more:'Lire l\'histoire',
    subscribe:'S\'abonner',
    donate_now:'Donner maintenant',
    get_involved:'S\'impliquer',
    watch_video:'Regarder la vidéo',
    login_title:'Bon retour',
    login_sub:'Connectez-vous pour accéder à votre tableau de bord.',
    signup_title:'Rejoindre Childsphere',
    signup_sub:'Créez un compte gratuit pour postuler à des programmes dans le monde entier.',
    full_name:'Nom complet', age_label:'Âge', country_label:'Pays',
    city_label:'Ville', password_label:'Mot de passe', email_label:'Adresse e-mail',
    phone_label:'Numéro de téléphone', contact_label:'E-mail ou téléphone',
    district_label:'Ville / District',
    dash_applications:'Mes candidatures', dash_inbox:'Boîte de réception',
    dash_saved_videos:'Vidéos sauvegardées', dash_profile:'Profil',
    footer_org:'Organisation', footer_programs:'Programmes', footer_involve:'S\'impliquer',
  }
};

// ============================================================
// GAMES DATA
// ============================================================
window.GAMES = [
  {
    id:'rights_quiz',
    title:'Rights Champion Quiz',
    desc:"Test your knowledge of children's 54 UNCRC rights. Answer correctly to earn points!",
    icon:'fa-trophy',
    color:'#1D4ED8', bg:'#EFF6FF',
    ageGroups:['7-12','13-18'],
    type:'quiz',
    questions:[
      { q:'Every child has the right to a name and nationality. Which article of the UNCRC covers this?', options:['Article 7','Article 12','Article 3','Article 19'], correct:0 },
      { q:'Children have the right to express their views freely. This is called the right to...', options:['Education','Participation','Health','Play'], correct:1 },
      { q:'What does UNCRC stand for?', options:['United Nations Convention on the Rights of the Child','Universal Nations Child Rights Code','United Nations Charter for Rights of Children','Universal Norms for Child Rights Commission'], correct:0 },
      { q:'Children have the right to be protected from violence, abuse and neglect. Which article covers this?', options:['Article 19','Article 6','Article 28','Article 13'], correct:0 },
      { q:'Every child has the right to education. Which article is this?', options:['Article 28','Article 31','Article 24','Article 17'], correct:0 },
      { q:'Children have the right to rest and play. Which article covers this?', options:['Article 31','Article 28','Article 24','Article 19'], correct:0 },
      { q:'Who is responsible for upholding children\'s rights?', options:['Governments and adults','Only parents','Only schools','Only NGOs'], correct:0 },
      { q:'At what age does the UNCRC define someone as a child?', options:['Under 18','Under 16','Under 21','Under 15'], correct:0 },
    ]
  },
  {
    id:'rights_match',
    title:'Rights Match-Up',
    desc:'Match each right to its correct UNCRC article number. Race against the clock!',
    icon:'fa-puzzle-piece',
    color:'#15803D', bg:'#F0FDF4',
    ageGroups:['7-12','13-18','19-24'],
    type:'matching',
    pairs:[
      { right:'Right to a name', article:'Article 7' },
      { right:'Right to education', article:'Article 28' },
      { right:'Right to play', article:'Article 31' },
      { right:'Right to health', article:'Article 24' },
      { right:'Right to express views', article:'Article 13' },
      { right:'Right to protection from abuse', article:'Article 19' },
      { right:'Right to family', article:'Article 9' },
      { right:'Right to privacy', article:'Article 16' },
    ]
  },
  {
    id:'safety_quiz',
    title:'Stay Safe Challenge',
    desc:'Learn what to do in different situations to keep yourself and others safe.',
    icon:'fa-shield-halved',
    color:'#BE123C', bg:'#FFF1F2',
    ageGroups:['0-6','7-12'],
    type:'quiz',
    questions:[
      { q:'Someone you don\'t know online asks for your home address. What do you do?', options:['Tell them','Block and tell a trusted adult','Give a fake address','Ignore it'], correct:1 },
      { q:'A friend tells you they are being hurt at home. What should you do?', options:['Keep it secret','Tell a trusted adult immediately','Wait and see','Do nothing'], correct:1 },
      { q:'What is the child helpline number in Zambia?', options:['116','999','123','911'], correct:0 },
      { q:'An adult touches you in a way that feels wrong. You should...', options:['Say NO and tell a trusted adult','Stay quiet','Blame yourself','Run away alone'], correct:0 },
      { q:'What is the safest way to meet someone you only know online?', options:['Go alone at night','Meet in a public place with a parent/guardian','Never meet at all','Meet at their house'], correct:2 },
      { q:'If someone threatens you, you should...', options:['Fight back','Tell a trusted adult or call 116','Keep quiet','Deal with it yourself'], correct:1 },
    ]
  },
  {
    id:'word_scramble',
    title:'Rights Word Scramble',
    desc:'Unscramble rights-related words as fast as you can. Beat the clock!',
    icon:'fa-font',
    color:'#6D28D9', bg:'#F5F3FF',
    ageGroups:['7-12','13-18'],
    type:'word_scramble',
    words:[
      { word:'EDUCATION', hint:'Every child has the right to learn' },
      { word:'PROTECTION', hint:'Children must be kept safe from harm' },
      { word:'PARTICIPATION', hint:'Children have the right to have their voice heard' },
      { word:'IDENTITY', hint:'Every child has the right to a name and nationality' },
      { word:'HEALTH', hint:'Every child has the right to medical care' },
      { word:'EQUALITY', hint:'All children deserve the same rights' },
      { word:'FAMILY', hint:'Children have the right to know and be cared for by parents' },
      { word:'PRIVACY', hint:'Children have the right to keep some things personal' },
    ]
  },
  {
    id:'emoji_story',
    title:'Rights Emoji Story',
    desc:"Build stories about children's rights using emojis. For the youngest learners!",
    icon:'fa-face-smile',
    color:'#D97706', bg:'#FFF7ED',
    ageGroups:['0-6','7-12'],
    type:'emoji_story',
    stories:[
      { emoji:'📚✏️🏫', meaning:'Every child has the right to go to school and learn.' },
      { emoji:'🏠💕👨‍👩‍👧', meaning:'Every child has the right to a safe home and loving family.' },
      { emoji:'⚽🎨🎵', meaning:'Every child has the right to play, create and have fun.' },
      { emoji:'🏥💊👩‍⚕️', meaning:'Every child has the right to be healthy and see a doctor.' },
      { emoji:'🛡️🚫😢', meaning:'No one is allowed to hurt or abuse a child.' },
      { emoji:'🗣️👂💬', meaning:"Children's voices must be heard and respected." },
    ]
  },
  {
    id:'leadership_path',
    title:'Leadership Journey',
    desc:'Make decisions as a young community leader. Every choice matters — build your impact score!',
    icon:'fa-people-group',
    color:'#0D9488', bg:'#CCFBF1',
    ageGroups:['13-18','19-24'],
    type:'scenario',
    scenarios:[
      { situation:'You notice younger children in your community don\'t know their rights. What do you do?', options:[{text:'Organise a rights awareness session',score:10},{text:'Tell an adult and move on',score:3},{text:'Post about it online',score:5},{text:'Wait for someone else to act',score:0}] },
      { situation:'A peer is being bullied at school. As a community champion, you...', options:[{text:'Intervene safely and report to teachers',score:10},{text:'Comfort them privately',score:6},{text:'Ignore it — not your business',score:0},{text:'Record a video',score:2}] },
      { situation:'You have been invited to speak at a community meeting about child welfare. You...', options:[{text:'Prepare a presentation and speak confidently',score:10},{text:'Decline — too nervous',score:0},{text:'Attend but stay quiet',score:3},{text:'Send a written message instead',score:6}] },
      { situation:'A company wants to sponsor Childsphere but their practices harm children. You...', options:[{text:'Refuse and explain why clearly',score:10},{text:'Accept — the money is needed',score:0},{text:'Ask for more information first',score:7},{text:'Let someone else decide',score:2}] },
    ]
  },
];

// ============================================================
// ACTIVITIES DATA
// ============================================================
window.ACTIVITIES = {
  '0-6': [
    { title:'Songs & Rights Rhymes', icon:'fa-music', color:'#92400E', bg:'linear-gradient(135deg,#FEF9C3,#FDE68A)', desc:'Rights-based songs and movement activities that embed values through play and joyful repetition.' },
    { title:'Creative Playtime', icon:'fa-paint-brush', color:'#065F46', bg:'linear-gradient(135deg,#ECFDF5,#A7F3D0)', desc:'Drawing, colouring and crafts that encourage self-expression and emotional literacy from the very start.' },
    { title:'Storytime Circles', icon:'fa-book-open', color:'#1E40AF', bg:'linear-gradient(135deg,#EFF6FF,#BFDBFE)', desc:'Age-appropriate stories about kindness, identity and belonging — facilitated by trained youth volunteers.' },
    { title:'Emoji Rights Game', icon:'fa-face-smile', color:'#D97706', bg:'linear-gradient(135deg,#FFF7ED,#FED7AA)', desc:'Learn rights through fun emoji stories and simple matching games designed for tiny learners.' },
    { title:'Movement & Dance', icon:'fa-person-walking', color:'#7C3AED', bg:'linear-gradient(135deg,#F5F3FF,#DDD6FE)', desc:'Body-awareness activities that teach children about personal space, consent and safety through movement.' },
  ],
  '7-12': [
    { title:'Rights Quizzes & Games', icon:'fa-gamepad', color:'#166534', bg:'linear-gradient(135deg,#F0FDF4,#BBF7D0)', desc:'Team competitions where children learn all 54 UNCRC rights through exciting challenges and points.' },
    { title:'Speak Up Club', icon:'fa-microphone', color:'#C2410C', bg:'linear-gradient(135deg,#FFF7ED,#FED7AA)', desc:'Public speaking, debate and poetry sessions that build confidence and give children a powerful voice.' },
    { title:'Drama & Role Play', icon:'fa-masks-theater', color:'#7E22CE', bg:'linear-gradient(135deg,#FDF4FF,#E9D5FF)', desc:'Theatrical performances exploring real children\'s rights scenarios — fun, empathetic and educational.' },
    { title:'Rights Word Scramble', icon:'fa-font', color:'#1D4ED8', bg:'linear-gradient(135deg,#EFF6FF,#BFDBFE)', desc:'Unscramble rights-related words against the clock — builds vocabulary while learning key concepts.' },
    { title:'Safety Challenge Game', icon:'fa-shield-halved', color:'#BE123C', bg:'linear-gradient(135deg,#FFF1F2,#FECDD3)', desc:'Interactive scenarios that teach children how to stay safe online, at home and in the community.' },
    { title:'Art for Rights', icon:'fa-palette', color:'#047857', bg:'linear-gradient(135deg,#ECFDF5,#6EE7B7)', desc:'Create posters, comics and digital art that express children\'s rights — displayed at community events.' },
  ],
  '13-18': [
    { title:'Digital Rights Lab', icon:'fa-laptop', color:'#1D4ED8', bg:'linear-gradient(135deg,#EFF6FF,#93C5FD)', desc:'Online safety, media literacy and using technology to advocate for children\'s rights across Zambia.' },
    { title:'Youth Advocacy', icon:'fa-seedling', color:'#047857', bg:'linear-gradient(135deg,#ECFDF5,#6EE7B7)', desc:'Training in policy engagement, community campaigns and holding local leaders accountable.' },
    { title:'Peer Support Network', icon:'fa-hand-holding-heart', color:'#BE123C', bg:'linear-gradient(135deg,#FFF1F2,#FECDD3)', desc:'Mental health first aid and peer counselling skills — creating safe spaces for teens.' },
    { title:'Leadership Journey Game', icon:'fa-people-group', color:'#0D9488', bg:'linear-gradient(135deg,#CCFBF1,#99F6E4)', desc:'Make strategic decisions as a young community leader and build your impact score.' },
    { title:'Rights Champion Quiz', icon:'fa-trophy', color:'#D97706', bg:'linear-gradient(135deg,#FFF7ED,#FED7AA)', desc:'Advanced UNCRC knowledge quiz with leaderboard — compete with youth across all districts.' },
    { title:'Journalism & Storytelling', icon:'fa-newspaper', color:'#5B21B6', bg:'linear-gradient(135deg,#F5F3FF,#C4B5FD)', desc:'Write real stories about child rights issues in your community for publication on our platform.' },
  ],
  '19-24': [
    { title:'Become a Peer Educator', icon:'fa-chalkboard-user', color:'#5B21B6', bg:'linear-gradient(135deg,#F5F3FF,#C4B5FD)', desc:'Train as a certified Childsphere peer educator. Deliver sessions and receive a stipend.', hasApply:true },
    { title:'Community Champion', icon:'fa-bullhorn', color:'#065F46', bg:'linear-gradient(135deg,#ECFDF5,#A7F3D0)', desc:'Lead awareness campaigns, coordinate local events and represent Childsphere in your community.', hasApply:true },
    { title:'Youth Organisation Partner', icon:'fa-handshake', color:'#B45309', bg:'linear-gradient(135deg,#FFF7ED,#FDE68A)', desc:'Align your youth group with Childsphere — co-create programs and share resources.', hasApply:true },
    { title:'Leadership Journey Game', icon:'fa-people-group', color:'#0D9488', bg:'linear-gradient(135deg,#CCFBF1,#99F6E4)', desc:'Advanced leadership scenario game — test your decision-making as an organisational leader.' },
    { title:'Rights Match-Up', icon:'fa-puzzle-piece', color:'#15803D', bg:'linear-gradient(135deg,#F0FDF4,#BBF7D0)', desc:'Expert-level UNCRC article matching challenge. Can you match all 54 rights correctly?' },
  ],
};

// ============================================================
// VIDEO DATA (topic-based)
// ============================================================
window.VIDEOS_DATA = [
  { id:'v1', title:'Know Your 54 Rights – Full Lesson', youtubeId:'ScMzIvxBSi4', category:'rights', ageGroups:['7-12','13-18'], desc:'A complete beginner-friendly lesson walking through the UNCRC — perfect for ages 10 and up.' },
  { id:'v2', title:'Mental Health for Young People', youtubeId:'ZbZSe6N_BXs', category:'wellbeing', ageGroups:['13-18','19-24'], desc:'Understanding emotions, stress and how to look after your mental health every day.' },
  { id:'v3', title:'What To Do in an Emergency', youtubeId:'LXb3EKWsInQ', category:'emergency', ageGroups:['0-6','7-12'], desc:'Step-by-step guide on what to do if you or another child is in danger.' },
  { id:'v4', title:'Becoming a Peer Educator', youtubeId:'hT_nvWreIhg', category:'leadership', ageGroups:['19-24'], desc:'Hear from young people who completed the 6-week training and now teach in their communities.' },
  { id:'v5', title:'Annual Gala 2024 Highlights', youtubeId:'8UVNT4wvIGY', category:'events', ageGroups:['all'], desc:'A look back at our biggest celebration of children across Lusaka, Kitwe and Livingstone.' },
  { id:'v6', title:'Child Protection – Safety at Home & School', youtubeId:'dX3k_QDnzHE', category:'emergency', ageGroups:['7-12','13-18'], desc:'Practical guidance on recognising unsafe situations — what every child should know.' },
  { id:'v7', title:'Songs & Rhymes for Little Rights Champions', youtubeId:'ScMzIvxBSi4', category:'rights', ageGroups:['0-6'], desc:'Fun, singalong rights education for the youngest children aged 0–6.' },
  { id:'v8', title:'Youth Leadership in Practice', youtubeId:'ZbZSe6N_BXs', category:'leadership', ageGroups:['13-18','19-24'], desc:'Real stories from young leaders driving change in their communities across Zambia.' },
];

// ============================================================
// TEAM DATA (starter — cleared for real org)
// ============================================================
window.TEAM_DATA = [];

// ============================================================
// GALLERY DATA (starter)
// ============================================================
window.GALLERY_DATA = [
  { id:'g1', src:'https://images.unsplash.com/photo-1536337005238-94b997371b40?w=500&q=80', caption:'Rights workshop, Lusaka', folder:'rights' },
  { id:'g2', src:'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=500&q=80', caption:'Community outreach, Kafue', folder:'outreach' },
  { id:'g3', src:'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&q=80', caption:'Annual gala 2024', folder:'events' },
  { id:'g4', src:'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=500&q=80', caption:'Peer educator training', folder:'programs' },
  { id:'g5', src:'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=500&q=80', caption:'Youth summit 2024', folder:'events' },
  { id:'g6', src:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=80', caption:'Team building day', folder:'team' },
];

// ============================================================
// OPPORTUNITIES DATA (starts empty — admin posts real ones)
// ============================================================
window.OPPORTUNITIES_DATA = [];

// ============================================================
// BLOG DATA (starts empty — admin posts real stories)
// ============================================================
window.BLOG_DATA = [];
