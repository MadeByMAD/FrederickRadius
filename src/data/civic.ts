import type { Meeting, Representative } from '../types';

export const CIVIC_DIRECTORY_NOTE =
  'County-wide directory only. Frederick Radius does not yet resolve district-specific representation from a searched address.';

export const MEETING_SNAPSHOT_NOTE =
  'Meeting dates are a manual snapshot verified against official county pages. This panel is not a live calendar feed yet.';

const VERIFIED_DATE = '2026-04-08';
const COUNTY_OFFICIALS_URL = 'https://www.frederickcountymd.gov/1649/Elected-Officials-List';
const STATE_ROSTER_URL = 'https://mgaleg.maryland.gov/pubs-current/current-roster-by-county.pdf';
const COUNTY_CALENDAR_URL = 'https://www.frederickcountymd.gov/Calendar.aspx';
const SENATE_MD_URL = 'https://www.senate.gov/states/MD/senators.htm';
const HOUSE_MD6_URL = 'https://www.congress.gov/member/april-mcclain-delaney/M001231';

export const countyRepresentatives: Representative[] = [
  { name: 'Jessica Fitzwater', title: 'County Executive', level: 'county', phone: '301-600-1100', website: 'https://www.frederickcountymd.gov/countyexecutive', sourceUrl: COUNTY_OFFICIALS_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Brad Young', title: 'County Council President', level: 'county', district: 'At-Large', sourceUrl: COUNTY_OFFICIALS_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Kavonte Duckett', title: 'County Council Vice-President', level: 'county', district: 'District 4', sourceUrl: COUNTY_OFFICIALS_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Renee Knapp', title: 'Council Member', level: 'county', district: 'At-Large', sourceUrl: COUNTY_OFFICIALS_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Jerry Donald', title: 'Council Member', level: 'county', district: 'District 1', sourceUrl: COUNTY_OFFICIALS_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Steve McKay', title: 'Council Member', level: 'county', district: 'District 2', sourceUrl: COUNTY_OFFICIALS_URL, verifiedDate: VERIFIED_DATE },
  { name: 'M. C. Keegan-Ayer', title: 'Council Member', level: 'county', district: 'District 3', sourceUrl: COUNTY_OFFICIALS_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Mason Carter', title: 'Council Member', level: 'county', district: 'District 5', sourceUrl: COUNTY_OFFICIALS_URL, verifiedDate: VERIFIED_DATE },
];

export const stateRepresentatives: Representative[] = [
  { name: 'Karen Lewis Young', title: 'State Senator', level: 'state', district: 'District 3', party: 'D', sourceUrl: STATE_ROSTER_URL, verifiedDate: VERIFIED_DATE },
  { name: 'William Folden', title: 'State Senator', level: 'state', district: 'District 4', party: 'R', sourceUrl: STATE_ROSTER_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Justin Ready', title: 'State Senator', level: 'state', district: 'District 5', party: 'R', sourceUrl: STATE_ROSTER_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Christopher Eric Bouchat', title: 'Delegate', level: 'state', district: 'District 5', party: 'R', sourceUrl: STATE_ROSTER_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Barrie S. Ciliberti', title: 'Delegate', level: 'state', district: 'District 4', party: 'R', sourceUrl: STATE_ROSTER_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Kris Fair', title: 'Delegate', level: 'state', district: 'District 3', party: 'D', sourceUrl: STATE_ROSTER_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Kenneth Kerr', title: 'Delegate', level: 'state', district: 'District 3', party: 'D', sourceUrl: STATE_ROSTER_URL, verifiedDate: VERIFIED_DATE },
  { name: 'April Miller', title: 'Delegate', level: 'state', district: 'District 4', party: 'R', sourceUrl: STATE_ROSTER_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Jesse T. Pippy', title: 'Delegate', level: 'state', district: 'District 4', party: 'R', sourceUrl: STATE_ROSTER_URL, verifiedDate: VERIFIED_DATE },
  { name: 'April Rose', title: 'Delegate', level: 'state', district: 'District 5', party: 'R', sourceUrl: STATE_ROSTER_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Karen Simpson', title: 'Delegate', level: 'state', district: 'District 3', party: 'D', sourceUrl: STATE_ROSTER_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Chris Tomlinson', title: 'Delegate', level: 'state', district: 'District 5', party: 'R', sourceUrl: STATE_ROSTER_URL, verifiedDate: VERIFIED_DATE },
  { name: 'William Valentine', title: 'Delegate', level: 'state', district: 'District 2A', party: 'R', sourceUrl: STATE_ROSTER_URL, verifiedDate: VERIFIED_DATE },
  { name: 'William Wivell', title: 'Delegate', level: 'state', district: 'District 2A', party: 'R', sourceUrl: STATE_ROSTER_URL, verifiedDate: VERIFIED_DATE },
];

export const federalRepresentatives: Representative[] = [
  { name: 'April McClain Delaney', title: 'U.S. Representative', level: 'federal', district: 'MD-6', party: 'D', sourceUrl: HOUSE_MD6_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Chris Van Hollen', title: 'U.S. Senator', level: 'federal', party: 'D', sourceUrl: SENATE_MD_URL, verifiedDate: VERIFIED_DATE },
  { name: 'Angela Alsobrooks', title: 'U.S. Senator', level: 'federal', party: 'D', sourceUrl: SENATE_MD_URL, verifiedDate: VERIFIED_DATE },
];

// TODO: Replace this manual snapshot with a structured calendar ingestion workflow.
// The current dates are useful as a reference, but they should never be presented as a live feed.
export const upcomingMeetings: Meeting[] = [
  {
    id: 'cc-1',
    title: 'County Council Regular Session',
    body: 'Frederick County Council',
    date: '2026-04-14',
    time: '5:30 PM',
    location: 'Winchester Hall, 12 E Church St, Frederick',
    type: 'council',
    status: 'manual-snapshot',
    sourceUrl: COUNTY_CALENDAR_URL,
    verifiedDate: VERIFIED_DATE,
  },
  {
    id: 'cc-2',
    title: 'County Council Regular Session',
    body: 'Frederick County Council',
    date: '2026-04-21',
    time: '5:30 PM',
    location: 'Winchester Hall, 12 E Church St, Frederick',
    type: 'council',
    status: 'manual-snapshot',
    sourceUrl: COUNTY_CALENDAR_URL,
    verifiedDate: VERIFIED_DATE,
  },
  {
    id: 'pc-1',
    title: 'Planning Commission Meeting',
    body: 'Frederick County Planning Commission',
    date: '2026-04-08',
    time: '7:00 PM',
    location: 'Winchester Hall, 12 E Church St, Frederick',
    type: 'planning',
    status: 'manual-snapshot',
    sourceUrl: COUNTY_CALENDAR_URL,
    verifiedDate: VERIFIED_DATE,
  },
  {
    id: 'pc-2',
    title: 'Planning Commission Meeting',
    body: 'Frederick County Planning Commission',
    date: '2026-04-22',
    time: '7:00 PM',
    location: 'Winchester Hall, 12 E Church St, Frederick',
    type: 'planning',
    status: 'manual-snapshot',
    sourceUrl: COUNTY_CALENDAR_URL,
    verifiedDate: VERIFIED_DATE,
  },
  {
    id: 'ba-1',
    title: 'Board of Appeals Hearing',
    body: 'Frederick County Board of Appeals',
    date: '2026-04-15',
    time: '9:00 AM',
    location: 'Winchester Hall, 12 E Church St, Frederick',
    type: 'appeals',
    status: 'manual-snapshot',
    sourceUrl: COUNTY_CALENDAR_URL,
    verifiedDate: VERIFIED_DATE,
  },
  {
    id: 'ws-1',
    title: 'County Council Work Session',
    body: 'Frederick County Council',
    date: '2026-04-09',
    time: '10:00 AM',
    location: 'Winchester Hall, 12 E Church St, Frederick',
    type: 'council',
    status: 'manual-snapshot',
    sourceUrl: COUNTY_CALENDAR_URL,
    verifiedDate: VERIFIED_DATE,
  },
];
