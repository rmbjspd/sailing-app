# Cap'n Dutch Harlan's route critique: Winthrop Harbor to Old Saybrook

*Read-only review by a subagent. Nothing in the repo was changed. I (the main session) have not independently verified these figures. All nm figures are the reviewer's own great-circle or track estimates, not charted distances.*

The overall shape of the plan is sound. The worst problems are three itinerary numbers that are plainly wrong (the canal days, the Hudson days, and Days 34-35), plus a Hell Gate instruction that is backwards.

## Top 5, do these first
1. **[MUST FIX] Erie Canal Days 21-23 are mis-sized.** Pittsford to Brewerton is about 101 statute miles with 9 locks, not 68. Fix: end Day 22 at Lyons or Newark, not Pittsford.
2. **[MUST FIX] Days 34-35 distances and text are wrong.** Day 34 is about 55 nm, Day 35 is about 21 nm, and the Race is not on the Greenport to Saybrook route at all. Consider a direct Port Jefferson to Old Saybrook day (about 38 nm).
3. **[MUST FIX] Hell Gate advice is backwards for eastbound.** You want the flood (it sets toward the Sound), not "a favorable ebb". The baked track also runs the East Channel of Roosevelt Island, which has a lift bridge with about 40 ft closed clearance. The mast is stepped by then.
4. **[MUST FIX] Day 1 warning says "be in by 3pm".** That is arithmetically impossible for 78 nm. Rewrite Day 1 around real times and a go/no-go rule, and reconsider using the Day 2 slot as a second travel day via St. Joseph.
5. **[MUST FIX] Hudson Days 29-30 are mislabeled.** They are 33 nm and 65 nm, not 60 and 75. The plan's own text says Catskill is mile 112, so the days are statute miles mislabeled as nm.

## 1. Day 1, Winthrop Harbor to Grand Haven (78 nm)

**Verdict [SHOULD FIX]:** Doable for a 30-footer with a prepared crew. Not reckless, but a poor Day 1, and the text around it is wrong.

**Timing (reviewer's arithmetic).**
- 78 nm is 13.0 h at 6.0 kt and 14.2 h at 5.5 kt.
- Solar times from the NOAA solar equations: civil twilight 04:38 CDT, sunrise 05:13 CDT. Sunset at Grand Haven is 21:27 EDT.
- Depart 04:45 CDT and you arrive about 18:45 to 19:45 EDT (Grand Haven is an hour ahead).
- "Plan to be in by 3pm" would need about 9.9 kt. Delete it.
- The itinerary never mentions the Central to Eastern time change.

**Exposure.**
- From the midpoint, the nearest Michigan harbors are Holland (about 35 nm), South Haven (about 39 nm) and Saugatuck (about 35 nm).
- Racine is a bail-out for roughly the first 2-3 hours only.
- That is 5-6 hours with nowhere to go, on a day when the crew is untested.
- June 19, 2027 is a full moon, which helps if a delay pushes you into dark.

**Water temperature and weather.**
- Southern-basin surface temps in mid-June run 50s to low 60s F, colder after cloudy spells. Sources: [CIMSS mid-June lake temperature blog](https://cimss.ssec.wisc.edu/satellite-blog/archives/41133) and [WOOD-TV beach and boating note](https://digital-release.woodtv.com/?p=76743).
- Warm moist air over cold water makes fog.
- Thunderstorm complexes from Wisconsin and Illinois tend to cross the lake late in the day or at night (general knowledge, not sourced).
- Check the NWS open-lake forecast and NDBC buoy 45007 (South Michigan) at 04:00, and check Special Marine Warnings.

**Alternatives (great-circle estimates, not charted distances).**

| Option | Legs | Total | Days |
|---|---|---|---|
| A. Current: direct to Grand Haven | 78 | 78 nm | 1 |
| B. **Reviewer's pick:** Winthrop to St. Joseph, then St. Joseph to Grand Haven | 62 + 58 | 120 nm | 2 |
| C. Shore-hug via Chicago | 38 + 52 + 58 | 148 nm | 3 |
| D. West shore to Milwaukee, then cross | 34 + 73 | 107 nm | 2 |

- Option D is pointless. You still make a 70+ nm crossing and only moved it.
- Option B uses the Day 2 rest slot as a travel day and shortens the exposed day by about 16 nm. It means arriving by mid-afternoon, then a shore-hugging Day 2 with harbors every 20 nm or so. The cost is spending your only early buffer.
- If you keep the direct run, make it conditional:
  - Go/no-go at 04:00.
  - A "point of no return" about 20 nm out.
  - A float plan and check-in schedule.
  - PLBs and tethers worn from the dock.

**Buffer placement [SHOULD FIX].**
- A buffer only absorbs delays that happen before it. Day 2 covers only Day 1. Day 6 covers only Days 3-5.
- Days 7-19 (Georgian Bay, the Ontario lee shore, Lake Erie) have no buffer except Day 31. Day 20 is tied to a crane booking.
- Do not spend a day at Grand Haven "resting" if all is well. Bank it, and use it at Killarney, Kincardine or Erie.

**Day 3 [NICE TO HAVE].** Muskegon is about 11 nm north of Grand Haven, not "40 nm". Grand Haven to Ludington is about 55 nm, not 80 (straight line 54; track 64).

## 2. Port Jefferson to Greenport to Old Saybrook (Days 34-35)

**Which distances are right: the track is.**
- The itinerary says 40 and 50. The track says about 55 and about 21.
- Day 34 must go through Plum Gut to reach Greenport (Port Jefferson to the Gut is about 41 nm, then about 13 nm more).
- Day 35 is Greenport to Plum Gut (about 13 nm) plus Plum Gut to the Saybrook breakwater (about 8.5 nm).
- Race Rock is about 13 nm east of the Saybrook entrance, nowhere near Greenport to Saybrook. Delete "Plum Gut to Race Rock" and "cross Race Rock near slack" from Day 35 and from `legGuides.ts`. The Race only matters if you detour to Fishers Island or Mystic.

**Option: direct Port Jefferson to Old Saybrook [SHOULD FIX].**
- Port Jefferson to the Saybrook breakwater is about 37 nm, marina to marina about 42 nm (about 7 h).
- It avoids both Plum Gut and the Race and keeps the SW breeze behind you.
- You lose the Greenport stop and gain a day.
- Watch the Long Sand Shoal area and use the marked Saybrook channel.

**NOAA predicted currents for the actual dates (Day 34 = Jul 22, Day 35 = Jul 23, 2027, EDT).** Full moon is Jul 18, so these are near-spring currents.
- Plum Gut (LIS1012): flood sets 306 deg (into the Sound), ebb 116 deg.
  - Jul 22: slack 08:12, flood max 2.1 kt at 10:48, slack 13:59, ebb max 3.1 kt at 16:37.
  - Jul 23: slack 08:50, flood max 2.0 kt at 11:19, slack 14:36, ebb max 3.1 kt at 17:20.
- The Race (LIS1001):
  - Jul 22: slack 08:52, flood max 3.3 kt at 11:43, slack 14:44, ebb max 4.1 kt at 17:53.
  - Jul 23: slack 09:26, flood max 3.3 kt at 12:19, slack 15:21, ebb max 4.1 kt at 18:32.
- Saybrook Channel, inside the river mouth (LIS1015), Jul 23: ebb max 2.0 kt at 07:02, slack 10:42, flood max 1.5 kt at 13:24, slack 16:02.

**Timing that works.**
- Day 34, eastbound, wants the ebb at Plum Gut. Leave Port Jefferson about 07:00 and reach the Gut around 14:00 as the ebb starts. Greenport is about 2 h later.
- Day 35, westbound, wants the flood. Leave Greenport about 08:00-08:30 to hit the Gut near max flood at 10:30-11:00. Reach the Saybrook entrance around 12:30-13:00, just as the river current turns fair.
- If you go direct on Day 34, leave Port Jefferson about 06:30 to reach the entrance on the early flood.
- Avoid a strong ebb against a SW breeze at the Connecticut River bar.

**Day 33 [SHOULD FIX].** Oyster Bay to Port Jefferson is about 22-27 nm, not 38. Day 32 plus Day 33 is only about 56 nm. With the fair flood through the East River, you can reach Port Jefferson on Day 32, or even skip to a direct run to Saybrook.

## 3. Day by day

Distances are the reviewer's great-circle or track estimates. The itinerary's total of 1,661 nm would drop to roughly 1,530-1,570 nm if corrected.

**Lake Michigan and North Channel**
- **D1-D2:** see section 1.
- **D4 [NICE TO HAVE]:** A true Ludington to Leland run is about 72 nm; the baked track says 87 because of an offshore detour. Manitou Passage warning is fine.
- **D5 [NICE TO HAVE]:** The "2-3 kt" Straits current is unverified. Expect mostly under 2 kt (Coast Pilot 6 not checked).
- **D7 [SHOULD FIX]:** The itinerary and the VIA comment say the route goes "through Les Cheneaux". The track runs about 3.5-4 nm south of Hessel and Cedarville in open water. Either change the text or add VIA points (section 4). The Drummond waypoint is about 1.3 nm inland; OSM puts the marina at 46.0243, -83.7495.
- **D8 [SHOULD FIX]:** Meldrum Bay as the "designated port of entry" is unverified. The [CBSA telephone reporting page](https://cbsa-asfc.gc.ca/do-rb/services/trsm-sdtm-eng.html) was down (503). A [2018 Offshore Blue list](https://www.offshoreblue.com/cruise/ca-customs-ports.php) shows only Tobermory in that area, though a 2025 [Waterway Guide review](https://waterwayguide-data.com/reviews/1-1830/meldrum-bay-marina) says the dockmaster helps with clearing. Per the [Offshore Blue customs primer](https://www.offshoreblue.com/cruise/ca-customs.php), you must report on crossing the boundary, so do not anchor before reporting. Non-Canadian/non-US crew means reporting in person at a designated site. Phone 1-888-226-7277 and check CBSA before you go.
- **D10-D11 [SHOULD FIX]:**
  - The Little Current swing bridge is the single point of failure for the east end. The [Expositor](https://manitoulin.com/?p=102503) says it opens "on the hour for about 15 minutes, dawn to dusk" but gave no current schedule that could be confirmed.
  - A [CTV headline from June 17, 2022](https://www.ctvnews.ca/northern-ontario/article/manitoulin-swing-bridge-reopened-closed-to-marine-traffic) says it reopened but stayed closed to marine traffic.
  - Plan your Day 11 departure at a bridge hour, and confirm status with the Ministry of Transportation.
  - Day 11 is about 19-24 nm to Killarney, not 42. The "baie-fine-killarney" waypoint is Killarney village, not The Pool.
- **D12 [NICE TO HAVE]:** Reserve Parks Canada moorings at Tobermory. The track passes within about 1 nm of Cape Hurd (see section 4).

**Lake Huron to Lake Erie**
- **D13 [SHOULD FIX]:** Jul 1, 2027 is a Thursday and Canada Day. The "Saturday bagpiper at sunset" is likely wrong: a [2023 Sarnia News Today story](https://sarnianewstoday.ca/midwestern/news/2023/06/30/kincardine-to-honour-phantom-piper) says the Phantom Piper plays nightly except Saturdays, with the season opening around July 2. Check the 2027 schedule. Confirm fuel at Kincardine; `waypoints.ts` doesn't flag it.
- **D14 [SHOULD FIX]:** Jul 2 is the Friday before the July 4 weekend. You need to choose Sarnia or Port Huron. If you overnight in Sarnia, you must still report to CBP on your first US arrival. The [CBP ROAM note](https://www.cbp.gov/newsroom/local-media-release/cbp-reminds-pleasure-boating-community-reporting-procedures-effect) says the app doesn't cover everyone (e.g. I-94 travelers), and Port Huron acceptance is unconfirmed. Reviewer would stay on the US side at Port Huron.
- **D15 [SHOULD FIX]:** Jul 3 (Saturday) means heavy recreational traffic. The distance is about 53-58 nm, not 68. Lake St. Clair guidance in `legGuides.ts` (line 117) calls the Middle Channel "the marked commercial lane". The reviewer believes the commercial lane is the South Channel/Cutoff; the baked track runs the North and Middle channels. Verify on the chart.
- **D16 [MUST FIX]:** Jul 4 (Sunday) is Put-in-Bay on the holiday. Reserve a mooring months ahead or pick Port Clinton, Middle Bass or Catawba. Distance is about 47 nm, not 55.
- **D17 [SHOULD FIX]:** Put-in-Bay to Cleveland is about 52 nm, not 70.
- **D18 [SHOULD FIX]:** The track sits about 15 nm off the Ohio shore at mid-leg, while the text promises bail-outs at Fairport (about 24 nm) and Ashtabula (about 47 nm). A VIA keeps it about 4-5 nm off (section 4).
- **D19 [SHOULD FIX]:** Erie to Tonawanda is about 83 nm (13+ h), not 70. Better: end Day 19 at Buffalo (about 68-70 nm), then Day 20 goes through Black Rock Lock to Tonawanda (about 15 nm) and the mast comes down that afternoon.

**Erie Canal**
- **D21-D23 [MUST FIX].**
  - Lock mileposts from this [Offshore Blue lock table](http://www.offshoreblue.com/cruise/erie-canal-locks.php) (its E-24/E-25 row has a visible typo): E-33 at 256.4, E-32 at 255.1, E-30 at 239.0, E-28A at 222.3, E-23 at 153.7, E-22 at 124.7, E-17 at 79.0, E-11 at 39.3. Lockport E-34/35 at about 320.7. Tonawanda is about 338.
  - Brockport is about 63 mi from Tonawanda, not 40 (Medina is about 42).
  - Pittsford to Brewerton is about 101 mi with 9 locks. That is a 14-15 h day, not 68 mi.
  - Fix: Day 21 Tonawanda to Brockport (about 63 mi, 2 locks). Day 22 Brockport to Lyons (about 53 mi, 6 locks: E-33, 32, 30, 29, 28B, 28A). Day 23 Lyons to Brewerton (about 68 mi, 5 locks: E-27, 26, 25, 24, 23).
  - That matches the itinerary's 13-lock total and 338 mi. Newark is the alternate stop. Keep Fairport and Newark as fallback walls.
- **Hours [SHOULD FIX].** The 2026 [Canal Corp hours page](https://www.canals.ny.gov/Boating-Information/Boating-Hours) says standard hours are 8:00-18:00, and 8:00-21:00 only at some locks, with E-32, E-33, E-34/35, E-8, E-23 and E-24 among them. The Waterford Flight is "arrival by 5 p.m. recommended". `legGuides.ts` says "7am-5pm, extended to 10pm", which is stale. Confirm 2027 hours in the spring Notice to Mariners.
- **Clearance [NICE TO HAVE].** The 14 ft 6 in target is conservative. [AM Nautical](https://www.amnautical.com/blogs/the-mariners-blog/tips-for-navigating-the-erie-canal-and-the-new-york-state-canal-system) cites a 15.5 ft minimum at normal pool, with high water lower. The "Guard Gate West 14 ft 8 in" figure could not be verified.
- **D27 [NICE TO HAVE].** Amsterdam to Waterford is likely 10 locks (E-11 to E-2), not 9, if Riverlink Park is above E-11.
- **D28 [OK].** The Hop-O-Nose mast-step stop is well known to canal sailors per [Practical Sailor](https://www.practical-sailor.com/sails-rigging-deckgear/standing-rigging/un-stepping-the-mast-for-americas-great-loop-2/) and [Waterway Guide](https://www.waterwayguide.com/reviews/9-538/hop-o-nose-marina) reviews; reviewers call the crane old but usable. Call ahead.

**Hudson and New York**
- **D29-D30 [MUST FIX].**
  - Catskill (mile 112) to Poughkeepsie (mile 75) is 37 statute miles, or about 33 nm. Poughkeepsie to Liberty Landing is about 65 nm.
  - Ebb is long in the upper river. Jul 17, 2027 at Catskill (ACT3781): ebb 03:37 to 11:10, max 2.35 kt at 07:37. At Poughkeepsie (HUR0620): ebb to 09:53, max 2.0 kt at 06:24.
  - Better split: Day 29 Catskill to Newburgh or Cold Spring (about 50 nm, leave around 05:30), Day 30 on to Liberty Landing (about 48 nm).
  - "Ebb 1-2 hours after high water at your location" is a poor rule. Use NOAA current predictions.
- **D30 [NICE TO HAVE].** The NYC waypoint (40.6947, -74.0444) is Liberty Island, about 1.1 nm south of the marina.
- **D32 [MUST FIX].** NOAA Hell Gate (NYH1924) on Jul 20: slack 06:08, flood max 3.2 kt at 09:01 (sets 45 deg), slack 11:53, ebb max 4.3 kt at 15:01. Jul 21: slack 06:44, flood max 3.2 kt at 09:21. Eastbound you ride the flood.
  - Rule of thumb from [Offshore Blue](https://www.offshoreblue.com/cruise/east-river-timing.php): enter at the Battery about 1h45m after Battery low water. Jul 20 Battery low is 04:17, so enter about 06:02; NOAA's Hell Gate slack is 06:08.
  - Throgs Neck is weak (LIS1038 flood max 1.6 kt).
  - Rewrite the warning to say "flood" and give the NOAA station ID.
  - Days 32-35 land just after full moon, so currents are strong; if you slip five days they ease.

## 4. The map

**Reality check on the audit.**
- `audit-route.py` reports only 2.3 nm over land, but the mask is Natural Earth at about 0.7 km per pixel.
- Plum Island does not exist in the mask, and Roosevelt Island is half a pixel wide. So "0 nm over land" cannot catch channel-level errors.

**Verified.** The reviewer ran the bake in a scratch directory with these VIA points and compared the output.
- **Plum Gut [MUST FIX]:** The track cuts across Plum Island, about 1.3 km east of the real Gut. With the VIA below it passes (-72.2087, 41.159), just off the NOAA Plum Gut station.
- **Cleveland to Erie [SHOULD FIX]:** With the VIA below the track stays about 4-5 nm off the Ohio shore instead of about 15 nm.
- **East River [MUST FIX]:** The track follows the East Channel (0.07-0.15 nm from OSM's East Channel line). A VIA does not hold at this resolution; the proposed version still landed within about 0.15 nm of both channels. You need a post-bake override of that stretch.

```python
VIA = {
    # existing
    "drummond-island": [(-84.35, 45.93), (-83.92, 45.975)],
    # Cleveland to Erie: stay about 4 nm off Fairport / Ashtabula / Conneaut (tested)
    "erie-pa": [(-81.28, 41.84), (-80.80, 41.99), (-80.55, 42.06)],
    # Plum Gut: (-72.2075, 41.1592) is NOAA current station LIS1012 (tested)
    "greenport":    [(-72.215, 41.200), (-72.2075, 41.1592), (-72.215, 41.125)],
    "old-saybrook": [(-72.215, 41.125), (-72.2075, 41.1592), (-72.215, 41.200)],
}
# East River: hard-code after simplification (OSM West Channel + Hell Gate centerline):
# (-73.9682,40.7408) (-73.9629,40.7511) (-73.9468,40.7693) (-73.9399,40.7755)
# (-73.9297,40.7792) (-73.9214,40.7831) (-73.9113,40.7927)
```

**Not tested; the VIA is a guess.**
- **Les Cheneaux [SHOULD FIX]:** The track runs outside the islands, in open water south of them. Hessel is at 46.0042, -84.4259 and Cedarville at 45.9984, -84.3641 (OSM). If you want it inside, start with gates around (-84.43, 45.985) and (-84.365, 45.985). Those are approximate and need checking on the NOAA chart.
- **Cape Hurd [SHOULD CHECK]:** The mask lacks the tip of the Bruce Peninsula near Cape Hurd (about 45.24, -81.80). The track passes within about 1 nm. Try a VIA around (-81.86, 45.28) and check it against the CHS chart.
- **Killarney exit [SHOULD CHECK]:** The track leaves Killarney village on a straight chord south. Real exits are the channel ends, not straight through. Unverified.
- **Lake St. Clair [SHOULD CHECK]:** The track follows North and Middle channels through the Flats, not the South Channel/Cutoff. That's a recreational choice, but the text calls the Middle Channel the commercial lane. Reconcile.
- **Black Rock [NICE TO HAVE]:** The track sits 0.35 nm from the Black Rock Channel line, on the river side of Squaw Island. At this resolution it can't be separated.

**Confirmed fine.**
- No Welland: the track goes Buffalo, Black Rock, Niagara River, Tonawanda, Erie Canal.
- The route north of Bois Blanc and up De Tour Passage is right.
- The Detroit River track runs east of Grosse Ile.
- The Hudson and the Erie Canal alignment look right.
- Track length by the numbers: about 1,538 nm total, Catskill to NYC about 95 nm.

**Cosmetic [NICE TO HAVE].** Out-and-back spurs at Grand Haven, Leland, Oyster Bay, Greenport and Pittsford.

## 5. Leave alone
- The overall leg structure and the Day 6 Mackinac rest.
- The Baie Fine splurge.
- Mast down at Tonawanda and up at Catskill.
- Staging at Brewerton for the Oneida Lake crossing.
- Staging at Amsterdam for the Waterford Flight.
- Liberty Landing and the Day 31 layover.
- The route logic of the baked track overall.

## Sources
- NOAA CO-OPS predictions (reviewer's own queries): [Hell Gate NYH1924, Jul 20 2027](https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=currents_predictions&station=NYH1924&begin_date=20270720&end_date=20270720&interval=MAX_SLACK&units=english&time_zone=lst_ldt&format=json&application=review). Same URL pattern for stations LIS1001, LIS1012, LIS1013, LIS1015, LIS1038, ACT3781, HUR0620 and Battery tides at 8518750.
- [NYS Canal Corp hours](https://www.canals.ny.gov/Boating-Information/Boating-Hours)
- [Offshore Blue lock table](http://www.offshoreblue.com/cruise/erie-canal-locks.php) and [East River timing](https://www.offshoreblue.com/cruise/east-river-timing.php)
- [AM Nautical canal tips](https://www.amnautical.com/blogs/the-mariners-blog/tips-for-navigating-the-erie-canal-and-the-new-york-state-canal-system)
- [CBSA reporting sites](https://cbsa-asfc.gc.ca/do-rb/services/trsm-sdtm-eng.html) (503 when tried), [Offshore Blue CBSA ports](https://www.offshoreblue.com/cruise/ca-customs-ports.php), [CBP release](https://www.cbp.gov/newsroom/local-media-release/cbp-reminds-pleasure-boating-community-reporting-procedures-effect)
- [CTV, Little Current bridge](https://www.ctvnews.ca/northern-ontario/article/manitoulin-swing-bridge-reopened-closed-to-marine-traffic), [Expositor](https://manitoulin.com/?p=102503)
- [CIMSS lake temps](https://cimss.ssec.wisc.edu/satellite-blog/archives/41133), [Sarnia News Today, Phantom Piper](https://sarnianewstoday.ca/midwestern/news/2023/06/30/kincardine-to-honour-phantom-piper)
- OSM Nominatim lookups for marina and village coordinates.

## Could not verify
- Mileposts for Medina, Brockport and Fairport (estimated), and the lock table's E-24/E-25 row (typo).
- 2027 canal hours, 2027 Little Current bridge schedule and replacement status, 2027 Kincardine piper schedule and festival dates.
- Whether Meldrum Bay is currently a CBSA reporting site, and whether Port Huron accepts ROAM.
- Les Cheneaux channel coordinates, the Killarney exit, Cape Hurd clearance, the Drummond to Meldrum route, Lake St. Clair channel identity and depth, Kelleys Island clearance on Day 17 (the track passes within about 0.5 nm), Black Rock canal versus river.
- Straits of Mackinac current speeds, Mackinac Bridge clearance, Hudson tide lag (5-6 h at Troy).
- Boat specifics (fuel burn, draft, air draft) and the fuel stops at Tobermory and Kincardine.
- NOAA figures are 2027 harmonic predictions; actual currents shift with weather and river flow.
- Every nm figure above is the reviewer's own great-circle or track estimate, not a charted distance.
- Overpass and the NOAA ENC buoy layers were unreachable, so buoyed channels were not checked.
- The live app and UI were not tested.
