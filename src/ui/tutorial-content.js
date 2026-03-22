/**
 * 教程和规则内容 — 单一数据来源
 * 同时被 renderer.js（游戏内弹窗）和 setup-screen.js（标题页弹窗）共享
 */

// ═══════ 新手入门 Tab ═══════
export function buildGuideContent() {
  return `
    <h4>🎯 游戏目标</h4>
    <p>将对手的<strong>气血</strong>打到0即可获胜。每人10点气血，不会回复。</p>

    <h4>🃏 每回合你要做什么</h4>
    <ol>
      <li>选 <strong>1张身法卡</strong>（控制距离/闪避）：冲步(-1) / 撤步(+1) / 扎马(不变) / 闪避(不变,耗2体力)</li>
      <li>选 <strong>1张攻防卡</strong>（战斗动作）：从5张中选1张</li>
      <li>点「确认出牌」—— AI也同时出牌，系统自动结算</li>
    </ol>

    <h4>📐 距离是一切的基石</h4>
    <p>双方共享一个<strong>间距值(0~3)</strong>，开局为2。不同兵器在不同间距有<strong>优势区</strong>（加伤）和<strong>劣势区</strong>（伤害大幅降低）。<br/>身法先结算，然后在<strong>新距离</strong>上打攻防。控距 = 控全局。</p>

    <h4>⚔️ 5张攻防卡 · 一句话说明</h4>
    <table class="tutorial-table">
      <tr><th>卡牌</th><th>类型</th><th>一句话</th></tr>
      <tr><td>🤺 卸力</td><td>防守</td><td>专克劈砍：反打2伤+2架势+僵直。猜错了自己吃亏</td></tr>
      <tr><td>⚡ 劈砍</td><td>攻击</td><td>重击3伤，克制点刺和虚晃，但怕卸力</td></tr>
      <tr><td>🎯 点刺</td><td>攻击</td><td>快攻1伤，穿透卸力，但被劈砍完克、被格挡抵消</td></tr>
      <tr><td>🛡️ 格挡</td><td>防守</td><td>完全挡住点刺，减1点劈砍伤害，但被虚晃骗</td></tr>
      <tr><td>🌀 虚晃</td><td>攻击</td><td>0伤害但给对手+2架势，克格挡和卸力，怕劈砍和点刺</td></tr>
    </table>

    <h4>🔄 核心克制链 · 记住这个就够了</h4>
    <div class="tutorial-chain">
      <p><strong>⚡劈砍</strong> → 克 → 🎯点刺、🌀虚晃、🛡️格挡(破防)</p>
      <p><strong>🎯点刺</strong> → 克 → 🤺卸力、🌀虚晃</p>
      <p><strong>🤺卸力</strong> → 克 → ⚡劈砍 (反制2伤+僵直)</p>
      <p><strong>🛡️格挡</strong> → 克 → 🎯点刺 (完全抵消)</p>
      <p><strong>🌀虚晃</strong> → 克 → 🤺卸力、🛡️格挡 (骗出+2架势)</p>
      <p><strong>💨闪避</strong>(身法卡) → 闪开对手攻击，同时自己的攻防卡照常生效，但消耗2体力</p>
    </div>

    <h4>⚠️ 容易被忽略的重要规则</h4>
    <ul>
      <li><strong>闪避是身法卡</strong>：闪避与冲步/撤步/扎马互斥，选了闪避就不能移动。闪避消耗<strong>2体力</strong>，但可以同时出一张攻防卡。</li>
      <li><strong>闪避成功</strong>：对手的攻击卡被无效化，你的攻防卡照常生效（可能单方面命中对手！）。</li>
      <li><strong>闪避被打断</strong>：对手在<strong>优势区使用点刺</strong>可以打断闪避，且你的攻防卡也会被<strong>连带取消</strong>（级联打断）。</li>
      <li><strong>身法打断</strong>：如果你在移动（冲步/撤步）的同时被攻击命中扣血，你的移动会被<strong>取消</strong>！距离回到移动前的位置。</li>
      <li><strong>劣势区架势减半</strong>：在劣势区攻击时，造成的架势效果<strong>减半</strong>（向下取整）。劣势区进攻只能割血，无法有效累积架势。</li>
      <li><strong>架势 → 处决</strong>：架势累计到5点自动触发「处决」<strong>扣5血</strong>，然后架势清零。管好架势比管血更重要！</li>
      <li><strong>僵直</strong>：被卸力反制后下回合<strong>所有攻击卡禁用</strong>，只能防守。</li>
      <li><strong>体力限制</strong>：体力上限4，每回合恢复1（扎马恢复2）。冲步/撤步/闪避消耗体力，体力不够则无法使用。</li>
    </ul>

    <h4>🏹 兵器一览</h4>
    <ul>
      <li><strong>🗡️ 短刀</strong>：优势区0-1 | 点刺破闪避，闪避反击1伤 | 远距劈砍几乎无效</li>
      <li><strong>🔱 长枪</strong>：优势区2-3 | 劈砍+2伤，劈砍额外+1架势，格挡弹枪推1距 | 贴身劈砍几乎无力</li>
      <li><strong>⚔️ 剑</strong>：优势区1-2 | 卸力不僵直改为自身-2架势，完美格挡(劈砍免伤) | 贴身/远距劈砍削弱</li>
      <li><strong>🏏 棍</strong>：优势区1-3(最广) | 虚晃+3架势+推距，劈砍额外+2架势，格挡震退+1架势 | 贴身劈砍无力</li>
      <li><strong>🪓 大刀</strong>：优势区仅2 | 劈砍+3伤(全场最高)+推1距，格挡额外减伤 | 贴身劈砍无力</li>
      <li><strong>🥢 双刺</strong>：优势区仅0 | 贴身点刺追击+1伤，闪避+2架势，贴身命中+1架势 | 远距攻击大幅削弱</li>
    </ul>

    <h4>💡 操作提示</h4>
    <ul>
      <li>点击已选卡牌可取消选择</li>
      <li>虚线卡牌 = 距离不佳，伤害几乎为0；灰色卡牌 = 僵直/体力不足</li>
      <li>鼠标悬停卡牌可看详细提示</li>
      <li>⏪ 回退按钮可撤销上一回合</li>
      <li>右侧历史记录中<strong>点击任意回合</strong>可查看该回合的详细解释</li>
    </ul>
  `;
}

// ═══════ 完整规则 Tab ═══════
export function buildRulesContent() {
  return `
    <h4>📐 间距系统</h4>
    <ul>
      <li>4个间距区间：<strong>贴身区(0) → 近战区(1) → 中距区(2) → 远距区(3)</strong></li>
      <li>初始间距：中距区(2)，范围 [0, 3]</li>
      <li>双方身法效果叠加：玩家冲步(-1) + AI撤步(+1) = 间距不变</li>
      <li>身法消耗：冲步/撤步/闪避各2体力，扎马0体力（扎马额外+1体力恢复）</li>
    </ul>

    <h4>⚔️ 结算顺序</h4>
    <ol>
      <li><strong>身法先结算</strong> → 得到新距离</li>
      <li><strong>攻防在新距离上结算</strong> → 伤害/架势变化</li>
      <li><strong>身法打断判定</strong>：受到HP伤害的一方，如果本回合有移动（冲步/撤步），移动被<strong>取消回退</strong></li>
      <li><strong>状态结算</strong>：检查架势是否≥5触发处决，检查HP</li>
      <li><strong>回合结束</strong>：体力恢复（基础+1，扎马额外+1）</li>
    </ol>

    <h4>🔄 5×5 攻防克制表</h4>
    ${buildRulesMatrix()}

    <h4>★ 闪避机制（身法卡）</h4>
    <ul>
      <li>闪避是<strong>身法卡</strong>，与冲步/撤步/扎马互斥，选了闪避就不能移动。</li>
      <li>选择闪避后<strong>仍然要选一张攻防卡</strong>（5选1）。</li>
      <li>闪避成功：对手的<strong>攻击卡被无效化</strong>，你的攻防卡<strong>照常生效</strong>（可能单方面命中！）。对手的防御卡仍有效。</li>
      <li><strong>优势区点刺破闪避</strong>：当点刺方处于自身兵器优势区时，点刺可无视闪避直接命中。</li>
      <li><strong>级联打断</strong>：闪避被打断时，你的攻防卡也会被<strong>连带取消</strong>！</li>
    </ul>

    <h4>⚡ 身法打断机制</h4>
    <ul>
      <li>本回合选了冲步或撤步的一方，如果在攻防结算中<strong>受到了HP伤害</strong>，其身法移动会被<strong>取消</strong></li>
      <li>距离会回退到该方没有移动的状态（另一方的移动照常生效）</li>
      <li>例：玩家冲步+点刺 vs AI撤步+卸力 → 点刺穿透卸力 → AI受伤 → <strong>AI的撤步被取消</strong></li>
      <li>扎马不受影响（没有移动就无法被打断）</li>
    </ul>

    <h4>🎭 架势 · 处决 · 僵直</h4>
    <ul>
      <li>被攻击/虚晃命中 → 架势值累加</li>
      <li>架势值<strong>≥5</strong>时立即触发「处决」：<strong>扣5血</strong>，架势归零</li>
      <li>被卸力反制 → 进入<strong>僵直</strong>（下回合所有攻击卡禁用）</li>
      <li>剑的卸力例外：成功后<strong>不造成僵直</strong>，改为自身架势-2</li>
    </ul>

    <h4>💪 体力系统</h4>
    <ul>
      <li>体力上限<strong>4</strong>，每回合结束恢复<strong>1</strong>点（扎马额外+1 = 恢复2）</li>
      <li>身法消耗：冲步/撤步/<strong>闪避</strong>各2体力，扎马0体力</li>
      <li>闪避是身法卡，与移动互斥，共享体力池</li>
      <li>攻防卡（卸力、劈砍、点刺、格挡、虚晃）不消耗体力</li>
      <li><strong>劣势区架势减半</strong>：劣势区攻击命中时，造成的架势效果减半（向下取整）</li>
    </ul>

    <h4>🏹 兵器优劣势区间</h4>
    ${buildWeaponTable()}

    <h4>📉 距离对伤害的影响</h4>
    <ul>
      <li>在<strong>劣势区</strong>攻击会受到伤害惩罚，卡牌显示为"虚线框" + "⚠ 距离不佳"</li>
      <li>伤害惩罚严重时（-3），基础伤害会降为0，等于空招</li>
      <li>所有卡牌始终可用，但要注意距离对效果的影响</li>
    </ul>
  `;
}

// ═══════ 共享子组件 ═══════

function buildRulesMatrix() {
  return `
    <table class="rules-matrix">
      <tr><th>我方＼对手</th><th>🤺卸力</th><th>⚡劈砍</th><th>🎯点刺</th><th>🛡️格挡</th><th>🌀虚晃</th></tr>
      <tr><td><strong>🤺卸力</strong></td><td>各+2架势</td><td class="rule-win">反制！对手受2伤+2架势+僵直</td><td class="rule-lose">被刺穿：受点刺伤+1架势</td><td class="rule-lose">浪费：自身+1架势</td><td class="rule-lose">被骗：自身+2架势</td></tr>
      <tr><td><strong>⚡劈砍</strong></td><td class="rule-lose">被反制！受2伤+2架势+僵直</td><td>互砍各受伤</td><td class="rule-win">命中！对手受3伤+1架势</td><td class="rule-win">破防！减1伤后命中</td><td class="rule-win">命中！对手受3伤+1架势</td></tr>
      <tr><td><strong>🎯点刺</strong></td><td class="rule-win">穿透！对手受1伤+1架势</td><td class="rule-lose">被克：受3伤+1架势</td><td>互刺各受伤</td><td class="rule-lose">被挡：完全抵消</td><td class="rule-win">命中！对手受1伤+1架势</td></tr>
      <tr><td><strong>🛡️格挡</strong></td><td>空过(对手+1架势)</td><td class="rule-lose">被破：受减伤后伤害+1架势</td><td class="rule-win">格挡：完全抵消</td><td>空过</td><td class="rule-lose">被骗：自身+2架势</td></tr>
      <tr><td><strong>🌀虚晃</strong></td><td class="rule-win">骗到：对手+2架势</td><td class="rule-lose">被砍：受3伤+1架势</td><td class="rule-lose">被刺：受1伤+1架势</td><td class="rule-win">骗到：对手+2架势</td><td>空过</td></tr>
    </table>
  `;
}

function buildWeaponTable() {
  return `
    <table class="rules-matrix">
      <tr><th>兵器</th><th>优势区</th><th>劣势区</th><th>核心特点</th></tr>
      <tr><td>🗡️ 短刀</td><td>0, 1</td><td>2, 3</td><td>优势区点刺破闪避、闪避反击1伤、远距劈砍几乎无伤</td></tr>
      <tr><td>🔱 长枪</td><td>2, 3</td><td>0</td><td>劈砍+2伤、劈砍额外+1架势、格挡弹枪推1距、贴身劈砍几乎无伤</td></tr>
      <tr><td>⚔️ 剑</td><td>1, 2</td><td>0, 3</td><td>卸力不僵直/自身-2架势、完美格挡(劈砍免伤)、贴身远距劈砍削弱</td></tr>
      <tr><td>🏏 棍</td><td>1, 2, 3</td><td>0</td><td>虚晃+3架势+推距、劈砍额外+2架势、格挡震退+1架势、贴身劈砍几乎无伤</td></tr>
      <tr><td>🪓 大刀</td><td>2</td><td>0</td><td>劈砍+3伤(全场最高)+推1距、格挡额外减伤、贴身劈砍几乎无伤</td></tr>
      <tr><td>🥢 双刺</td><td>0</td><td>2, 3</td><td>贴身点刺追击+1伤、闪避+2架势、贴身命中+1架势</td></tr>
    </table>
  `;
}
