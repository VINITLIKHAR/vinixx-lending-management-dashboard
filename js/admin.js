const $ = (s) => document.querySelector(s),
  inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const C = {
  paid: "ok",
  approved: "ok",
  disbursed: "ok",
  active: "ok",
  verified: "ok",
  pending: "warn",
  assigned: "warn",
  upcoming: "warn",
  today: "warn",
  inactive: "bad",
  rejected: "bad",
  overdue: "bad",
};
const bd = (s) =>
  `<span class="bd ${C[String(s).toLowerCase()] || ""}">${s}</span>`;
const toast = (m) => {
  const t = $("#toast");
  t.textContent = m;
  t.classList.add("on");
  setTimeout(() => t.classList.remove("on"), 2200);
};
const tbl = (h, r) =>
  `<div class="tw"><table><tr>${h.map((x) => `<th>${x}</th>`).join("")}</tr>${r.map((x) => `<tr>${x.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;
const card = (t, b) =>
  `<div class="card">${t ? `<h2>${t}</h2>` : ""}${b}</div>`;
const head = (t, x = "") => `<div class="pg"><h1>${t}</h1>${x}</div>`;
const srch = `<input class="srch" placeholder="Search..." oninput="filt(this.value)">`;
function filt(v) {
  document
    .querySelectorAll("table tr:not(:first-child)")
    .forEach(
      (r) =>
        (r.style.display = r.textContent.toLowerCase().includes(v.toLowerCase())
          ? ""
          : "none"),
    );
}
function open_(h) {
  $("#mc").innerHTML = h;
  $("#modal").classList.add("on");
}
function close_() {
  $("#modal").classList.remove("on");
}
$("#modal").onclick = (e) => {
  if (e.target.id == "modal") close_();
};
const NAV = [
  ["Overview"],
  ["dashboard", "🏠", "Dashboard"],
  ["users", "👤", "User"],
  ["investors", "💰", "Investors"],
  ["loans", "✅", "Loans"],
  ["dues", "⏰", "Loan Dues"],
  ["Finance"],
  ["payset", "⚙️", "Payment Settings"],
  ["refset", "🎁", "Referral Settings"],
  ["schemes", "📋", "Loan Schemes"],
  ["deposits", "⬇️", "Deposit Requests"],
  ["invwd", "⬆️", "Investor Withdrawals"],
  ["usrwd", "☑️", "User Withdrawals"],
];
const T = {
  dashboard: "Dashboard",
  users: "Users",
  investors: "Investors",
  loans: "Loans List",
  dues: "Loan Due Management",
  payset: "Payment Settings",
  refset: "Referral Settings",
  schemes: "Loan Schemes",
  deposits: "Deposit Requests",
  invwd: "Investor Withdrawals",
  usrwd: "User Withdrawals",
  profile: "My Profile",
  loan: "Loan Details",
};
let dueTab = "all";

/* ---------- actions (in-memory demo) ---------- */
function setSt(list, i, s, m) {
  list[i][list[i].length - 1] = s;
  toast(m);
  route();
}
function reject(id) {
  D.loans.find((l) => l.id == id).status = "rejected";
  toast("Loan application rejected.");
  route();
}
function assignM(id) {
  open_(
    `<h3>Assign Loan #${id} to Investors</h3><label>Interest Rate (%)<input value="3"></label><br>${D.invites.map((i) => `<div class="row"><label style="display:flex;gap:8px;font-weight:500"><input type="checkbox" style="width:auto" checked> ${i[0]}</label><span>${i[1]}</span></div>`).join("")}<div class="mf"><button class="b o" onclick="close_()">Cancel</button><button class="b" onclick="D.loans.find(l=>l.id==${id}).status='assigned';close_();toast('Loan assigned to investors.');route()">Assign</button></div>`,
  );
}
function directM(id) {
  open_(
    `<h3>Direct Approve Loan #${id}</h3><div class="form"><label>Total Interest %<input value="11"></label><label>Investor Interest %<input value="3"></label></div><br><label>Investor<select>${D.invites.map((i) => `<option>${i[0]} (${i[1]})</option>`).join("")}</select></label><div class="mf"><button class="b o" onclick="close_()">Cancel</button><button class="b" onclick="D.loans.find(l=>l.id==${id}).status='approved';close_();toast('Loan approved and funded.');route()">Approve & Fund</button></div>`,
  );
}
const loanAct = (l) => {
  const a = [
    `<button class="b o" onclick="location.hash='#/loan/${l.id}'">View</button>`,
  ];
  if (l.status == "pending" || l.status == "assigned")
    a.push(
      `<button class="b" onclick="directM(${l.id})">Direct Approve</button>`,
      `<button class="b o" onclick="assignM(${l.id})">Assign</button>`,
      `<button class="b r" onclick="reject(${l.id})">Reject</button>`,
    );
  return a.join("");
};

/* ---------- pages ---------- */
const P = {
  dashboard() {
    const m = Math.max(...D.trend.map((t) => t[1]));
    const dis = D.loans.filter((l) => l.status == "disbursed"),
      od = D.dues.filter((d) => ["overdue", "today"].includes(d[4]));
    return `<section class="hero"><div><h1>Welcome back, ${D.admin.name}</h1><p>Here's what's happening across your lending platform today.</p><span class="pill">⚡ System Operational</span><span class="pill">📅 Tuesday, 27 Oct 2026</span><a class="pill" href="#/dues">🚨 ${od.length} overdue / due today</a></div><div><button class="b o" onclick="location.hash='#/loans'">View Loans</button> <button class="b o" onclick="location.hash='#/deposits'">Deposits</button></div></section>
<section class="kg">${[
      ["Capital Disbursed", "₹12,50,000", "54 active loans"],
      ["Total Repaid / Collected", "₹9,80,400", "Across 212 loans"],
      ["Active Outstanding Dues", "₹3,12,600", "As of today"],
      ["Investor Liquidity", "₹4,60,000", "36 investor wallets"],
    ]
      .map(
        (k) =>
          `<div class="kc"><small>${k[0]}</small><b>${k[1]}</b><span>${k[2]}</span></div>`,
      )
      .join("")}</section>
<div class="two">${card("Disbursement vs Repayment Trends", `<div class="lg"><span><u></u>Disbursed (₹ L)</span><span><u style="background:#c9b3b3"></u>Repaid</span></div><div class="bars">${D.trend.map((t) => `<div><span style="display:flex;gap:3px;align-items:flex-end;height:140px;width:100%;justify-content:center"><i style="height:${(t[1] / m) * 100}%"></i><i class="l" style="height:${(t[2] / m) * 100}%"></i></span>${t[0]}</div>`).join("")}</div>`)}
${card("Portfolio Status", `<svg viewBox="0 0 42 42" style="width:150px;display:block;margin:auto"><circle cx="21" cy="21" r="15.9" fill="none" stroke="#F4E9E9" stroke-width="7"/><circle cx="21" cy="21" r="15.9" fill="none" stroke="#08132D" stroke-width="7" stroke-dasharray="55 45" transform="rotate(-90 21 21)"/><circle cx="21" cy="21" r="15.9" fill="none" stroke="#16915c" stroke-width="7" stroke-dasharray="30 70" stroke-dashoffset="-55" transform="rotate(-90 21 21)"/><circle cx="21" cy="21" r="15.9" fill="none" stroke="#d64545" stroke-width="7" stroke-dasharray="15 85" stroke-dashoffset="-85" transform="rotate(-90 21 21)"/></svg><div class="row"><span>🔵 Active</span><b>55%</b></div><div class="row"><span>🟢 Paid</span><b>30%</b></div><div class="row"><span>🔴 Overdue</span><b>15%</b></div>`)}</div>
${card(
  "🚨 Urgent Follow-Ups (Overdue & Due Today)",
  tbl(
    [
      "Loan ID",
      "Borrower",
      "Principal",
      "Total Due",
      "Due Date",
      "Status",
      "Quick Reminder",
    ],
    od.map((d) => [
      "#" + d[1],
      d[0],
      inr((+d[2].replace(/\D/g, "") * 0.9) | 0),
      d[2],
      d[3],
      bd(d[4]),
      `<button class="b g" onclick="toast('WhatsApp reminder sent to ${d[0]}')">Send</button>`,
    ]),
  ),
)}
<div class="two">${card(
      "📄 Recent Applications",
      tbl(
        ["Borrower", "Amount", "Status", "Action"],
        D.loans
          .slice(2, 6)
          .map((l) => [
            l.user,
            inr(l.amt),
            bd(l.status),
            `<button class="b o" onclick="location.hash='#/loan/${l.id}'">View</button>`,
          ]),
      ),
    )}
${card(
  "💳 Pending Withdrawals",
  tbl(
    ["Investor", "Amount"],
    D.inv_wd.filter((w) => w[4] == "pending").map((w) => [w[1], w[2]]),
  ),
)}</div>`;
  },
  users: () =>
    head("Users", srch) +
    card(
      "",
      tbl(
        ["Sr.", "Name", "Mobile", "Email", "KYC", "Status", "Actions"],
        D.users.map((u, i) => [
          i + 1,
          u[0],
          u[1],
          u[2],
          bd(u[3]),
          bd(u[4]),
          `<button class="b o" onclick="toast('Opening ${u[0]}')">View</button><button class="b ${u[4] == "active" ? "r" : "g"}" onclick="D.users[${i}][4]='${u[4] == "active" ? "inactive" : "active"}';toast('Status updated');route()">${u[4] == "active" ? "Deactivate" : "Activate"}</button>`,
        ]),
      ),
    ),
  investors: () =>
    head("Investors", srch) +
    card(
      "",
      tbl(
        ["Sr.", "Name", "Mobile", "Wallet Balance", "Investments", "Status"],
        D.investors.map((u, i) => [i + 1, ...u.slice(0, 4), bd(u[4])]),
      ),
    ),
  loans: () =>
    head("All Loans", srch) +
    card(
      "",
      tbl(
        [
          "Sr. No.",
          "User",
          "Amount",
          "Tenure",
          "Status",
          "Applied Date",
          "Actions",
        ],
        D.loans.map((l, i) => [
          i + 1,
          l.user,
          inr(l.amt),
          l.ten + " Days",
          bd(l.status),
          l.date,
          loanAct(l),
        ]),
      ),
    ),
  loan(id) {
    const l = D.loans.find((x) => x.id == id) || D.loans[0];
    return (
      head(
        "Loan #" + l.id,
        `<button class="b o" onclick="location.hash='#/loans'">← Back</button>`,
      ) +
      `<div class="two">${card(
        "Loan Information",
        [
          ["Borrower", l.user],
          ["Mobile", l.mob],
          ["Amount", inr(l.amt)],
          ["Tenure", l.ten + " Days"],
          ["Interest Rate", l.rate + "%"],
          ["Purpose", l.purpose],
          ["Due Date", l.due],
          ["Total Payable", inr(l.total)],
          ["Status", bd(l.status)],
        ]
          .map(
            (r) => `<div class="row"><span>${r[0]}</span><b>${r[1]}</b></div>`,
          )
          .join(""),
      )}${card("Actions", (l.status == "approved" ? `<button class="b" onclick="D.loans.find(x=>x.id==${l.id}).status='disbursed';toast('Loan marked as disbursed.');route()">Mark Disbursed</button>` : "") + (l.status == "disbursed" ? `<button class="b g" onclick="D.loans.find(x=>x.id==${l.id}).status='paid';toast('Loan marked paid. Investors paid out.');route()">Mark Paid</button>` : "") + (["pending", "assigned"].includes(l.status) ? loanAct(l) : '<span style="color:#6c7590">No further actions.</span>'))}</div>`
    );
  },
  dues: () => {
    const f = D.dues.filter((d) => dueTab == "all" || d[4] == dueTab);
    return (
      head(
        "Loan Due Management",
        `<button class="b o" onclick="toast('CSV exported')">Export CSV</button>`,
      ) +
      `<div class="tabs">${["all", "today", "upcoming", "overdue", "paid"].map((t) => `<button class="${t == dueTab ? "on" : ""}" onclick="dueTab='${t}';route()">${t[0].toUpperCase() + t.slice(1)}</button>`).join("")}</div>` +
      card(
        "",
        tbl(
          [
            "Borrower",
            "Loan",
            "Total Payable",
            "Due Date",
            "Status",
            "Reminder",
          ],
          f.map((d) => [
            d[0],
            "#" + d[1],
            d[2],
            d[3],
            bd(d[4]),
            d[4] == "paid"
              ? "—"
              : `<button class="b g" onclick="toast('Reminder sent to ${d[0]}')">WhatsApp</button>`,
          ]),
        ),
      )
    );
  },
  payset: () =>
    head("Payment Settings") +
    card(
      "",
      `<div class="form"><label>UPI ID<input value="Vinixx@upi"></label><label>Account Holder<input value="Vinixx Pvt Ltd"></label><label>Bank Name<input value="HDFC Bank"></label><label>Account Number<input value="50100123456789"></label><label>IFSC Code<input value="HDFC0001234"></label><label>QR Image<input type="file"></label></div><br><button class="b" onclick="toast('Payment settings saved.')">Save Settings</button>`,
    ),
  refset: () =>
    head("Referral Settings") +
    card(
      "",
      `<div class="form"><label>Reward Type<select><option>Flat</option><option>Percentage</option></select></label><label>Reward Value<input value="100"></label><label>Minimum Withdrawal (₹)<input value="500"></label></div><br><button class="b" onclick="toast('Referral settings saved.')">Save Settings</button>`,
    ),
  schemes: () =>
    head(
      "Loan Schemes",
      `<button class="b" onclick="toast('Scheme form opened')">+ Add Scheme</button>`,
    ) +
    card(
      "",
      tbl(
        [
          "#",
          "Amount Range",
          "Tenure",
          "Admin %",
          "Investor %",
          "Processing Fee",
          "Platform Charge",
          "Action",
        ],
        D.schemes.map((s) => [
          ...s,
          `<button class="b o">Edit</button><button class="b r" onclick="D.schemes.splice(${s[0] - 1},1);toast('Scheme deleted');route()">Delete</button>`,
        ]),
      ),
    ),
  deposits: () =>
    head("Deposit Requests") +
    card(
      "",
      tbl(
        ["#", "Investor", "Amount", "Method", "Date", "Status", "Action"],
        D.deposits.map((d, i) => [
          ...d.slice(0, 5),
          bd(d[5]),
          d[5] == "pending"
            ? `<button class="b g" onclick="setSt(D.deposits,${i},'approved','Deposit approved. Wallet credited.')">Approve</button><button class="b r" onclick="setSt(D.deposits,${i},'rejected','Deposit rejected.')">Reject</button>`
            : "—",
        ]),
      ),
    ),
  invwd: () =>
    head("Investor Withdrawals") +
    card(
      "",
      tbl(
        ["#", "Investor", "Amount", "Date", "Status", "Action"],
        D.inv_wd.map((d, i) => [
          ...d.slice(0, 4),
          bd(d[4]),
          d[4] == "pending"
            ? `<button class="b g" onclick="setSt(D.inv_wd,${i},'approved','Withdrawal approved.')">Approve</button><button class="b r" onclick="setSt(D.inv_wd,${i},'rejected','Withdrawal rejected.')">Reject</button>`
            : "—",
        ]),
      ),
    ),
  usrwd: () =>
    head("User Withdrawals") +
    card(
      "",
      tbl(
        ["#", "User", "Amount", "Date", "Status", "Action"],
        D.usr_wd.map((d, i) => [
          ...d.slice(0, 4),
          bd(d[4]),
          d[4] == "pending"
            ? `<button class="b g" onclick="setSt(D.usr_wd,${i},'approved','Withdrawal approved.')">Approve</button><button class="b r" onclick="setSt(D.usr_wd,${i},'rejected','Withdrawal rejected.')">Reject</button>`
            : "—",
        ]),
      ),
    ),
  profile: () =>
    head("My Profile") +
    card(
      "",
      `<div class="form"><label>Name<input value="${D.admin.name}"></label><label>Mobile<input value="${D.admin.mobile}" disabled></label><label>Email<input value="${D.admin.email}"></label><label>New Password<input type="password" placeholder="Leave blank to keep"></label></div><br><button class="b" onclick="toast('Profile updated.')">Update Profile</button>`,
    ),
};

/* ---------- shell / router ---------- */
function loginView() {
  $("#app").innerHTML =
    `<div class="ld"><div class="lp"><div class="logo" style="border:0;padding:0;color:#F4E9E9"><span class="lm" style="background:#F4E9E9;color:#08132D">K</span>Vinixx</div><h1>Admin Console</h1><p>Manage loans, investors, payouts and dues from one secure place.</p></div><div class="lf"><div class="card"><h2 style="font-size:22px">Admin Login</h2><label>Mobile Number<input id="m" type="tel" value="9000000001"></label><br><label>Password<span class="pwf"><input id="pw" type="password" value="admin123"><button onclick="pw.type=pw.type=='password'?'text':'password'">👁</button></span></label><br><button class="b" style="width:100%;padding:12px;font-size:14px" onclick="location.hash='#/dashboard'">Login</button></div></div></div>`;
}
function route() {
  const h = location.hash.replace("#/", "") || "login",
    [k, a] = h.split("/");
  if (k == "login" || (!P[k] && k != "login" && h != "login" && !P[k])) {
    return loginView();
  }
  const act = k == "loan" ? "loans" : k;
  $("#app").innerHTML =
    `<div class="shell"><aside class="sb" id="sb"><div class="logo"><span class="lm">V</span>Vinixx</div><nav class="menu">${NAV.map((n) => (n.length == 1 ? `<div class="sec">${n[0]}</div>` : `<a class="${n[0] == act ? "on" : ""}" onclick="location.hash='#/${n[0]}'"><span class="ic">${n[1]}</span>${n[2]}</a>`)).join("")}</nav></aside><div class="bk" onclick="sb.classList.remove('on')"></div><section class="main"><header class="top"><div class="tl"><button class="tg" onclick="sb.classList.add('on')">☰</button>${T[k]}</div><div class="pw"><button class="pb" onclick="pm.classList.toggle('on')"><span class="av">A</span><span class="pn">${D.admin.name}</span></button><div class="pm" id="pm"><div>${D.admin.name}</div><a onclick="location.hash='#/profile'">My Profile</a><a onclick="location.hash='#/login'">Logout</a></div></div></header><main class="ct">${P[k](a)}</main></section></div>`;
  window.scrollTo(0, 0);
}
addEventListener("hashchange", route);
route();
