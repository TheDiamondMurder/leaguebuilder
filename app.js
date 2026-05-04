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
};

const els = {
  groupSelect: document.querySelector("#groupSelect"),
  renameGroupButton: document.querySelector("#renameGroupButton"),
  deleteGroupButton: document.querySelector("#deleteGroupButton"),
  seasonNameInput: document.querySelector("#seasonNameInput"),
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
  addTeamButton: document.querySelector("#addTeamButton"),
  teamTableBody: document.querySelector("#teamTableBody"),
  cleanLeagueName: document.querySelector("#cleanLeagueName"),
  cleanSeasonInput: document.querySelector("#cleanSeasonInput"),
  renderGraphicButton: document.querySelector("#renderGraphicButton"),
  cleanLegend: document.querySelector("#cleanLegend"),
  cleanTableBody: document.querySelector("#cleanTableBody"),
  fixtureModeInput: document.querySelector("#fixtureModeInput"),
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
  views: {
    editor: document.querySelector("#editorView"),
    clean: document.querySelector("#cleanView"),
    fixtures: document.querySelector("#fixturesView"),
    playoffs: document.querySelector("#playoffsView"),
    bracket: document.querySelector("#bracketView"),
    projections: document.querySelector("#projectionsView"),
    deductions: document.querySelector("#deductionsView"),
  },
};

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function createGroup(name = "Main Pyramid", seasonName = "Season 1") {
  return { id: createId("group"), name, seasonName, seasons: [] };
}

function defaultTeam(index) {
  return {
    id: createId("team"),
    name: `Team ${index + 1}`,
    manual: { played: 0, won: 0, drawn: 0, lost: 0, for: 0, against: 0, diff: 0, points: 0 },
  };
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
    seasons: Array.isArray(group.seasons) ? group.seasons : [],
  };
}

function normalizeLeague(league) {
  const normalizedTeams = (league.teams || []).map((team, index) => ({
    ...defaultTeam(index),
    ...team,
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
  if (state.activeView === "clean") renderCleanTable(league);
  if (state.activeView === "fixtures") renderFixtures(league);
  if (state.activeView === "playoffs") {
    renderPlayoffs(league);
    renderMovementPreview(league);
  }
  if (state.activeView === "bracket") renderPlayoffBracketView(league);
  if (state.activeView === "projections") renderProjections(league);
  if (state.activeView === "deductions") renderDeductions(league);
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
      <td><input data-field="name" value="${escapeAttribute(team.name)}" aria-label="Team name" /></td>
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
  const table = tableWithRules(league);
  els.cleanLeagueName.textContent = `${league.name} | ${selectedGroup()?.seasonName || "Current Season"}`;
  renderCleanLegend(league);
  renderDeductionNotes(league, table);
  els.cleanTableBody.innerHTML = "";
  table.forEach((row, index) => {
    const status = mathematicalStatus(league, table, row, index);
    const tr = document.createElement("tr");
    tr.className = qualificationClass(row.positionRule);
    tr.style.setProperty("--custom-zone", row.positionRule.customColor || "#6d4ab3");
    tr.innerHTML = `
      <td><span class="rank-pill">${index + 1}</span></td>
      <td><button class="team-link" data-team-id="${escapeAttribute(row.teamId)}" type="button">${escapeHtml(row.team.name)}${playoffMovementBadge(league, row.teamId)}</button></td>
      <td>${row.played}</td><td>${row.won}</td><td>${row.drawn}</td><td>${row.lost}</td>
      <td>${row.for}</td><td>${row.against}</td><td>${row.diff}</td><td><strong>${row.points}</strong></td>
      <td>${renderForm(row.form)}</td>
      <td>${status ? `<span class="status-chip">${escapeHtml(status)}</span>` : ""}</td>
    `;
    tr.querySelector(".team-link").addEventListener("click", () => openTeamDialog(league, row.teamId));
    els.cleanTableBody.append(tr);
  });
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
  els.fixturesList.innerHTML = "";
  if (!league.fixtures.length) {
    els.fixturesList.innerHTML = `<p class="empty-note">Generate fixtures or add manual fixtures to start entering ${escapeHtml((league.pointLabel || "goal").toLowerCase())} totals and automatic tables.</p>`;
    return;
  }
  const byGameweek = new Map();
  league.fixtures.forEach((fixture) => byGameweek.set(fixture.gameweek, [...(byGameweek.get(fixture.gameweek) || []), fixture]));
  byGameweek.forEach((fixtures, gameweek) => {
    const section = document.createElement("section");
    section.className = "gameweek";
    section.innerHTML = `<h4>Gameweek ${gameweek}</h4>`;
    fixtures.forEach((fixture) => section.append(renderFixtureRow(league, fixture)));
    els.fixturesList.append(section);
  });
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
    { key: "safe", label: "Guarantee safety" },
  ];
  tableWithRules(league).forEach((row) => {
    const fixture = nextFixtureForTeam(league, row.teamId);
    if (!fixture) return;
    const scenarios = nextMatchProjectionScenarios(league, row.teamId, fixture);
    const currentResults = projectionResults(league, tableWithRules(league), row);
    const card = document.createElement("article");
    card.className = "projection-card";
    card.innerHTML = `<h4>${escapeHtml(row.team.name)}</h4><p class="empty-note">Next: ${escapeHtml(plainTeamName(league, fixture.homeId))} v ${escapeHtml(plainTeamName(league, fixture.awayId))}</p>`;
    targets.forEach((target) => {
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
    safe: guaranteedSafe(league, table, row, countQualification(league, "relegation")),
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
  const title = snapshotLeague ? `${snapshotLeague.name} - ${snapshotLeague.seasonName}` : `${league.name} - ${selectedGroup()?.seasonName || "Current Season"}`;
  const legend = graphicLegendItems(rows);
  const deductionNotes = snapshotLeague ? plainDeductionNotesFromSnapshot(snapshotLeague) : deductionNotesFor(league, currentTable);
  const width = 1100;
  const rowHeight = 44;
  const topOffset = 190 + (legend.length ? 34 : 0);
  const notesHeight = deductionNotes.length ? 30 + deductionNotes.length * 22 : 0;
  const height = topOffset + rows.length * rowHeight + notesHeight + 30;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f7faf8";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#177245";
  ctx.fillRect(0, 0, width, 92);
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 34px Inter, Arial, sans-serif";
  ctx.fillText(title, 42, 56);

  const columns = [
    ["#", 42, 46],
    ["Team", 98, 360],
    ["P", 480, 52],
    ["W", 545, 52],
    ["D", 610, 52],
    ["L", 675, 52],
    ["F", 740, 52],
    ["A", 805, 52],
    ["Diff", 870, 70],
    ["Pts", 955, 70],
  ];
  if (legend.length) {
    let x = 42;
    const y = 112;
    legend.forEach((item) => {
      ctx.fillStyle = item.color;
      ctx.fillRect(x, y - 12, 16, 16);
      ctx.fillStyle = "#17211f";
      ctx.font = "800 13px Inter, Arial, sans-serif";
      ctx.fillText(item.label, x + 24, y + 2);
      x += Math.min(240, 42 + item.label.length * 8);
    });
  }
  const headerY = topOffset - 44;
  ctx.fillStyle = "#dfe8e4";
  ctx.fillRect(32, headerY - 24, width - 64, 38);
  ctx.fillStyle = "#17211f";
  ctx.font = "800 13px Inter, Arial, sans-serif";
  columns.forEach(([label, x]) => ctx.fillText(label, x, headerY));
  rows.forEach((row, index) => {
    const y = topOffset + index * rowHeight;
    ctx.fillStyle = index % 2 ? "#ffffff" : "#edf2f0";
    ctx.fillRect(32, y - 24, width - 64, rowHeight - 4);
    ctx.fillStyle = qualificationColor(row.positionRule || defaultPositionRule(0));
    ctx.fillRect(32, y - 24, 8, rowHeight - 4);
    ctx.fillStyle = "#17211f";
    ctx.font = "800 16px Inter, Arial, sans-serif";
    ctx.fillText(String(index + 1), 48, y + 2);
    ctx.fillText(row.teamName, 98, y + 2);
    if (row.playoffBadge) {
      ctx.fillStyle = row.playoffBadge === "P" ? "#177245" : "#b83931";
      ctx.fillRect(412, y - 17, 22, 22);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 13px Inter, Arial, sans-serif";
      ctx.fillText(row.playoffBadge, 419, y - 1);
      ctx.fillStyle = "#17211f";
    }
    ctx.font = "700 15px Inter, Arial, sans-serif";
    [row.played, row.won, row.drawn, row.lost, row.for, row.against, row.diff, row.points].forEach((value, valueIndex) => {
      ctx.fillText(String(value), columns[valueIndex + 2][1], y + 2);
    });
  });
  if (deductionNotes.length) {
    let y = topOffset + rows.length * rowHeight + 18;
    ctx.fillStyle = "#65736f";
    ctx.font = "700 14px Inter, Arial, sans-serif";
    deductionNotes.forEach((note) => {
      ctx.fillText(`* ${note}`, 42, y);
      y += 22;
    });
  }
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${slugify(title)}.png`;
  link.click();
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
  league.fixtureMode = els.fixtureModeInput.value;
  league.fixtures = buildRoundRobin(league.teams.map((team) => team.id), league.fixtureMode);
  setUpdated(league);
  saveState();
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
  return { id: createId("fixture"), gameweek, homeId, awayId, homeScore: null, awayScore: null, played: false };
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
  league.fixtures.sort((a, b) => a.gameweek - b.gameweek);
  setUpdated(league);
  saveState();
  render();
}

function updateFixture(league, fixtureId, control) {
  const fixture = league.fixtures.find((item) => item.id === fixtureId);
  if (!fixture) return;
  const value = control.value === "" ? null : Number(control.value);
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
  els.generateFixturesButton.addEventListener("click", generateFixtures);
  els.addManualFixtureButton.addEventListener("click", addManualFixture);
  els.renderGraphicButton.addEventListener("click", renderLeagueGraphic);
  els.autoPlayoffButton.addEventListener("click", () => autoPlayoff("playoff"));
  els.autoRelegationPlayoffButton.addEventListener("click", () => autoPlayoff("relegation"));
  document.querySelectorAll(".tab-button").forEach((button) => button.addEventListener("click", () => {
    state.activeView = button.dataset.view;
    render();
  }));
  els.groupSelect.addEventListener("change", (event) => {
    state.selectedGroupId = event.target.value;
    state.selectedLeagueId = filteredLeagues()[0]?.id || "";
    state.activeCleanSeasonId = "current";
    saveState();
    render();
  });
  els.seasonNameInput.addEventListener("change", (event) => updateSeasonName(event.target.value));
  els.cleanSeasonInput.addEventListener("change", (event) => {
    state.activeCleanSeasonId = event.target.value;
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
  els.fixtureModeInput.addEventListener("change", (event) => updateLeagueField("fixtureMode", event.target.value));
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
render();
