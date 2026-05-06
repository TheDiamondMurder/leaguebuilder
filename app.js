const STORAGE_KEY = "league-table-creator:v2";
const OLD_STORAGE_KEY = "league-table-creator:v1";

const qualificationTypes = {
  none: "None",
  automatic: "Automatic Promotion",
  playoff: "Playoffs",
  relegationPlayoff: "Relegation Playoffs",
  relegation: "Relegation",
  custom: "Custom Qualification",
};

const state = {
  groups: [],
  leagues: [],
  selectedGroupId: "",
  selectedLeagueId: "",
  activeView: "editor",
  pendingCustomPosition: -1,
  activeCleanSeasonId: "current",
  activeRaceView: "title",
  fixtureFilter: "all",
  fixtureCalendarMode: false,
  cleanRewindWeek: "",
  darkMode: false,
  latestShareUrl: "",
};

const fallbackNewsPosts = [
  {
    slug: "v1-3",
    title: "v1.3 is here",
    coverPhoto: "announcements/image1.svg",
    postDate: "2026-05-06",
    content: [
      {
        type: "paragraph",
        text: "Version 1.3 expands sharing, fixtures, graphics, history, and everyday league management.",
      },
      {
        type: "heading",
        text: "Highlights",
      },
      {
        type: "list",
        items: [
          "Shareable league, fixture, and team pages with QR codes.",
          "New graphic exports for teams, races, fixtures, playoffs, and mobile formats.",
          "Season and team history, news posts, fixture dates, and cleaner controls.",
        ],
      },
      {
        type: "paragraph",
        text: "The app remains fully static and ready for GitHub Pages.",
      },
    ],
  },
  {
    slug: "welcome",
    title: "Welcome to League Table Creator",
    coverPhoto: "announcements/image1.svg",
    postDate: "2026-05-06",
    content: [
      {
        type: "paragraph",
        text: "Welcome to LeagueBuilder",
      },
      {
        type: "heading",
        text: "What is being worked on",
      },
      {
        type: "list",
        items: [
          "Share links for league tables, fixtures, and team pages.",
          "New graphic export formats for tables, races, teams, playoffs, and gameweeks.",
          "Fixture dates, calendar views, and better gameweek tools.",
          "Season history, team history, group dashboards, and pyramid views.",
        ],
      },
      {
        type: "paragraph",
        text: "The creator is now on v1.3.",
      },
    ],
  },
];

const els = {
  homePage: document.querySelector("#homePage"),
  creatorPage: document.querySelector("#creatorPage"),
  changelogPage: document.querySelector("#changelogPage"),
  newsPage: document.querySelector("#newsPage"),
  sharePage: document.querySelector("#sharePage"),
  enterCreatorButton: document.querySelector("#enterCreatorButton"),
  openChangelogButton: document.querySelector("#openChangelogButton"),
  openNewsButton: document.querySelector("#openNewsButton"),
  backHomeButton: document.querySelector("#backHomeButton"),
  newsBackHomeButton: document.querySelector("#newsBackHomeButton"),
  newsList: document.querySelector("#newsList"),
  newsArticle: document.querySelector("#newsArticle"),
  homeNavButton: document.querySelector("#homeNavButton"),
  changelogNavButton: document.querySelector("#changelogNavButton"),
  darkModeButton: document.querySelector("#darkModeButton"),
  groupSelect: document.querySelector("#groupSelect"),
  renameGroupButton: document.querySelector("#renameGroupButton"),
  deleteGroupButton: document.querySelector("#deleteGroupButton"),
  seasonNameInput: document.querySelector("#seasonNameInput"),
  seasonStartInput: document.querySelector("#seasonStartInput"),
  seasonEndInput: document.querySelector("#seasonEndInput"),
  leagueGroupInput: document.querySelector("#leagueGroupInput"),
  leagueList: document.querySelector("#leagueList"),
  tierList: document.querySelector("#tierList"),
  leagueCount: document.querySelector("#leagueCount"),
  leagueTitle: document.querySelector("#leagueTitle"),
  saveStatus: document.querySelector("#saveStatus"),
  emptyState: document.querySelector("#emptyState"),
  leagueEditor: document.querySelector("#leagueEditor"),
  newLeagueButton: document.querySelector("#newLeagueButton"),
  newGroupButton: document.querySelector("#newGroupButton"),
  emptyCreateButton: document.querySelector("#emptyCreateButton"),
  duplicateLeagueButton: document.querySelector("#duplicateLeagueButton"),
  deleteLeagueButton: document.querySelector("#deleteLeagueButton"),
  exportButton: document.querySelector("#exportButton"),
  importInput: document.querySelector("#importInput"),
  leagueNameInput: document.querySelector("#leagueNameInput"),
  tierInput: document.querySelector("#tierInput"),
  statusInput: document.querySelector("#statusInput"),
  promotesToInput: document.querySelector("#promotesToInput"),
  relegatesToInput: document.querySelector("#relegatesToInput"),
  pointLabelInput: document.querySelector("#pointLabelInput"),
  teamColorsInput: document.querySelector("#teamColorsInput"),
  resetKeepTeamsButton: document.querySelector("#resetKeepTeamsButton"),
  resetAllButton: document.querySelector("#resetAllButton"),
  addTeamButton: document.querySelector("#addTeamButton"),
  bulkAddTeamsButton: document.querySelector("#bulkAddTeamsButton"),
  teamTableBody: document.querySelector("#teamTableBody"),
  cleanLeagueName: document.querySelector("#cleanLeagueName"),
  cleanSeasonInput: document.querySelector("#cleanSeasonInput"),
  shareModeInput: document.querySelector("#shareModeInput"),
  shareTeamInput: document.querySelector("#shareTeamInput"),
  renderGraphicButton: document.querySelector("#renderGraphicButton"),
  generateShareCodeButton: document.querySelector("#generateShareCodeButton"),
  cleanLegend: document.querySelector("#cleanLegend"),
  cleanTableBody: document.querySelector("#cleanTableBody"),
  rewindGameweekInput: document.querySelector("#rewindGameweekInput"),
  rewindTableBox: document.querySelector("#rewindTableBox"),
  fixtureModeInput: document.querySelector("#fixtureModeInput"),
  fixtureGameweekFilter: document.querySelector("#fixtureGameweekFilter"),
  applyGameweekDateButton: document.querySelector("#applyGameweekDateButton"),
  gameweekDateDialog: document.querySelector("#gameweekDateDialog"),
  gameweekDateSelect: document.querySelector("#gameweekDateSelect"),
  gameweekDateInput: document.querySelector("#gameweekDateInput"),
  fixtureCalendarButton: document.querySelector("#fixtureCalendarButton"),
  renderGameweekButton: document.querySelector("#renderGameweekButton"),
  manualDateInput: document.querySelector("#manualDateInput"),
  manualGameweekInput: document.querySelector("#manualGameweekInput"),
  manualHomeInput: document.querySelector("#manualHomeInput"),
  manualAwayInput: document.querySelector("#manualAwayInput"),
  addManualFixtureButton: document.querySelector("#addManualFixtureButton"),
  generateFixturesButton: document.querySelector("#generateFixturesButton"),
  fixturesList: document.querySelector("#fixturesList"),
  playoffList: document.querySelector("#playoffList"),
  relegationPlayoffList: document.querySelector("#relegationPlayoffList"),
  bracketStage: document.querySelector("#bracketStage"),
  movementPreview: document.querySelector("#movementPreview"),
  autoPlayoffButton: document.querySelector("#autoPlayoffButton"),
  autoRelegationPlayoffButton: document.querySelector("#autoRelegationPlayoffButton"),
  twoLegPlayoffInput: document.querySelector("#twoLegPlayoffInput"),
  customDialog: document.querySelector("#customDialog"),
  customQualificationInput: document.querySelector("#customQualificationInput"),
  customQualificationColorInput: document.querySelector("#customQualificationColorInput"),
  rolloverDialog: document.querySelector("#rolloverDialog"),
  rolloverSummary: document.querySelector("#rolloverSummary"),
  nextSeasonInput: document.querySelector("#nextSeasonInput"),
  teamDialog: document.querySelector("#teamDialog"),
  teamDialogTitle: document.querySelector("#teamDialogTitle"),
  teamFixtureList: document.querySelector("#teamFixtureList"),
  projectionsList: document.querySelector("#projectionsList"),
  deductionsList: document.querySelector("#deductionsList"),
  deductionNotes: document.querySelector("#deductionNotes"),
  sharedSeasonName: document.querySelector("#sharedSeasonName"),
  sharedLeagueName: document.querySelector("#sharedLeagueName"),
  sharedLeagueTab: document.querySelector("#sharedLeagueTab"),
  sharedFixturesTab: document.querySelector("#sharedFixturesTab"),
  sharedTeamTab: document.querySelector("#sharedTeamTab"),
  sharedLeagueView: document.querySelector("#sharedLeagueView"),
  sharedFixturesView: document.querySelector("#sharedFixturesView"),
  sharedTeamView: document.querySelector("#sharedTeamView"),
  sharedLegend: document.querySelector("#sharedLegend"),
  sharedTableBody: document.querySelector("#sharedTableBody"),
  sharedDeductionNotes: document.querySelector("#sharedDeductionNotes"),
  sharedFixturesList: document.querySelector("#sharedFixturesList"),
  sharedTeamProfile: document.querySelector("#sharedTeamProfile"),
  bulkTeamsDialog: document.querySelector("#bulkTeamsDialog"),
  bulkTeamsInput: document.querySelector("#bulkTeamsInput"),
  shareDialog: document.querySelector("#shareDialog"),
  shareLinkOutput: document.querySelector("#shareLinkOutput"),
  shareQrImage: document.querySelector("#shareQrImage"),
  copyShareLinkButton: document.querySelector("#copyShareLinkButton"),
  toastStack: document.querySelector("#toastStack"),
  groupDashboard: document.querySelector("#groupDashboard"),
  pyramidLadder: document.querySelector("#pyramidLadder"),
  historySeasonInput: document.querySelector("#historySeasonInput"),
  historyTeamInput: document.querySelector("#historyTeamInput"),
  historyPanel: document.querySelector("#historyPanel"),
  graphicFormatInput: document.querySelector("#graphicFormatInput"),
  graphicTeamInput: document.querySelector("#graphicTeamInput"),
  graphicGameweekInput: document.querySelector("#graphicGameweekInput"),
  graphicRaceInput: document.querySelector("#graphicRaceInput"),
  renderLeagueGraphic2Button: document.querySelector("#renderLeagueGraphic2Button"),
  renderPlayoffsGraphicButton: document.querySelector("#renderPlayoffsGraphicButton"),
  renderTeamGraphicButton: document.querySelector("#renderTeamGraphicButton"),
  renderRaceGraphicButton: document.querySelector("#renderRaceGraphicButton"),
  renderGameweekGraphic2Button: document.querySelector("#renderGameweekGraphic2Button"),
  views: {
    editor: document.querySelector("#editorView"),
    dashboard: document.querySelector("#dashboardView"),
    clean: document.querySelector("#cleanView"),
    fixtures: document.querySelector("#fixturesView"),
    playoffs: document.querySelector("#playoffsView"),
    bracket: document.querySelector("#bracketView"),
    projections: document.querySelector("#projectionsView"),
    deductions: document.querySelector("#deductionsView"),
    history: document.querySelector("#historyView"),
    graphics: document.querySelector("#graphicsView"),
  },
};

function showPage(page) {
  els.homePage.hidden = page !== "home";
  els.creatorPage.hidden = page !== "creator";
  els.changelogPage.hidden = page !== "changelog";
  els.newsPage.hidden = page !== "news";
  els.sharePage.hidden = page !== "share";
  if (page === "creator") render();
  if (page === "news") loadNews(newsSlugFromHash());
}

function notify(message, tone = "info") {
  const item = document.createElement("div");
  item.className = `toast ${tone}`;
  item.textContent = message;
  els.toastStack.append(item);
  window.setTimeout(() => item.remove(), 3200);
}

function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  document.body.classList.toggle("dark-mode", state.darkMode);
  els.darkModeButton.textContent = state.darkMode ? "Light Mode" : "Dark Mode";
  notify(`${state.darkMode ? "Dark" : "Light"} mode enabled.`, "success");
}

async function loadNews(targetSlug = "") {
  els.newsArticle.hidden = true;
  els.newsList.hidden = false;
  els.newsList.innerHTML = `<p class="empty-note">Loading announcements...</p>`;
  let posts = fallbackNewsPosts;
  let warning = "";
  try {
    posts = await loadAnnouncementPosts();
  } catch (error) {
    if (isFilePreview()) warning = "Local file preview cannot reload announcement JSON files. Start the local preview server, then open http://localhost:5173/ to see JSON edits immediately.";
    console.warn(error);
    posts = fallbackNewsPosts;
  }
  posts = posts
    .filter((post) => post && post.title)
    .sort((a, b) => String(b.postDate || "").localeCompare(String(a.postDate || "")));
  if (targetSlug) {
    const post = posts.find((item) => item.slug === targetSlug);
    if (post) {
      renderNewsArticle(post);
      return;
    }
  }
  renderNewsList(posts, warning);
}

async function loadAnnouncementPosts() {
  const cacheToken = Date.now();
  const files = await fetch(`announcements/index.json?v=${cacheToken}`, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("Announcement index failed to load.");
      return response.json();
    });
  const results = await Promise.allSettled(files.map((entry) => loadAnnouncementPost(entry, cacheToken)));
  const posts = results
    .filter((result) => result.status === "fulfilled" && result.value)
    .map((result) => result.value);
  if (!posts.length) throw new Error("No announcement posts loaded.");
  return posts;
}

async function loadAnnouncementPost(entry, cacheToken) {
  const file = normalizeAnnouncementFile(entry);
  if (!file) return null;
  const post = await fetch(`announcements/${file}?v=${cacheToken}`, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(`Announcement failed to load: ${file}`);
      return response.json();
    });
  return { slug: post.slug || file.replace(/\.json$/i, ""), ...post };
}

function normalizeAnnouncementFile(entry) {
  const file = typeof entry === "string" ? entry : entry?.file || entry?.path || "";
  if (!file || file === "template.json") return "";
  return file.replace(/^announcements\//, "");
}

function isFilePreview() {
  return window.location.protocol === "file:";
}

function renderNewsList(posts, warning = "") {
  els.newsList.innerHTML = warning ? `<p class="empty-note">${escapeHtml(warning)}</p>` : "";
  posts.forEach((post) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "news-card";
    card.innerHTML = `
      <img src="${escapeAttribute(post.coverPhoto)}" alt="" />
      <span>${escapeHtml(formatDate(post.postDate))}</span>
      <strong>${escapeHtml(post.title)}</strong>
    `;
    card.addEventListener("click", () => openNewsArticle(post));
    els.newsList.append(card);
  });
}

function openNewsArticle(post) {
  const url = new URL(window.location.href);
  url.hash = `news=${encodeURIComponent(post.slug || slugify(post.title))}`;
  if (window.location.hash !== url.hash) window.history.pushState(null, "", url);
  renderNewsArticle(post);
}

function renderNewsArticle(post) {
  els.newsList.hidden = true;
  els.newsList.innerHTML = "";
  els.newsArticle.hidden = false;
  const postUrl = newsArticleUrl(post);
  els.newsArticle.innerHTML = `
    <div class="news-article-actions">
      <button class="ghost-button news-back-button" type="button">Back to News</button>
      <button class="secondary-button news-share-button" type="button">Copy Share Link</button>
    </div>
    <img src="${escapeAttribute(post.coverPhoto)}" alt="" />
    <p class="eyebrow">${escapeHtml(formatDate(post.postDate))}</p>
    <h3>${escapeHtml(post.title)}</h3>
    <input class="news-share-link" value="${escapeAttribute(postUrl)}" readonly />
    ${renderPostContent(post.content || [])}
  `;
  els.newsArticle.querySelector(".news-back-button").addEventListener("click", () => {
    clearHash();
    loadNews();
  });
  els.newsArticle.querySelector(".news-share-button").addEventListener("click", () => copyShareUrl(postUrl));
}

function newsArticleUrl(post) {
  const url = new URL(window.location.href);
  url.hash = `news=${encodeURIComponent(post.slug || slugify(post.title))}`;
  return url.toString();
}

function newsSlugFromHash() {
  const match = window.location.hash.match(/^#news=([^&]+)$/);
  return match ? decodeURIComponent(match[1]) : "";
}

function maybeRenderNewsPage() {
  if (!newsSlugFromHash()) return false;
  showPage("news");
  return true;
}

function slugify(value) {
  return String(value || "news")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "news";
}

function clearHash() {
  const url = new URL(window.location.href);
  url.hash = "";
  window.history.pushState(null, "", url);
}

function renderPostContent(content) {
  return content.map((block) => {
    if (block.type === "heading") return `<h4>${escapeHtml(block.text)}</h4>`;
    if (block.type === "list") return `<ul>${(block.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    return `<p>${escapeHtml(block.text || "")}</p>`;
  }).join("");
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function createGroup(name = "Main Pyramid", seasonName = "Season 1") {
  return { id: createId("group"), name, seasonName, seasonStart: "", seasonEnd: "", seasons: [] };
}

function defaultTeam(index) {
  return {
    id: createId("team"),
    name: `Team ${index + 1}`,
    color: teamColor(index),
    manual: { played: 0, won: 0, drawn: 0, lost: 0, for: 0, against: 0, diff: 0, points: 0 },
  };
}

function teamColor(index) {
  return ["#177245", "#235a97", "#b96919", "#b83931", "#6d4ab3", "#65736f"][index % 6];
}

function defaultPositionRule(index) {
  return {
    qualification: "none",
    customQualification: "",
    customColor: "#6d4ab3",
  };
}

function createLeague(name = "New League", tier = 1, groupId = state.selectedGroupId) {
  return {
    id: createId("league"),
    groupId,
    name,
    tier,
    status: "active",
    promotesTo: "",
    relegatesTo: "",
    pointLabel: "Goal",
    showTeamColors: false,
    twoLegPlayoffs: false,
    fixtureMode: "single",
    teams: Array.from({ length: 12 }, (_, index) => defaultTeam(index)),
    positionRules: Array.from({ length: 12 }, (_, index) => defaultPositionRule(index)),
    fixtures: [],
    playoffs: createBracket("promotion"),
    relegationPlayoff: createBracket("relegation"),
    pointDeductions: {},
    movementLog: [],
    updatedAt: new Date().toISOString(),
  };
}

function createBracket(type) {
  return { type, matches: [], championId: "", applied: false };
}

function loadState() {
  const saved = parseStored(STORAGE_KEY) || migrateOldState(parseStored(OLD_STORAGE_KEY));
  if (saved?.leagues?.length) {
    state.groups = saved.groups?.length ? saved.groups.map(normalizeGroup) : [createGroup()];
    state.leagues = saved.leagues.map(normalizeLeague);
    state.selectedGroupId = saved.selectedGroupId || state.groups[0].id;
    state.selectedLeagueId = saved.selectedLeagueId || filteredLeagues()[0]?.id || state.leagues[0].id;
    state.activeCleanSeasonId = saved.activeCleanSeasonId || "current";
    return;
  }
  const group = createGroup();
  state.groups = [group];
  state.selectedGroupId = group.id;
}

function parseStored(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function migrateOldState(saved) {
  if (!saved?.leagues?.length) return null;
  const group = createGroup();
  return {
    groups: [group],
    selectedGroupId: group.id,
    selectedLeagueId: saved.selectedLeagueId,
    leagues: saved.leagues.map((league) => ({ ...league, groupId: group.id })),
  };
}

function normalizeGroup(group) {
  return {
    ...createGroup(group.name || "Main Pyramid", group.seasonName || group.currentSeason || "Season 1"),
    ...group,
    seasonName: group.seasonName || group.currentSeason || "Season 1",
    seasonStart: group.seasonStart || "",
    seasonEnd: group.seasonEnd || "",
    seasons: Array.isArray(group.seasons) ? group.seasons : [],
  };
}

function normalizeLeague(league) {
  const normalizedTeams = (league.teams || []).map((team, index) => ({
    ...defaultTeam(index),
    ...team,
    color: team.color || teamColor(index),
    manual: { ...defaultTeam(index).manual, ...(team.manual || team) },
  }));
  const migratedRules = league.positionRules || normalizedTeams.map((team, index) => ({
    ...defaultPositionRule(index),
    qualification: team.qualification || defaultPositionRule(index).qualification,
    customQualification: team.customQualification || "",
    customColor: team.customColor || "#6d4ab3",
  }));
  return {
    ...createLeague(league.name || "League", league.tier || 1, league.groupId || state.groups[0]?.id),
    ...league,
    teams: normalizedTeams,
    positionRules: normalizedTeams.map((_, index) => ({ ...defaultPositionRule(index), ...(migratedRules[index] || {}) })),
    fixtures: league.fixtures || [],
    playoffs: { ...createBracket("promotion"), ...(league.playoffs || {}) },
    relegationPlayoff: { ...createBracket("relegation"), ...(league.relegationPlayoff || {}) },
    pointDeductions: league.pointDeductions || {},
    showTeamColors: Boolean(league.showTeamColors),
    twoLegPlayoffs: Boolean(league.twoLegPlayoffs),
  };
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      groups: state.groups,
      leagues: state.leagues,
      selectedGroupId: state.selectedGroupId,
      selectedLeagueId: state.selectedLeagueId,
      activeCleanSeasonId: state.activeCleanSeasonId,
    }),
  );
  els.saveStatus.textContent = `Saved locally ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function selectedLeague() {
  return state.leagues.find((league) => league.id === state.selectedLeagueId) || null;
}

function selectedGroup() {
  return state.groups.find((group) => group.id === state.selectedGroupId) || state.groups[0];
}

function filteredLeagues() {
  return state.leagues.filter((league) => league.groupId === state.selectedGroupId);
}

function sortedLeagues(leagues = filteredLeagues()) {
  return [...leagues].sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
}

function setUpdated(league) {
  league.updatedAt = new Date().toISOString();
}

function ensurePositionRules(league) {
  while (league.positionRules.length < league.teams.length) {
    league.positionRules.push(defaultPositionRule(league.positionRules.length));
  }
  if (league.positionRules.length > league.teams.length) {
    league.positionRules.length = league.teams.length;
  }
}

function positionRule(league, index) {
  ensurePositionRules(league);
  return league.positionRules[index] || defaultPositionRule(index);
}

function tableWithRules(league) {
  return calculateTable(league).map((row, index) => ({ ...row, positionRule: positionRule(league, index), position: index }));
}

function calculateTable(league) {
  const rows = league.teams.map((team, index) => ({
    team,
    teamId: team.id,
    sourceIndex: index,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    for: 0,
    against: 0,
    diff: 0,
    points: 0,
    form: [],
  }));
  const byId = new Map(rows.map((row) => [row.teamId, row]));
  const playedFixtures = league.fixtures.filter((fixture) => fixture.played && Number.isFinite(fixture.homeScore) && Number.isFinite(fixture.awayScore));

  if (!playedFixtures.length) {
    return rows
      .map((row) => applyPointDeduction(league, { ...row, ...row.team.manual, diff: row.team.manual.diff ?? row.team.manual.for - row.team.manual.against }))
      .sort(sortTableRows);
  }

  playedFixtures.forEach((fixture) => {
    const home = byId.get(fixture.homeId);
    const away = byId.get(fixture.awayId);
    if (!home || !away) return;
    applyResult(home, fixture.homeScore, fixture.awayScore);
    applyResult(away, fixture.awayScore, fixture.homeScore);
  });

  rows.forEach((row) => {
    row.diff = row.for - row.against;
    row.form = formForTeam(league, row.teamId);
    applyPointDeduction(league, row);
  });
  return rows.sort(sortTableRows);
}

function applyPointDeduction(league, row) {
  const deduction = pointDeductionFor(league, row.teamId);
  row.deduction = deduction;
  row.points -= deduction;
  return row;
}

function pointDeductionFor(league, teamId) {
  return Math.max(0, Number(league.pointDeductions?.[teamId]) || 0);
}

function applyResult(row, scored, conceded) {
  row.played += 1;
  row.for += scored;
  row.against += conceded;
  if (scored > conceded) {
    row.won += 1;
    row.points += 3;
  } else if (scored === conceded) {
    row.drawn += 1;
    row.points += 1;
  } else {
    row.lost += 1;
  }
}

function sortTableRows(a, b) {
  return b.points - a.points || b.diff - a.diff || b.for - a.for || a.sourceIndex - b.sourceIndex;
}

function formForTeam(league, teamId) {
  return league.fixtures
    .filter((fixture) => fixture.played && (fixture.homeId === teamId || fixture.awayId === teamId))
    .sort((a, b) => a.gameweek - b.gameweek)
    .slice(-5)
    .map((fixture) => {
      const scored = fixture.homeId === teamId ? fixture.homeScore : fixture.awayScore;
      const conceded = fixture.homeId === teamId ? fixture.awayScore : fixture.homeScore;
      if (scored > conceded) return "W";
      if (scored === conceded) return "D";
      return "L";
    });
}

function render() {
  ensureSelection();
  const league = selectedLeague();
  const hasSelectedLeague = Boolean(league);

  els.emptyState.hidden = hasSelectedLeague;
  els.leagueEditor.hidden = !hasSelectedLeague;
  els.duplicateLeagueButton.disabled = !league;
  els.deleteLeagueButton.disabled = !league;
  els.deleteGroupButton.disabled = state.groups.length < 2 && filteredLeagues().length === 0;
  els.leagueCount.textContent = String(filteredLeagues().length);
  els.leagueTitle.textContent = league ? league.name : "Create your first league";

  renderGroups();
  renderLeagueList();
  renderTierList();
  renderTabs();

  if (!league) return;
  renderSettings(league);
  renderActiveView(league);
}

function renderActiveView(league) {
  if (state.activeView === "editor") renderEditorTable(league);
  if (state.activeView === "dashboard") renderDashboard();
  if (state.activeView === "clean") renderCleanTable(league);
  if (state.activeView === "fixtures") renderFixtures(league);
  if (state.activeView === "playoffs") {
    renderPlayoffs(league);
    renderMovementPreview(league);
  }
  if (state.activeView === "bracket") renderPlayoffBracketView(league);
  if (state.activeView === "projections") renderProjections(league);
  if (state.activeView === "deductions") renderDeductions(league);
  if (state.activeView === "history") renderHistory(league);
  if (state.activeView === "graphics") renderGraphicsControls(league);
}

function renderGraphicsControls(league) {
  const table = tableWithRules(league);
  els.graphicTeamInput.innerHTML = table.map((row) => `<option value="${row.teamId}">${escapeHtml(row.team.name)}</option>`).join("");
  const weeks = [...new Set(league.fixtures.map((fixture) => fixture.gameweek))].sort((a, b) => a - b);
  els.graphicGameweekInput.innerHTML = [`<option value="all">All gameweeks</option>`]
    .concat(weeks.map((week) => `<option value="${week}">Gameweek ${week}</option>`))
    .join("");
  els.graphicRaceInput.value = els.graphicRaceInput.value || state.activeRaceView || "title";
}

function ensureSelection() {
  if (!state.groups.length) state.groups.push(createGroup());
  if (!state.selectedGroupId || !state.groups.some((group) => group.id === state.selectedGroupId)) {
    state.selectedGroupId = state.groups[0].id;
  }
  if (!state.selectedLeagueId || !state.leagues.some((league) => league.id === state.selectedLeagueId)) {
    state.selectedLeagueId = filteredLeagues()[0]?.id || state.leagues[0]?.id || "";
  }
}

function renderGroups() {
  const options = state.groups.map((group) => `<option value="${group.id}">${escapeHtml(group.name)}</option>`).join("");
  els.groupSelect.innerHTML = options;
  els.leagueGroupInput.innerHTML = options;
  els.groupSelect.value = state.selectedGroupId;
  els.seasonNameInput.value = selectedGroup()?.seasonName || "Season 1";
  els.seasonStartInput.value = selectedGroup()?.seasonStart || "";
  els.seasonEndInput.value = selectedGroup()?.seasonEnd || "";
  if (selectedLeague()) els.leagueGroupInput.value = selectedLeague().groupId;
}

function renderLeagueList() {
  els.leagueList.innerHTML = "";
  const leagues = sortedLeagues();
  if (!leagues.length) {
    els.leagueList.innerHTML = `<p class="empty-note">No leagues in ${escapeHtml(selectedGroup()?.name || "this group")} yet.</p>`;
    return;
  }
  leagues.forEach((league) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `league-card ${league.id === state.selectedLeagueId ? "active" : ""}`;
    button.innerHTML = `<strong></strong><span></span>`;
    button.querySelector("strong").textContent = league.name;
    button.querySelector("span").textContent = `Tier ${league.tier} | ${league.teams.length} teams | ${league.status}`;
    button.addEventListener("click", () => {
      state.selectedLeagueId = league.id;
      state.cleanRewindWeek = "";
      saveState();
      render();
    });
    els.leagueList.append(button);
  });
}

function renderTierList() {
  els.tierList.innerHTML = "";
  const groups = new Map();
  sortedLeagues().forEach((league) => groups.set(league.tier, [...(groups.get(league.tier) || []), league]));
  if (!groups.size) {
    els.tierList.innerHTML = `<p class="empty-note">This group has no tier ladder yet.</p>`;
    return;
  }
  groups.forEach((leagues, tier) => {
    const item = document.createElement("div");
    item.className = "tier-card";
    item.innerHTML = `<strong></strong><span></span>`;
    item.querySelector("strong").textContent = `Tier ${tier}`;
    item.querySelector("span").textContent = leagues.map((league) => league.name).join(", ");
    els.tierList.append(item);
  });
}

function renderDashboard() {
  const group = selectedGroup();
  const leagues = sortedLeagues();
  const completed = leagues.filter((league) => league.status === "completed").length;
  const teams = leagues.reduce((total, league) => total + league.teams.length, 0);
  const fixtures = leagues.reduce((total, league) => total + league.fixtures.length, 0);
  els.groupDashboard.innerHTML = [
    dashboardStat("Group", group?.name || "Group"),
    dashboardStat("Season", `${group?.seasonName || "Season"}${group?.seasonStart || group?.seasonEnd ? ` (${group.seasonStart || "?"} to ${group.seasonEnd || "?"})` : ""}`),
    dashboardStat("Leagues", leagues.length),
    dashboardStat("Teams", teams),
    dashboardStat("Fixtures", fixtures),
    dashboardStat("Completed", `${completed}/${leagues.length}`),
  ].join("");
  const tiers = new Map();
  leagues.forEach((league) => tiers.set(league.tier, [...(tiers.get(league.tier) || []), league]));
  els.pyramidLadder.innerHTML = [...tiers.entries()].map(([tier, tierLeagues]) => `
    <div class="pyramid-tier">
      <strong>Tier ${tier}</strong>
      <div>${tierLeagues.map((league) => `<button class="league-pill" data-league-id="${league.id}" type="button">${escapeHtml(league.name)}</button>`).join("")}</div>
    </div>
  `).join("") || `<p class="empty-note">Add leagues to build a pyramid ladder.</p>`;
  els.pyramidLadder.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.selectedLeagueId = button.dataset.leagueId;
    state.activeView = "clean";
    state.cleanRewindWeek = "";
    saveState();
    render();
  }));
}

function dashboardStat(label, value) {
  return `<div class="dashboard-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function renderTabs() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.activeView);
  });
  Object.entries(els.views).forEach(([view, element]) => {
    element.hidden = view !== state.activeView;
  });
}

function renderSettings(league) {
  els.leagueNameInput.value = league.name;
  els.tierInput.value = String(league.tier);
  els.statusInput.value = league.status;
  els.statusInput.title = leagueCompletionIssues(league).join(" ");
  els.pointLabelInput.value = league.pointLabel || "Goal";
  els.fixtureModeInput.value = league.fixtureMode || "single";
  els.teamColorsInput.value = league.showTeamColors ? "on" : "off";
  els.twoLegPlayoffInput.checked = Boolean(league.twoLegPlayoffs);
  renderLeagueSelects(league);
}

function renderLeagueSelects(league) {
  const options = [`<option value="">None</option>`]
    .concat(
      sortedLeagues()
        .filter((item) => item.id !== league.id)
        .map((item) => `<option value="${item.id}">${escapeHtml(item.name)} | Tier ${item.tier}</option>`),
    )
    .join("");
  els.promotesToInput.innerHTML = options;
  els.relegatesToInput.innerHTML = options;
  els.promotesToInput.value = league.promotesTo;
  els.relegatesToInput.value = league.relegatesTo;
}

function renderEditorTable(league) {
  const table = tableWithRules(league);
  els.teamTableBody.innerHTML = "";
  table.forEach((row, index) => {
    const team = row.team;
    const rule = row.positionRule;
    const tr = document.createElement("tr");
    tr.className = qualificationClass(rule);
    tr.style.setProperty("--custom-zone", rule.customColor || "#6d4ab3");
    tr.innerHTML = `
      <td><span class="rank-pill">${index + 1}</span></td>
      <td>
        <div class="team-edit-cell">
          ${league.showTeamColors ? `<input class="team-color-input" data-field="color" type="color" value="${escapeAttribute(team.color || teamColor(index))}" aria-label="Team colour" />` : ""}
          <input data-field="name" value="${escapeAttribute(team.name)}" aria-label="Team name" />
        </div>
      </td>
      <td>${row.played}</td>
      <td>${row.won}</td>
      <td>${row.drawn}</td>
      <td>${row.lost}</td>
      <td>${row.diff}</td>
      <td><strong>${row.points}</strong></td>
      <td>${qualificationControl(rule)}</td>
      <td><div class="team-actions">
        <button class="icon-button" data-action="up" type="button" title="Move up">Up</button>
        <button class="icon-button" data-action="down" type="button" title="Move down">Down</button>
        <button class="icon-button" data-action="remove" type="button" title="Remove">X</button>
      </div></td>
    `;
    tr.querySelectorAll("input, select").forEach((control) => control.addEventListener("change", (event) => updateTeam(league, team.id, index, event.target)));
    tr.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => handleTeamAction(league, team.id, button.dataset.action)));
    els.teamTableBody.append(tr);
  });
}

function qualificationControl(rule) {
  return `
    <select data-field="qualification" aria-label="Qualification">
      ${Object.entries(qualificationTypes).map(([value, label]) => `<option value="${value}" ${rule.qualification === value ? "selected" : ""}>${label}</option>`).join("")}
    </select>
    ${rule.qualification === "custom" ? `<div class="custom-tag" style="color:${escapeAttribute(rule.customColor)}">${escapeHtml(rule.customQualification || "Custom Qualification")}</div>` : ""}
  `;
}

function renderCleanTable(league) {
  renderCleanSeasonOptions();
  const snapshotLeague = selectedSnapshotLeague(league);
  if (snapshotLeague) {
    renderSnapshotCleanTable(snapshotLeague);
    return;
  }
  if (state.cleanRewindWeek && !league.fixtures.some((fixture) => fixture.gameweek === Number(state.cleanRewindWeek))) {
    state.cleanRewindWeek = "";
  }
  const displayLeague = state.cleanRewindWeek ? leagueBeforeGameweek(league, Number(state.cleanRewindWeek)) : league;
  const table = tableWithRules(displayLeague);
  const rewindLabel = state.cleanRewindWeek ? ` | Before Gameweek ${state.cleanRewindWeek}` : "";
  els.cleanLeagueName.textContent = `${league.name} | ${selectedGroup()?.seasonName || "Current Season"}${rewindLabel}`;
  renderShareTeamOptions(league);
  renderCleanLegend(displayLeague);
  renderDeductionNotes(displayLeague, table);
  renderRewindControls(league);
  els.cleanTableBody.innerHTML = "";
  table.forEach((row, index) => {
    const status = state.cleanRewindWeek ? "" : mathematicalStatus(league, table, row, index);
    const tr = document.createElement("tr");
    tr.className = qualificationClass(row.positionRule);
    tr.style.setProperty("--custom-zone", row.positionRule.customColor || "#6d4ab3");
    tr.innerHTML = `
      <td><span class="rank-pill">${index + 1}</span></td>
      <td><button class="team-link" data-team-id="${escapeAttribute(row.teamId)}" type="button">${teamColorDot(displayLeague, row.team)}${escapeHtml(row.team.name)}${state.cleanRewindWeek ? "" : playoffMovementBadge(league, row.teamId)}</button></td>
      <td>${row.played}</td><td>${row.won}</td><td>${row.drawn}</td><td>${row.lost}</td>
      <td>${row.for}</td><td>${row.against}</td><td>${row.diff}</td><td><strong>${row.points}</strong></td>
      <td>${renderForm(row.form)}</td>
      <td>${status ? `<span class="status-chip">${escapeHtml(status)}</span>` : ""}</td>
    `;
    tr.querySelector(".team-link").addEventListener("click", () => openTeamDialog(displayLeague, row.teamId));
    els.cleanTableBody.append(tr);
  });
}

function leagueBeforeGameweek(league, week) {
  const copy = structuredClone(league);
  copy.fixtures = copy.fixtures.filter((fixture) => fixture.played && fixture.gameweek < week);
  return copy;
}

function renderRewindControls(league) {
  const weeks = [...new Set(league.fixtures.map((fixture) => fixture.gameweek))].sort((a, b) => a - b);
  if (state.cleanRewindWeek && !weeks.includes(Number(state.cleanRewindWeek))) state.cleanRewindWeek = "";
  els.rewindGameweekInput.innerHTML = [`<option value="">Current table</option>`]
    .concat(weeks.map((week) => `<option value="${week}">Before Gameweek ${week}</option>`))
    .join("");
  els.rewindGameweekInput.value = state.cleanRewindWeek || "";
  els.rewindTableBox.innerHTML = state.cleanRewindWeek
    ? `<p class="empty-note">The main clean table is showing the standings before Gameweek ${state.cleanRewindWeek}.</p>`
    : `<p class="empty-note">Choose a gameweek to rewind the main clean table.</p>`;
}

function renderRewindTable() {
  state.cleanRewindWeek = els.rewindGameweekInput.value;
  const league = selectedLeague();
  if (league) renderCleanTable(league);
}

function renderShareTeamOptions(league) {
  els.shareTeamInput.innerHTML = tableWithRules(league)
    .map((row) => `<option value="${row.teamId}">${escapeHtml(row.team.name)}</option>`)
    .join("");
  els.shareTeamInput.hidden = els.shareModeInput.value !== "team";
}

function renderCleanSeasonOptions() {
  const group = selectedGroup();
  const options = [`<option value="current">Current: ${escapeHtml(group?.seasonName || "Season 1")}</option>`]
    .concat((group?.seasons || []).map((season) => `<option value="${season.id}">${escapeHtml(season.name)}</option>`));
  els.cleanSeasonInput.innerHTML = options.join("");
  if (!options.some((option) => option.includes(`value="${state.activeCleanSeasonId}"`))) state.activeCleanSeasonId = "current";
  els.cleanSeasonInput.value = state.activeCleanSeasonId;
}

function selectedSnapshotLeague(currentLeague) {
  if (state.activeCleanSeasonId === "current") return null;
  const season = selectedGroup()?.seasons?.find((item) => item.id === state.activeCleanSeasonId);
  return season?.leagues?.find((item) => item.originalLeagueId === currentLeague.id || item.name === currentLeague.name) || null;
}

function renderSnapshotCleanTable(snapshotLeague) {
  els.cleanLeagueName.textContent = `${snapshotLeague.name} | ${snapshotLeague.seasonName}`;
  renderSnapshotLegend(snapshotLeague);
  els.deductionNotes.innerHTML = snapshotLeague.deductionNotes || "";
  els.rewindGameweekInput.innerHTML = `<option value="">Season archive</option>`;
  els.rewindTableBox.innerHTML = `<p class="empty-note">Gameweek rewind is available for the current season table.</p>`;
  els.cleanTableBody.innerHTML = "";
  snapshotLeague.table.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.className = qualificationClass(row.positionRule);
    tr.style.setProperty("--custom-zone", row.positionRule.customColor || "#6d4ab3");
    tr.innerHTML = `
      <td><span class="rank-pill">${index + 1}</span></td>
      <td><button class="team-link" data-team-id="${escapeAttribute(row.teamId)}" type="button">${escapeHtml(row.teamName)}${row.playoffBadge || ""}</button></td>
      <td>${row.played}</td><td>${row.won}</td><td>${row.drawn}</td><td>${row.lost}</td>
      <td>${row.for}</td><td>${row.against}</td><td>${row.diff}</td><td><strong>${row.points}</strong></td>
      <td>${renderForm(row.form || [])}</td>
      <td>${row.status ? `<span class="status-chip">${escapeHtml(row.status)}</span>` : ""}</td>
    `;
    tr.querySelector(".team-link").addEventListener("click", () => openTeamDialog(snapshotLeague, row.teamId, true));
    els.cleanTableBody.append(tr);
  });
}

function generateShareCode() {
  const league = selectedLeague();
  if (!league) return;
  const payload = createSharePayload(league, els.shareModeInput.value, els.shareTeamInput.value);
  const shareCode = encodeSharePayload(payload);
  const url = new URL(window.location.href);
  url.hash = `share=${shareCode}`;
  showShareDialog(url.href);
}

function createSharePayload(league, mode = "league", teamId = "") {
  const snapshotLeague = selectedSnapshotLeague(league);
  if (snapshotLeague) {
    return {
      version: 1,
      mode,
      name: snapshotLeague.name,
      seasonName: snapshotLeague.seasonName,
      table: mode === "fixtures" ? [] : snapshotLeague.table,
      fixtures: mode === "league" || mode === "team" ? [] : shareFixtures(snapshotLeague),
      team: mode === "team" ? shareTeamProfile(snapshotLeague, teamId) : null,
      deductionNotes: plainDeductionNotesFromSnapshot(snapshotLeague),
    };
  }
  const table = tableWithRules(league);
  return {
    version: 1,
    mode,
    name: league.name,
    seasonName: selectedGroup()?.seasonName || "Current Season",
    table: mode === "fixtures" ? [] : table.map((row, index) => ({
      teamId: row.teamId,
      teamName: row.team.name,
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      for: row.for,
      against: row.against,
      diff: row.diff,
      points: row.points,
      form: row.form,
      status: mathematicalStatus(league, table, row, index),
      positionRule: row.positionRule,
      playoffBadge: playoffMovementBadge(league, row.teamId),
    })),
    fixtures: mode === "league" || mode === "team" ? [] : shareFixtures(league),
    team: mode === "team" ? shareTeamProfile(league, teamId) : null,
    deductionNotes: deductionNotesFor(league, table),
  };
}

function shareTeamProfile(leagueLike, teamId) {
  const table = leagueLike.table || tableWithRules(leagueLike);
  const row = table.find((item) => item.teamId === teamId) || table[0];
  if (!row) return null;
  const fixtures = (leagueLike.fixtures || [])
    .filter((fixture) => fixture.homeId === row.teamId || fixture.awayId === row.teamId)
    .map((fixture) => ({
      gameweek: fixture.gameweek || 1,
      homeName: plainTeamName(leagueLike, fixture.homeId),
      awayName: plainTeamName(leagueLike, fixture.awayId),
      homeScore: fixture.homeScore,
      awayScore: fixture.awayScore,
      played: Boolean(fixture.played && Number.isFinite(fixture.homeScore) && Number.isFinite(fixture.awayScore)),
    }));
  return {
    teamName: row.team?.name || row.teamName,
    played: row.played,
    won: row.won,
    drawn: row.drawn,
    lost: row.lost,
    for: row.for,
    against: row.against,
    diff: row.diff,
    points: row.points,
    form: row.form || [],
    status: row.status || "",
    fixtures,
  };
}

function shareFixtures(leagueLike) {
  return (leagueLike.fixtures || []).map((fixture) => ({
    id: fixture.id,
    gameweek: fixture.gameweek || 1,
    date: fixture.date || "",
    homeName: plainTeamName(leagueLike, fixture.homeId),
    awayName: plainTeamName(leagueLike, fixture.awayId),
    homeScore: fixture.homeScore,
    awayScore: fixture.awayScore,
    played: Boolean(fixture.played && Number.isFinite(fixture.homeScore) && Number.isFinite(fixture.awayScore)),
  }));
}

function encodeSharePayload(payload) {
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeSharePayload(code) {
  const base64 = code.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(code.length / 4) * 4, "=");
  return JSON.parse(decodeURIComponent(escape(atob(base64))));
}

function showShareDialog(url) {
  state.latestShareUrl = url;
  els.shareLinkOutput.value = url;
  els.shareQrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}`;
  els.shareDialog.showModal();
  copyShareUrl(url);
}

async function copyShareUrl(url = state.latestShareUrl) {
  try {
    await navigator.clipboard.writeText(url);
    notify("Share link copied.", "success");
  } catch {
    notify("Copy failed. The link is shown in the share dialog.", "warn");
  }
}

function maybeRenderSharedPage() {
  const match = window.location.hash.match(/^#share=(.+)$/);
  if (!match) return false;
  try {
    renderSharedCleanPage(decodeSharePayload(match[1]));
    return true;
  } catch {
    alert("This share link could not be opened.");
    window.location.hash = "";
    return false;
  }
}

function renderSharedCleanPage(payload) {
  els.sharedSeasonName.textContent = payload.seasonName || "Shared League";
  els.sharedLeagueName.textContent = payload.name || "League Table";
  renderSharedLegend(payload.table || []);
  els.sharedTableBody.innerHTML = "";
  (payload.table || []).forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.className = qualificationClass(row.positionRule || defaultPositionRule(0));
    tr.style.setProperty("--custom-zone", row.positionRule?.customColor || "#6d4ab3");
    tr.innerHTML = `
      <td><span class="rank-pill">${index + 1}</span></td>
      <td><strong>${escapeHtml(row.teamName)}${row.playoffBadge || ""}</strong></td>
      <td>${row.played}</td><td>${row.won}</td><td>${row.drawn}</td><td>${row.lost}</td>
      <td>${row.for}</td><td>${row.against}</td><td>${row.diff}</td><td><strong>${row.points}</strong></td>
      <td>${renderForm(row.form || [])}</td>
      <td>${row.status ? `<span class="status-chip">${escapeHtml(row.status)}</span>` : ""}</td>
    `;
    els.sharedTableBody.append(tr);
  });
  els.sharedDeductionNotes.innerHTML = (payload.deductionNotes || []).map((note) => `<p>* ${escapeHtml(note)}</p>`).join("");
  renderSharedFixtures(payload.fixtures || []);
  renderSharedTeamProfile(payload.team);
  setSharedTab("league");
  if (payload.mode === "fixtures") setSharedTab("fixtures");
  if (payload.mode === "team") setSharedTab("team");
  showPage("share");
}

function setSharedTab(tab) {
  els.sharedLeagueView.hidden = tab !== "league";
  els.sharedFixturesView.hidden = tab !== "fixtures";
  els.sharedTeamView.hidden = tab !== "team";
  els.sharedLeagueTab.classList.toggle("active", tab === "league");
  els.sharedFixturesTab.classList.toggle("active", tab === "fixtures");
  els.sharedTeamTab.classList.toggle("active", tab === "team");
}

function renderSharedTeamProfile(team) {
  if (!team) {
    els.sharedTeamProfile.innerHTML = `<p class="empty-note">No team profile was included in this share.</p>`;
    return;
  }
  els.sharedTeamProfile.innerHTML = `
    <div class="team-profile-header">
      <div>
        <p class="eyebrow">Team profile</p>
        <h3>${escapeHtml(team.teamName)}</h3>
      </div>
      ${team.status ? `<span class="status-chip">${escapeHtml(team.status)}</span>` : ""}
    </div>
    <div class="team-stat-grid">
      ${teamStat("P", team.played)}
      ${teamStat("W", team.won)}
      ${teamStat("D", team.drawn)}
      ${teamStat("L", team.lost)}
      ${teamStat("For", team.for)}
      ${teamStat("Ag", team.against)}
      ${teamStat("Diff", team.diff)}
      ${teamStat("Pts", team.points)}
    </div>
    <div class="team-profile-fixtures">
      ${(team.fixtures || []).map((fixture) => `
        <div class="shared-fixture-row">
          <span>GW ${fixture.gameweek || 1}</span>
          <strong>${escapeHtml(fixture.homeName)}</strong>
          <strong class="score-box ${sharedResultClass(fixture, "home")}">${fixture.played ? fixture.homeScore : "-"}</strong>
          <strong class="score-box ${sharedResultClass(fixture, "away")}">${fixture.played ? fixture.awayScore : "-"}</strong>
          <strong>${escapeHtml(fixture.awayName)}</strong>
          <span class="fixture-state">${fixture.played ? "Played" : "Upcoming"}</span>
        </div>
      `).join("") || `<p class="empty-note">No fixtures shared for this team.</p>`}
    </div>
  `;
}

function teamStat(label, value) {
  return `<div class="team-stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function renderSharedFixtures(fixtures) {
  els.sharedFixturesList.innerHTML = "";
  if (!fixtures.length) {
    els.sharedFixturesList.innerHTML = `<p class="empty-note">No fixtures were shared for this league.</p>`;
    return;
  }
  const byGameweek = new Map();
  fixtures
    .slice()
    .sort((a, b) => (a.gameweek || 1) - (b.gameweek || 1))
    .forEach((fixture) => byGameweek.set(fixture.gameweek || 1, [...(byGameweek.get(fixture.gameweek || 1) || []), fixture]));
  byGameweek.forEach((items, gameweek) => {
    const section = document.createElement("section");
    section.className = "gameweek";
    section.innerHTML = `<h4>Gameweek ${gameweek}</h4>`;
    items.forEach((fixture) => {
      const row = document.createElement("div");
      row.className = "shared-fixture-row";
      const played = fixture.played && Number.isFinite(fixture.homeScore) && Number.isFinite(fixture.awayScore);
      row.innerHTML = `
        <span>${escapeHtml(fixture.homeName)}</span>
        <strong class="score-box ${sharedResultClass(fixture, "home")}">${played ? fixture.homeScore : "-"}</strong>
        <span class="fixture-separator">v</span>
        <strong class="score-box ${sharedResultClass(fixture, "away")}">${played ? fixture.awayScore : "-"}</strong>
        <span>${escapeHtml(fixture.awayName)}</span>
        <span class="fixture-state">${played ? "Played" : "Upcoming"}</span>
        <span class="fixture-state">${fixture.date ? escapeHtml(fixture.date) : "No date"}</span>
      `;
      section.append(row);
    });
    els.sharedFixturesList.append(section);
  });
}

function sharedResultClass(fixture, side) {
  if (!fixture.played || !Number.isFinite(fixture.homeScore) || !Number.isFinite(fixture.awayScore)) return "future";
  if (fixture.homeScore === fixture.awayScore) return "draw";
  const homeWon = fixture.homeScore > fixture.awayScore;
  return (side === "home" && homeWon) || (side === "away" && !homeWon) ? "win" : "loss";
}

function renderSharedLegend(table) {
  const seen = new Map();
  table.forEach((row) => {
    const rule = row.positionRule || defaultPositionRule(0);
    const label = rule.qualification === "custom" ? rule.customQualification || "Custom Qualification" : qualificationTypes[rule.qualification];
    const color = qualificationColor(rule);
    const key = `${rule.qualification}:${label}:${color}`;
    if (rule.qualification === "none" || seen.has(key)) return;
    seen.set(key, { label, color });
  });
  els.sharedLegend.innerHTML = "";
  seen.forEach((item) => {
    const chip = document.createElement("div");
    chip.className = "legend-chip";
    chip.innerHTML = `<span></span><strong></strong>`;
    chip.querySelector("span").style.background = item.color;
    chip.querySelector("strong").textContent = item.label;
    els.sharedLegend.append(chip);
  });
}

function renderSnapshotLegend(snapshotLeague) {
  const seen = new Map();
  snapshotLeague.table.forEach((row) => {
    const rule = row.positionRule || defaultPositionRule(0);
    const label = rule.qualification === "custom" ? rule.customQualification || "Custom Qualification" : qualificationTypes[rule.qualification];
    const color = qualificationColor(rule);
    const key = `${rule.qualification}:${label}:${color}`;
    if (rule.qualification === "none" || seen.has(key)) return;
    seen.set(key, { label, color });
  });
  els.cleanLegend.innerHTML = "";
  seen.forEach((item) => {
    const chip = document.createElement("div");
    chip.className = "legend-chip";
    chip.innerHTML = `<span></span><strong></strong>`;
    chip.querySelector("span").style.background = item.color;
    chip.querySelector("strong").textContent = item.label;
    els.cleanLegend.append(chip);
  });
}

function playoffMovementBadge(league, teamId) {
  if (league.playoffs.championId === teamId) return `<span class="movement-badge badge-promoted">P</span>`;
  if (league.relegationPlayoff.championId === teamId) return `<span class="movement-badge badge-relegated">R</span>`;
  return "";
}

function teamColorDot(league, team) {
  return league.showTeamColors ? `<span class="team-color-dot" style="background:${escapeAttribute(team.color || "#65736f")}"></span>` : "";
}

function renderDeductionNotes(league, table = tableWithRules(league)) {
  const notes = deductionNotesFor(league, table);
  els.deductionNotes.innerHTML = notes.length ? notes.map((note) => `<p>* ${escapeHtml(note)}</p>`).join("") : "";
}

function deductionNotesFor(league, table = tableWithRules(league)) {
  return table
    .filter((row) => row.deduction > 0)
    .map((row) => `${row.team.name} has been deducted ${row.deduction} point${row.deduction === 1 ? "" : "s"}.`);
}

function renderCleanLegend(league) {
  const seen = new Map();
  tableWithRules(league).forEach((row) => {
    const rule = row.positionRule;
    const label = rule.qualification === "custom" ? rule.customQualification || "Custom Qualification" : qualificationTypes[rule.qualification];
    const color = qualificationColor(rule);
    const key = `${rule.qualification}:${label}:${color}`;
    if (rule.qualification === "none" || seen.has(key)) return;
    seen.set(key, { label, color });
  });
  els.cleanLegend.innerHTML = "";
  if (!seen.size) return;
  seen.forEach((item) => {
    const chip = document.createElement("div");
    chip.className = "legend-chip";
    chip.innerHTML = `<span></span><strong></strong>`;
    chip.querySelector("span").style.background = item.color;
    chip.querySelector("strong").textContent = item.label;
    els.cleanLegend.append(chip);
  });
}

function qualificationColor(rule) {
  return {
    automatic: "#177245",
    playoff: "#235a97",
    relegationPlayoff: "#b96919",
    relegation: "#b83931",
    custom: rule.customColor || "#6d4ab3",
  }[rule.qualification] || "#6b7773";
}

function mathematicalStatus(league, table, row, index) {
  const autoCount = countQualification(league, "automatic");
  const playoffCount = countQualification(league, "playoff");
  const relegationCount = countQualification(league, "relegation");
  if (guaranteedTopCut(league, table, row, 1)) return "Guaranteed 1st";
  if (autoCount && guaranteedTopCut(league, table, row, autoCount)) return "Guaranteed automatic promotion";
  if (playoffCount && guaranteedTopCut(league, table, row, autoCount + playoffCount)) return "Guaranteed playoffs minimum";
  if (relegationCount && guaranteedRelegated(league, table, row, relegationCount)) return "Relegation Confirmed";
  return "";
}

function guaranteedTopCut(league, table, row, cut) {
  return worstPossibleRank(league, table, row) <= cut;
}

function worstPossibleRank(league, table, row) {
  return 1 + table.filter((other) => other.teamId !== row.teamId && maximumPointsFor(league, other) >= row.points).length;
}

function guaranteedRelegated(league, table, row, relegationCount) {
  const safeSlots = Math.max(0, table.length - relegationCount);
  return bestPossibleRank(league, table, row) > safeSlots;
}

function guaranteedSafe(league, table, row, relegationCount) {
  if (!relegationCount) return true;
  const safeSlots = Math.max(0, table.length - relegationCount);
  return worstPossibleRank(league, table, row) <= safeSlots;
}

function bestPossibleRank(league, table, row) {
  const maxPoints = maximumPointsFor(league, row);
  return 1 + table.filter((other) => other.teamId !== row.teamId && other.points > maxPoints).length;
}

function maximumPointsFor(league, row) {
  return row.points + remainingMatchesForTeam(league, row.teamId) * 3;
}

function remainingMatchesForTeam(league, teamId) {
  return league.fixtures.filter((fixture) => !fixture.played && (fixture.homeId === teamId || fixture.awayId === teamId)).length;
}

function countQualification(league, type) {
  ensurePositionRules(league);
  return league.positionRules.filter((rule) => rule.qualification === type).length;
}

function renderForm(form) {
  if (!form.length) return `<span class="empty-note">-</span>`;
  return `<div class="form-dots">${form.map((result) => `<span class="form-dot ${result.toLowerCase()}">${result}</span>`).join("")}</div>`;
}

function renderFixtures(league) {
  renderManualFixtureControls(league);
  renderFixtureFilters(league);
  els.fixturesList.innerHTML = "";
  if (!league.fixtures.length) {
    els.fixturesList.innerHTML = `<p class="empty-note">Generate fixtures or add manual fixtures to start entering ${escapeHtml((league.pointLabel || "goal").toLowerCase())} totals and automatic tables.</p>`;
    return;
  }
  const byGameweek = new Map();
  league.fixtures
    .filter((fixture) => state.fixtureFilter === "all" || String(fixture.gameweek) === state.fixtureFilter)
    .forEach((fixture) => byGameweek.set(fixture.gameweek, [...(byGameweek.get(fixture.gameweek) || []), fixture]));
  els.fixturesList.classList.toggle("calendar-mode", state.fixtureCalendarMode);
  byGameweek.forEach((fixtures, gameweek) => {
    const section = document.createElement("section");
    section.className = "gameweek";
    section.innerHTML = `<h4>Gameweek ${gameweek}</h4>`;
    fixtures.forEach((fixture) => section.append(renderFixtureRow(league, fixture)));
    els.fixturesList.append(section);
  });
}

function renderFixtureFilters(league) {
  const weeks = [...new Set(league.fixtures.map((fixture) => fixture.gameweek))].sort((a, b) => a - b);
  els.fixtureGameweekFilter.innerHTML = [`<option value="all">All gameweeks</option>`]
    .concat(weeks.map((week) => `<option value="${week}">Gameweek ${week}</option>`))
    .join("");
  els.fixtureGameweekFilter.value = weeks.some((week) => String(week) === state.fixtureFilter) ? state.fixtureFilter : "all";
  els.fixtureCalendarButton.textContent = state.fixtureCalendarMode ? "List View" : "Calendar View";
}

function renderManualFixtureControls(league) {
  const options = league.teams.map((team) => `<option value="${team.id}">${escapeHtml(team.name)}</option>`).join("");
  els.manualHomeInput.innerHTML = options;
  els.manualAwayInput.innerHTML = options;
  els.manualHomeInput.value = league.teams[0]?.id || "";
  els.manualAwayInput.value = league.teams[1]?.id || league.teams[0]?.id || "";
  els.manualGameweekInput.value = String(nextGameweek(league));
  els.addManualFixtureButton.disabled = league.teams.length < 2;
}

function renderFixtureRow(league, fixture) {
  const row = document.createElement("div");
  row.className = "fixture-row";
  const notes = fixtureClinchNotes(league, fixture);
  row.innerHTML = `
    <span>${teamName(league, fixture.homeId)}</span>
    <input data-score="home" type="number" min="0" value="${fixture.homeScore ?? ""}" aria-label="Home ${escapeAttribute(league.pointLabel)}s" />
    <span class="fixture-separator">v</span>
    <input data-score="away" type="number" min="0" value="${fixture.awayScore ?? ""}" aria-label="Away ${escapeAttribute(league.pointLabel)}s" />
    <span>${teamName(league, fixture.awayId)}</span>
    <input data-date="fixture" type="date" value="${escapeAttribute(fixture.date || "")}" aria-label="Fixture date" />
    <div class="fixture-actions">
      <button class="secondary-button" data-action="clear" type="button">Clear</button>
      <button class="danger-button" data-action="delete" type="button">Delete</button>
    </div>
    ${notes.length ? `<div class="fixture-note">${notes.map((note) => `<span>${escapeHtml(note)}</span>`).join("")}</div>` : ""}
  `;
  row.querySelectorAll("input").forEach((input) => input.addEventListener("change", (event) => updateFixture(league, fixture.id, event.target)));
  row.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.action === "delete") deleteFixture(league, fixture.id);
    else clearFixture(league, fixture.id);
  }));
  return row;
}

function fixtureClinchNotes(league, fixture) {
  if (fixture.played) return [];
  return [fixture.homeId, fixture.awayId].flatMap((teamId) => {
    const copy = structuredClone(league);
    const copyFixture = copy.fixtures.find((item) => item.id === fixture.id);
    const isHome = copyFixture.homeId === teamId;
    copyFixture.homeScore = isHome ? 1 : 0;
    copyFixture.awayScore = isHome ? 0 : 1;
    copyFixture.played = true;
    const table = tableWithRules(copy);
    const row = table.find((item) => item.teamId === teamId);
    if (!row) return [];
    const status = mathematicalStatus(copy, table, row, row.position);
    const labels = {
      "Guaranteed 1st": "can guarantee 1st place with a win",
      "Guaranteed automatic promotion": "can guarantee automatic promotion with a win",
      "Guaranteed playoffs minimum": "can guarantee playoffs with a win",
    };
    return labels[status] ? [`${plainTeamName(league, teamId)} ${labels[status]}`] : [];
  });
}

function renderPlayoffs(league) {
  renderBracket(league, league.playoffs, els.playoffList, "playoff");
  renderBracket(league, league.relegationPlayoff, els.relegationPlayoffList, "relegation");
}

function renderPlayoffBracketView(league) {
  const brackets = [
    { title: "Promotion Playoffs", bracket: league.playoffs, kind: "playoff" },
    { title: "Relegation Playoff", bracket: league.relegationPlayoff, kind: "relegation" },
  ];
  els.bracketStage.innerHTML = "";
  brackets.forEach((item) => {
    const panel = document.createElement("section");
    panel.className = "bracket-panel";
    panel.innerHTML = `<h4>${item.title}</h4>`;
    if (!item.bracket.matches.length) {
      panel.innerHTML += `<p class="empty-note">Generate matchups in the Playoffs tab first.</p>`;
      els.bracketStage.append(panel);
      return;
    }
    const rounds = [...new Set(item.bracket.matches.map((match) => match.round))].sort((a, b) => a - b);
    const grid = document.createElement("div");
    grid.className = "bracket-rounds";
    rounds.forEach((round) => {
      const roundEl = document.createElement("div");
      roundEl.className = "bracket-round";
      roundEl.innerHTML = `<strong>${round === rounds.at(-1) && rounds.length > 1 ? "Final" : `Round ${round}`}</strong>`;
      item.bracket.matches.filter((match) => match.round === round).forEach((match) => {
        roundEl.append(renderBracketCard(league, match, item.kind));
      });
      grid.append(roundEl);
    });
    panel.append(grid);
    if (item.bracket.championId) {
      const winner = document.createElement("div");
      winner.className = "winner-strip";
      winner.textContent = `${item.kind === "playoff" ? "Projected promoted" : "Projected relegated"}: ${plainTeamName(league, item.bracket.championId)}`;
      panel.append(winner);
    }
    els.bracketStage.append(panel);
  });
}

function renderBracketCard(league, match, kind) {
  const card = document.createElement("article");
  card.className = "bracket-card";
  const homeName = plainTeamName(league, match.homeId);
  const awayName = plainTeamName(league, match.awayId);
  const h2h = h2hSummary(league, match.homeId, match.awayId);
  const projection = projectedPlayoffWinner(league, match, kind);
  card.innerHTML = `
    <div class="bracket-team ${match.winnerId === match.homeId ? "winner" : ""}">
      <span>${escapeHtml(homeName)}</span>
      <strong>${match.homeScore ?? "-"}</strong>
    </div>
    <div class="bracket-team ${match.winnerId === match.awayId ? "winner" : ""}">
      <span>${escapeHtml(awayName)}</span>
      <strong>${match.awayScore ?? "-"}</strong>
    </div>
    <div class="bracket-meta">
      <span>${escapeHtml(h2h)}</span>
      <span>${escapeHtml(projection)}</span>
    </div>
  `;
  return card;
}

function h2hSummary(league, homeId, awayId) {
  if (!homeId || !awayId) return "H2H: TBD";
  const fixtures = [
    ...league.fixtures,
    ...(league.playoffs?.matches || []),
    ...(league.relegationPlayoff?.matches || []),
  ].filter((fixture) => fixture.played !== false && Number.isFinite(fixture.homeScore) && Number.isFinite(fixture.awayScore)
    && ((fixture.homeId === homeId && fixture.awayId === awayId) || (fixture.homeId === awayId && fixture.awayId === homeId)));
  if (!fixtures.length) return "H2H: no meetings";
  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;
  fixtures.forEach((fixture) => {
    const homeScored = fixture.homeId === homeId ? fixture.homeScore : fixture.awayScore;
    const awayScored = fixture.homeId === homeId ? fixture.awayScore : fixture.homeScore;
    if (homeScored > awayScored) homeWins += 1;
    else if (homeScored < awayScored) awayWins += 1;
    else draws += 1;
  });
  return `H2H: ${homeWins}-${draws}-${awayWins}`;
}

function projectedPlayoffWinner(league, match, kind) {
  if (!match.homeId && !match.awayId) return "Projection: TBD";
  if (!match.awayId) return `Projection: ${plainTeamName(league, match.homeId)}`;
  if (!match.homeId) return `Projection: ${plainTeamName(league, match.awayId)}`;
  const homeScore = playoffProjectionScore(league, match.homeId, match.awayId);
  const awayScore = playoffProjectionScore(league, match.awayId, match.homeId);
  if (homeScore === awayScore) return "Projection: too close";
  const winnerId = homeScore > awayScore ? match.homeId : match.awayId;
  const label = kind === "relegation" ? "favoured to survive" : "favoured";
  return `Projection: ${plainTeamName(league, winnerId)} ${label}`;
}

function playoffProjectionScore(league, teamId, opponentId) {
  const formScore = formForTeam(league, teamId).reduce((total, result) => total + ({ W: 3, D: 1, L: 0 }[result] || 0), 0);
  const h2hFixtures = league.fixtures.filter((fixture) => fixture.played && Number.isFinite(fixture.homeScore) && Number.isFinite(fixture.awayScore)
    && ((fixture.homeId === teamId && fixture.awayId === opponentId) || (fixture.homeId === opponentId && fixture.awayId === teamId)));
  const h2hScore = h2hFixtures.reduce((total, fixture) => {
    const scored = fixture.homeId === teamId ? fixture.homeScore : fixture.awayScore;
    const conceded = fixture.homeId === teamId ? fixture.awayScore : fixture.homeScore;
    if (scored > conceded) return total + 4;
    if (scored === conceded) return total + 1;
    return total;
  }, 0);
  const row = tableWithRules(league).find((item) => item.teamId === teamId);
  return formScore + h2hScore + (row ? Math.max(0, 12 - row.position) : 0);
}

function renderBracket(league, bracket, container, kind) {
  container.innerHTML = "";
  const entrants = playoffEntrants(league, kind);
  if (!entrants.length) {
    container.innerHTML = `<p class="empty-note">No teams are marked for this playoff.</p>`;
    return;
  }
  if (!bracket.matches.length) {
    container.innerHTML = `<p class="empty-note">${escapeHtml(entrants.map((team) => team.name).join(", "))} are waiting for matchups.</p>`;
    return;
  }
  bracket.matches.forEach((match) => container.append(renderPlayoffMatch(league, bracket, match)));
  if (bracket.championId) {
    const winner = document.createElement("div");
    winner.className = "winner-strip";
    winner.textContent = `${kind === "playoff" ? "Promotion playoff winner" : "Relegation playoff loser"}: ${plainTeamName(league, bracket.championId)}`;
    container.append(winner);
  }
}

function renderPlayoffMatch(league, bracket, match) {
  const row = document.createElement("div");
  row.className = "playoff-match";
  row.innerHTML = `
    <span class="round-label">${escapeHtml(match.roundName)}</span>
    ${teamSelect(league, match.homeId, "home")}
    <input data-score="home" type="number" min="0" value="${match.homeScore ?? ""}" />
    <span class="fixture-separator">v</span>
    <input data-score="away" type="number" min="0" value="${match.awayScore ?? ""}" />
    ${teamSelect(league, match.awayId, "away")}
  `;
  row.querySelectorAll("select").forEach((select) => select.addEventListener("change", (event) => updatePlayoffTeam(league, bracket, match.id, event.target)));
  row.querySelectorAll("input").forEach((input) => input.addEventListener("change", (event) => updatePlayoffScore(league, bracket, match.id, event.target)));
  return row;
}

function renderMovementPreview(league) {
  const items = movementItemsForLeague(league).map((item) => item.text);
  els.movementPreview.innerHTML = items.length ? items.map((item) => `<div class="movement-item"><strong>${escapeHtml(item)}</strong></div>`).join("") : `<p class="empty-note">Movement appears here when positions or playoff winners are set.</p>`;
  if (league.movementLog?.length) els.movementPreview.innerHTML += `<p class="empty-note">Last applied: ${escapeHtml(league.movementLog.join("; "))}</p>`;
}

function renderDeductions(league) {
  els.deductionsList.innerHTML = "";
  tableWithRules(league).forEach((row) => {
    const item = document.createElement("div");
    item.className = "deduction-row";
    item.innerHTML = `
      <strong>${escapeHtml(row.team.name)}</strong>
      <label>
        Points deducted
        <input data-team-id="${escapeAttribute(row.teamId)}" type="number" min="0" step="1" value="${pointDeductionFor(league, row.teamId)}" />
      </label>
    `;
    item.querySelector("input").addEventListener("change", (event) => updatePointDeduction(league, event.target));
    els.deductionsList.append(item);
  });
}

function renderHistory(league) {
  const group = selectedGroup();
  const seasons = group?.seasons || [];
  const previousSeasonId = els.historySeasonInput.value || "current";
  const previousTeamId = els.historyTeamInput.value || "";
  els.historySeasonInput.innerHTML = [`<option value="current">Current: ${escapeHtml(group?.seasonName || "Season")}</option>`]
    .concat(seasons.map((season) => `<option value="${season.id}">${escapeHtml(season.name)}</option>`))
    .join("");
  els.historySeasonInput.value = seasons.some((season) => season.id === previousSeasonId) ? previousSeasonId : "current";
  const selectedSeasonId = els.historySeasonInput.value || "current";
  const sourceLeagues = selectedSeasonId === "current"
    ? sortedLeagues()
    : seasons.find((season) => season.id === selectedSeasonId)?.leagues || [];
  const teamOptions = [];
  sourceLeagues.forEach((item) => {
    const rows = item.table || tableWithRules(item);
    rows.forEach((row) => teamOptions.push({ id: row.teamId, name: row.team?.name || row.teamName, league: item.name }));
  });
  els.historyTeamInput.innerHTML = [`<option value="">All teams</option>`]
    .concat(teamOptions.map((team) => `<option value="${team.id}">${escapeHtml(team.name)} | ${escapeHtml(team.league)}</option>`))
    .join("");
  els.historyTeamInput.value = teamOptions.some((team) => team.id === previousTeamId) ? previousTeamId : "";
  const teamId = els.historyTeamInput.value;
  if (teamId) {
    renderHistoryTeam(sourceLeagues, teamId);
  } else {
    els.historyPanel.innerHTML = sourceLeagues.map((item) => {
      const rows = item.table || tableWithRules(item);
      const champion = rows[0]?.team?.name || rows[0]?.teamName || "TBD";
      const auto = rows.filter((row) => row.positionRule?.qualification === "automatic").map((row) => row.team?.name || row.teamName);
      const relegated = rows.filter((row) => row.positionRule?.qualification === "relegation").map((row) => row.team?.name || row.teamName);
      const playoffPromoted = rows.find((row) => String(row.playoffBadge || "").includes("badge-promoted"))?.teamName || "";
      return `<div class="history-card">
        <strong>${escapeHtml(item.name)}</strong>
        <span>Champion: ${escapeHtml(champion)}</span>
        <span>Automatic promotion: ${escapeHtml(auto.join(", ") || "None")}</span>
        <span>Playoff promotion: ${escapeHtml(playoffPromoted || "None")}</span>
        <span>Relegated: ${escapeHtml(relegated.join(", ") || "None")}</span>
      </div>`;
    }).join("") || `<p class="empty-note">No archived seasons yet. Complete a group season to build history.</p>`;
  }
}

function renderHistoryTeam(leagues, teamId) {
  const entries = [];
  leagues.forEach((league) => {
    const rows = league.table || tableWithRules(league);
    const row = rows.find((item) => item.teamId === teamId);
    if (row) entries.push({ league, row, position: rows.indexOf(row) + 1 });
  });
  els.historyPanel.innerHTML = entries.map(({ league, row, position }) => `
    <div class="history-card">
      <strong>${escapeHtml(row.team?.name || row.teamName)} - ${escapeHtml(league.name)}</strong>
      <span>Position ${position}</span>
      <span>${row.played}P ${row.won}W ${row.drawn}D ${row.lost}L | ${row.points} pts</span>
    </div>
  `).join("") || `<p class="empty-note">No history found for this team.</p>`;
}

function updatePointDeduction(league, input) {
  const points = Math.max(0, Number(input.value) || 0);
  league.pointDeductions ||= {};
  if (points) league.pointDeductions[input.dataset.teamId] = points;
  else delete league.pointDeductions[input.dataset.teamId];
  setUpdated(league);
  saveState();
  render();
}

function renderProjections(league) {
  els.projectionsList.innerHTML = "";
  if (!league.fixtures.length) {
    els.projectionsList.innerHTML = `<p class="empty-note">Add fixtures before projections can be calculated.</p>`;
    return;
  }
  if (!league.fixtures.some((fixture) => !fixture.played)) {
    els.projectionsList.innerHTML = `<p class="empty-note">There are no remaining fixtures in this league.</p>`;
    return;
  }
  const targets = [
    { key: "title", label: "Guarantee 1st place" },
    { key: "automatic", label: "Guarantee automatic promotion" },
    { key: "playoff", label: "Guarantee playoffs minimum" },
    { key: "survival", label: "Guarantee survival" },
  ];
  const activeTarget = targets.find((target) => target.key === state.activeRaceView) || targets[0];
  tableWithRules(league).forEach((row) => {
    const fixture = nextFixtureForTeam(league, row.teamId);
    if (!fixture) return;
    const scenarios = nextMatchProjectionScenarios(league, row.teamId, fixture);
    const currentResults = projectionResults(league, tableWithRules(league), row);
    const card = document.createElement("article");
    card.className = "projection-card";
    card.innerHTML = `<h4>${escapeHtml(row.team.name)}</h4><p class="empty-note">Next: ${escapeHtml(plainTeamName(league, fixture.homeId))} v ${escapeHtml(plainTeamName(league, fixture.awayId))}</p>`;
    [activeTarget].forEach((target) => {
      const matches = scenarios.filter((scenario) => scenario.results[target.key] && !currentResults[target.key]);
      const line = document.createElement("div");
      line.className = "projection-line";
      line.innerHTML = `<strong>${target.label}</strong>`;
      if (!matches.length) {
        line.innerHTML += `<span>Cannot be achieved in the next match.</span>`;
      } else {
        line.innerHTML += matches.map((scenario) => `<span>${escapeHtml(scenario.label)}</span>`).join("");
      }
      card.append(line);
    });
    els.projectionsList.append(card);
  });
}

function nextFixtureForTeam(league, teamId) {
  return league.fixtures
    .filter((fixture) => !fixture.played && (fixture.homeId === teamId || fixture.awayId === teamId))
    .sort((a, b) => (a.gameweek || 1) - (b.gameweek || 1))[0] || null;
}

function nextMatchProjectionScenarios(league, teamId, fixture) {
  const isHome = fixture.homeId === teamId;
  const outcomes = [
    { homeScore: isHome ? 1 : 0, awayScore: isHome ? 0 : 1, label: `${plainTeamName(league, teamId)} win` },
    { homeScore: 0, awayScore: 0, label: `${plainTeamName(league, teamId)} draw` },
    { homeScore: isHome ? 0 : 1, awayScore: isHome ? 1 : 0, label: `${plainTeamName(league, teamId)} lose` },
  ];
  return outcomes.map((outcome) => {
    const copy = structuredClone(league);
    const copyFixture = copy.fixtures.find((item) => item.id === fixture.id);
    copyFixture.homeScore = outcome.homeScore;
    copyFixture.awayScore = outcome.awayScore;
    copyFixture.played = true;
    const table = tableWithRules(copy);
    const projectedRow = table.find((item) => item.teamId === teamId);
    return {
      label: outcome.label,
      results: projectionResults(copy, table, projectedRow),
    };
  });
}

function projectionResults(league, table, row) {
  if (!row) return {};
  const status = mathematicalStatus(league, table, row, row.position);
  return {
    title: status === "Guaranteed 1st",
    automatic: status === "Guaranteed 1st" || status === "Guaranteed automatic promotion",
    playoff: status === "Guaranteed 1st" || status === "Guaranteed automatic promotion" || status === "Guaranteed playoffs minimum",
    survival: guaranteedSafe(league, table, row, countQualification(league, "relegation")),
  };
}

function openTeamDialog(leagueLike, teamId, isSnapshot = false) {
  const team = isSnapshot
    ? leagueLike.teams.find((item) => item.id === teamId) || { name: leagueLike.table.find((row) => row.teamId === teamId)?.teamName || "Team" }
    : leagueLike.teams.find((item) => item.id === teamId);
  if (!team) return;
  els.teamDialogTitle.textContent = `${team.name} Fixtures`;
  const fixtures = leagueLike.fixtures
    .filter((fixture) => fixture.homeId === teamId || fixture.awayId === teamId)
    .sort((a, b) => (a.gameweek || 1) - (b.gameweek || 1));
  const playoffMatches = teamPlayoffMatches(leagueLike, teamId);
  const rows = [
    ...fixtures.map((fixture) => teamFixtureLine(leagueLike, fixture, teamId)),
    ...playoffMatches.map((match) => teamPlayoffLine(leagueLike, match, teamId)),
  ];
  els.teamFixtureList.innerHTML = rows.length
    ? rows.join("")
    : `<p class="empty-note">No fixtures found for this team.</p>`;
  els.teamDialog.showModal();
}

function teamFixtureLine(leagueLike, fixture, teamId) {
  const played = fixture.played && Number.isFinite(fixture.homeScore) && Number.isFinite(fixture.awayScore);
  const resultClass = played ? resultClassForFixture(fixture, teamId) : "future";
  return `
    <div class="team-fixture-row">
      <span>GW ${fixture.gameweek || 1}</span>
      <strong>${escapeHtml(plainTeamName(leagueLike, fixture.homeId))}</strong>
      <span class="score-box ${resultClass}">${played ? `${fixture.homeScore} - ${fixture.awayScore}` : "v"}</span>
      <strong>${escapeHtml(plainTeamName(leagueLike, fixture.awayId))}</strong>
      <span>${played ? "Played" : "Upcoming"}</span>
    </div>
  `;
}

function teamPlayoffMatches(leagueLike, teamId) {
  return [
    ...(leagueLike.playoffs?.matches || []).map((match) => ({ ...match, bracketLabel: "Promotion Playoff" })),
    ...(leagueLike.relegationPlayoff?.matches || []).map((match) => ({ ...match, bracketLabel: "Relegation Playoff" })),
  ].filter((match) => match.homeId === teamId || match.awayId === teamId);
}

function teamPlayoffLine(leagueLike, match, teamId) {
  const played = Number.isFinite(match.homeScore) && Number.isFinite(match.awayScore);
  const resultClass = played ? resultClassForFixture(match, teamId) : "future";
  return `
    <div class="team-fixture-row">
      <span>${escapeHtml(match.bracketLabel)}</span>
      <strong>${escapeHtml(plainTeamName(leagueLike, match.homeId))}</strong>
      <span class="score-box ${resultClass}">${played ? `${match.homeScore} - ${match.awayScore}` : "v"}</span>
      <strong>${escapeHtml(plainTeamName(leagueLike, match.awayId))}</strong>
      <span>${escapeHtml(match.roundName || "Playoff")}</span>
    </div>
  `;
}

function resultClassForFixture(fixture, teamId) {
  const scored = fixture.homeId === teamId ? fixture.homeScore : fixture.awayScore;
  const conceded = fixture.homeId === teamId ? fixture.awayScore : fixture.homeScore;
  if (scored > conceded) return "win";
  if (scored < conceded) return "loss";
  return "draw";
}

function renderLeagueGraphic() {
  const league = selectedLeague();
  if (!league) return;
  const snapshotLeague = selectedSnapshotLeague(league);
  const currentTable = snapshotLeague ? [] : tableWithRules(league);
  const rows = snapshotLeague
    ? snapshotLeague.table.map((row) => ({
      ...row,
      playoffBadge: String(row.playoffBadge || "").includes("badge-promoted") ? "P" : String(row.playoffBadge || "").includes("badge-relegated") ? "R" : "",
    }))
    : currentTable.map((row, index) => ({
      teamName: row.team.name,
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      for: row.for,
      against: row.against,
      diff: row.diff,
      points: row.points,
      positionRule: row.positionRule,
      status: mathematicalStatus(league, currentTable, row, index),
      playoffBadge: playoffMovementBadge(league, row.teamId).includes("badge-promoted") ? "P" : playoffMovementBadge(league, row.teamId).includes("badge-relegated") ? "R" : "",
    }));
  const title = snapshotLeague ? snapshotLeague.name : league.name;
  const eyebrow = snapshotLeague ? snapshotLeague.seasonName : selectedGroup()?.seasonName || "Current Season";
  const legend = graphicLegendItems(rows);
  const deductionNotes = snapshotLeague ? plainDeductionNotesFromSnapshot(snapshotLeague) : deductionNotesFor(league, currentTable);
  const scale = 2;
  const width = 1120;
  const margin = 48;
  const rowHeight = 42;
  const headerHeight = 36;
  const titleBlockHeight = 106;
  const legendHeight = legend.length ? 38 : 0;
  const notesHeight = deductionNotes.length ? 28 + deductionNotes.length * 20 : 0;
  const panelTop = margin + titleBlockHeight;
  const panelHeight = 28 + legendHeight + headerHeight + rows.length * rowHeight + notesHeight + 26;
  const height = panelTop + panelHeight + margin;
  const panelX = margin;
  const panelY = panelTop;
  const panelW = width - margin * 2;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  ctx.fillStyle = "#f7faf8";
  ctx.fillRect(0, 0, width, height);
  const greenGlow = ctx.createRadialGradient(0, 0, 40, 0, 0, 580);
  greenGlow.addColorStop(0, "rgba(23, 114, 69, 0.14)");
  greenGlow.addColorStop(1, "rgba(23, 114, 69, 0)");
  ctx.fillStyle = greenGlow;
  ctx.fillRect(0, 0, width, height);
  const blueGlow = ctx.createRadialGradient(width, height, 40, width, height, 620);
  blueGlow.addColorStop(0, "rgba(35, 90, 151, 0.13)");
  blueGlow.addColorStop(1, "rgba(35, 90, 151, 0)");
  ctx.fillStyle = blueGlow;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#0c5c35";
  ctx.font = "900 13px Inter, Arial, sans-serif";
  ctx.fillText(String(eyebrow).toUpperCase(), margin, 66);
  ctx.fillStyle = "#17211f";
  ctx.font = "900 42px Inter, Arial, sans-serif";
  drawFittedText(ctx, title, margin, 112, width - margin * 2, 42);

  drawRoundRect(ctx, panelX, panelY, panelW, panelHeight, 8, "rgba(255, 255, 255, 0.92)", "#d7dfdc");

  const columns = [
    ["#", panelX + 22, 44],
    ["Team", panelX + 82, 350],
    ["P", panelX + 478, 46],
    ["W", panelX + 536, 46],
    ["D", panelX + 594, 46],
    ["L", panelX + 652, 46],
    ["F", panelX + 710, 48],
    ["A", panelX + 770, 48],
    ["Diff", panelX + 830, 64],
    ["Pts", panelX + 920, 56],
  ];

  let cursorY = panelY + 22;
  if (legend.length) {
    let x = panelX + 22;
    const y = cursorY + 16;
    legend.forEach((item) => {
      const chipW = Math.min(210, 42 + item.label.length * 7.5);
      drawRoundRect(ctx, x, y - 18, chipW, 26, 8, "#f7faf8", "#d7dfdc");
      ctx.fillStyle = item.color;
      ctx.fillRect(x + 10, y - 10, 12, 12);
      ctx.fillStyle = "#65736f";
      ctx.font = "800 12px Inter, Arial, sans-serif";
      drawFittedText(ctx, item.label, x + 30, y, chipW - 38, 12);
      x += chipW + 8;
    });
    cursorY += legendHeight;
  }

  const headerY = cursorY + 24;
  ctx.fillStyle = "#eef4f1";
  ctx.fillRect(panelX + 14, headerY - 22, panelW - 28, headerHeight);
  ctx.fillStyle = "#17211f";
  ctx.font = "800 13px Inter, Arial, sans-serif";
  columns.forEach(([label, x]) => ctx.fillText(label, x, headerY));

  const rowStartY = headerY + 34;
  rows.forEach((row, index) => {
    const y = rowStartY + index * rowHeight;
    ctx.fillStyle = index % 2 ? "#ffffff" : "#f1f6f4";
    ctx.fillRect(panelX + 14, y - 25, panelW - 28, rowHeight - 4);
    const zoneColor = qualificationColor(row.positionRule || defaultPositionRule(0));
    drawRoundRect(ctx, panelX + 22, y - 19, 30, 28, 8, zoneColor, zoneColor);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 14px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(index + 1), panelX + 37, y);
    ctx.textAlign = "left";
    ctx.fillStyle = "#17211f";
    ctx.font = "800 16px Inter, Arial, sans-serif";
    drawFittedText(ctx, row.teamName, columns[1][1], y, 300, 16);
    if (row.playoffBadge) {
      ctx.fillStyle = row.playoffBadge === "P" ? "#177245" : "#b83931";
      drawRoundRect(ctx, panelX + 406, y - 17, 22, 22, 6, ctx.fillStyle, ctx.fillStyle);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 13px Inter, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(row.playoffBadge, panelX + 417, y - 1);
      ctx.textAlign = "left";
      ctx.fillStyle = "#17211f";
    }
    ctx.font = "700 15px Inter, Arial, sans-serif";
    ctx.fillStyle = "#17211f";
    [row.played, row.won, row.drawn, row.lost, row.for, row.against, row.diff, row.points].forEach((value, valueIndex) => {
      ctx.fillText(String(value), columns[valueIndex + 2][1], y + 2);
    });
  });

  if (deductionNotes.length) {
    let y = rowStartY + rows.length * rowHeight + 18;
    ctx.fillStyle = "#65736f";
    ctx.font = "700 14px Inter, Arial, sans-serif";
    deductionNotes.forEach((note) => {
      drawFittedText(ctx, `* ${note}`, panelX + 22, y, panelW - 44, 14);
      y += 22;
    });
  }

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${slugify(title)}.png`;
  link.click();
}

function renderGameweekGraphic() {
  const league = selectedLeague();
  if (!league) return;
  const weeks = [...new Set(league.fixtures.map((fixture) => fixture.gameweek))].sort((a, b) => a - b);
  const selected = els.graphicGameweekInput?.value || state.fixtureFilter;
  const gameweek = selected === "all" ? weeks[0] : Number(selected);
  const fixtures = league.fixtures.filter((fixture) => selected === "all" || fixture.gameweek === gameweek);
  if (!fixtures.length) {
    notify("No fixtures found for that gameweek.", "warn");
    return;
  }
  const scale = 2;
  const width = 900;
  const rowHeight = 56;
  const height = 150 + fixtures.length * rowHeight + 48;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.fillStyle = "#f7faf8";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#0c5c35";
  ctx.font = "900 13px Inter, Arial, sans-serif";
  ctx.fillText(`${league.name} | ${selected === "all" ? "ALL GAMEWEEKS" : `GAMEWEEK ${gameweek}`}`.toUpperCase(), 48, 62);
  ctx.fillStyle = "#17211f";
  ctx.font = "900 36px Inter, Arial, sans-serif";
  ctx.fillText("Fixtures and Results", 48, 108);
  drawRoundRect(ctx, 48, 136, width - 96, fixtures.length * rowHeight + 24, 8, "rgba(255,255,255,.92)", "#d7dfdc");
  fixtures.forEach((fixture, index) => {
    const y = 176 + index * rowHeight;
    ctx.fillStyle = index % 2 ? "#ffffff" : "#f1f6f4";
    ctx.fillRect(66, y - 28, width - 132, rowHeight - 8);
    ctx.fillStyle = "#17211f";
    ctx.font = "900 18px Inter, Arial, sans-serif";
    ctx.fillStyle = "#65736f";
    ctx.font = "800 12px Inter, Arial, sans-serif";
    ctx.fillText(fixture.date || "No date", 86, y);
    ctx.fillStyle = "#17211f";
    ctx.font = "900 18px Inter, Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(plainTeamName(league, fixture.homeId), 342, y);
    ctx.textAlign = "center";
    ctx.fillStyle = "#65736f";
    ctx.font = "900 16px Inter, Arial, sans-serif";
    ctx.fillText(fixture.played ? `${fixture.homeScore} - ${fixture.awayScore}` : "v", 450, y);
    ctx.textAlign = "left";
    ctx.fillStyle = "#17211f";
    ctx.font = "900 18px Inter, Arial, sans-serif";
    ctx.fillText(plainTeamName(league, fixture.awayId), 558, y);
  });
  ctx.textAlign = "left";
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${slugify(`${league.name}-${selected === "all" ? "all-gameweeks" : `gameweek-${gameweek}`}`)}.png`;
  link.click();
}

function renderPlayoffsGraphic() {
  const league = selectedLeague();
  if (!league) return;
  const lines = [...(league.playoffs.matches || []), ...(league.relegationPlayoff.matches || [])]
    .map((match) => `${match.roundName}: ${plainTeamName(league, match.homeId)} ${match.homeScore ?? "-"} - ${match.awayScore ?? "-"} ${plainTeamName(league, match.awayId)}`);
  renderTextGraphic(`${league.name} Playoffs`, "PLAYOFF BRACKET", lines.length ? lines : ["No playoff matches generated yet."], "playoffs");
}

function renderTeamGraphic() {
  const league = selectedLeague();
  if (!league) return;
  const table = tableWithRules(league);
  const teamId = els.graphicTeamInput.value || els.shareTeamInput.value || table[0]?.teamId;
  const row = table.find((item) => item.teamId === teamId) || table[0];
  if (!row) return;
  const scale = 2;
  const format = els.graphicFormatInput?.value || "default";
  const size = format === "story" ? [720, 1280] : format === "square" ? [1080, 1080] : [1100, 760];
  const [width, height] = size;
  const margin = format === "story" ? 42 : 48;
  const panelX = margin;
  const panelY = format === "story" ? 160 : 150;
  const panelW = width - margin * 2;
  const panelH = height - panelY - margin;
  const gap = format === "story" ? 18 : 24;
  const boxW = (panelW - gap * 3) / 2;
  const boxH = format === "story" ? 180 : 150;
  const boxX1 = panelX + gap;
  const boxX2 = boxX1 + boxW + gap;
  const boxY1 = panelY + gap;
  const boxY2 = boxY1 + boxH + gap;
  const recentMatches = recentTeamMatches(league, row.teamId, 5);
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  drawGraphicBackdrop(ctx, width, height);
  ctx.fillStyle = "#0c5c35";
  ctx.font = "900 13px Inter, Arial, sans-serif";
  ctx.fillText(`${league.name} | TEAM PROFILE`.toUpperCase(), margin, 66);
  ctx.fillStyle = "#17211f";
  ctx.font = `900 ${format === "story" ? 38 : 42}px Inter, Arial, sans-serif`;
  drawFittedText(ctx, row.team.name, margin, format === "story" ? 118 : 112, width - margin * 2, format === "story" ? 38 : 42);

  drawRoundRect(ctx, panelX, panelY, panelW, panelH, 8, "rgba(255, 255, 255, 0.92)", "#d7dfdc");
  drawTeamStatBox(ctx, boxX1, boxY1, boxW, boxH, ordinal(row.position + 1), "Position", "#17211f");
  drawRecordBox(ctx, boxX2, boxY1, boxW, boxH, row);
  drawTeamStatBox(ctx, boxX1, boxY2, boxW, boxH, String(row.points), "Points", "#177245");
  drawFormBox(ctx, boxX2, boxY2, boxW, boxH, row.form.slice(-4));

  const resultsY = boxY2 + boxH + (format === "story" ? 34 : 30);
  ctx.fillStyle = "#65736f";
  ctx.font = "900 13px Inter, Arial, sans-serif";
  ctx.fillText("PREVIOUS 5 MATCHES", boxX1, resultsY);
  drawRecentMatches(ctx, league, row.teamId, recentMatches, boxX1, resultsY + 24, panelW - gap * 2, height - resultsY - margin - 28);

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${slugify(`team-profile-${row.team.name}`)}.png`;
  link.click();
}

function renderRaceGraphic() {
  const league = selectedLeague();
  if (!league) return;
  const raceKey = els.graphicRaceInput?.value || state.activeRaceView || "title";
  const labels = { title: "Title Race", automatic: "Automatic Promotion Race", playoff: "Playoff Race", survival: "Relegation Battle" };
  const goals = {
    title: "Guaranteed 1st",
    automatic: "Automatic promotion",
    playoff: "Playoffs minimum",
    survival: "Survival",
  };
  const table = tableWithRules(league);
  const rows = raceGraphicRows(league, table, raceKey).slice(0, 8);
  const scale = 2;
  const format = els.graphicFormatInput?.value || "default";
  const size = format === "story" ? [720, 1280] : format === "square" ? [1080, 1080] : [1100, 760];
  const [width, height] = size;
  const margin = format === "story" ? 42 : 48;
  const panelX = margin;
  const panelY = format === "story" ? 160 : 150;
  const panelW = width - margin * 2;
  const panelH = height - panelY - margin;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  drawGraphicBackdrop(ctx, width, height);
  ctx.fillStyle = "#0c5c35";
  ctx.font = "900 13px Inter, Arial, sans-serif";
  ctx.fillText(`${league.name} | RACE CENTRE`.toUpperCase(), margin, 66);
  ctx.fillStyle = "#17211f";
  ctx.font = `900 ${format === "story" ? 38 : 42}px Inter, Arial, sans-serif`;
  drawFittedText(ctx, labels[raceKey] || "Race Centre", margin, format === "story" ? 118 : 112, width - margin * 2, format === "story" ? 38 : 42);
  drawRoundRect(ctx, panelX, panelY, panelW, panelH, 8, "rgba(255, 255, 255, 0.92)", "#d7dfdc");

  const gap = format === "story" ? 14 : 18;
  const boxH = format === "story" ? 112 : 108;
  const statW = (panelW - gap * 4) / 3;
  const statY = panelY + gap;
  drawRaceSummaryBox(ctx, panelX + gap, statY, statW, boxH, String(rows.length), "Teams Shown");
  drawRaceSummaryBox(ctx, panelX + gap * 2 + statW, statY, statW, boxH, goals[raceKey] || "Race Goal");
  drawRaceSummaryBox(ctx, panelX + gap * 3 + statW * 2, statY, statW, boxH, `${rows.reduce((total, row) => total + row.remaining, 0)}`, "Matches Left");

  const listY = statY + boxH + gap + 26;
  ctx.fillStyle = "#65736f";
  ctx.font = "900 13px Inter, Arial, sans-serif";
  ctx.fillText("RACE TABLE", panelX + gap, listY - 8);
  drawRaceRows(ctx, league, rows, panelX + gap, listY + 18, panelW - gap * 2, panelY + panelH - listY - gap - 16);

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${slugify(`${labels[raceKey] || "race"}-${league.name}`)}.png`;
  link.click();
}

function renderTextGraphic(title, eyebrow, lines, name) {
  const scale = 2;
  const format = els.graphicFormatInput?.value || "default";
  const size = format === "story" ? [720, 1280] : format === "square" ? [1080, 1080] : [1100, 760];
  const [width, height] = size;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.fillStyle = "#f7faf8";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#0c5c35";
  ctx.font = "900 13px Inter, Arial, sans-serif";
  ctx.fillText(eyebrow.toUpperCase(), 48, 64);
  ctx.fillStyle = "#17211f";
  ctx.font = "900 40px Inter, Arial, sans-serif";
  drawFittedText(ctx, title, 48, 112, width - 96, 40);
  drawRoundRect(ctx, 48, 150, width - 96, height - 198, 8, "rgba(255,255,255,.92)", "#d7dfdc");
  ctx.font = "800 22px Inter, Arial, sans-serif";
  lines.forEach((line, index) => {
    const y = 205 + index * 46;
    if (y > height - 80) return;
    ctx.fillStyle = index % 2 ? "#ffffff" : "#f1f6f4";
    ctx.fillRect(68, y - 28, width - 136, 38);
    ctx.fillStyle = "#17211f";
    drawFittedText(ctx, line, 88, y, width - 176, 22);
  });
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${slugify(`${name}-${title}`)}.png`;
  link.click();
}

function drawGraphicBackdrop(ctx, width, height) {
  ctx.fillStyle = "#f7faf8";
  ctx.fillRect(0, 0, width, height);
  const greenGlow = ctx.createRadialGradient(0, 0, 40, 0, 0, 580);
  greenGlow.addColorStop(0, "rgba(23, 114, 69, 0.14)");
  greenGlow.addColorStop(1, "rgba(23, 114, 69, 0)");
  ctx.fillStyle = greenGlow;
  ctx.fillRect(0, 0, width, height);
  const blueGlow = ctx.createRadialGradient(width, height, 40, width, height, 620);
  blueGlow.addColorStop(0, "rgba(35, 90, 151, 0.13)");
  blueGlow.addColorStop(1, "rgba(35, 90, 151, 0)");
  ctx.fillStyle = blueGlow;
  ctx.fillRect(0, 0, width, height);
}

function raceGraphicRows(league, table, raceKey) {
  const automaticCutoff = countQualification(league, "automatic") || Math.min(2, table.length);
  const playoffCutoff = automaticCutoff + countQualification(league, "playoff") || Math.min(6, table.length);
  const relegationCount = countQualification(league, "relegation");
  let rows = table;
  if (raceKey === "title") rows = table.slice(0, Math.min(6, table.length));
  if (raceKey === "automatic") rows = table.slice(0, Math.max(automaticCutoff + 4, 6));
  if (raceKey === "playoff") rows = table.slice(0, Math.max(playoffCutoff + 3, 8));
  if (raceKey === "survival" && relegationCount) rows = table.slice(Math.max(0, table.length - relegationCount - 5));
  return rows.map((row) => ({
    teamName: row.team.name,
    position: row.position + 1,
    points: row.points,
    diff: row.diff,
    form: row.form || [],
    remaining: remainingMatchesForTeam(league, row.teamId),
    next: nextFixtureForTeam(league, row.teamId),
  }));
}

function drawRaceSummaryBox(ctx, x, y, width, height, value, label = "") {
  drawRoundRect(ctx, x, y, width, height, 8, "#f7faf8", "#d7dfdc");
  ctx.fillStyle = "#17211f";
  ctx.font = "900 24px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  drawCenteredFittedText(ctx, value, x + width / 2, y + height / 2 - 2, width - 28, 24);
  if (label) {
    ctx.fillStyle = "#65736f";
    ctx.font = "900 13px Inter, Arial, sans-serif";
    drawCenteredFittedText(ctx, label, x + width / 2, y + height - 24, width - 20, 13);
  }
  ctx.textAlign = "left";
}

function drawRaceRows(ctx, league, rows, x, y, width, maxHeight) {
  if (!rows.length) {
    ctx.fillStyle = "#65736f";
    ctx.font = "800 18px Inter, Arial, sans-serif";
    ctx.fillText("No race data available yet.", x, y + 28);
    return;
  }
  const compact = width < 760;
  const formX = x + width - (compact ? 330 : 520);
  const pointsX = x + width - (compact ? 205 : 350);
  const leftX = x + width - (compact ? 112 : 190);
  const gdX = x + width - 30;
  ctx.fillStyle = "#65736f";
  ctx.font = "900 11px Inter, Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("FORM", formX, y - 8);
  ctx.textAlign = "right";
  ctx.fillText("PTS", pointsX, y - 8);
  ctx.fillText("LEFT", leftX, y - 8);
  ctx.fillText("GD", gdX, y - 8);
  ctx.textAlign = "left";
  const rowHeight = Math.min(66, Math.max(34, Math.floor((maxHeight - 12) / rows.length)));
  rows.forEach((row, index) => {
    const rowY = y + 8 + index * rowHeight;
    if (rowY + rowHeight > y + maxHeight) return;
    ctx.fillStyle = index % 2 ? "#ffffff" : "#f1f6f4";
    ctx.fillRect(x, rowY, width, rowHeight - 8);
    drawRoundRect(ctx, x + 12, rowY + 11, 36, 32, 8, "#177245", "#177245");
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 14px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(row.position), x + 30, rowY + 32);
    ctx.textAlign = "left";
    ctx.fillStyle = "#17211f";
    ctx.font = "900 17px Inter, Arial, sans-serif";
    drawFittedText(ctx, row.teamName, x + 62, rowY + 25, Math.max(190, formX - x - 92), 17);
    ctx.fillStyle = "#65736f";
    ctx.font = "800 11px Inter, Arial, sans-serif";
    const nextText = row.next ? `Next: ${plainTeamName(league, row.next.homeId)} v ${plainTeamName(league, row.next.awayId)}` : "No fixture left";
    drawFittedText(ctx, nextText, x + 62, rowY + 43, Math.max(190, formX - x - 92), 11);
    drawMiniFormDots(ctx, row.form.slice(-4), formX, rowY + 34);
    ctx.fillStyle = "#17211f";
    ctx.font = "900 16px Inter, Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(String(row.points), pointsX, rowY + 28);
    ctx.fillText(String(row.remaining), leftX, rowY + 28);
    ctx.fillStyle = "#65736f";
    ctx.font = "900 13px Inter, Arial, sans-serif";
    ctx.fillText(`${row.diff >= 0 ? "+" : ""}${row.diff}`, gdX, rowY + 28);
    ctx.textAlign = "left";
  });
}

function drawMiniFormDots(ctx, form, x, y) {
  const dots = form.length ? form : ["-", "-", "-", "-"];
  dots.forEach((result, index) => {
    const color = result === "W" ? "#177245" : result === "D" ? "#9aa7a3" : result === "L" ? "#b83931" : "#d7dfdc";
    drawRoundRect(ctx, x + index * 21, y - 18, 17, 17, 9, color, color);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 8px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(result, x + index * 21 + 8.5, y - 6);
  });
  ctx.textAlign = "left";
}

function drawTeamStatBox(ctx, x, y, width, height, value, label, color) {
  drawRoundRect(ctx, x, y, width, height, 8, "#f7faf8", "#d7dfdc");
  ctx.fillStyle = color;
  ctx.font = `900 ${height > 160 ? 68 : 62}px Inter, Arial, sans-serif`;
  ctx.textAlign = "center";
  if (ctx.measureText(value).width > width - 36) {
    ctx.textAlign = "left";
    drawFittedText(ctx, value, x + 18, y + height / 2 + 12, width - 36, height > 160 ? 68 : 62);
    ctx.textAlign = "center";
  } else {
    ctx.fillText(value, x + width / 2, y + height / 2 + 12);
  }
  ctx.fillStyle = "#65736f";
  ctx.font = "900 18px Inter, Arial, sans-serif";
  ctx.fillText(label, x + width / 2, y + height - 26);
  ctx.textAlign = "left";
}

function drawRecordBox(ctx, x, y, width, height, row) {
  drawRoundRect(ctx, x, y, width, height, 8, "#f7faf8", "#d7dfdc");
  const labels = [["Wins", row.won], ["Draws", row.drawn], ["Losses", row.lost]];
  ctx.font = "800 24px Inter, Arial, sans-serif";
  labels.forEach(([label, value], index) => {
    const lineY = y + 42 + index * 30;
    ctx.fillStyle = "#17211f";
    ctx.textAlign = "left";
    ctx.fillText(label, x + 28, lineY);
    ctx.textAlign = "right";
    ctx.fillText(String(value), x + width - 28, lineY);
  });
  ctx.textAlign = "center";
  ctx.fillStyle = "#65736f";
  ctx.font = "900 18px Inter, Arial, sans-serif";
  ctx.fillText("Record", x + width / 2, y + height - 26);
  ctx.textAlign = "left";
}

function drawFormBox(ctx, x, y, width, height, form) {
  drawRoundRect(ctx, x, y, width, height, 8, "#f7faf8", "#d7dfdc");
  const dots = form.length ? form : ["-", "-", "-", "-"];
  const dotSize = 34;
  const totalWidth = dots.length * dotSize + (dots.length - 1) * 10;
  let dotX = x + (width - totalWidth) / 2;
  const dotY = y + height / 2 - 22;
  dots.forEach((result) => {
    const color = result === "W" ? "#177245" : result === "D" ? "#9aa7a3" : result === "L" ? "#b83931" : "#d7dfdc";
    drawRoundRect(ctx, dotX, dotY, dotSize, dotSize, 17, color, color);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 15px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(result, dotX + dotSize / 2, dotY + 22);
    dotX += dotSize + 10;
  });
  ctx.fillStyle = "#65736f";
  ctx.font = "900 18px Inter, Arial, sans-serif";
  ctx.fillText("Form", x + width / 2, y + height - 26);
  ctx.textAlign = "left";
}

function recentTeamMatches(league, teamId, limit) {
  return league.fixtures
    .filter((fixture) => fixture.played && (fixture.homeId === teamId || fixture.awayId === teamId))
    .sort((a, b) => a.gameweek - b.gameweek)
    .slice(-limit);
}

function drawRecentMatches(ctx, league, teamId, matches, x, y, width, maxHeight) {
  if (!matches.length) {
    ctx.fillStyle = "#65736f";
    ctx.font = "800 18px Inter, Arial, sans-serif";
    ctx.fillText("No completed matches yet.", x, y + 28);
    return;
  }
  const rowHeight = Math.min(48, Math.max(30, Math.floor(maxHeight / matches.length)));
  matches.forEach((fixture, index) => {
    const rowY = y + index * rowHeight;
    if (rowY + rowHeight > y + maxHeight) return;
    const isHome = fixture.homeId === teamId;
    const opponentId = isHome ? fixture.awayId : fixture.homeId;
    const scored = isHome ? fixture.homeScore : fixture.awayScore;
    const conceded = isHome ? fixture.awayScore : fixture.homeScore;
    const result = scored > conceded ? "W" : scored === conceded ? "D" : "L";
    const color = result === "W" ? "#177245" : result === "D" ? "#9aa7a3" : "#b83931";
    ctx.fillStyle = index % 2 ? "#ffffff" : "#f1f6f4";
    ctx.fillRect(x, rowY, width, rowHeight - 6);
    drawRoundRect(ctx, x + 12, rowY + 8, 32, 26, 8, color, color);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 13px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(result, x + 28, rowY + 26);
    ctx.textAlign = "left";
    ctx.fillStyle = "#65736f";
    ctx.font = "800 12px Inter, Arial, sans-serif";
    ctx.fillText(`GW ${fixture.gameweek || 1}`, x + 58, rowY + 26);
    ctx.fillStyle = "#17211f";
    ctx.font = "900 16px Inter, Arial, sans-serif";
    drawFittedText(ctx, plainTeamName(league, opponentId), x + 112, rowY + 26, width - 260, 16);
    ctx.textAlign = "right";
    ctx.fillText(`${scored} - ${conceded}`, x + width - 18, rowY + 26);
    ctx.textAlign = "left";
  });
}

function ordinal(value) {
  const number = Number(value) || 0;
  const teen = number % 100;
  if (teen >= 11 && teen <= 13) return `${number}th`;
  return `${number}${{ 1: "st", 2: "nd", 3: "rd" }[number % 10] || "th"}`;
}

function drawRoundRect(ctx, x, y, width, height, radius, fill, stroke = "") {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawFittedText(ctx, text, x, y, maxWidth, fontSize) {
  const value = String(text);
  if (ctx.measureText(value).width <= maxWidth) {
    ctx.fillText(value, x, y);
    return;
  }
  let output = value;
  while (output.length > 1 && ctx.measureText(`${output}...`).width > maxWidth) {
    output = output.slice(0, -1);
  }
  ctx.fillText(`${output}...`, x, y);
}

function drawCenteredFittedText(ctx, text, x, y, maxWidth) {
  const originalAlign = ctx.textAlign;
  const value = String(text);
  if (ctx.measureText(value).width <= maxWidth) {
    ctx.fillText(value, x, y);
    ctx.textAlign = originalAlign;
    return;
  }
  let output = value;
  while (output.length > 1 && ctx.measureText(`${output}...`).width > maxWidth) {
    output = output.slice(0, -1);
  }
  ctx.fillText(`${output}...`, x, y);
  ctx.textAlign = originalAlign;
}

function graphicLegendItems(rows) {
  const seen = new Map();
  rows.forEach((row) => {
    const rule = row.positionRule || defaultPositionRule(0);
    if (rule.qualification === "none") return;
    const label = rule.qualification === "custom" ? rule.customQualification || "Custom Qualification" : qualificationTypes[rule.qualification];
    const color = qualificationColor(rule);
    const key = `${label}:${color}`;
    if (!seen.has(key)) seen.set(key, { label, color });
  });
  return [...seen.values()];
}

function plainDeductionNotesFromSnapshot(snapshotLeague) {
  return (snapshotLeague.deductionNotes || "")
    .replace(/<\/p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((note) => note.replace(/^\*\s*/, "").trim())
    .filter(Boolean);
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "league-table";
}

function updateTeam(league, teamId, positionIndex, control) {
  const team = league.teams.find((item) => item.id === teamId);
  if (!team) return;
  if (control.dataset.field === "name") {
    team.name = control.value.trim() || "Unnamed Team";
  }
  if (control.dataset.field === "color") {
    team.color = control.value;
  }
  if (control.dataset.field === "qualification") {
    const rule = positionRule(league, positionIndex);
    if (control.value === "relegationPlayoff" && countQualification(league, "relegationPlayoff") >= 2 && rule.qualification !== "relegationPlayoff") {
      control.value = rule.qualification;
      alert("Only two positions can be marked as relegation playoffs.");
      return;
    }
    rule.qualification = control.value;
    if (control.value === "custom") openCustomDialog(positionIndex);
    resetBrackets(league);
  }
  setUpdated(league);
  saveState();
  render();
}

function handleTeamAction(league, teamId, action) {
  const index = league.teams.findIndex((team) => team.id === teamId);
  if (index < 0) return;
  if (action === "remove") {
    const hasFixtures = league.fixtures.some((fixture) => fixture.homeId === teamId || fixture.awayId === teamId);
    if (hasFixtures && !confirm(`Remove ${league.teams[index].name}? This team has fixtures scheduled and those fixtures will be removed.`)) return;
    league.teams.splice(index, 1);
    ensurePositionRules(league);
    league.fixtures = league.fixtures.filter((fixture) => fixture.homeId !== teamId && fixture.awayId !== teamId);
    if (league.pointDeductions) delete league.pointDeductions[teamId];
  } else {
    const target = action === "up" ? index - 1 : index + 1;
    if (target >= 0 && target < league.teams.length) [league.teams[index], league.teams[target]] = [league.teams[target], league.teams[index]];
  }
  resetBrackets(league);
  setUpdated(league);
  saveState();
  render();
}

function openCustomDialog(positionIndex) {
  const league = selectedLeague();
  const rule = positionRule(league, positionIndex);
  state.pendingCustomPosition = positionIndex;
  els.customQualificationInput.value = rule.customQualification || "";
  els.customQualificationColorInput.value = rule.customColor || "#6d4ab3";
  els.customDialog.showModal();
}

function addTeam() {
  const league = selectedLeague();
  if (!league) return;
  league.teams.push(defaultTeam(league.teams.length));
  ensurePositionRules(league);
  resetBrackets(league);
  setUpdated(league);
  saveState();
  render();
}

function bulkAddTeams() {
  els.bulkTeamsInput.value = "";
  els.bulkTeamsDialog.showModal();
}

function confirmBulkTeams() {
  const league = selectedLeague();
  if (!league) return;
  const names = els.bulkTeamsInput.value.split(/\r?\n/).map((name) => name.trim()).filter(Boolean);
  if (!names.length) {
    notify("Paste at least one team name.", "warn");
    return;
  }
  names.forEach((name) => {
    const team = defaultTeam(league.teams.length);
    team.name = name;
    league.teams.push(team);
  });
  ensurePositionRules(league);
  resetBrackets(league);
  setUpdated(league);
  saveState();
  notify(`Added ${names.length} team${names.length === 1 ? "" : "s"}.`, "success");
  render();
}

function addGroup() {
  const name = prompt("Group name", `Pyramid ${state.groups.length + 1}`);
  if (!name) return;
  const seasonName = prompt("Season name", "Season 1") || "Season 1";
  const group = createGroup(name.trim(), seasonName.trim() || "Season 1");
  state.groups.push(group);
  state.selectedGroupId = group.id;
  state.selectedLeagueId = "";
  saveState();
  render();
}

function renameGroup() {
  const group = selectedGroup();
  if (!group) return;
  const name = prompt("Group name", group.name);
  if (!name?.trim()) return;
  group.name = name.trim();
  saveState();
  render();
}

function deleteGroup() {
  const group = selectedGroup();
  if (!group) return;
  const leagueCount = filteredLeagues().length;
  if (!confirm(`Delete "${group.name}" and ${leagueCount} league${leagueCount === 1 ? "" : "s"} in it?`)) return;
  state.leagues = state.leagues.filter((league) => league.groupId !== group.id);
  state.groups = state.groups.filter((item) => item.id !== group.id);
  if (!state.groups.length) state.groups.push(createGroup());
  state.selectedGroupId = state.groups[0].id;
  state.selectedLeagueId = filteredLeagues()[0]?.id || "";
  state.activeCleanSeasonId = "current";
  saveState();
  render();
}

function updateSeasonName(value) {
  const group = selectedGroup();
  if (!group) return;
  group.seasonName = value.trim() || "Season 1";
  saveState();
  const league = selectedLeague();
  if (league) renderCleanTable(league);
}

function updateGroupField(field, value) {
  const group = selectedGroup();
  if (!group) return;
  group[field] = value;
  saveState();
  if (state.activeView === "dashboard") renderDashboard();
}

function addLeague() {
  if (!state.selectedGroupId) state.selectedGroupId = state.groups[0].id;
  const nextTier = filteredLeagues().length ? Math.max(...filteredLeagues().map((league) => league.tier)) + 1 : 1;
  const league = createLeague(`League ${filteredLeagues().length + 1}`, nextTier, state.selectedGroupId);
  autoLinkLeague(league);
  state.leagues.push(league);
  state.selectedLeagueId = league.id;
  saveState();
  render();
}

function autoLinkLeague(newLeague) {
  const groupLeagues = filteredLeagues();
  const upper = groupLeagues.find((league) => league.tier === newLeague.tier - 1);
  const lower = groupLeagues.find((league) => league.tier === newLeague.tier + 1);
  if (upper) {
    newLeague.promotesTo = upper.id;
    upper.relegatesTo = newLeague.id;
  }
  if (lower) {
    newLeague.relegatesTo = lower.id;
    lower.promotesTo = newLeague.id;
  }
}

function duplicateLeague() {
  const league = selectedLeague();
  if (!league) return;
  const copy = structuredClone(league);
  copy.id = createId("league");
  copy.name = `${league.name} Copy`;
  copy.promotesTo = "";
  copy.relegatesTo = "";
  copy.teams = copy.teams.map((team) => ({ ...team, id: createId("team") }));
  copy.pointDeductions = {};
  copy.fixtures = [];
  copy.playoffs = createBracket("promotion");
  copy.relegationPlayoff = createBracket("relegation");
  state.leagues.push(copy);
  state.selectedLeagueId = copy.id;
  saveState();
  render();
}

function deleteLeague() {
  const league = selectedLeague();
  if (!league || !confirm(`Delete "${league.name}" from local storage?`)) return;
  state.leagues = state.leagues.filter((item) => item.id !== league.id);
  state.leagues.forEach((item) => {
    if (item.promotesTo === league.id) item.promotesTo = "";
    if (item.relegatesTo === league.id) item.relegatesTo = "";
  });
  state.selectedLeagueId = filteredLeagues()[0]?.id || "";
  saveState();
  render();
}

function generateFixtures() {
  const league = selectedLeague();
  if (!league) return;
  if (league.fixtures.length && !confirm("Regenerate fixtures? This will replace all current fixtures and scores.")) return;
  league.fixtureMode = els.fixtureModeInput.value;
  league.fixtures = buildRoundRobin(league.teams.map((team) => team.id), league.fixtureMode);
  setUpdated(league);
  saveState();
  render();
}

function resetLeague(keepTeams) {
  const league = selectedLeague();
  if (!league) return;
  const message = keepTeams ? "Reset this league but keep all teams?" : "Reset this league and replace teams with a fresh default set?";
  if (!confirm(message)) return;
  if (!keepTeams) {
    league.teams = Array.from({ length: 12 }, (_, index) => defaultTeam(index));
    league.positionRules = Array.from({ length: 12 }, (_, index) => defaultPositionRule(index));
  }
  league.teams.forEach((team) => {
    team.manual = { played: 0, won: 0, drawn: 0, lost: 0, for: 0, against: 0, diff: 0, points: 0 };
  });
  league.fixtures = [];
  league.pointDeductions = {};
  league.playoffs = createBracket("promotion");
  league.relegationPlayoff = createBracket("relegation");
  league.status = "active";
  ensurePositionRules(league);
  setUpdated(league);
  saveState();
  notify("League reset.", "success");
  render();
}

function buildRoundRobin(teamIds, mode) {
  const ids = [...teamIds];
  if (ids.length % 2) ids.push("bye");
  const rounds = ids.length - 1;
  const half = ids.length / 2;
  const fixtures = [];
  let rotation = [...ids];
  for (let round = 1; round <= rounds; round += 1) {
    for (let index = 0; index < half; index += 1) {
      const left = rotation[index];
      const right = rotation[rotation.length - 1 - index];
      if (left !== "bye" && right !== "bye") {
        const flip = (round + index) % 2 === 0;
        fixtures.push(createFixture(round, flip ? right : left, flip ? left : right));
      }
    }
    rotation = [rotation[0], rotation[rotation.length - 1], ...rotation.slice(1, -1)];
  }
  if (mode === "double") {
    const secondLeg = fixtures.map((fixture) => createFixture(fixture.gameweek + rounds, fixture.awayId, fixture.homeId));
    fixtures.push(...secondLeg);
  }
  return fixtures;
}

function createFixture(gameweek, homeId, awayId) {
  return { id: createId("fixture"), gameweek, homeId, awayId, date: "", homeScore: null, awayScore: null, played: false };
}

function nextGameweek(league) {
  return league.fixtures.length ? Math.max(...league.fixtures.map((fixture) => fixture.gameweek || 1)) + 1 : 1;
}

function addManualFixture() {
  const league = selectedLeague();
  if (!league) return;
  const gameweek = Math.max(1, Number(els.manualGameweekInput.value) || nextGameweek(league));
  const homeId = els.manualHomeInput.value;
  const awayId = els.manualAwayInput.value;
  if (!homeId || !awayId || homeId === awayId) {
    alert("Choose two different teams for the fixture.");
    return;
  }
  league.fixtures.push(createFixture(gameweek, homeId, awayId));
  league.fixtures.at(-1).date = els.manualDateInput.value || "";
  league.fixtures.sort((a, b) => a.gameweek - b.gameweek);
  setUpdated(league);
  saveState();
  render();
}

function openGameweekDateDialog() {
  const league = selectedLeague();
  if (!league || league.fixtures.length === 0) {
    notify("Create fixtures before setting a gameweek date.", "warn");
    return;
  }
  const weeks = [...new Set(league.fixtures.map((fixture) => fixture.gameweek))].sort((a, b) => a - b);
  els.gameweekDateSelect.innerHTML = weeks
    .map((week) => `<option value="${week}">Gameweek ${week}</option>`)
    .join("");
  const preferredWeek = state.fixtureFilter !== "all" && weeks.includes(Number(state.fixtureFilter))
    ? Number(state.fixtureFilter)
    : weeks[0];
  els.gameweekDateSelect.value = String(preferredWeek);
  const existingDates = league.fixtures
    .filter((fixture) => fixture.gameweek === preferredWeek && fixture.date)
    .map((fixture) => fixture.date);
  els.gameweekDateInput.value = existingDates[0] || "";
  els.gameweekDateDialog.showModal();
}

function syncGameweekDateInput() {
  const league = selectedLeague();
  const gameweek = Number(els.gameweekDateSelect.value);
  if (!league || !gameweek) return;
  const existing = league.fixtures.find((fixture) => fixture.gameweek === gameweek && fixture.date);
  els.gameweekDateInput.value = existing?.date || "";
}

function applyGameweekDate() {
  const league = selectedLeague();
  const date = els.gameweekDateInput.value;
  const gameweek = Number(els.gameweekDateSelect.value);
  if (!league || !date || !gameweek) {
    notify("Choose a specific gameweek and a date first.", "warn");
    return;
  }
  league.fixtures.forEach((fixture) => {
    if (fixture.gameweek === gameweek) fixture.date = date;
  });
  setUpdated(league);
  saveState();
  notify(`Gameweek ${gameweek} dates updated.`, "success");
  renderFixtures(league);
}

function updateFixture(league, fixtureId, control) {
  const fixture = league.fixtures.find((item) => item.id === fixtureId);
  if (!fixture) return;
  const value = control.value === "" ? null : Number(control.value);
  if (control.dataset.date === "fixture") {
    fixture.date = control.value;
    setUpdated(league);
    saveState();
    return;
  }
  if (control.dataset.score === "home") fixture.homeScore = value;
  if (control.dataset.score === "away") fixture.awayScore = value;
  fixture.played = Number.isFinite(fixture.homeScore) && Number.isFinite(fixture.awayScore);
  setUpdated(league);
  saveState();
  render();
}

function clearFixture(league, fixtureId) {
  const fixture = league.fixtures.find((item) => item.id === fixtureId);
  if (!fixture) return;
  fixture.homeScore = null;
  fixture.awayScore = null;
  fixture.date = "";
  fixture.played = false;
  setUpdated(league);
  saveState();
  render();
}

function deleteFixture(league, fixtureId) {
  league.fixtures = league.fixtures.filter((fixture) => fixture.id !== fixtureId);
  setUpdated(league);
  saveState();
  render();
}

function playoffEntrants(league, kind) {
  const type = kind === "playoff" ? "playoff" : "relegationPlayoff";
  return tableWithRules(league).filter((row) => row.positionRule.qualification === type).map((row) => row.team);
}

function autoPlayoff(kind) {
  const league = selectedLeague();
  if (!league) return;
  const entrants = playoffEntrants(league, kind);
  if (kind === "relegation" && entrants.length > 2) {
    alert("Relegation playoffs can only have two teams.");
    return;
  }
  const bracket = kind === "playoff" ? league.playoffs : league.relegationPlayoff;
  bracket.matches = [];
  bracket.championId = "";
  bracket.applied = false;
  if (entrants.length < 2) {
    saveState();
    render();
    return;
  }
  if (kind === "relegation") {
    bracket.matches.push(createPlayoffMatch("Relegation Playoff", entrants[0].id, entrants[1].id, 1));
  } else {
    let low = 0;
    let high = entrants.length - 1;
    while (low < high) {
      bracket.matches.push(createPlayoffMatch("Round 1", entrants[low].id, entrants[high].id, 1));
      if (league.twoLegPlayoffs) bracket.matches.push(createPlayoffMatch("Round 1 Leg 2", entrants[high].id, entrants[low].id, 1));
      low += 1;
      high -= 1;
    }
    if (low === high) bracket.matches.push(createPlayoffMatch("Round 1 Bye", entrants[low].id, "", 1, entrants[low].id));
  }
  setUpdated(league);
  saveState();
  render();
}

function createPlayoffMatch(roundName, homeId, awayId, round, winnerId = "") {
  return { id: createId("match"), roundName, round, homeId, awayId, homeScore: null, awayScore: null, winnerId };
}

function teamSelect(league, selectedId, side) {
  const options = [`<option value="">TBD</option>`].concat(league.teams.map((team) => `<option value="${team.id}" ${team.id === selectedId ? "selected" : ""}>${escapeHtml(team.name)}</option>`));
  return `<select data-side="${side}">${options.join("")}</select>`;
}

function updatePlayoffTeam(league, bracket, matchId, control) {
  const match = bracket.matches.find((item) => item.id === matchId);
  if (!match) return;
  match[`${control.dataset.side}Id`] = control.value;
  match.winnerId = "";
  bracket.championId = "";
  setUpdated(league);
  saveState();
  render();
}

function updatePlayoffScore(league, bracket, matchId, control) {
  const match = bracket.matches.find((item) => item.id === matchId);
  if (!match) return;
  match[`${control.dataset.score}Score`] = control.value === "" ? null : Number(control.value);
  const winner = winnerForMatch(match);
  if (winner) match.winnerId = winner;
  progressBracket(bracket);
  setUpdated(league);
  saveState();
  render();
}

function winnerForMatch(match) {
  if (!match.homeId || !match.awayId) return match.homeId || "";
  if (!Number.isFinite(match.homeScore) || !Number.isFinite(match.awayScore) || match.homeScore === match.awayScore) return "";
  return match.homeScore > match.awayScore ? match.homeId : match.awayId;
}

function progressBracket(bracket) {
  const rounds = [...new Set(bracket.matches.map((match) => match.round))].sort((a, b) => a - b);
  const current = rounds.at(-1) || 1;
  const currentMatches = bracket.matches.filter((match) => match.round === current);
  if (!currentMatches.length || currentMatches.some((match) => !match.winnerId)) return;
  if (currentMatches.length === 1) {
    bracket.championId = bracket.type === "relegation" ? loserForMatch(currentMatches[0]) : currentMatches[0].winnerId;
    return;
  }
  if (bracket.matches.some((match) => match.round === current + 1)) return;
  const winners = currentMatches.map((match) => match.winnerId);
  for (let index = 0; index < winners.length; index += 2) {
    bracket.matches.push(createPlayoffMatch(winners.length === 2 ? "Final" : `Round ${current + 1}`, winners[index], winners[index + 1] || "", current + 1, winners[index + 1] ? "" : winners[index]));
  }
}

function loserForMatch(match) {
  if (!match.homeId || !match.awayId) return "";
  if (!Number.isFinite(match.homeScore) || !Number.isFinite(match.awayScore) || match.homeScore === match.awayScore) return "";
  return match.homeScore > match.awayScore ? match.awayId : match.homeId;
}

function resetBrackets(league) {
  league.playoffs = createBracket("promotion");
  league.relegationPlayoff = createBracket("relegation");
}

function movementItemsForLeague(league) {
  const table = tableWithRules(league);
  const promotesTo = state.leagues.find((item) => item.id === league.promotesTo);
  const relegatesTo = state.leagues.find((item) => item.id === league.relegatesTo);
  const promoted = table.filter((row) => row.positionRule.qualification === "automatic").map((row) => row.team);
  const relegated = table.filter((row) => row.positionRule.qualification === "relegation").map((row) => row.team);
  const playoffWinner = league.playoffs.championId ? league.teams.find((team) => team.id === league.playoffs.championId) : null;
  const relegationLoser = league.relegationPlayoff.championId ? league.teams.find((team) => team.id === league.relegationPlayoff.championId) : null;
  if (playoffWinner) promoted.push(playoffWinner);
  if (relegationLoser) relegated.push(relegationLoser);
  return [
    ...uniqueTeams(promoted).map((team) => ({ team, from: league, to: promotesTo, verb: "Promoted", text: `${team.name} promoted from ${league.name} to ${promotesTo?.name || "no league set"}` })),
    ...uniqueTeams(relegated).map((team) => ({ team, from: league, to: relegatesTo, verb: "Relegated", text: `${team.name} relegated from ${league.name} to ${relegatesTo?.name || "no league set"}` })),
  ];
}

function uniqueTeams(teams) {
  const seen = new Set();
  return teams.filter((team) => {
    if (!team || seen.has(team.id)) return false;
    seen.add(team.id);
    return true;
  });
}

function leagueCompletionIssues(league) {
  const issues = [];
  if (!league.fixtures.length) {
    issues.push("Generate fixtures first.");
  } else if (league.fixtures.some((fixture) => !fixture.played)) {
    issues.push("All fixtures must have scores.");
  }
  const playoffCount = playoffEntrants(league, "playoff").length;
  if (playoffCount >= 2 && !league.playoffs.championId) issues.push("Finish the promotion playoffs.");
  const relegationPlayoffCount = playoffEntrants(league, "relegation").length;
  if (relegationPlayoffCount === 2 && !league.relegationPlayoff.championId) issues.push("Finish the relegation playoff.");
  if (relegationPlayoffCount > 2) issues.push("Only two relegation playoff positions are allowed.");
  return issues;
}

function canCompleteLeague(league) {
  return leagueCompletionIssues(league).length === 0;
}

function maybeOpenRolloverDialog() {
  const leagues = filteredLeagues();
  if (!leagues.length || leagues.some((league) => league.status !== "completed" || !canCompleteLeague(league))) return;
  const items = leagues.flatMap(movementItemsForLeague);
  els.rolloverSummary.innerHTML = items.length
    ? items.map((item) => `<div class="movement-item"><strong>${escapeHtml(item.text)}</strong></div>`).join("")
    : `<p class="empty-note">No teams are set to move. Confirming will still reset every completed league in this group for a new season.</p>`;
  els.nextSeasonInput.value = nextSeasonName(selectedGroup()?.seasonName || "Season 1");
  els.rolloverDialog.showModal();
}

function confirmSeasonRollover() {
  const leagues = filteredLeagues();
  const group = selectedGroup();
  if (group) group.seasons.unshift(createSeasonSnapshot(group, leagues));
  const items = leagues.flatMap(movementItemsForLeague).filter((item) => item.to);
  const moved = [];
  items.forEach((item) => moveTeams(item.from, item.to, [item.team], moved, item.verb));
  leagues.forEach((league) => resetLeagueSeason(league, moved));
  if (group) group.seasonName = els.nextSeasonInput.value.trim() || nextSeasonName(group.seasonName);
  state.activeCleanSeasonId = "current";
  saveState();
  render();
}

function nextSeasonName(name) {
  const match = String(name).match(/^(.*?)(\d+)$/);
  if (!match) return "Next Season";
  return `${match[1]}${Number(match[2]) + 1}`;
}

function createSeasonSnapshot(group, leagues) {
  return {
    id: createId("season"),
    name: group.seasonName || "Season",
    seasonStart: group.seasonStart || "",
    seasonEnd: group.seasonEnd || "",
    createdAt: new Date().toISOString(),
    leagues: leagues.map((league) => {
      const table = tableWithRules(league);
      return {
        originalLeagueId: league.id,
        name: league.name,
        seasonName: group.seasonName || "Season",
        fixtures: structuredClone(league.fixtures),
        playoffs: structuredClone(league.playoffs),
        relegationPlayoff: structuredClone(league.relegationPlayoff),
        teams: structuredClone(league.teams),
        deductionNotes: deductionNotesFor(league, table).map((note) => `<p>* ${escapeHtml(note)}</p>`).join(""),
        table: table.map((row, index) => ({
          teamId: row.teamId,
          teamName: row.team.name,
          played: row.played,
          won: row.won,
          drawn: row.drawn,
          lost: row.lost,
          for: row.for,
          against: row.against,
          diff: row.diff,
          points: row.points,
          form: row.form,
          status: mathematicalStatus(league, table, row, index),
          positionRule: structuredClone(row.positionRule),
          playoffBadge: playoffMovementBadge(league, row.teamId),
        })),
      };
    }),
  };
}

function moveTeams(fromLeague, toLeague, teams, moved, verb) {
  if (!toLeague) return;
  teams.forEach((team) => {
    if (!fromLeague.teams.some((item) => item.id === team.id)) return;
    fromLeague.teams = fromLeague.teams.filter((item) => item.id !== team.id);
    fromLeague.fixtures = fromLeague.fixtures.filter((fixture) => fixture.homeId !== team.id && fixture.awayId !== team.id);
    toLeague.teams.push({ ...structuredClone(team), id: createId("team") });
    ensurePositionRules(toLeague);
    moved.push(`${verb}: ${team.name} to ${toLeague.name}`);
    setUpdated(toLeague);
  });
}

function resetLeagueSeason(league, moved) {
  league.teams.forEach((team) => {
    team.manual = { played: 0, won: 0, drawn: 0, lost: 0, for: 0, against: 0, diff: 0, points: 0 };
  });
  league.fixtures = [];
  league.playoffs = createBracket("promotion");
  league.relegationPlayoff = createBracket("relegation");
  league.status = "active";
  league.movementLog = moved.filter((item) => item.includes(` ${league.name}`) || item.includes(`to ${league.name}`));
  ensurePositionRules(league);
  setUpdated(league);
}

function exportJson() {
  const blob = new Blob([JSON.stringify({ groups: state.groups, leagues: state.leagues, selectedGroupId: state.selectedGroupId, selectedLeagueId: state.selectedLeagueId }, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "league-table-creator-data.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function importJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported.leagues)) throw new Error("Missing leagues");
      state.groups = imported.groups?.length ? imported.groups.map(normalizeGroup) : [createGroup()];
      state.leagues = imported.leagues.map(normalizeLeague);
      state.selectedGroupId = imported.selectedGroupId || state.groups[0].id;
      state.selectedLeagueId = imported.selectedLeagueId || filteredLeagues()[0]?.id || state.leagues[0]?.id || "";
      state.activeCleanSeasonId = "current";
      saveState();
      render();
    } catch {
      alert("That JSON file does not look like League Table Creator data.");
    }
  });
  reader.readAsText(file);
}

function teamName(league, teamId) {
  return escapeHtml(plainTeamName(league, teamId));
}

function plainTeamName(leagueLike, teamId) {
  return leagueLike.teams?.find((team) => team.id === teamId)?.name
    || leagueLike.table?.find((row) => row.teamId === teamId)?.teamName
    || "TBD";
}

function qualificationClass(rule) {
  return {
    automatic: "zone-auto",
    playoff: "zone-playoff",
    relegationPlayoff: "zone-relplayoff",
    relegation: "zone-relegation",
    custom: "zone-custom",
  }[rule.qualification] || "";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function bindEvents() {
  els.enterCreatorButton.addEventListener("click", () => showPage("creator"));
  els.openChangelogButton.addEventListener("click", () => showPage("changelog"));
  els.openNewsButton.addEventListener("click", () => {
    clearHash();
    showPage("news");
  });
  els.backHomeButton.addEventListener("click", () => showPage("home"));
  els.newsBackHomeButton.addEventListener("click", () => {
    clearHash();
    showPage("home");
  });
  els.homeNavButton.addEventListener("click", () => showPage("home"));
  els.changelogNavButton.addEventListener("click", () => showPage("changelog"));
  els.darkModeButton.addEventListener("click", toggleDarkMode);
  els.sharedLeagueTab.addEventListener("click", () => setSharedTab("league"));
  els.sharedFixturesTab.addEventListener("click", () => setSharedTab("fixtures"));
  els.newLeagueButton.addEventListener("click", addLeague);
  els.emptyCreateButton.addEventListener("click", addLeague);
  els.newGroupButton.addEventListener("click", addGroup);
  els.renameGroupButton.addEventListener("click", renameGroup);
  els.deleteGroupButton.addEventListener("click", deleteGroup);
  els.duplicateLeagueButton.addEventListener("click", duplicateLeague);
  els.deleteLeagueButton.addEventListener("click", deleteLeague);
  els.exportButton.addEventListener("click", exportJson);
  els.importInput.addEventListener("change", (event) => importJson(event.target.files[0]));
  els.addTeamButton.addEventListener("click", addTeam);
  els.bulkAddTeamsButton.addEventListener("click", bulkAddTeams);
  els.generateFixturesButton.addEventListener("click", generateFixtures);
  els.resetKeepTeamsButton.addEventListener("click", () => resetLeague(true));
  els.resetAllButton.addEventListener("click", () => resetLeague(false));
  els.addManualFixtureButton.addEventListener("click", addManualFixture);
  els.renderGraphicButton.addEventListener("click", renderLeagueGraphic);
  els.generateShareCodeButton.addEventListener("click", generateShareCode);
  els.copyShareLinkButton.addEventListener("click", () => copyShareUrl());
  els.shareModeInput.addEventListener("change", () => {
    const league = selectedLeague();
    if (league) renderShareTeamOptions(league);
  });
  els.fixtureGameweekFilter.addEventListener("change", (event) => {
    state.fixtureFilter = event.target.value;
    renderFixtures(selectedLeague());
  });
  els.fixtureCalendarButton.addEventListener("click", () => {
    state.fixtureCalendarMode = !state.fixtureCalendarMode;
    renderFixtures(selectedLeague());
  });
  els.applyGameweekDateButton.addEventListener("click", openGameweekDateDialog);
  els.renderGameweekButton.addEventListener("click", () => renderGameweekGraphic());
  els.renderLeagueGraphic2Button.addEventListener("click", renderLeagueGraphic);
  els.renderPlayoffsGraphicButton.addEventListener("click", renderPlayoffsGraphic);
  els.renderTeamGraphicButton.addEventListener("click", renderTeamGraphic);
  els.renderRaceGraphicButton.addEventListener("click", renderRaceGraphic);
  els.renderGameweekGraphic2Button.addEventListener("click", () => renderGameweekGraphic());
  els.autoPlayoffButton.addEventListener("click", () => autoPlayoff("playoff"));
  els.autoRelegationPlayoffButton.addEventListener("click", () => autoPlayoff("relegation"));
  document.querySelectorAll(".tab-button").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.race) {
      state.activeRaceView = button.dataset.race;
      document.querySelectorAll("[data-race]").forEach((raceButton) => raceButton.classList.toggle("active", raceButton.dataset.race === state.activeRaceView));
      renderProjections(selectedLeague());
      return;
    }
    state.activeView = button.dataset.view;
    render();
  }));
  els.groupSelect.addEventListener("change", (event) => {
    state.selectedGroupId = event.target.value;
    state.selectedLeagueId = filteredLeagues()[0]?.id || "";
    state.activeCleanSeasonId = "current";
    state.cleanRewindWeek = "";
    saveState();
    render();
  });
  els.seasonNameInput.addEventListener("change", (event) => updateSeasonName(event.target.value));
  els.seasonStartInput.addEventListener("change", (event) => updateGroupField("seasonStart", event.target.value));
  els.seasonEndInput.addEventListener("change", (event) => updateGroupField("seasonEnd", event.target.value));
  els.cleanSeasonInput.addEventListener("change", (event) => {
    state.activeCleanSeasonId = event.target.value;
    state.cleanRewindWeek = "";
    saveState();
    const league = selectedLeague();
    if (league) renderCleanTable(league);
  });
  els.leagueGroupInput.addEventListener("change", (event) => updateLeagueField("groupId", event.target.value));
  els.leagueNameInput.addEventListener("input", (event) => updateLeagueField("name", event.target.value.trim() || "Untitled League", false));
  els.tierInput.addEventListener("change", (event) => updateLeagueField("tier", Math.max(1, Number(event.target.value) || 1)));
  els.statusInput.addEventListener("change", (event) => updateLeagueStatus(event.target.value));
  els.promotesToInput.addEventListener("change", (event) => updateLeagueField("promotesTo", event.target.value));
  els.relegatesToInput.addEventListener("change", (event) => updateLeagueField("relegatesTo", event.target.value));
  els.pointLabelInput.addEventListener("input", (event) => updateLeagueField("pointLabel", event.target.value.trim() || "Point", false));
  els.teamColorsInput.addEventListener("change", (event) => updateLeagueField("showTeamColors", event.target.value === "on"));
  els.twoLegPlayoffInput.addEventListener("change", (event) => updateLeagueField("twoLegPlayoffs", event.target.checked));
  els.fixtureModeInput.addEventListener("change", (event) => updateLeagueField("fixtureMode", event.target.value));
  els.historySeasonInput.addEventListener("change", () => renderHistory(selectedLeague()));
  els.historyTeamInput.addEventListener("change", () => renderHistory(selectedLeague()));
  els.rewindGameweekInput.addEventListener("change", renderRewindTable);
  els.bulkTeamsDialog.addEventListener("close", () => {
    if (els.bulkTeamsDialog.returnValue === "save") confirmBulkTeams();
  });
  els.gameweekDateDialog.addEventListener("close", () => {
    if (els.gameweekDateDialog.returnValue === "save") applyGameweekDate();
  });
  els.gameweekDateSelect.addEventListener("change", syncGameweekDateInput);
  els.customDialog.addEventListener("close", () => {
    const league = selectedLeague();
    if (!league || state.pendingCustomPosition < 0) return;
    const rule = positionRule(league, state.pendingCustomPosition);
    if (els.customDialog.returnValue === "save") {
      rule.customQualification = els.customQualificationInput.value.trim() || "Custom Qualification";
      rule.customColor = els.customQualificationColorInput.value;
    } else if (!rule.customQualification) {
      rule.qualification = "none";
    }
    state.pendingCustomPosition = -1;
    setUpdated(league);
    saveState();
    render();
  });
  els.rolloverDialog.addEventListener("close", () => {
    if (els.rolloverDialog.returnValue === "confirm") confirmSeasonRollover();
  });
  window.addEventListener("hashchange", () => {
    if (!maybeRenderSharedPage() && !maybeRenderNewsPage()) showPage("home");
  });
  window.addEventListener("popstate", () => {
    if (!maybeRenderSharedPage() && !maybeRenderNewsPage()) showPage("home");
  });
}

function updateLeagueStatus(status) {
  const league = selectedLeague();
  if (!league) return;
  if (status === "completed" && !canCompleteLeague(league)) {
    alert(`This league cannot be marked as completed yet. ${leagueCompletionIssues(league).join(" ")}`);
    els.statusInput.value = league.status;
    return;
  }
  updateLeagueField("status", status);
  if (status === "completed") maybeOpenRolloverDialog();
}

function updateLeagueField(field, value, rerender = true) {
  const league = selectedLeague();
  if (!league) return;
  league[field] = value;
  if (field === "groupId") {
    state.selectedGroupId = value;
    state.selectedLeagueId = league.id;
    league.promotesTo = "";
    league.relegatesTo = "";
  }
  setUpdated(league);
  saveState();
  if (rerender) render();
  else {
    els.leagueTitle.textContent = league.name;
    renderLeagueList();
    renderTierList();
  }
}

loadState();
bindEvents();
if (!maybeRenderSharedPage()) maybeRenderNewsPage();
