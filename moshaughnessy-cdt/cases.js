/* The Fine Print — case study data.
   Each case lists the news coverage, timeline, source notices, and the
   old/new SORN text for every change. Edit the text here; app.js builds
   the redlines automatically. "flags" are phrases in the NEW text to mark
   as linked to a reported harm. */

const SAVE20 = 'https://www.govinfo.gov/content/pkg/FR-2020-05-27/html/2020-11390.htm';
const SAVE25 = 'https://www.govinfo.gov/content/pkg/FR-2025-10-31/html/2025-19735.htm';

window.FINE_PRINT_CASES = [
  {
    id: 'save',
    tag: 'DHS · SAVE',
    agency: 'Department of Homeland Security · USCIS',
    system: 'DHS/USCIS-004 · Systematic Alien Verification for Entitlements (SAVE)',
    title: 'How DHS turned a benefits-verification tool into a voter citizenship check',
    blurb: 'Texas ran its voter rolls through DHS’s revised SAVE system, which flagged 2,724 people as potential noncitizens. Some of them were U.S. citizens, and at least one had his registration cancelled.',
    dek: 'SAVE was originally used to check immigration status for public benefits. A revised notice in October 2025 expanded it to cover U.S.-born citizens, draw on Social Security data, and support “voter verification.” States have since used it to check tens of millions of voter registrations, and it has flagged citizens as possible noncitizens.',
    priorLabel: '2020 notice', newLabel: '2025 notice',
    notices: [
      { label: 'Prior notice', cite: '85 FR 31798', date: 'May 27, 2020', url: SAVE20 },
      { label: 'Rewritten notice', cite: '90 FR 48948', date: 'Oct. 31, 2025', url: SAVE25 }
    ],
    timeline: [
      { date: 'May 27, 2020', text: 'SAVE notice covers immigrants and naturalized or derived citizens.' },
      { date: 'May 15, 2025', text: 'SSA–DHS agreement puts Social Security data into SAVE.' },
      { date: 'Oct. 31, 2025', text: 'Rewritten notice published, effective the same day.' },
      { date: 'Dec. 2025 – Jul. 2026', text: 'Citizens flagged in Texas; the state later tells counties to reinstate some.', harm: true },
      { date: 'Jun. – Sep. 2026', text: 'A court vacates the overhaul; the Supreme Court stays that ruling.' }
    ],
    news: [
      { outlet: 'NPR', date: 'Dec. 10, 2025', headline: 'Trump’s SAVE tool is looking for noncitizen voters. But it’s flagging U.S. citizens too', url: 'https://www.npr.org/2025/12/10/nx-s1-5588384/save-voting-data-us-citizens' },
      { outlet: 'Votebeat', date: 'July 30, 2026', headline: 'Texas confirms some flagged as potential noncitizens on voter rolls had provided DPS proof of citizenship', url: 'https://www.votebeat.org/texas/2026/07/30/save-potential-noncitizens-gave-proof-of-citizenship-to-dps/' },
      { outlet: 'AP via PBS NewsHour', date: 'May 17, 2026', headline: 'Critics fear a midterm purge as the Trump administration promotes program to check voter eligibility', url: 'https://www.pbs.org/newshour/politics/critics-fear-a-midterm-purge-as-the-trump-administration-promotes-program-to-check-voter-eligibility' }
    ],
    changes: [
      {
        section: 'Purpose of the system',
        old: 'to confirm immigration and naturalized and certain derived citizen status information … (4) conducting a background investigation; or (5) any other lawful purpose.',
        new: 'to verify the U.S. citizenship and immigration status of individual, to include naturalized, derived, and U.S. citizens by birth … (4) conducting a background investigation; (5) voter verification or (6) any other lawful purpose.',
        flags: ['U.S. citizens by birth', 'voter verification'],
        why: 'SAVE previously checked the status of immigrants and naturalized citizens. The new purpose adds people born in the U.S. and voter verification, which is how states are now using it to review their voter rolls.'
      },
      {
        section: 'Who’s covered',
        old: '(2) individuals who have been granted naturalized or derived U.S. citizenship;',
        new: '(2) individuals who are U.S. citizens, including those who are U.S. citizens by birth, and naturalized or acquired U.S. citizens;',
        flags: ['U.S. citizens by birth'],
        why: 'The old notice did not cover U.S.-born citizens. Adding them is what allowed states to submit entire voter rolls, at least 67 million registrations by May 2026.'
      },
      {
        section: 'What’s collected',
        old: 'Social Security number (SSN) (in very limited circumstances using the Form G-845, Document Verification Request);',
        new: 'Social Security number (full and truncated) or other alternate number issued by the SSA (e.g., Individual Tax Identification Number (ITIN);',
        flags: ['full and truncated'],
        why: 'SAVE used to collect Social Security numbers only in limited cases; now they are a standard search field. Social Security citizenship records can be out of date for people who naturalized after getting their number, which can cause citizens to be flagged.'
      },
      {
        section: 'Where the data comes from',
        old: '',
        oldNote: 'The 2020 notice listed no Social Security Administration system as a source.',
        new: 'SSA-60-0058 Master Files of Social Security Number Holders and Social Security Number Applications, February 20, 2025 (90 FR 10025)',
        flags: ['Master Files of Social Security Number Holders'],
        why: 'SAVE now draws on Social Security’s master file, which covers nearly everyone with an SSN. A federal judge later ruled that the overhaul violated the Privacy Act and the Social Security Act, though that ruling is currently on hold.'
      },
      {
        section: 'Routine use I: who can receive SAVE data',
        old: 'To approved Federal, state, tribal, and local government agencies for any legally mandated purpose in accordance with their authorizing statute or law and when an approved Memorandum of Agreement (MOA) or Computer Matching Agreement (CMA) is in place between DHS and the entity.',
        new: 'To approved federal, state, territorial, tribal, and local government agencies for any legally mandated purpose (e.g., benefits, licensing, voter verification) in accordance with their authorizing statute or law and when an approved agreement (e.g., Memorandum of Agreement (MOA) or Computer Matching Agreement (CMA) is in place between DHS and the entity.',
        flags: ['voter verification)'],
        why: 'This routine use is how SAVE results reach state election officials, who have used them to send notices to voters and cancel registrations.'
      },
      {
        section: 'New routine use L',
        old: '',
        new: 'To the Social Security Administration and other federal, state, tribal, territorial, local, governments and other authorized entities to assist user agencies determine U.S. citizenship and immigration status of an individual when a DHS approved agreement is in place between DHS and the entity.',
        flags: ['other authorized entities'],
        why: 'Combined Social Security and DHS data can be shared with “other authorized entities,” a term the routine use does not define.'
      }
    ],
    status: 'In League of Women Voters v. DHS, a federal court vacated the overhauled SAVE system and its notices on June 22, 2026. The Supreme Court stayed that ruling on Sept. 25, 2026, so the expanded SAVE is operating while the appeal continues.'
  },
  {
    id: 'ssa',
    tag: 'SSA · NUMIDENT',
    agency: 'Social Security Administration',
    system: 'SSA 60-0058 · Master Files of Social Security Number Holders and SSN Applications (the “Numident”)',
    title: 'SSA shared citizenship data with DHS months before publishing a notice',
    blurb: 'Under a May 2025 agreement, SSA data on millions of Americans went into DHS’s SAVE system. SSA did not publish a notice covering that disclosure until November.',
    dek: 'SSA did not change the stated purposes of its master file. Instead, it added a routine use allowing it to give DHS the citizenship status of “any individual.” Reporting shows the data was already being shared with DHS by May 2025.',
    priorLabel: 'Feb. 2025 notice', newLabel: 'Nov. 2025 notice',
    notices: [
      { label: 'Prior notice', cite: '90 FR 10025', date: 'Feb. 20, 2025', url: 'https://www.govinfo.gov/content/pkg/FR-2025-02-20/html/2025-02850.htm' },
      { label: 'Rewritten notice', cite: '90 FR 50879', date: 'Nov. 12, 2025', url: 'https://www.govinfo.gov/content/pkg/FR-2025-11-12/html/2025-19849.htm' }
    ],
    timeline: [
      { date: 'Feb. 20, 2025', text: 'Prior notice published with 48 routine uses.' },
      { date: 'May 15, 2025', text: 'SSA–DHS agreement puts Social Security data into SAVE.', harm: true },
      { date: 'Aug. 26, 2025', text: 'Whistleblower alleges DOGE staff copied the Numident to a poorly secured cloud.', harm: true },
      { date: 'Nov. 12, 2025', text: 'Notice adds routine use 49 for DHS.' },
      { date: 'Dec. 12, 2025', text: 'New routine uses take effect.' }
    ],
    news: [
      { outlet: 'NPR', date: 'June 29, 2025', headline: 'The Trump administration is building a national citizenship data system', url: 'https://www.npr.org/nx-s1-5409608' },
      { outlet: 'ProPublica', date: 'Oct. 30, 2025', headline: 'Details of DHS Agreement Reveal Risks of Trump Administration’s Use of Social Security Data for Voter Citizenship Checks', url: 'https://www.propublica.org/article/dhs-social-security-data-voter-citizenship-trump' },
      { outlet: 'NPR', date: 'Aug. 26, 2025', headline: 'Whistleblower says Trump officials copied millions of Social Security numbers', url: 'https://www.npr.org/2025/08/26/nx-s1-5517977/social-security-doge-privacy' }
    ],
    changes: [
      {
        section: 'New routine use 49',
        old: '',
        new: '49. To DHS, information regarding the citizenship and immigration status, lawful or unlawful, of any individual pursuant to 8 U.S.C. 1373(a).',
        flags: ['citizenship and immigration status, lawful or unlawful, of any individual'],
        why: '“Any individual” includes nearly everyone with a Social Security number, including people born in the U.S. This is the disclosure that supports SAVE’s voter citizenship checks.'
      },
      {
        section: 'Effective date',
        old: '',
        new: "The system of records notice (SORN) is applicable upon its publication in today's Federal Register, with the exception of the new routine uses, which are effective December 12, 2025.",
        flags: ['effective December 12, 2025.'],
        why: 'News reports and court records show SSA data was already going into SAVE by May 2025. The public notice and 30-day comment period came months later.'
      },
      {
        section: 'New routine use 50',
        old: '',
        new: "50. To the U.S. Department of the Treasury, when disclosure of the information is relevant to review SSA's payment and award eligibility through the Do Not Pay Working System for the purposes of identifying, preventing, or recouping improper payments to an applicant for, or recipient of, Federal funds …",
        flags: ['Do Not Pay Working System'],
        why: 'This opens the master file to another federal data-matching system, as part of a wider effort to combine personal data across agencies.'
      },
      {
        section: 'Routine use 2',
        old: '2. To Federal, State, and local entities to assist them with administering income maintenance and health-maintenance programs, when a Federal statute authorizes them to use the SSN.',
        new: '',
        flags: [],
        why: 'SSA removed this routine use as “duplicative.” It has little practical effect on privacy; we include it so every change is shown.'
      },
      {
        section: 'What’s collected',
        old: "a citizenship code that identifies the number holder's status as a U.S. citizen or the work authorization of a non-citizen;",
        new: "a citizenship code that identifies the number holder's status as a U.S. citizen or the work authorization of a non-citizen;",
        flags: ['a citizenship code'],
        why: 'This text did not change, but the data is now shared with DHS. SSA records citizenship when a number is issued, so the code may be outdated for people who later naturalized. That can lead to a citizen being flagged as a noncitizen.'
      }
    ],
    status: 'The June 22, 2026 ruling in League of Women Voters v. DHS set aside this notice along with DHS’s SAVE notice. The Supreme Court stayed that ruling on Sept. 25, 2026; the appeal is pending.'
  },
  {
    id: 'snap',
    tag: 'USDA · SNAP',
    agency: 'Department of Agriculture · Food and Nutrition Service',
    system: 'USDA/FNS-15 · National SNAP Information Database',
    title: 'USDA builds a federal database of every SNAP applicant',
    blurb: 'At least 27 states gave USDA data on people receiving food assistance after the department demanded it. USDA is checking recipients against DHS’s SAVE immigration database.',
    dek: 'In June 2025, USDA created a new federal system covering everyone who has applied for SNAP. It includes home addresses and allows sharing with law enforcement agencies “whether Federal, foreign, State, local, or tribal.” USDA then asked every state for years of records.',
    priorLabel: 'FNS-5 (2010)', newLabel: 'FNS-15 (2025)',
    compareNote: 'FNS-15 is a brand-new system, so there is no earlier version. We compare it with USDA/FNS-5, the closest earlier SNAP notice, which covered only people disqualified for fraud.',
    notices: [
      { label: 'Closest prior notice (FNS-5)', cite: '75 FR 81205', date: 'Dec. 27, 2010', url: 'https://www.govinfo.gov/content/pkg/FR-2010-12-27/html/2010-32457.htm' },
      { label: 'New system (FNS-15)', cite: '90 FR 26521', date: 'June 23, 2025', url: 'https://www.govinfo.gov/content/pkg/FR-2025-06-23/html/2025-11463.htm' }
    ],
    timeline: [
      { date: 'Dec. 27, 2010', text: 'Federal SNAP file limited to people disqualified for fraud.' },
      { date: 'June 23, 2025', text: 'New FNS-15 notice covers every applicant.' },
      { date: 'July 2025', text: 'USDA widens its demand to five years of data on all household members.', harm: true },
      { date: 'Oct. 2025', text: 'At least 27 states have complied; a court bars USDA from cutting funds to states that refuse.', harm: true },
      { date: 'June 15, 2026', text: 'Revised notice drops “foreign” and ties sharing to the Food and Nutrition Act.' }
    ],
    news: [
      { outlet: 'NPR', date: 'July 24, 2025', headline: 'As USDA begins gathering data on food stamp recipients, it widens its ask of states', url: 'https://www.npr.org/2025/07/24/nx-s1-5476642/snap-usda-data-privacy' },
      { outlet: 'NPR', date: 'Oct. 16, 2025', headline: 'At least 27 states turned over sensitive data about food stamp recipients to USDA', url: 'https://www.npr.org/2025/10/16/nx-s1-5533045/snap-privacy-usda-lawsuit' },
      { outlet: 'AP via Colorado Politics', date: 'Sept. 19, 2025', headline: 'Judge blocks USDA from collecting data about SNAP applicants in 21 states', url: 'https://www.coloradopolitics.com/2025/09/19/judge-blocks-usda-from-collecting-data-about-snap-applicants-in-21-states/' }
    ],
    changes: [
      {
        section: 'Purpose of the system',
        old: 'To facilitate the Congressional mandate to increase the severity of disqualifications from SNAP for repeated instances of fraudulently obtaining SNAP benefits and to verify eligibility of applicants for SNAP benefits.',
        new: 'USDA will leverage data-sharing across Federal and State systems to identify and rectify any ineligible, duplicate, or fraudulent SNAP enrollments or transactions. This includes verifying eligibility based on immigration status, identifying and eliminating duplicate enrollments, assisting States in mitigating identity theft, and performing other eligibility and program integrity checks using lawfully shared internal and interagency data.',
        flags: ['verifying eligibility based on immigration status', 'data-sharing across Federal and State systems'],
        why: 'The earlier system was focused on penalizing repeat fraud. The new one is built for cross-agency checks on all recipients and names immigration status specifically. NPR later reported that USDA is running SNAP data through DHS’s SAVE system.'
      },
      {
        section: 'Who’s covered',
        old: 'The system consists of information about individuals who have been disqualified from SNAP participation for intentionally violating SNAP regulations.',
        new: 'Individuals who have received, are currently receiving, or have applied to receive SNAP benefits.',
        flags: ['have applied to receive'],
        why: 'The federal file used to cover only people disqualified for fraud. It now covers anyone who has applied for benefits, which is tens of millions of people.'
      },
      {
        section: 'What’s collected',
        old: '(first name, middle initial, last name, Social Security number (SSN), date of birth, and sex) about individuals disqualified from SNAP and information identifying the location, date(s) and length(s) of any disqualification determined and imposed.',
        new: '… including but not limited to SNAP participant name, Social Security Number (SSN), date of birth (DOB), residential address, Electronic Benefit Transaction (EBT) card number, and case record identifier number or other identifiers or data elements maintained by States, vendors, or contractors to identify SNAP recipients.',
        flags: ['residential address', 'other identifiers or data elements', 'including but not limited to'],
        why: 'Adding home addresses makes the database useful for locating people. The open-ended reference to “other identifiers or data elements” gave USDA room to ask states for immigration status and information on other household members.'
      },
      {
        section: 'Routine use 8: law enforcement',
        old: 'Records contained in this system may be disclosed, as part of a computer matching program or otherwise, to State agency personnel responsible for investigating or prosecuting violations of SNAP regulations, and to Federal, State, and local officials responsible for administration of SNAP.',
        new: 'When a record on its face, or in conjunction with other records, indicates a violation or potential violation of law, whether civil, criminal or regulatory in nature … USDA/FNS may disclose the record to the appropriate agency, whether Federal, foreign, State, local, or tribal, or other public authority responsible for enforcing, investigating, or prosecuting such violation …',
        flags: ['potential violation of law', 'Federal, foreign, State, local, or tribal'],
        why: 'Sharing could be triggered by any “potential violation of law,” including immigration law, and records could go to any enforcement agency, including foreign ones. A federal judge said uses like this go “well beyond those permitted” by law. USDA removed “foreign” in June 2026.'
      },
      {
        section: 'Routine use 11: other agencies',
        old: '',
        oldNote: 'FNS-5 had no equivalent routine use.',
        new: 'To support another Federal agency or to an instrumentality of any governmental jurisdiction within or under the control of the United States (including any State or local governmental agency), that administers, or that has the authority to investigate or assist USDA to investigate potential fraud, waste, or abuse in, a Federal benefits program funded in whole or in part by Federal funds …',
        flags: ['a Federal benefits program'],
        why: 'SNAP data can go to any agency that investigates any federally funded program, matching the cross-agency sharing called for in an executive order on “information silos.” This routine use is being challenged in court along with routine use 8.'
      },
      {
        section: 'How long it’s kept',
        old: '',
        oldNote: 'Not compared: FNS-5 covered a different, much smaller set of records.',
        new: 'All records in this system will be kept indefinitely unless otherwise required by law until NARA has approved a records schedule for this system.',
        flags: ['kept indefinitely'],
        why: 'The notice sets no deletion schedule, so records on every applicant will be kept until the National Archives approves one.'
      }
    ],
    status: 'Courts have barred USDA from cutting off SNAP funds to states that refuse to hand over data (State of California v. USDA, N.D. Cal.). A separate challenge to routine uses 8 and 11 (Pallek v. Rollins, D.D.C.) is pending. In June 2026 the Justice Department sued four states to force them to turn over data.'
  },
  {
    id: 'ice',
    tag: 'DHS · ICE',
    agency: 'Department of Homeland Security · ICE',
    system: 'DHS/ICE-006 · ICE Intelligence Records System (IIRS)',
    title: 'ICE expands its intelligence records to include critics, social media, and location data',
    blurb: 'DHS sent hundreds of subpoenas to tech companies seeking the identities of people behind accounts that track or criticize ICE. A 2025 notice had already expanded ICE’s intelligence records to cover this kind of information.',
    dek: 'A July 2025 notice added new categories to ICE’s intelligence system, including people who make “credible threats” against ICE, social media accounts and IP addresses, commercially available location data, and facial images. Later reporting described DHS trying to identify anonymous ICE critics and buying a tool that tracks phones across entire neighborhoods.',
    caveat: 'Public records don’t show which ICE system stores the results of these subpoenas or purchases. The notice does show that ICE gave itself permission to keep this kind of data in its intelligence system.',
    priorLabel: '2010 notice', newLabel: '2025 notice',
    notices: [
      { label: 'Prior notice', cite: '75 FR 9233', date: 'Mar. 1, 2010', url: 'https://www.govinfo.gov/content/pkg/FR-2010-03-01/html/2010-4102.htm' },
      { label: 'Rewritten notice', cite: '90 FR 34282', date: 'July 21, 2025', url: 'https://www.govinfo.gov/content/pkg/FR-2025-07-21/html/2025-13613.htm' }
    ],
    timeline: [
      { date: 'Mar. 1, 2010', text: 'Prior notice for ICE’s intelligence records.' },
      { date: 'July 21, 2025', text: 'Rewritten notice adds social media, location, and biometric data.' },
      { date: 'Oct. 2025', text: 'ICE seeks a round-the-clock social media surveillance team.', harm: true },
      { date: 'Jan. 2026', text: 'Report details an ICE tool that monitors phones across whole neighborhoods.', harm: true },
      { date: 'Feb. 2026', text: 'DHS subpoenas tech companies for the identities behind anti-ICE accounts.', harm: true }
    ],
    news: [
      { outlet: 'New York Times (syndicated)', date: 'Feb. 13, 2026', headline: 'Homeland Security wants social media sites to expose anti-ICE accounts', url: 'https://www.hawaiitribune-herald.com/2026/02/14/nation-world-news/homeland-security-wants-social-media-sites-to-expose-anti-ice-accounts/' },
      { outlet: '404 Media', date: 'Jan. 8, 2026', headline: 'Inside ICE’s Tool to Monitor Phones in Entire Neighborhoods', url: 'https://www.404media.co/inside-ices-tool-to-monitor-phones-in-entire-neighborhoods/' },
      { outlet: 'Engadget', date: 'Oct. 5, 2025', headline: 'ICE is planning to create a surveillance team that hunts for leads on social media', url: 'https://www.engadget.com/social-media/ice-is-planning-to-create-a-surveillance-team-that-hunts-for-leads-on-social-media-163743143.html' }
    ],
    changes: [
      {
        section: 'Who’s covered: perceived threats to ICE',
        old: '',
        new: '(13) Individuals who have made credible threats against ICE personnel or facilities.',
        flags: ['credible threats against ICE personnel or facilities.'],
        why: 'People can now be included in ICE’s intelligence system based on their conduct toward ICE. DHS has defended its subpoenas for critics’ identities as a way to protect officers.'
      },
      {
        section: 'Who’s covered: people suspected of nothing',
        old: '',
        new: '(7) Individuals not implicated in activities in violation of laws enforced or administered by ICE, but with pertinent knowledge of some circumstance of a case or record subject.',
        flags: ['not implicated'],
        why: 'People who are not suspected of anything, such as witnesses, neighbors, or bystanders, can now have records in the intelligence system.'
      },
      {
        section: 'What’s collected: online activity',
        old: '(12) Articles, public-source data, and other published information on individuals and events of interest to ICE;',
        new: 'Articles, public-source data, and other published information on individuals and events of interest to ICE, including social media account information and social media posts, internet protocol addresses, and usernames;',
        flags: ['social media account information and social media posts, internet protocol addresses, and usernames;'],
        why: 'Usernames and IP addresses can be used to identify the people behind anonymous accounts, which is what DHS’s subpoenas to tech companies were trying to do.'
      },
      {
        section: 'What’s collected: location',
        old: '',
        oldNote: 'The 2010 notice had no location-records category.',
        new: 'Location-Related Records, including geotags from metadata associated with other record categories collected; geolocation information derived from authorized law enforcement activities, ICE-owned devices, witness accounts, or commercially available data; …',
        flags: ['commercially available data;'],
        why: 'Buying location data from brokers can let an agency avoid getting a warrant. 404 Media reports that an internal ICE legal analysis says the phone-tracking tool ICE bought can be searched without one.'
      },
      {
        section: 'What’s collected: biometrics',
        old: '',
        new: 'Biometric information, including facial images, iris images, and fingerprints;',
        flags: ['facial images,'],
        why: 'Storing face, iris, and fingerprint data alongside social media and location records makes it easier to connect a person’s face to their name, accounts, and whereabouts.'
      },
      {
        section: 'Purpose of the system',
        old: '(e) To identify potential criminal activity, immigration violations, and threats to homeland security',
        new: '(e) To identify potential criminal activity, immigration violations; threats to homeland security, ICE personnel, and ICE facilities',
        flags: ['ICE personnel, and ICE facilities'],
        why: 'Protecting ICE personnel and facilities is now a stated purpose of the system. DHS has given the same reason for seeking the identities of its critics.'
      }
    ],
    status: 'We found no court challenge to the notice itself. In January 2026, DHS withdrew a subpoena seeking the people behind the Montco Community Watch account two days after a court hearing on the ACLU’s motion to quash it.'
  }
];
