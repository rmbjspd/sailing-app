import { CountUp, Reveal, SectionHeader } from "@/components/kit";
import { tripTotals } from "@/lib/data/stats";
import { clockFacts, criticalOps, waterModel } from "@/lib/data/vizModel";
import { NM_PER_MI } from "@/lib/data/waterProfile";
import { LegShare } from "./LegShare";
import { OpsTimeline } from "./OpsTimeline";
import { FigureHeader, Stat, fmt, pct } from "./parts";
import { CanalKey, StaircaseLoupe, StaircaseOverview } from "./Staircase";
import { ClockReadout, VoyageClock } from "./VoyageClock";
import { VizProvider } from "./VizContext";
import s from "./viz.module.css";

/**
 * "The Voyage in Numbers" — the home page's data section. Server component:
 * every figure is derived here from lib/data and handed to small interactive
 * islands as plain props, so the itinerary text never ships to the client.
 */
export default function VoyageInNumbers() {
  const model = waterModel();
  const totals = tripTotals();
  const ops = criticalOps();
  const facts = clockFacts(model.days);
  const { legs, days, locks, lift, mast } = model;
  const canal = legs.find(l => l.legId === "erie-canal")!;
  const lakes = legs.filter(l => !l.inland);
  const lakePace = lakes.reduce((a, l) => a + l.nm, 0) / lakes.reduce((a, l) => a + l.days, 0);
  const startFt = model.surface[0].ft;
  const e17 = locks.find(l => l.id === "E-17")!;
  const flight = locks.filter(l => l.flight === "Waterford");

  // Canal loupe: Black Rock (a few nm before) → the end of the mast-up day.
  const loupe: [number, number] = [locks[0].x - 8, mast.x1];
  const third = (loupe[1] - loupe[0]) / 3;
  const rows: [number, number][] = [0, 1, 2].map(i => [loupe[0] + i * third, loupe[0] + (i + 1) * third]);

  return (
    <section id="numbers" aria-labelledby="numbers-title" className={`${s.root} relative py-24 md:py-36`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div id="numbers-title">
          <SectionHeader
            eyebrow="The voyage in numbers"
            title={<>Thirty-five days, <em>measured</em></>}
            lede={<>
              <span className="num">{fmt(totals.distanceNmEquiv)}</span> nautical miles, <span className="num">{totals.locks}</span> locks
              and <span className="num">{fmt(startFt, 1)}</span> feet of descent, from the top of the Great Lakes to the Atlantic.
              Every figure is computed from the passage plan. Hover, tap or tab through any of them.
            </>}
          />
        </div>

        <VizProvider>
          {/* ── Fig. 1 ─────────────────────────────────────────────────── */}
          <figure className="mt-20 md:mt-28">
            <Reveal>
              <FigureHeader
                num="1"
                kicker="Water-surface elevation"
                title={<>The staircase <em>to the sea</em></>}
                dek={<>
                  Sabbatical starts the summer <span className="num text-ink">{fmt(startFt, 1)} ft</span> above the Atlantic. Rivers ease her down a few feet;
                  the Erie Canal does the rest in <span className="num text-ink">{lift.count - 2}</span> chambers, plus a federal lock at each end.
                  Three of them, oddly, lift her <em className="not-italic text-glow">up</em>.
                </>}
                aside={
                  <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 lg:w-[460px] lg:grid-cols-2">
                    <Stat value={<CountUp value={lift.count} />} label={<>locks · <span className="num">{lift.downCount}</span> down, <span className="num">{lift.upCount}</span> up</>} />
                    <Stat value={<CountUp value={Math.round(lift.downFt)} />} unit="ft" label={<>locked down (and <span className="num">{fmt(lift.upFt)}</span> ft up)</>} tone="brass" />
                    <Stat value={fmt(e17.liftFt, 1)} unit="ft" label={<>tallest single lift, {e17.id} {e17.place}</>} />
                    <Stat value={<CountUp value={mast.upDay - mast.downDay + 1} />} unit="days" label="with the mast on deck" tone="glow" />
                  </div>
                }
              />
            </Reveal>

            <div className="mt-12">
              <p className="eyebrow mb-3"><span className="num text-ink-2">1A</span> · The whole voyage, Chicago → Old Saybrook</p>
              <div className="hidden md:block"><StaircaseOverview model={model} /></div>
              <div className="md:hidden"><StaircaseOverview model={model} compact /></div>
            </div>

            <div className="mt-10 md:mt-14">
              <p className="eyebrow mb-3"><span className="num text-ink-2">1B</span> · Black Rock → Catskill, enlarged · every lock to scale</p>
              <div className="hidden md:block">
                <StaircaseLoupe model={model} domain={loupe} inset title="Every lock from Black Rock to Troy, enlarged" />
              </div>
              <div className="flex flex-col gap-2 md:hidden">
                {rows.map((d, i) => (
                  <StaircaseLoupe key={i} model={model} domain={d} compact keyed rowIndex={i}
                    title={`Canal profile, part ${i + 1} of 3`} />
                ))}
                <CanalKey model={model} />
              </div>
            </div>

            <figcaption className="mt-8 grid gap-6 border-t border-line pt-6 text-[12.5px] leading-relaxed text-ink-3 md:grid-cols-[1fr_auto] md:items-start">
              <p className="max-w-3xl">
                Lake surfaces at chart datum (IGLD 1985); summer levels run a foot or three higher. Below the surface line, the lake and sea floor
                directly under our track, sampled every half mile from NOAA NCEI ETOPO 2022. It is drawn where the bed is resolved; canal and river
                channels are too narrow, and the model carries no floor for Lake St. Clair or Oneida Lake. Canal pools are rebuilt from the
                published lift of each lock, chained from Lake Erie and from tidewater; the two chains close within a few feet. The Waterford
                Flight (<span className="num">{flight.length}</span> locks) is magnified so you can see each step.
              </p>
              <LockTable model={model} />
            </figcaption>
          </figure>

          {/* ── Fig. 2 ─────────────────────────────────────────────────── */}
          <figure className="mt-28 md:mt-40">
            <Reveal>
              <FigureHeader
                num="2"
                kicker="Daily rhythm"
                title={<><span className="num">{days.length}</span> days, <em>one turn</em> of the clock</>}
                dek={<>
                  Big open-water days on the lakes, short lock-heavy days on the canal, and <span className="num text-ink">{facts.restDays.length}</span> days
                  that go nowhere on purpose. The average day under way covers <span className="num text-ink">{fmt(facts.movingAvg)} nm</span>.
                </>}
              />
            </Reveal>
            <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
              <div className="mx-auto w-full max-w-[680px]">
                <div className="hidden md:block"><VoyageClock days={days} legs={legs} /></div>
                <div className="md:hidden"><VoyageClock days={days} legs={legs} compact /></div>
              </div>
              <ClockReadout days={days} facts={facts} nmPerMi={NM_PER_MI} />
            </div>
          </figure>

          {/* ── Fig. 3 ─────────────────────────────────────────────────── */}
          <figure className="mt-28 md:mt-40">
            <Reveal>
              <FigureHeader
                num="3"
                kicker="Distance vs. time"
                title={<>Where the <em>miles</em> go</>}
                dek={<>
                  The Erie Canal is <span className="num text-ink">{pct(canal.shareDistance)}</span> of the distance but takes <span className="num text-ink">{pct(canal.shareDays)}</span> of
                  the days: <span className="num text-ink">{fmt(canal.pace)}</span> nm a day between locks and lift bridges, against <span className="num text-ink">{fmt(lakePace)}</span> on open water.
                </>}
              />
            </Reveal>
            <div className="mt-10">
              <div className="hidden md:block"><LegShare legs={legs} totalNm={totals.distanceNmEquiv} totalDays={totals.sailingDays} /></div>
              <div className="md:hidden"><LegShare legs={legs} totalNm={totals.distanceNmEquiv} totalDays={totals.sailingDays} compact /></div>
            </div>
          </figure>

          {/* ── Fig. 4 ─────────────────────────────────────────────────── */}
          <figure className="mt-28 md:mt-40">
            <Reveal>
              <FigureHeader
                num="4"
                kicker="Dead reckoning"
                title={<>Six things that <em>won&rsquo;t wait</em></>}
                dek="The passage plan is flexible almost everywhere. These six are the exceptions: book ahead, clear in, or time the water. Get them right and the rest is sailing."
              />
            </Reveal>
            <div className="mt-10">
              <OpsTimeline ops={ops} days={days} />
            </div>
          </figure>

          <p className="mt-20 max-w-3xl text-[11.5px] leading-relaxed text-ink-4">
            Sources: USACE / NOAA Great Lakes Low Water Datum (IGLD 1985); US EPA, Physical Features of the Great Lakes; NYS Canal Corporation
            and OffshoreBlue Erie Canal lock tables (lifts, lock spacing, 338.75-mile canal); USACE Black Rock and Troy locks; NOAA NCEI ETOPO 2022
            for lake and sea floors under the track. Distances, locks and days from the S/V Sabbatical passage plan.
          </p>
        </VizProvider>
      </div>
    </section>
  );
}

function LockTable({ model }: { model: ReturnType<typeof waterModel> }) {
  const byDay = new Map(model.days.map(d => [d.day, d]));
  return (
    <details className="group w-full rounded-xl border border-line md:w-auto">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 px-4 py-2.5 text-[12px] text-ink-2 hover:text-ink">
        <span className="eyebrow !text-[10px]">Lock table · <span className="num">{model.locks.length}</span> rows</span>
        <span aria-hidden className="transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="max-h-[420px] overflow-auto border-t border-line md:w-[560px]" data-lenis-prevent>
        <table className={s.table}>
          <thead>
            <tr><th>#</th><th>Lock</th><th>Place</th><th>Day</th><th className="!text-right">Lift</th><th className="!text-right">Pool after</th></tr>
          </thead>
          <tbody>
            {model.locks.map((l, i) => (
              <tr key={l.id}>
                <td className="num">{i + 1}</td>
                <td className="num text-ink">{l.id}</td>
                <td>{l.place}</td>
                <td className="num">{l.day} · {byDay.get(l.day)?.dateShort}</td>
                <td className="num text-right" style={{ color: l.dir === "up" ? "var(--glow)" : undefined }}>{l.dir === "up" ? "↑" : "↓"} {fmt(l.liftFt, 1)}</td>
                <td className="num text-right">{fmt(l.toFt)} ft</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
