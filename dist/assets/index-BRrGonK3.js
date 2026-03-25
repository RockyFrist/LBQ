(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function t(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(o){if(o.ep)return;o.ep=!0;const s=t(o);fetch(o.href,s)}})();const b=Object.freeze({SHORT_BLADE:"short_blade",SPEAR:"spear",SWORD:"sword",STAFF:"staff",GREAT_BLADE:"great_blade",DUAL_STAB:"dual_stab"}),v=Object.freeze({HOLD:"hold",ADVANCE:"advance",RETREAT:"retreat",DODGE:"dodge"}),i=Object.freeze({DEFLECT:"deflect",SLASH:"slash",THRUST:"thrust",BLOCK:"block",FEINT:"feint"}),Y=Object.freeze({ATTACK:"attack",DEFENSE:"defense"}),we=Object.freeze({SETUP:"setup",INFO_SYNC:"info_sync",PLAYER_PICK:"player_pick",AI_PICK:"ai_pick",DISTANCE_RESOLVE:"distance_resolve",COMBAT_RESOLVE:"combat_resolve",STATUS_RESOLVE:"status_resolve",ROUND_END:"round_end",GAME_OVER:"game_over"});function Yt(e){return{weapon:e,hp:10,stance:0,stamina:4,staggered:!1}}function Vn(e,n,t){return{distance:2,round:0,phase:we.SETUP,player:Yt(e),ai:Yt(n),aiLevel:t,aiName:null,aiTitle:null,history:[],log:[],gameOver:!1,winner:null}}const I={MAX_HP:10,MAX_STANCE:5,EXECUTION_DAMAGE:5,INITIAL_DISTANCE:2,MAX_STAMINA:4,STAMINA_RECOVERY:1},Ke=0,Ve=3,ae=["贴身区","近战区","中距区","远距区"],Ie={[i.DEFLECT]:Y.DEFENSE,[i.SLASH]:Y.ATTACK,[i.THRUST]:Y.ATTACK,[i.BLOCK]:Y.DEFENSE,[i.FEINT]:Y.ATTACK},ze={[i.DEFLECT]:{cost:3,staminaCost:0,damage:2,stanceToOpponent:2,priority:2},[i.SLASH]:{cost:3,staminaCost:0,damage:3,stanceToOpponent:1,priority:3},[i.THRUST]:{cost:1,staminaCost:0,damage:1,stanceToOpponent:1,priority:4},[i.BLOCK]:{cost:2,staminaCost:0,damage:0,stanceToOpponent:0,priority:5},[i.FEINT]:{cost:1,staminaCost:0,damage:0,stanceToOpponent:2,priority:6}},N={[v.ADVANCE]:{cost:2,delta:-1},[v.RETREAT]:{cost:2,delta:1},[v.HOLD]:{cost:0,delta:0},[v.DODGE]:{cost:2,delta:0}},q={[i.DEFLECT]:"卸力",[i.SLASH]:"重击",[i.THRUST]:"轻击",[i.BLOCK]:"格挡",[i.FEINT]:"擒拿"},ee={[v.ADVANCE]:"冲步",[v.RETREAT]:"撤步",[v.HOLD]:"扎马",[v.DODGE]:"闪避"},O={[b.SHORT_BLADE]:"短刀",[b.SPEAR]:"长枪",[b.SWORD]:"剑",[b.STAFF]:"棍",[b.GREAT_BLADE]:"大刀",[b.DUAL_STAB]:"双刺"},M={[b.SHORT_BLADE]:"🗡️",[b.SPEAR]:"🔱",[b.SWORD]:"⚔️",[b.STAFF]:"🏑",[b.GREAT_BLADE]:"🪓",[b.DUAL_STAB]:"🥢"},F={[b.SHORT_BLADE]:{advantage:[0,1],disadvantage:[2,3]},[b.SPEAR]:{advantage:[2,3],disadvantage:[0]},[b.SWORD]:{advantage:[1,2],disadvantage:[0,3]},[b.STAFF]:{advantage:[1,2,3],disadvantage:[0]},[b.GREAT_BLADE]:{advantage:[2],disadvantage:[0]},[b.DUAL_STAB]:{advantage:[0],disadvantage:[2,3]}};function qn(e,n,t){const a=N[n].delta,o=N[t].delta,s=e+a+o;return Math.max(Ke,Math.min(Ve,s))}const Qt={deflectStagger:!0,deflectSelfStance:0,blockSlashReduction:1,advBlockSlashReduction:0,advDodgeCounter:0,advBlockPerfect:!1,advBlockBonusStance:0,advSlashBonusStance:0,advBlockPushDist:0,advFeintBonusStance:0,dodgeCostReduction:0,damageRules:[],pushRules:[]},Gn={[b.SHORT_BLADE]:{advDodgeCounter:1,advFeintBonusStance:1,dodgeCostReduction:1,damageRules:[{minDist:3,card:i.SLASH,mod:-3}]},[b.SPEAR]:{advBlockPushDist:1,damageRules:[{adv:!0,card:i.SLASH,mod:2},{dist:0,card:i.SLASH,mod:-3}]},[b.SWORD]:{deflectStagger:!1,deflectSelfStance:-2,advBlockPerfect:!0,damageRules:[{dist:0,card:i.SLASH,mod:-2},{dist:3,card:i.SLASH,mod:-3}]},[b.STAFF]:{advBlockBonusStance:1,advSlashBonusStance:2,advFeintBonusStance:1,damageRules:[{dist:0,card:i.SLASH,mod:-3}],pushRules:[{card:i.FEINT,vs:i.BLOCK,adv:!0,push:1}]},[b.GREAT_BLADE]:{advBlockSlashReduction:1,damageRules:[{adv:!0,card:i.SLASH,mod:3},{dist:0,card:i.SLASH,mod:-3}],pushRules:[{card:i.SLASH,adv:!0,push:1}]},[b.DUAL_STAB]:{advFeintBonusStance:1,dodgeCostReduction:1,damageRules:[{adv:!0,card:i.THRUST,mod:1},{disadv:!0,card:i.SLASH,mod:-3}]}};function te(e){const n=Gn[e];return n?{...Qt,...n}:{...Qt}}function C(e,n){return F[e].advantage.includes(n)}function Nt(e,n){return F[e].disadvantage.includes(n)}function Oe(e,n,t){const a=te(e);for(const o of a.damageRules)if(o.card===t&&!(o.adv&&!C(e,n))&&!(o.disadv&&!Nt(e,n))&&!(o.dist!==void 0&&o.dist!==n)&&!(o.minDist!==void 0&&n<o.minDist))return o.mod;return 0}function Wt(e,n){return C(e,n)?te(e).advDodgeCounter:0}function xe(e,n){return C(e,n)&&te(e).advBlockPerfect}function ct(e,n){return C(e,n)?te(e).advBlockBonusStance:0}function He(e,n){return C(e,n)?te(e).advSlashBonusStance:0}function rt(e,n){return C(e,n)?te(e).advBlockPushDist:0}function It(e,n){const t=te(e);return t.blockSlashReduction+(C(e,n)?t.advBlockSlashReduction:0)}function zn(e){return te(e).deflectStagger}function Ot(e,n){return 3+(C(e,n)?te(e).advFeintBonusStance:0)}function ft(e){return te(e).dodgeCostReduction}function re(e,n,t,a){if(!C(e,n))return 0;const o=te(e);for(const s of o.pushRules)if(s.card===t&&!(s.adv&&!C(e,n))&&!(s.vs&&s.vs!==a))return s.push;return 0}function en(e,n){return C(e,n)}function R(e,n,t){return Nt(n,t)?Math.floor(e/2):e}function Sn(){return{player:{hpChange:0,stanceChange:0,staggered:!1},ai:{hpChange:0,stanceChange:0,staggered:!1},distancePush:0,log:[]}}function V(e,n,t){const a=ze[e].damage,o=Oe(n,t,e);return Math.max(0,a+o)}function Xn(e,n,t){const a=Sn(),o=e.distance,s=e.player.weapon,l=e.ai.weapon;return n===t?Zn(a,n,s,l,o):(Jn(a,n,t,s,l,o),a)}function Zn(e,n,t,a,o){switch(n){case i.BLOCK:e.log.push("双方空过");break;case i.DEFLECT:e.player.stanceChange+=2,e.ai.stanceChange+=2,e.log.push("卸力对碰，双方各+2架势");break;case i.SLASH:{const s=V(i.SLASH,t,o),l=V(i.SLASH,a,o);e.player.hpChange-=l,e.ai.hpChange-=s,e.player.stanceChange+=R(1,a,o),e.ai.stanceChange+=R(1,t,o);const c=He(t,o),r=He(a,o);c>0&&(e.ai.stanceChange+=c),r>0&&(e.player.stanceChange+=r),t==="spear"&&C(t,o)&&(e.ai.stanceChange+=1),a==="spear"&&C(a,o)&&(e.player.stanceChange+=1);const u=re(t,o,i.SLASH,i.SLASH),f=re(a,o,i.SLASH,i.SLASH);e.distancePush+=u+f,e.log.push(`互砍：玩家受${l}伤，AI受${s}伤`);break}case i.THRUST:{const s=V(i.THRUST,t,o),l=V(i.THRUST,a,o);e.player.hpChange-=l,e.ai.hpChange-=s,e.player.stanceChange+=R(1,a,o),e.ai.stanceChange+=R(1,t,o),e.log.push(`互刺：玩家受${l}伤，AI受${s}伤`);break}case i.FEINT:e.log.push("双方擒拿，空过");break}return e}function Jn(e,n,t,a,o,s){if(n===i.DEFLECT&&t===i.SLASH){tn(e,"player","ai",a);return}if(t===i.DEFLECT&&n===i.SLASH){tn(e,"ai","player",o);return}if(n===i.DEFLECT&&t===i.THRUST){const l=V(i.THRUST,o,s);e.player.hpChange-=l,e.player.stanceChange+=R(1,o,s),e.log.push(`玩家卸力失败遇轻击：受${l}伤+${R(1,o,s)}架势`);return}if(t===i.DEFLECT&&n===i.THRUST){const l=V(i.THRUST,a,s);e.ai.hpChange-=l,e.ai.stanceChange+=R(1,a,s),e.log.push(`AI卸力失败遇轻击：受${l}伤+${R(1,a,s)}架势`);return}if(n===i.DEFLECT&&t===i.FEINT){e.ai.stanceChange+=2,e.log.push("玩家卸力识破擒拿：AI+2架势");return}if(t===i.DEFLECT&&n===i.FEINT){e.player.stanceChange+=2,e.log.push("AI卸力识破擒拿：玩家+2架势");return}if(n===i.DEFLECT&&t===i.BLOCK){e.player.stanceChange+=1,e.log.push("玩家卸力失败(遇格挡)：+1架势");return}if(t===i.DEFLECT&&n===i.BLOCK){e.ai.stanceChange+=1,e.log.push("AI卸力失败(遇格挡)：+1架势");return}if(n===i.SLASH&&t===i.THRUST){dt(e,"player","ai",a,o,s,i.THRUST);return}if(t===i.SLASH&&n===i.THRUST){dt(e,"ai","player",o,a,s,i.THRUST);return}if(n===i.SLASH&&t===i.BLOCK){const l=V(i.SLASH,a,s),c=It(o,s),r=xe(o,s)?0:Math.max(0,l-c);e.ai.hpChange-=r,e.ai.stanceChange+=R(1,a,s);const u=ct(o,s);u>0&&(e.player.stanceChange+=u),a==="spear"&&C(a,s)&&(e.ai.stanceChange+=1);const f=He(a,s);f>0&&(e.ai.stanceChange+=f);const d=re(a,s,i.SLASH,i.BLOCK),p=rt(o,s);e.distancePush+=d+p,xe(o,s)?e.log.push("玩家重击被完美格挡(剑)：AI完全免伤"):e.log.push(`玩家重击破格挡：AI受${r}伤(减免${c})+架势`);return}if(t===i.SLASH&&n===i.BLOCK){const l=V(i.SLASH,o,s),c=It(a,s),r=xe(a,s)?0:Math.max(0,l-c);e.player.hpChange-=r,e.player.stanceChange+=R(1,o,s);const u=ct(a,s);u>0&&(e.ai.stanceChange+=u),o==="spear"&&C(o,s)&&(e.player.stanceChange+=1);const f=He(o,s);f>0&&(e.player.stanceChange+=f);const d=re(o,s,i.SLASH,i.BLOCK),p=rt(a,s);e.distancePush+=d+p,xe(a,s)?e.log.push("AI重击被完美格挡(剑)：玩家完全免伤"):e.log.push(`AI重击破格挡：玩家受${r}伤(减免${c})+架势`);return}if(n===i.SLASH&&t===i.FEINT){dt(e,"player","ai",a,o,s,i.FEINT);return}if(t===i.SLASH&&n===i.FEINT){dt(e,"ai","player",o,a,s,i.FEINT);return}if(n===i.THRUST&&t===i.BLOCK){const l=ct(o,s);l>0&&(e.player.stanceChange+=l);const c=rt(o,s);c>0&&(e.distancePush+=c),e.log.push(`玩家轻击被格挡完全抵消${l>0?"，棍震退+1架势":""}${c>0?"，被弹枪推开":""}`);return}if(t===i.THRUST&&n===i.BLOCK){const l=ct(a,s);l>0&&(e.ai.stanceChange+=l);const c=rt(a,s);c>0&&(e.distancePush+=c),e.log.push(`AI轻击被格挡完全抵消${l>0?"，棍震退+1架势":""}${c>0?"，被弹枪推开":""}`);return}if(n===i.THRUST&&t===i.FEINT){const l=V(i.THRUST,a,s);e.ai.hpChange-=l,e.ai.stanceChange+=R(1,a,s),e.log.push(`玩家轻击命中：AI受${l}伤+${R(1,a,s)}架势`);return}if(t===i.THRUST&&n===i.FEINT){const l=V(i.THRUST,o,s);e.player.hpChange-=l,e.player.stanceChange+=R(1,o,s),e.log.push(`AI轻击命中：玩家受${l}伤+${R(1,o,s)}架势`);return}if(n===i.BLOCK&&t===i.FEINT){const l=Ot(o,s),c=R(l,o,s);e.player.stanceChange+=c;const r=re(o,s,i.FEINT,i.BLOCK);e.distancePush+=r,e.log.push(`AI擒拿命中格挡：玩家+${c}架势${r?"，距离+"+r:""}`);return}if(t===i.BLOCK&&n===i.FEINT){const l=Ot(a,s),c=R(l,a,s);e.ai.stanceChange+=c;const r=re(a,s,i.FEINT,i.BLOCK);e.distancePush+=r,e.log.push(`玩家擒拿命中格挡：AI+${c}架势${r?"，距离+"+r:""}`);return}e.log.push("双方空过")}function tn(e,n,t,a){const o=ze[i.DEFLECT].damage;e[t].hpChange-=o,e[t].stanceChange+=2;const s=n==="player"?"玩家":"AI";zn(a)?(e[t].staggered=!0,e.log.push(`${s}卸力反制成功：对手受${o}伤+2架势+僵直`)):(e[n].stanceChange-=2,e.log.push(`${s}(剑)卸力反制成功：对手受${o}伤+2架势，自身-2架势`))}function dt(e,n,t,a,o,s,l){const c=V(i.SLASH,a,s);e[t].hpChange-=c,e[t].stanceChange+=R(1,a,s);const r=He(a,s);r>0&&(e[t].stanceChange+=r),a==="spear"&&C(a,s)&&(e[t].stanceChange+=1);const u=re(a,s,i.SLASH,l);e.distancePush+=u,e.log.push(`${n==="player"?"玩家":"AI"}重击命中：对手受${c}伤+架势${u?"，距离+"+u:""}`)}function nn(e,n,t){const a=Sn(),o=e.distance,s=e[n].weapon,l=n==="player"?"ai":"player",c=n==="player"?"玩家":"AI";switch(t){case i.SLASH:{const r=V(i.SLASH,s,o);a[l].hpChange-=r,a[l].stanceChange+=R(1,s,o);const u=He(s,o);u>0&&(a[l].stanceChange+=u),s==="spear"&&C(s,o)&&(a[l].stanceChange+=1);const f=re(s,o,i.SLASH,null);a.distancePush+=f,a.log.push(`${c}重击命中(对手闪避失败)：对手受${r}伤+架势`);break}case i.THRUST:{const r=V(i.THRUST,s,o);a[l].hpChange-=r,a[l].stanceChange+=R(1,s,o),a.log.push(`${c}轻击命中(对手闪避失败)：对手受${r}伤`);break}case i.FEINT:{const r=Ot(s,o),u=R(r,s,o);a[l].stanceChange+=u,a.log.push(`${c}擒拿命中(对手闪避失败)：对手+${u}架势`);break}case i.DEFLECT:case i.BLOCK:a.log.push(`${c}防守落空(无攻击可防)`);break}return a}function ht(e,n,t){const a=Vn(e,n,t);return a.phase=we.INFO_SYNC,a}function Bt(e,n,t){let a=JSON.parse(JSON.stringify(e));return a.round+=1,a.log=[],a.log.push(`══════ 第 ${a.round} 回合 ══════`),a.player.staggered=!1,a.ai.staggered=!1,a._lastPDist=n.distanceCard,a._lastADist=t.distanceCard,a=Yn(a,n.distanceCard,t.distanceCard),a=Qn(a,n.combatCard,t.combatCard),a=Wn(a),a=ea(a),a.history.push({round:a.round,playerDistance:n.distanceCard,playerCombat:n.combatCard,aiDistance:t.distanceCard,aiCombat:t.combatCard,pMoveInterrupted:a._pInterrupted||!1,aMoveInterrupted:a._aInterrupted||!1}),delete a._pInterrupted,delete a._aInterrupted,a}function Yn(e,n,t){var l,c;const a=e.distance;e._pDodging=n===v.DODGE,e._aDodging=t===v.DODGE,e._pMoveDelta=N[n].delta,e._aMoveDelta=N[t].delta,e.distance=qn(a,n,t);let o=((l=N[n])==null?void 0:l.cost)??0,s=((c=N[t])==null?void 0:c.cost)??0;return n===v.DODGE&&(o=Math.max(0,o-ft(e.player.weapon))),t===v.DODGE&&(s=Math.max(0,s-ft(e.ai.weapon))),e.player.stamina=Math.max(0,e.player.stamina-o),e.ai.stamina=Math.max(0,e.ai.stamina-s),o>0&&e.log.push(`玩家身法消耗：-${o}体力`),s>0&&e.log.push(`AI身法消耗：-${s}体力`),e.log.push(`间距变化：${a} → ${e.distance}`),e}function Qn(e,n,t){const a=e._pDodging,o=e._aDodging;let s=!1,l=!1,c=!1,r=!1,u=0,f=0;if(a)if(t==="feint")e.log.push("🎭 AI擒拿穿透闪避！玩家闪避落空");else if(t&&Ie[t]===Y.ATTACK)if(t==="thrust"&&en(e.ai.weapon,e.distance))c=!0,e.log.push("⚡ 玩家闪避被AI轻击打断(优势区)！攻防卡取消");else{s=!0,e.log.push("💨 玩家闪避成功！AI攻击无效");const h=Wt(e.player.weapon,e.distance);h>0&&(e.ai.hp-=h,f-=h,e.log.push(`🗡️ 闪避反击！AI受${h}伤`)),e.player.weapon==="dual_stab"&&(e.ai.stance+=2,e.log.push("🥢 双刺闪避成功：AI+2架势"))}else e.log.push("💨 玩家闪避落空(对手无攻击)");if(o)if(n==="feint")e.log.push("🎭 玩家擒拿穿透闪避！AI闪避落空");else if(n&&Ie[n]===Y.ATTACK)if(n==="thrust"&&en(e.player.weapon,e.distance))r=!0,e.log.push("⚡ AI闪避被玩家轻击打断(优势区)！攻防卡取消");else{l=!0,e.log.push("💨 AI闪避成功！玩家攻击无效");const h=Wt(e.ai.weapon,e.distance);h>0&&(e.player.hp-=h,u-=h,e.log.push(`🗡️ 闪避反击！玩家受${h}伤`)),e.ai.weapon==="dual_stab"&&(e.player.stance+=2,e.log.push("🥢 双刺闪避成功：玩家+2架势"))}else e.log.push("💨 AI闪避落空(对手无攻击)");let d=c?null:n,p=r?null:t;s&&(p=null),l&&(d=null);let m;if(d&&p?m=Xn(e,d,p):d&&!p?m=nn(e,"player",d):!d&&p?m=nn(e,"ai",p):m={player:{hpChange:0,stanceChange:0,staggered:!1},ai:{hpChange:0,stanceChange:0,staggered:!1},distancePush:0,log:["双方攻防均被取消"]},e.player.hp+=m.player.hpChange,e.ai.hp+=m.ai.hpChange,e.player.stance+=m.player.stanceChange,e.ai.stance+=m.ai.stanceChange,m.player.staggered&&(e.player.staggered=!0),m.ai.staggered&&(e.ai.staggered=!0),e.distance===0&&(e.player.weapon==="dual_stab"&&(m.ai.hpChange<0||m.ai.stanceChange>0||m.ai.staggered)&&(e.ai.stance+=1,e.log.push("🥢 双刺贴身命中：AI额外+1架势")),e.ai.weapon==="dual_stab"&&(m.player.hpChange<0||m.player.stanceChange>0||m.player.staggered)&&(e.player.stance+=1,e.log.push("🥢 双刺贴身命中：玩家额外+1架势"))),e.distance===0&&(e.player.weapon==="dual_stab"&&d==="thrust"&&m.ai.hpChange<0&&(e.ai.hp-=1,e.log.push("🥢 双刺追击：贴身轻击二连，AI额外受1伤")),e.ai.weapon==="dual_stab"&&p==="thrust"&&m.player.hpChange<0&&(e.player.hp-=1,e.log.push("🥢 双刺追击：贴身轻击二连，玩家额外受1伤"))),m.distancePush!==0){const h=e.distance;e.distance=Math.max(Ke,Math.min(Ve,e.distance+m.distancePush)),e.distance!==h&&e.log.push(`间距被推动：${h} → ${e.distance}`)}e.log.push(...m.log);const g=m.player.hpChange+(u??0),y=m.ai.hpChange+(f??0);return e._pInterrupted=!1,e._aInterrupted=!1,(e._pMoveDelta??0)!==0&&g<0&&(e.distance=Math.max(Ke,Math.min(Ve,e.distance-e._pMoveDelta)),e._pInterrupted=!0,e.log.push("⚡ 玩家身法被打断！攻击命中，移动未完成")),(e._aMoveDelta??0)!==0&&y<0&&(e.distance=Math.max(Ke,Math.min(Ve,e.distance-e._aMoveDelta)),e._aInterrupted=!0,e.log.push("⚡ AI身法被打断！攻击命中，移动未完成")),delete e._pMoveDelta,delete e._aMoveDelta,delete e._pDodging,delete e._aDodging,e}function Wn(e){const n=I.MAX_STANCE,t=I.EXECUTION_DAMAGE;return e.player.stance=Math.max(0,e.player.stance),e.ai.stance=Math.max(0,e.ai.stance),e.player.stance>=n&&(e.player.hp-=t,e.player.stance=0,e.log.push(`⚔ 玩家被处决！-${t}气血`)),e.ai.stance>=n&&(e.ai.hp-=t,e.ai.stance=0,e.log.push(`⚔ AI被处决！-${t}气血`)),e.player.hp=Math.max(0,e.player.hp),e.ai.hp=Math.max(0,e.ai.hp),e}function ea(e){const n=I.MAX_STAMINA,t=I.STAMINA_RECOVERY;e.history.length>0&&e.history[e.history.length-1].playerDistance,e.history.length>0&&e.history[e.history.length-1].aiDistance;const a=e._lastPDist==="hold",o=e._lastADist==="hold",s=a?t+1:t,l=o?t+1:t;e.player.stamina=Math.min(n,e.player.stamina+s),e.ai.stamina=Math.min(n,e.ai.stamina+l),delete e._lastPDist,delete e._lastADist;const c=e.player.hp<=0,r=e.ai.hp<=0;return c&&r?(e.gameOver=!0,e.winner="draw",e.phase=we.GAME_OVER,e.log.push("双方同时倒下——平局！")):c?(e.gameOver=!0,e.winner="ai",e.phase=we.GAME_OVER,e.log.push("玩家气血归零——AI胜利！")):r?(e.gameOver=!0,e.winner="player",e.phase=we.GAME_OVER,e.log.push("AI气血归零——玩家胜利！")):e.phase=we.INFO_SYNC,e}function Qe(e,n,t=0){const{weapon:a,staggered:o,stamina:s}=e;return Object.values(i).filter(c=>!(o&&Ie[c]===Y.ATTACK))}function vt(e,n){const{stamina:t,weapon:a}=e;return Object.values(v).filter(s=>{var c;if(s===v.HOLD)return!0;if(s===v.ADVANCE&&n<=Ke||s===v.RETREAT&&n>=Ve)return!1;let l=((c=N[s])==null?void 0:c.cost)??0;return s===v.DODGE&&a&&(l=Math.max(0,l-ft(a))),!(t<l)})}function ta(e,n,t,a){var c;if(!vt(t,a).includes(e))return{valid:!1,reason:"身法卡不可用"};const s=((c=N[e])==null?void 0:c.cost)??0;return Qe(t,a,s).includes(n)?{valid:!0}:{valid:!1,reason:"攻防卡不可用（体力不足）"}}function Xe(e){const n=e.aiLevel;let t;switch(n){case 1:t=an(e);break;case 2:t=sa(e);break;case 3:t=ia(e);break;case 4:t=oa(e);break;case 5:t=la(e);break;case 6:t=ca(e);break;case 7:t=ra(e);break;case 8:t=da(e);break;default:t=an(e);break}return na(e,t)}function na(e,n){var o;const t=((o=N[n.distanceCard])==null?void 0:o.cost)??0,a=Qe(e.ai,e.distance,t);return a.includes(n.combatCard)||(n.combatCard=S(a)),n}function S(e){if(!(!e||e.length===0))return e[Math.floor(Math.random()*e.length)]}function K(e,n){const t=n.reduce((o,s)=>o+s,0);let a=Math.random()*t;for(let o=0;o<e.length;o++)if(a-=n[o],a<=0)return e[o];return e[e.length-1]}function ue(e){const n=e.distance,t=e.ai,a=vt(t,n),o=Qe(t);return{distCards:a,combatCards:o}}function aa(e){return F[e].advantage}function Re(e,n){const t=aa(e);if(t.includes(n))return v.HOLD;const a=t.reduce((o,s)=>o+s,0)/t.length;return n>a?v.ADVANCE:v.RETREAT}function B(e,n){const a={[i.SLASH]:[i.DEFLECT,i.BLOCK],[i.THRUST]:[i.BLOCK,i.SLASH],[i.FEINT]:[i.DEFLECT,i.SLASH,i.THRUST],[i.BLOCK]:[i.FEINT,i.SLASH],[i.DEFLECT]:[i.THRUST,i.BLOCK]}[e]||[];for(const o of a)if(n.includes(o))return o;return null}function We(e,n){var s,l;const t=e.slice(-n),a={};for(const c of Object.values(i))a[c]=0;t.forEach(c=>a[c.playerCombat]++);const o=Object.entries(a).sort((c,r)=>r[1]-c[1]);return{freq:a,sorted:o,mostUsed:(s=o[0])==null?void 0:s[0],mostCount:((l=o[0])==null?void 0:l[1])||0}}function bt(e,n){const t=e.slice(-n),a={};for(const o of Object.values(v))a[o]=0;return t.forEach(o=>a[o.playerDistance]++),a}function $n(e,n,t){var c;if(!n.includes(v.DODGE)||e.ai.stamina<2)return!1;const a=e.ai.stance,o=e.player.weapon,s=e.distance,l=(c=F[o])==null?void 0:c.advantage.includes(s);return!!(a>=3&&Math.random()<t+.15||l&&Math.random()<t)}function Se(e,n,t={}){const{weapon:a,stamina:o}=e.ai,s=e.player.weapon,l=e.distance,c=F[a].advantage,r=F[s].advantage,u=c.includes(l),f=r.includes(l),d=t.dodgeUrgency||0,p=t.staminaAware||!1,m=t.escapeChance||.4;if(d>0&&$n(e,n,d))return v.DODGE;if(p&&o<=1&&!f)return v.HOLD;let g;if(f&&!u){const y=Re(a,l),h=l<2?v.RETREAT:v.ADVANCE;g=Math.random()<m?h:y}else if(u&&!f)g=v.HOLD;else if(u&&f){const y=c.filter(h=>!r.includes(h));if(y.length){const h=y[0];g=h<l?v.ADVANCE:h>l?v.RETREAT:v.HOLD}else{const h=l<2?v.RETREAT:v.ADVANCE;g=n.includes(h)?h:v.HOLD}}else g=Re(a,l);return n.includes(g)||(g=S(n)),g}function an(e){const{distCards:n,combatCards:t}=ue(e),a=e.ai.weapon,o=e.distance;let s;Math.random()<.6?(s=Re(a,o),n.includes(s)||(s=S(n))):s=S(n);let l;if(C(a,o)){const c=t.filter(r=>Ie[r]===Y.ATTACK);l=c.length&&Math.random()<.65?S(c):S(t)}else{const c=[i.BLOCK,i.THRUST,i.SLASH].filter(r=>t.includes(r));l=c.length?K(c,[3,2,1]):S(t)}return{distanceCard:s,combatCard:l}}function sa(e){const{distCards:n,combatCards:t}=ue(e),a=e.ai.weapon,o=e.distance,s=e.history;let l=Se(e,n,{escapeChance:.3}),c;const r=s.length>0?s[s.length-1]:null;if(r&&Math.random()<.4&&(c=B(r.playerCombat,t)),!c)if(C(a,o)){const u=[i.SLASH,i.THRUST,i.FEINT].filter(f=>t.includes(f));c=u.length?S(u):S(t)}else{const u=[i.BLOCK,i.THRUST].filter(f=>t.includes(f));c=u.length?S(u):S(t)}return{distanceCard:l,combatCard:c}}function ia(e){const{distCards:n,combatCards:t}=ue(e),a=e.ai.weapon,o=e.distance,s=e.history;let l=Se(e,n,{staminaAware:!0,escapeChance:.45,dodgeUrgency:.15}),c;const r=e.ai.stance,u=e.player.stance,f=s.length>0?s[s.length-1]:null;if(r>=3&&t.includes(i.BLOCK)&&Math.random()<.7&&(c=i.BLOCK),!c&&e.player.staggered){const d=[i.SLASH].filter(p=>t.includes(p));d.length&&(c=d[0])}if(!c&&u>=3){const d=[i.THRUST,i.FEINT].filter(p=>t.includes(p));d.length&&(c=S(d))}if(!c&&f&&Math.random()<.55&&(c=B(f.playerCombat,t)),!c&&s.length>=2){const d=s.slice(-2).map(p=>p.playerCombat);if(d[0]===d[1]){const p=B(d[1],t);p&&Math.random()<.65&&(c=p)}}if(!c)if(C(a,o)){const d=[i.SLASH,i.THRUST,i.FEINT].filter(p=>t.includes(p));c=d.length?K(d,[3,2,2]):S(t)}else{const d=[i.BLOCK,i.THRUST,i.DEFLECT].filter(p=>t.includes(p));c=d.length?K(d,[3,2,1]):S(t)}return{distanceCard:l,combatCard:c}}function oa(e){const{distCards:n,combatCards:t}=ue(e),a=e.ai.weapon,o=e.distance,s=e.history;let l=Se(e,n,{staminaAware:!0,escapeChance:.55,dodgeUrgency:.2}),c;const r=e.ai.stance,u=e.player.stance,f=s.length>0?s[s.length-1]:null;if(r>=3&&t.includes(i.BLOCK)&&(c=i.BLOCK),!c&&e.player.staggered&&t.includes(i.SLASH)&&(c=i.SLASH),!c&&u>=3){const d=[i.THRUST,i.FEINT,i.SLASH].filter(p=>t.includes(p));d.length&&(c=d[0])}if(!c&&f&&(f.aiCombat===i.FEINT&&(f.playerCombat===i.BLOCK||f.playerCombat===i.DEFLECT)&&t.includes(i.SLASH)&&(c=i.SLASH),!c&&f.aiCombat===i.SLASH&&f.playerCombat===i.DEFLECT&&t.includes(i.THRUST)&&(c=i.THRUST)),!c&&s.length>=2){const{mostUsed:d,mostCount:p}=We(s,3);if(p>=2){const m=B(d,t);m&&Math.random()<.65&&(c=m)}}if(!c&&f&&Math.random()<.55&&(c=B(f.playerCombat,t)),!c)if(C(a,o)){const d=[i.SLASH,i.THRUST,i.FEINT].filter(p=>t.includes(p));c=d.length?K(d,[3,2,2]):S(t)}else{const d=[i.BLOCK,i.THRUST,i.DEFLECT].filter(p=>t.includes(p));c=d.length?K(d,[3,2,2]):S(t)}return{distanceCard:l,combatCard:c}}function la(e){const{distCards:n,combatCards:t}=ue(e),a=e.ai.weapon;e.player.weapon;const o=e.distance,s=e.history;let l;if(s.length>=3){const d=bt(s,4);d[v.DODGE]>=2,d[v.ADVANCE]>=3&&n.includes(v.RETREAT)&&(l=v.RETREAT)}l||(l=Se(e,n,{staminaAware:!0,escapeChance:.6,dodgeUrgency:.3}));let c;const r=e.ai.stance,u=e.player.stance,f=s.length>0?s[s.length-1]:null;if(r>=4&&t.includes(i.BLOCK)&&(c=i.BLOCK),!c&&r>=3){const d=[i.BLOCK,i.DEFLECT].filter(p=>t.includes(p));d.length&&Math.random()<.75&&(c=S(d))}if(!c&&e.player.staggered&&t.includes(i.SLASH)&&(c=i.SLASH),!c&&u>=3){const d=[i.FEINT,i.SLASH,i.THRUST].filter(p=>t.includes(p));d.length&&(c=d[0])}if(!c&&f&&(f.aiCombat===i.FEINT&&(f.playerCombat===i.BLOCK||f.playerCombat===i.DEFLECT)&&t.includes(i.SLASH)&&(c=i.SLASH),!c&&f.aiCombat===i.SLASH&&f.playerCombat===i.DEFLECT&&t.includes(i.THRUST)&&(c=i.THRUST),!c&&f.playerDistance===v.DODGE&&t.includes(i.FEINT)&&Math.random()<.6&&(c=i.FEINT)),!c&&s.length>=3){const{mostUsed:d,mostCount:p,sorted:m}=We(s,5);if(p>=2){const g=B(d,t);g&&Math.random()<.75&&(c=g)}if(!c&&m[1]&&m[1][1]>=2){const g=B(m[1][0],t);g&&Math.random()<.5&&(c=g)}}if(!c&&f&&Math.random()<.6&&(c=B(f.playerCombat,t)),!c)if(C(a,o)){const d=[i.SLASH,i.THRUST,i.FEINT,i.DEFLECT].filter(p=>t.includes(p));c=d.length?K(d,[3,2,2,1]):S(t)}else{const d=[i.BLOCK,i.THRUST,i.DEFLECT,i.FEINT].filter(p=>t.includes(p));c=d.length?K(d,[3,2,2,1]):S(t)}return{distanceCard:l,combatCard:c}}function ca(e){var d;const{distCards:n,combatCards:t}=ue(e),a=e.ai.weapon;e.player.weapon;const o=e.distance,s=e.history,l=s.length>0?s[s.length-1]:null;let c;if(s.length>=3){const p=bt(s,5);p[v.DODGE]>=2&&(C(a,o)?c=v.HOLD:c=Re(a,o)),!c&&p[v.ADVANCE]>=3&&(C(a,o)?c=v.HOLD:c=n.includes(v.RETREAT)?v.RETREAT:Re(a,o))}c||(c=Se(e,n,{staminaAware:!0,escapeChance:.65,dodgeUrgency:.35})),n.includes(c)||(c=S(n));let r;const u=e.ai.stance,f=e.player.stance;if(u>=3)if(u>=4&&t.includes(i.BLOCK))r=i.BLOCK;else{const p=[i.BLOCK,i.DEFLECT].filter(m=>t.includes(m));p.length&&(r=S(p))}if(!r&&e.player.staggered&&(r=t.includes(i.SLASH)?i.SLASH:null),!r&&f>=3){const p=[i.FEINT,i.THRUST,i.SLASH].filter(m=>t.includes(m));p.length&&(r=p[0])}if(!r&&l&&(l.aiCombat===i.FEINT&&(l.playerCombat===i.BLOCK||l.playerCombat===i.DEFLECT)&&(r=t.includes(i.SLASH)?i.SLASH:null),!r&&l.aiCombat===i.SLASH&&l.playerCombat===i.DEFLECT&&(r=t.includes(i.THRUST)?i.THRUST:null),!r&&l.aiCombat===i.THRUST&&l.playerCombat===i.BLOCK&&(r=t.includes(i.FEINT)?i.FEINT:null),!r&&l.playerDistance===v.DODGE&&t.includes(i.FEINT)&&Math.random()<.7&&(r=i.FEINT)),!r&&s.length>=3){const{mostUsed:p,mostCount:m,sorted:g}=We(s,6);if(m>=2){const y=B(p,t);y&&Math.random()<.85&&(r=y)}if(!r&&((d=g[1])==null?void 0:d[1])>=2){const y=B(g[1][0],t);y&&Math.random()<.6&&(r=y)}}if(!r&&l&&(r=B(l.playerCombat,t)),!r)if(C(a,o)){const p=[i.SLASH,i.THRUST,i.FEINT,i.DEFLECT].filter(m=>t.includes(m));r=p.length?K(p,[3,3,2,1]):S(t)}else{const p=[i.BLOCK,i.DEFLECT,i.THRUST,i.FEINT].filter(m=>t.includes(m));r=p.length?K(p,[3,2,2,1]):S(t)}return{distanceCard:c,combatCard:r}}function ra(e){var p;const{distCards:n,combatCards:t}=ue(e),a=e.ai.weapon;e.player.weapon;const o=e.distance,s=e.history,l=s.length>0?s[s.length-1]:null;let c;s.length>=3&&bt(s,5)[v.DODGE]>=2&&(c=C(a,o)?v.HOLD:Re(a,o)),c||(c=Se(e,n,{staminaAware:!0,escapeChance:.7,dodgeUrgency:.35})),n.includes(c)||(c=S(n));let r;const u=e.ai.stance,f=e.player.stance;let d=!1;if(s.length>=2){const m=s.slice(-2).map(g=>g.aiCombat);d=m[0]===m[1]}if(u>=3){const m=[i.BLOCK,i.DEFLECT].filter(g=>t.includes(g));m.length&&(r=u>=4?i.BLOCK:S(m))}if(!r&&e.player.staggered&&(r=t.includes(i.SLASH)?i.SLASH:null),!r&&f>=3){const m=[i.FEINT,i.THRUST,i.SLASH].filter(g=>t.includes(g));m.length&&(r=m[0])}if(!r&&l&&(l.aiCombat===i.FEINT&&(l.playerCombat===i.BLOCK||l.playerCombat===i.DEFLECT)&&(r=t.includes(i.SLASH)?i.SLASH:null),!r&&l.aiCombat===i.SLASH&&l.playerCombat===i.DEFLECT&&(r=t.includes(i.THRUST)?i.THRUST:null),!r&&l.aiCombat===i.THRUST&&l.playerCombat===i.BLOCK&&(r=t.includes(i.FEINT)?i.FEINT:null),!r&&l.playerDistance===v.DODGE&&t.includes(i.FEINT)&&(r=i.FEINT)),!r&&s.length>=3){const{mostUsed:m,mostCount:g,sorted:y}=We(s,6);if(g>=2){const h=B(m,t);h&&(r=h)}if(!r&&((p=y[1])==null?void 0:p[1])>=2){const h=B(y[1][0],t);h&&Math.random()<.7&&(r=h)}}if(!r&&l&&(r=B(l.playerCombat,t)),r&&d&&l&&r===l.aiCombat&&Math.random()<.2){const m=t.filter(g=>g!==r);m.length&&(r=S(m))}if(!r)if(C(a,o)){const m=[i.SLASH,i.THRUST,i.FEINT,i.DEFLECT].filter(g=>t.includes(g));r=m.length?K(m,[3,3,2,1]):S(t)}else{const m=[i.BLOCK,i.DEFLECT,i.THRUST,i.FEINT].filter(g=>t.includes(g));r=m.length?K(m,[3,2,2,1]):S(t)}return{distanceCard:c,combatCard:r}}function da(e){var y;const{distCards:n,combatCards:t}=ue(e),a=e.ai.weapon,o=e.player.weapon,s=e.distance,l=e.history,c=l.length>0?l[l.length-1]:null;let r;const u=C(a,s),f=C(o,s);l.length>=3&&bt(l,5)[v.DODGE]>=2&&u&&(r=v.HOLD),r||e.ai.stamina<=1&&!f&&e.ai.stance<3&&(r=v.HOLD),r||$n(e,n,.45)&&(r=v.DODGE),r||(r=Se(e,n,{staminaAware:!0,escapeChance:.75,dodgeUrgency:0})),n.includes(r)||(r=S(n));let d;const p=e.ai.stance,m=e.player.stance;e.ai.hp;const g=e.player.hp;if(p>=4&&t.includes(i.BLOCK)&&(d=i.BLOCK),!d&&p>=3){const h=[i.BLOCK,i.DEFLECT].filter(w=>t.includes(w));h.length&&(d=S(h))}if(!d&&e.player.staggered&&(d=t.includes(i.SLASH)?i.SLASH:null),!d&&g<=3&&(C(a,s)&&t.includes(i.SLASH)?d=i.SLASH:t.includes(i.THRUST)&&(d=i.THRUST)),!d&&m>=3){const h=[i.FEINT,i.THRUST,i.SLASH].filter(w=>t.includes(w));h.length&&(d=h[0])}if(!d&&c){const h=c.aiCombat,w=B(h,Object.values(i));if(w){const T=B(w,t);T&&Math.random()<.6&&(d=T)}}if(!d&&c&&(c.aiCombat===i.FEINT&&(c.playerCombat===i.BLOCK||c.playerCombat===i.DEFLECT)&&(d=t.includes(i.SLASH)?i.SLASH:null),!d&&c.aiCombat===i.SLASH&&c.playerCombat===i.DEFLECT&&(d=t.includes(i.THRUST)?i.THRUST:null),!d&&c.aiCombat===i.THRUST&&c.playerCombat===i.BLOCK&&(d=t.includes(i.FEINT)?i.FEINT:null),!d&&c.playerDistance===v.DODGE&&(d=t.includes(i.FEINT)?i.FEINT:null)),!d&&l.length>=2){const{mostUsed:h,mostCount:w,sorted:T}=We(l,8);if(w>=2){const E=B(h,t);E&&(d=E)}if(!d&&((y=T[1])==null?void 0:y[1])>=2){const E=B(T[1][0],t);E&&(d=E)}}if(!d&&c&&(d=B(c.playerCombat,t)),d&&l.length>=4&&Math.random()<.15){const h=t.filter(w=>w!==d);if(h.length){const w=h.map(T=>Ie[T]===Y.ATTACK&&C(a,s)?3:T===i.BLOCK&&p>=2?2:1);d=K(h,w)}}if(!d)if(C(a,s)){const h=[i.SLASH,i.THRUST,i.FEINT,i.DEFLECT].filter(w=>t.includes(w));d=h.length?K(h,[4,3,2,1]):S(t)}else{const h=[i.BLOCK,i.DEFLECT,i.THRUST,i.FEINT].filter(w=>t.includes(w));d=h.length?K(h,[3,3,2,1]):S(t)}return{distanceCard:r,combatCard:d}}function ua(e,n){const t=C(e,n),a=Nt(e,n),o=[];switch(t&&o.push({icon:"★",text:"优势区",cls:"trait-buff"}),a&&o.push({icon:"✗",text:"劣势区",cls:"trait-nerf"}),e){case b.SHORT_BLADE:t&&(o.push({icon:"🎯",text:"轻击破闪避",cls:"trait-buff"}),o.push({icon:"🗡️",text:"闪避时反击1伤",cls:"trait-buff"})),n>=3&&o.push({icon:"⚠",text:"重击几乎无效",cls:"trait-nerf"});break;case b.SPEAR:t&&(o.push({icon:"🔱",text:"重击+2伤+额外架势",cls:"trait-buff"}),o.push({icon:"🛡️",text:"格挡弹枪推1距",cls:"trait-buff"})),n===0&&o.push({icon:"⚠",text:"重击几乎无效",cls:"trait-nerf"});break;case b.SWORD:t&&(o.push({icon:"⚔️",text:"卸力不造成僵直",cls:"trait-buff"}),o.push({icon:"🛡️",text:"完美格挡(重击免伤)",cls:"trait-buff"})),n===0&&o.push({icon:"⚠",text:"重击大幅削弱",cls:"trait-nerf"}),n===3&&o.push({icon:"⚠",text:"重击大幅削弱",cls:"trait-nerf"});break;case b.STAFF:t&&(o.push({icon:"🏑",text:"擒拿+3架势",cls:"trait-buff"}),o.push({icon:"↗",text:"擒拿破格挡→推距",cls:"trait-buff"}),o.push({icon:"⚡",text:"重击额外+2架势",cls:"trait-buff"}),o.push({icon:"🛡️",text:"格挡震退+1架势",cls:"trait-buff"})),n===0&&o.push({icon:"⚠",text:"重击几乎无效",cls:"trait-nerf"});break;case b.GREAT_BLADE:t&&(o.push({icon:"🪓",text:"重击+3伤(共6)",cls:"trait-buff"}),o.push({icon:"↗",text:"重击命中→推距+1",cls:"trait-buff"}),o.push({icon:"🛡️",text:"格挡额外减1伤",cls:"trait-buff"})),n===0&&o.push({icon:"⚠",text:"重击几乎无效",cls:"trait-nerf"});break;case b.DUAL_STAB:t&&(o.push({icon:"🥢",text:"轻击追击+1伤",cls:"trait-buff"}),o.push({icon:"💨",text:"闪避→对手+2架势",cls:"trait-buff"}),o.push({icon:"✦",text:"命中额外+1架势",cls:"trait-buff"})),a&&o.push({icon:"⚠",text:"重击几乎无效",cls:"trait-nerf"});break}return o}function pa(e,n,t,a,o){const s=[],l=q[e],c=q[n];if(s.push(`玩家出 <strong>${l}</strong> vs AI出 <strong>${c}</strong>`),e===n){switch(e){case i.BLOCK:case i.FEINT:s.push("双方出了相同的牌 → <strong>空过</strong>，无事发生");break;case i.DEFLECT:s.push("卸力对碰 → <strong>双方各+2架势</strong>");break;case i.SLASH:s.push("互砍 → <strong>双方各受重击伤害+1架势</strong>");break;case i.THRUST:s.push("互刺 → <strong>双方各受轻击伤害+1架势</strong>");break}return s}if(sn(s,e,n,t,a,o,"玩家"),s.length===1&&sn(s,n,e,a,t,o,"AI"),C(t,o)){const r=Oe(t,o,e);r>0&&s.push(`📈 玩家 ${O[t]} 优势区加成：${l}伤害+${r}`)}if(C(a,o)){const r=Oe(a,o,n);r>0&&s.push(`📈 AI ${O[a]} 优势区加成：${c}伤害+${r}`)}return s}function sn(e,n,t,a,o,s,l){if(n===i.DEFLECT)t===i.SLASH?(e.push(`${l}卸力 vs 重击 → <strong>卸力反制成功！</strong>重击方受2伤+2架势+僵直`),a==="sword"&&e.push("（⚔️ 剑的卸力：不造成僵直，改为自身-2架势）")):t===i.THRUST?e.push(`${l}卸力 vs 轻击 → <strong>卸力失败</strong>（轻击穿透卸力），卸力方受轻击伤害+1架势`):t===i.FEINT?e.push(`${l}卸力 vs 擒拿 → <strong>卸力识破！</strong>擒拿方+2架势`):t===i.BLOCK&&e.push(`${l}卸力 vs 格挡 → <strong>卸力落空</strong>，卸力方+1架势`);else if(n===i.SLASH){const c=ze[i.SLASH].damage,r=Oe(a,s,i.SLASH),u=Math.max(0,c+r),f=r<0?`（势区惩罚${r}，实际${u}伤）`:"";if(t===i.THRUST)e.push(`${l}重击 vs 轻击 → <strong>重击克制轻击！</strong>轻击方受${u}伤+1架势${f}`);else if(t===i.BLOCK){const d=It(o,s);if(xe(o,s))e.push(`${l}重击 vs 格挡 → <strong>完美格挡！</strong>格挡方完全免伤${f}`);else{const p=Math.max(0,u-d);e.push(`${l}重击 vs 格挡 → <strong>重击破格挡</strong>，格挡方减免${d}伤后受${p}伤+1架势${f}`)}}else t===i.FEINT&&e.push(`${l}重击 vs 擒拿 → <strong>重击命中！</strong>擒拿方受${u}伤+1架势${f}`)}else if(n===i.THRUST){const c=ze[i.THRUST].damage,r=Oe(a,s,i.THRUST),u=Math.max(0,c+r),f=r!==0?`（距离修正${r>0?"+":""}${r}，实际${u}伤）`:"";t===i.BLOCK?e.push(`${l}轻击 vs 格挡 → <strong>格挡完全抵消</strong>轻击，无伤害`):t===i.FEINT&&e.push(`${l}轻击 vs 擒拿 → <strong>轻击命中！</strong>擒拿方受${u}伤+1架势${f}`)}else n===i.BLOCK&&t===i.FEINT&&e.push(`${l}格挡 vs 擒拿 → <strong>格挡被擒拿骗</strong>，格挡方+3架势`)}function Ln(){return`
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
      <tr><td>🤺 卸力</td><td>防守</td><td>克重击(反打2伤+僵直)＋识破擒拿(对手+2架势)。遇其他牌吃亏</td></tr>
      <tr><td>⚡ 重击</td><td>攻击</td><td>重击3伤，克制轻击和擒拿，但怕卸力</td></tr>
      <tr><td>🎯 轻击</td><td>攻击</td><td>快攻1伤，穿透卸力，但被重击完克、被格挡抵消</td></tr>
      <li><strong>🛡️ 格挡</strong></td><td>防守</td><td>完全挡住轻击，减1点重击伤害，但被擒拿骗+3架势</li>
      <tr><td>🌀 擒拿</td><td>攻击</td><td>0伤害但给对手+3架势，克格挡和闪避，怕重击和卸力</td></tr>
    </table>

    <h4>🔄 核心克制链 · 记住这个就够了</h4>
    <div class="tutorial-chain">
      <p><strong>⚡重击</strong> → 克 → 🎯轻击、🌀擒拿、🛡️格挡(破防)</p>
      <p><strong>🎯轻击</strong> → 克 → 🤺卸力、🌀擒拿</p>
      <p><strong>🤺卸力</strong> → 克 → ⚡重击 (反制2伤+僵直)、🌀擒拿 (识破+2架势)</p>
      <p><strong>🛡️格挡</strong> → 克 → 🎯轻击 (完全抵消)</p>
      <p><strong>🌀擒拿</strong> → 克 → 🛡️格挡 (骗出+3架势)、💨闪避 (穿透闪避)</p>
      <p><strong>💨闪避</strong>(身法卡) → 闪开对手重击/轻击，但<strong>无法闪避擒拿</strong>，同时自己的攻防卡照常生效</p>
    </div>

    <h4>⚠️ 容易被忽略的重要规则</h4>
    <ul>
      <li><strong>💨 闪避</strong>：闪避与冲步/撤步/扎马互斥。闪避消耗<strong>2体力</strong>（短刀/双刺仅耗1），但可以同时出一张攻防卡。</li>
      <li><strong>闪避成功</strong>：对手的重击/轻击被无效化，你的攻防卡照常生效（可能单方面命中对手！）。</li>
      <li><strong>擒拿穿透闪避</strong>：对手出擒拿时，你的闪避会<strong>落空</strong>！体力白耗。</li>
      <li><strong>闪避被打断</strong>：对手在<strong>优势区使用轻击</strong>可以打断闪避，且你的攻防卡也会被<strong>连带取消</strong>（级联打断）。</li>
      <li><strong>身法打断</strong>：如果你在移动（冲步/撤步）的同时被攻击命中扣血，你的移动会被<strong>取消</strong>！距离回到移动前的位置。</li>
      <li><strong>劣势区架势减半</strong>：在劣势区攻击时，造成的架势效果<strong>减半</strong>（向下取整）。劣势区进攻只能割血，无法有效累积架势。</li>
      <li><strong>架势 → 处决</strong>：架势累计到5点自动触发「处决」<strong>扣5血</strong>，然后架势清零。管好架势比管血更重要！</li>
      <li><strong>僵直</strong>：被卸力反制后下回合<strong>所有攻击卡禁用</strong>，只能防守。</li>
      <li><strong>体力限制</strong>：体力上限4，每回合恢复1（扎马恢复2）。冲步/撤步/闪避消耗体力，体力不够则无法使用。</li>
    </ul>

    <h4>🏹 兵器一览</h4>
    <ul>
      <li><strong>� 短刀</strong>：优势区0-1 | 轻击破闪避，闪避反击1伤，闪避仅耗1体力 | 远距重击几乎无效</li>
      <li><strong>🔱 长枪</strong>：优势区2-3 | 重击+2伤，重击额外+1架势，格挡弹枪推1距 | 贴身重击几乎无力</li>
      <li><strong>⚔️ 剑</strong>：优势区1-2 | 卸力不僵直改为自身-2架势，完美格挡(重击免伤) | 贴身/远距重击削弱</li>
      <li><strong>🏏 棍</strong>：优势区1-3(最广) | 擒拿+3架势+推距，重击额外+2架势，格挡震退+1架势 | 贴身重击无力</li>
      <li><strong>🪓 大刀</strong>：优势区仅2 | 重击+3伤(全场最高)+推1距，格挡额外减伤 | 贴身重击无力</li>
      <li><strong>🥢 双刺</strong>：优势区仅0 | 贴身轻击追击+1伤，闪避+2架势，闪避仅耗1体力，贴身命中+1架势 | 远距攻击大幅削弱</li>
    </ul>

    <h4>💡 操作提示</h4>
    <ul>
      <li>点击已选卡牌可取消选择</li>
      <li>虚线卡牌 = 距离不佳，伤害几乎为0；灰色卡牌 = 僵直/体力不足</li>
      <li>鼠标悬停卡牌可看详细提示</li>
      <li>⏪ 回退按钮可撤销上一回合</li>
      <li>右侧历史记录中<strong>点击任意回合</strong>可查看该回合的详细解释</li>
    </ul>
  `}function wn(){return`
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
    ${fa()}

    <h4>★ 闪避机制（身法卡）</h4>
    <ul>
      <li>闪避是<strong>身法卡</strong>，与冲步/撤步/扎马互斥，选了闪避就不能移动。</li>
      <li>选择闪避后<strong>仍然要选一张攻防卡</strong>（5选1）。</li>
      <li>闪避成功：对手的<strong>重击/轻击被无效化</strong>，你的攻防卡<strong>照常生效</strong>（可能单方面命中！）。对手的防御卡仍有效。</li>
      <li><strong>擒拿穿透闪避</strong>：对手出擒拿时，你的闪避会<strong>落空</strong>，体力白耗。</li>
      <li><strong>优势区轻击破闪避</strong>：当轻击方处于自身兵器优势区时，轻击可无视闪避直接命中。</li>
      <li><strong>级联打断</strong>：闪避被轻击打断时，你的攻防卡也会被<strong>连带取消</strong>！</li>
    </ul>

    <h4>⚡ 身法打断机制</h4>
    <ul>
      <li>本回合选了冲步或撤步的一方，如果在攻防结算中<strong>受到了HP伤害</strong>，其身法移动会被<strong>取消</strong></li>
      <li>距离会回退到该方没有移动的状态（另一方的移动照常生效）</li>
      <li>例：玩家冲步+轻击 vs AI撤步+卸力 → 轻击穿透卸力 → AI受伤 → <strong>AI的撤步被取消</strong></li>
      <li>扎马不受影响（没有移动就无法被打断）</li>
    </ul>

    <h4>🎭 架势 · 处决 · 僵直</h4>
    <ul>
      <li>被攻击/擒拿命中 → 架势值累加</li>
      <li>架势值<strong>≥5</strong>时立即触发「处决」：<strong>扣5血</strong>，架势归零</li>
      <li>被卸力反制 → 进入<strong>僵直</strong>（下回合所有攻击卡禁用）</li>
      <li>剑的卸力例外：成功后<strong>不造成僵直</strong>，改为自身架势-2</li>
    </ul>

    <h4>💪 体力系统</h4>
    <ul>
      <li>体力上限<strong>4</strong>，每回合结束恢复<strong>1</strong>点（扎马额外+1 = 恢复2）</li>
      <li>身法消耗：冲步/撤步/<strong>闪避</strong>各2体力，扎马0体力</li>
      <li>闪避是身法卡，与移动互斥，共享体力池</li>
      <li>攻防卡（卸力、重击、轻击、格挡、擒拿）不消耗体力</li>
      <li><strong>劣势区架势减半</strong>：劣势区攻击命中时，造成的架势效果减半（向下取整）</li>
    </ul>

    <h4>🏹 兵器优劣势区间</h4>
    ${ma()}

    <h4>📉 距离对伤害的影响</h4>
    <ul>
      <li>在<strong>劣势区</strong>攻击会受到伤害惩罚，卡牌显示为"虚线框" + "⚠ 距离不佳"</li>
      <li>伤害惩罚严重时（-3），基础伤害会降为0，等于空招</li>
      <li>所有卡牌始终可用，但要注意距离对效果的影响</li>
    </ul>
  `}function fa(){return`
    <table class="rules-matrix">
      <tr><th>我方＼对手</th><th>🤺卸力</th><th>⚡重击</th><th>🎯轻击</th><th>🛡️格挡</th><th>🌀擒拿</th></tr>
      <tr><td><strong>🤺卸力</strong></td><td>各+2架势</td><td class="rule-win">反制！对手受2伤+2架势+僵直</td><td class="rule-lose">被刺穿：受轻击伤+1架势</td><td class="rule-lose">浪费：自身+1架势</td><td class="rule-win">识破！对手+2架势</td></tr>
      <tr><td><strong>⚡重击</strong></td><td class="rule-lose">被反制！受2伤+2架势+僵直</td><td>互砍各受伤</td><td class="rule-win">命中！对手受3伤+1架势</td><td class="rule-win">破防！减1伤后命中</td><td class="rule-win">命中！对手受3伤+1架势</td></tr>
      <tr><td><strong>🎯轻击</strong></td><td class="rule-win">穿透！对手受1伤+1架势</td><td class="rule-lose">被克：受3伤+1架势</td><td>互刺各受伤</td><td class="rule-lose">被挡：完全抵消</td><td class="rule-win">命中！对手受1伤+1架势</td></tr>
      <tr><td><strong>🛡️格挡</strong></td><td>空过(对手+1架势)</td><td class="rule-lose">被破：受减伤后伤害+1架势</td><td class="rule-win">格挡：完全抵消</td><td>空过</td><td class="rule-lose">被骗：自身+3架势</td></tr>
      <tr><td><strong>🌀擒拿</strong></td><td class="rule-lose">被识破：自身+2架势</td><td class="rule-lose">被砍：受3伤+1架势</td><td class="rule-lose">被刺：受1伤+1架势</td><td class="rule-win">骗到：对手+3架势</td><td>空过</td></tr>
    </table>
  `}function ma(){return`
    <table class="rules-matrix">
      <tr><th>兵器</th><th>优势区</th><th>劣势区</th><th>核心特点</th></tr>
      <tr><td>🗡️ 短刀</td><td>0, 1</td><td>2, 3</td><td>优势区轻击破闪避、闪避反击1伤、远距重击几乎无伤</td></tr>
      <tr><td>🔱 长枪</td><td>2, 3</td><td>0</td><td>重击+2伤、重击额外+1架势、格挡弹枪推1距、贴身重击几乎无伤</td></tr>
      <tr><td>⚔️ 剑</td><td>1, 2</td><td>0, 3</td><td>卸力不僵直/自身-2架势、完美格挡(重击免伤)、贴身远距重击削弱</td></tr>
      <tr><td>🏏 棍</td><td>1, 2, 3</td><td>0</td><td>擒拿+3架势+推距、重击额外+2架势、格挡震退+1架势、贴身重击几乎无伤</td></tr>
      <tr><td>🪓 大刀</td><td>2</td><td>0</td><td>重击+3伤(全场最高)+推1距、格挡额外减伤、贴身重击几乎无伤</td></tr>
      <tr><td>🥢 双刺</td><td>0</td><td>2, 3</td><td>贴身轻击追击+1伤、闪避+2架势、贴身命中+1架势</td></tr>
    </table>
  `}const U={[i.DEFLECT]:{emoji:"🤺",type:"防",desc:"反制重击+识破擒拿，克重击/擒拿"},[i.SLASH]:{emoji:"⚡",type:"攻",desc:"3伤+1架势，高威力"},[i.THRUST]:{emoji:"🎯",type:"攻",desc:"1伤+1架势，快速打击"},[i.BLOCK]:{emoji:"🛡️",type:"防",desc:"减免攻击伤害"},[i.FEINT]:{emoji:"🌀",type:"攻",desc:"0伤+3架势，克格挡/闪避，被卸力识破"}},Ze={[v.ADVANCE]:{emoji:"⬆️",desc:"冲步：间距-1"},[v.RETREAT]:{emoji:"⬇️",desc:"撤步：间距+1"},[v.HOLD]:{emoji:"⏸️",desc:"不变"},[v.DODGE]:{emoji:"💨",desc:"闪避(耗2体力，短刀/双刺耗1)：闪开重击/轻击，无法躲擒拿"}},ce={0:{player:42,ai:58},1:{player:35,ai:65},2:{player:24,ai:76},3:{player:12,ai:88}},D=(e,n)=>({cat:e,text:n}),Dn={[b.SHORT_BLADE]:{style:"近身刺客",traits:[D("core","优势区闪避反击1伤"),D("core","闪避仅耗1体力"),D("buff","优势区擒拿+4架势"),D("weak","远距(3)重击无伤")]},[b.SPEAR]:{style:"中远控距",traits:[D("core","优势区格挡弹枪→推距+1"),D("buff","优势区重击5伤，额外+1架势"),D("weak","贴身(0)重击无伤")]},[b.SWORD]:{style:"均衡防反",traits:[D("core","卸力不僵直，自身回2架势"),D("core","优势区格挡完全免重击"),D("weak","贴身重击仅1伤，远距重击无伤")]},[b.STAFF]:{style:"广域压制",traits:[D("core","优势区擒拿命中格挡→推距+1"),D("core","优势区格挡给对手+1架势"),D("buff","优势区擒拿+4架势 / 重击+2架势"),D("weak","贴身(0)重击无伤")]},[b.GREAT_BLADE]:{style:"重击爆发",traits:[D("core","优势区重击命中→推距+1"),D("core","优势区格挡减2伤(常规1)"),D("buff","优势区重击6伤(全场最高)"),D("weak","贴身(0)重击无伤")]},[b.DUAL_STAB]:{style:"贴身缠斗",traits:[D("core","闪避成功→对手+2架势"),D("core","闪避仅耗1体力"),D("buff","贴身：轻击3伤(追击) / 擒拿+4架势"),D("weak","中远距(2-3)重击无伤")]}},ga={core:{label:"特",cls:"wz-cat-core"},buff:{label:"强",cls:"wz-cat-buff"},weak:{label:"弱",cls:"wz-cat-weak"}},on=["core","buff","weak"],ha={[b.SHORT_BLADE]:[{name:"贴身步",emoji:"👣",desc:"间距-1，贴身区额外减体力消耗"}],[b.SPEAR]:[{name:"撑杆退",emoji:"🔱",desc:"间距+1，阻止对手下回合靠近超过1格"}],[b.SWORD]:[{name:"游身换位",emoji:"🌊",desc:"间距不变，获得下回合优先结算权"}],[b.STAFF]:[{name:"拨草寻蛇",emoji:"🐍",desc:"间距+1，并给对手+1架势"}],[b.GREAT_BLADE]:[{name:"沉肩带步",emoji:"🏋️",desc:"间距-1，下回合重击消耗-1"}],[b.DUAL_STAB]:[{name:"蛇行缠步",emoji:"🥢",desc:"间距-2，消耗2体力"}]};function va(e){return(ha[e]||[]).map(t=>`
    <div class="dist-card disabled weapon-skill-card" title="${t.desc}（未开发）">
      <span class="dc-emoji">${t.emoji}</span>
      <span class="dc-name">${t.name}</span>
      <span class="dc-cost">🔒</span>
    </div>
  `).join("")}function j(e,n=null){const t=F[e],a=Dn[e],o=[0,1,2,3].map(c=>{const r=t.advantage.includes(c),u=t.disadvantage.includes(c),f=c===n;let d="wz-cell";r?d+=" wz-adv":u?d+=" wz-dis":d+=" wz-neutral",f&&(d+=" wz-current");const p=r?"★":u?"✗":"·";return`<div class="${d}">
      <div class="wz-dist-name">${ae[c]}</div>
      <div class="wz-marker">${p}</div>
      ${f?'<div class="wz-here">▲</div>':""}
    </div>`}).join(""),l=(a?[...a.traits].sort((c,r)=>on.indexOf(c.cat)-on.indexOf(r.cat)):[]).map(c=>{const r=ga[c.cat];return`<span class="wz-trait ${r.cls}"><span class="wz-cat-label">${r.label}</span>${c.text}</span>`}).join("");return`
    <div class="wz-strip">
      <div class="wz-header">${M[e]} ${O[e]} · ${(a==null?void 0:a.style)||""}</div>
      <div class="wz-bar">${o}</div>
      ${l?`<div class="wz-traits">${l}</div>`:""}
    </div>
  `}function ba(e,n=!1){const t=Dn[e];return`
    <div class="weapon-pick-btn ${n?"selected":""}" data-weapon="${e}">
      <span class="wpb-emoji">${M[e]}</span>
      <span class="wpb-name">${O[e]}</span>
      <span class="wpb-style">${(t==null?void 0:t.style)||""}</span>
    </div>
  `}let ye=null,de=null,Ae=.5,Je=!1;function pe(){return ye||(ye=new(window.AudioContext||window.webkitAudioContext),de=ye.createGain(),de.gain.value=Ae,de.connect(ye.destination)),ye.state==="suspended"&&ye.resume(),ye}function Me(){return pe(),de}function ya(e){Ae=Math.max(0,Math.min(1,e)),de&&(de.gain.value=Je?0:Ae);try{localStorage.setItem("lbq_sfxVol",Ae)}catch{}}function Aa(){return Ae}function Ea(e){Je=e,de&&(de.gain.value=Je?0:Ae);try{localStorage.setItem("lbq_muted",e?"1":"0")}catch{}}function Ht(){return Je}try{const e=localStorage.getItem("lbq_sfxVol");e!==null&&(Ae=parseFloat(e)),localStorage.getItem("lbq_muted")==="1"&&(Je=!0)}catch{}function P(e,n,t,a,o,s){const l=pe(),c=e*l.sampleRate,r=l.createBuffer(1,c,l.sampleRate),u=r.getChannelData(0);for(let g=0;g<c;g++)u[g]=Math.random()*2-1;const f=l.createBufferSource();f.buffer=r;const d=l.createBiquadFilter();d.type=t||"lowpass",d.frequency.value=n||2e3;const p=l.createGain(),m=l.currentTime;p.gain.setValueAtTime(0,m),p.gain.linearRampToValueAtTime(a||.3,m+(o||.01)),p.gain.linearRampToValueAtTime(0,m+e),f.connect(d),d.connect(p),p.connect(Me()),f.start(m),f.stop(m+e)}function L(e,n,t,a,o,s){const l=pe(),c=l.createOscillator();c.type=t||"sine",c.frequency.value=e;const r=l.createGain(),u=l.currentTime;r.gain.setValueAtTime(0,u),r.gain.linearRampToValueAtTime(a||.3,u+(o||.01)),r.gain.linearRampToValueAtTime(0,u+n),c.connect(r),r.connect(Me()),c.start(u),c.stop(u+n)}function Ee(e,n,t){const a=pe();let s=a.currentTime;for(const[l,c]of e){const r=a.createOscillator();r.type=n||"sine",r.frequency.value=l;const u=a.createGain();u.gain.setValueAtTime(0,s),u.gain.linearRampToValueAtTime(t||.25,s+.01),u.gain.linearRampToValueAtTime(0,s+c),r.connect(u),u.connect(Me()),r.start(s),r.stop(s+c),s+=c*.85}}function qe(){L(800,.08,"sine",.15,.005)}function ln(){L(600,.06,"square",.1,.005),L(900,.08,"sine",.12,.02)}function cn(){L(500,.06,"sine",.08,.005)}function Ta(){Ee([[520,.08],[780,.12]],"sine",.2)}function Ca(){Ee([[400,.1],[300,.15]],"triangle",.15)}function Sa(){P(.25,3e3,"bandpass",.35,.005),L(150,.15,"sawtooth",.2,.005)}function $a(){P(.12,5e3,"highpass",.25,.005),L(400,.08,"square",.15,.005)}function La(){L(200,.2,"triangle",.25,.005),P(.1,1500,"lowpass",.2,.005)}function wa(){const e=pe(),n=e.createOscillator();n.type="sawtooth";const t=e.currentTime;n.frequency.setValueAtTime(800,t),n.frequency.linearRampToValueAtTime(200,t+.2);const a=e.createGain();a.gain.setValueAtTime(0,t),a.gain.linearRampToValueAtTime(.2,t+.02),a.gain.linearRampToValueAtTime(0,t+.25),n.connect(a),a.connect(Me()),n.start(t),n.stop(t+.25),P(.15,4e3,"highpass",.15,.01)}function Da(){L(300,.1,"square",.12,.005),P(.08,2e3,"lowpass",.15,.01)}function rn(){const e=pe(),n=e.createOscillator();n.type="sine";const t=e.currentTime;n.frequency.setValueAtTime(300,t),n.frequency.linearRampToValueAtTime(800,t+.1),n.frequency.linearRampToValueAtTime(200,t+.3);const a=e.createGain();a.gain.setValueAtTime(0,t),a.gain.linearRampToValueAtTime(.15,t+.05),a.gain.linearRampToValueAtTime(0,t+.3),n.connect(a),a.connect(Me()),n.start(t),n.stop(t+.3),P(.2,6e3,"highpass",.1,.02)}function Ia(){L(250,.08,"square",.3,.002),L(500,.12,"sawtooth",.2,.005),P(.18,3500,"bandpass",.3,.005)}function dn(){P(.15,800,"lowpass",.35,.005),L(100,.12,"sine",.25,.005)}function un(){P(.3,600,"lowpass",.4,.005),L(80,.3,"sawtooth",.3,.005),setTimeout(()=>{L(60,.4,"sine",.25,.01),P(.2,2e3,"bandpass",.25,.02)},150)}function Oa(){const e=pe(),n=e.createOscillator();n.type="sawtooth";const t=e.currentTime;n.frequency.setValueAtTime(150,t),n.frequency.linearRampToValueAtTime(80,t+.3);const a=e.createGain();a.gain.setValueAtTime(0,t),a.gain.linearRampToValueAtTime(.2,t+.02),a.gain.linearRampToValueAtTime(0,t+.35),n.connect(a),a.connect(Me()),n.start(t),n.stop(t+.35)}function Ha(){P(.2,1200,"lowpass",.25,.005),L(200,.15,"triangle",.15,.01)}function pn(){P(.1,3e3,"lowpass",.15,.005),L(250,.06,"sine",.1,.005)}function fn(){P(.12,2e3,"lowpass",.12,.005),L(180,.08,"sine",.08,.005)}function mn(){P(.06,1500,"lowpass",.08,.005)}function Ra(){L(120,.15,"triangle",.2,.005),P(.1,800,"lowpass",.15,.02)}function Mt(){Ee([[523,.15],[659,.15],[784,.15],[1047,.3]],"triangle",.25),setTimeout(()=>{Ee([[784,.12],[1047,.25]],"sine",.15)},200)}function In(){Ee([[400,.2],[350,.2],[300,.25],[200,.4]],"triangle",.2)}function Na(){Ee([[600,.1],[800,.1],[1e3,.2]],"sine",.2)}function Ba(){Ee([[300,.25],[250,.25],[200,.3],[150,.5]],"sawtooth",.15)}function On(){P(.15,5e3,"highpass",.2,.005),setTimeout(()=>{L(400,.1,"sawtooth",.15,.005),L(600,.15,"sine",.12,.02)},80)}function gn(){L(500,.08,"sine",.08,.005),L(700,.1,"sine",.06,.03)}function hn(){L(350,.1,"triangle",.12,.005)}function vn(){L(600,.08,"sine",.08,.005),L(800,.1,"sine",.06,.02)}const Ma={slash:Sa,thrust:$a,block:La,deflect:wa,feint:Da};function ka(e){const n=Ma[e];n&&n()}function mt(){pe(),document.removeEventListener("click",mt),document.removeEventListener("keydown",mt)}document.addEventListener("click",mt);document.addEventListener("keydown",mt);function _a(e,n,t,a,o){const s=a.spectator,l=s?Za(n,a):Pa(n,t),c=`
    <div class="game-wrapper">
      ${Fa(n,a)}
      <div class="game-layout">
        ${l}
        ${Ka(n,a)}
        ${Qa(n,s)}
      </div>
      ${ts()}
    </div>
    ${ns()}
    ${as()}
  `;e.innerHTML=c,is(n,t,a,o)}function Fa(e,n){const t=`<button class="ctrl-btn" data-action="togglemute">${Ht()?"🔇":"🔊"}</button>`,a=`<input type="range" class="vol-slider" data-action="volume" min="0" max="100" value="${Math.round(Aa()*100)}" title="音量">`;return n.spectator?`
      <div class="top-bar">
        <div class="game-title">🦗 斗蛐蛐</div>
        <div class="top-controls">
          <button class="ctrl-btn" data-action="tutorial">📚 引导</button>
          <button class="ctrl-btn" data-action="newgame">🏠 返回</button>
          <button class="ctrl-btn" data-action="pause">${n.isPaused?"▶️ 继续":"⏸️ 暂停"}</button>
          ${t}${a}
          <span class="round-badge">第 ${e.round+1} 回合</span>
        </div>
      </div>
    `:`
    <div class="top-bar">
      <div class="game-title">⚔️ 冷刃博弈</div>
      <div class="top-controls">
        <button class="ctrl-btn" data-action="tutorial">📚 引导</button>
        <select class="diff-select" data-action="difficulty">
          ${[1,2,3,4,5,6].map(o=>`<option value="${o}" ${o===e.aiLevel?"selected":""}>难度${o}</option>`).join("")}
        </select>
        <button class="ctrl-btn" data-action="newgame">🎮 新对局</button>
        <button class="ctrl-btn" data-action="reset">🔄 重置</button>
        <button class="ctrl-btn" data-action="pause">${n.isPaused?"▶️ 继续":"⏸️ 暂停"}</button>
        <button class="ctrl-btn" data-action="undo" ${n.canUndo?"":"disabled"}>⏪ 回退</button>
        ${t}${a}
        <span class="round-badge">第 ${e.round+1} 回合</span>
      </div>
    </div>
  `}function Pa(e,n){var r;const t=e.player,a=e.distance,o=t.staggered?'<span class="stagger-badge">⚠ 僵直</span>':"",s=vt(t,a),l=n.distanceCard?((r=N[n.distanceCard])==null?void 0:r.cost)??0:0,c=Qe(t,a,l);return`
    <div class="side-panel player-side">
      <div class="panel-header">
        <span class="panel-icon">👤</span>
        <span class="panel-name">玩家 ${o}</span>
        <span class="weapon-badge">${M[t.weapon]||""} ${O[t.weapon]}</span>
      </div>
      ${kt(t)}
      ${j(t.weapon,e.distance)}
      <div class="divider"></div>
      <div class="card-sel-title">🃏 选择出牌</div>
      <div class="card-group-label">身法卡（必选）</div>
      <div class="cards-row">
        ${Ua(e,n,t,s)}
      </div>
      <div class="card-group-label weapon-skill-label">🔒 兵器专属身法 <span class="dev-tag">未开发</span></div>
      <div class="cards-row weapon-skills-row">
        ${va(e.player.weapon)}
      </div>
      <div class="card-group-label">攻防卡（必选）</div>
      <div class="cards-grid compact">
        ${xa(e,n,t,c)}
      </div>
      <button class="btn-confirm" id="btn-confirm"
        ${!n.distanceCard||!n.combatCard?"disabled":""}>
        确认出牌
      </button>
    </div>
  `}function kt(e,n){const t=I.MAX_HP,a=I.MAX_STANCE,o=I.MAX_STAMINA;return`
    ${Lt("❤️ 气血","hp",e.hp,t)}
    ${Lt("💨 体力","stamina",e.stamina,o,!1)}
    ${Lt("⚡ 架势","stance",e.stance,a,e.stance>=4)}
  `}function Lt(e,n,t,a,o){const s=Math.max(0,t/a*100);return`
    <div class="stat-row" data-stat="${n}">
      <span class="stat-label">${e}</span>
      <div class="stat-bar-wrap">
        <div class="stat-bar ${n}${o?" danger":""}" data-max="${a}" style="width: ${s}%"></div>
      </div>
      <span class="stat-value">${t}/${a}</span>
    </div>
  `}function Ua(e,n,t,a){const o=e.player;return e.distance,[v.ADVANCE,v.RETREAT,v.HOLD,v.DODGE].map(l=>{var m;const c=a.includes(l),r=n.distanceCard===l,u=Ze[l];let f=((m=N[l])==null?void 0:m.cost)??0;l===v.DODGE&&o.weapon&&(f=Math.max(0,f-ft(o.weapon)));const d=[u.desc];f>0&&d.push(`耗${f}体力`),!c&&f>0&&o.stamina<f&&d.push(`⛔ 体力不足（需要${f}）`);const p=d.join(`
`);return`
      <div class="dist-card ${r?"selected":""} ${c?"":"disabled"}"
           data-type="distance" data-card="${l}" title="${p}">
        <span class="dc-emoji">${u.emoji}</span>
        <span class="dc-name">${ee[l]}</span>
        ${f>0?`<span class="dc-cost">${f}体</span>`:""}
      </div>
    `}).join("")}function ja(e,n,t,a,o,s){return a&&Ie[e]===Y.ATTACK?"⛔ 僵直中，无法使用攻击":""}function xa(e,n,t,a){var l;const o=e.player,s=e.distance;return n.distanceCard&&((l=N[n.distanceCard])==null||l.cost),Object.values(i).map(c=>{const r=a.includes(c),u=n.combatCard===c,f=U[c],d=ze[c],p=f.type==="攻"?"atk":"def",m=[f.desc],g=Oe(o.weapon,s,c);g>0&&m.push(`📈 优势区加成：伤害+${g}`),g<0&&g>=-2&&m.push(`📉 劣势区减益：伤害${g}`),g<=-3&&m.push(`⚠️ 距离不佳：伤害${g}，几乎无效`),r||m.push(ja(c,o.weapon,s,o.staggered,o.stamina));const y=m.join(`
`),h=g<=-3&&d.damage>0?"cc-weak":"";return`
      <div class="combat-card ${u?"selected":""} ${r?"":"disabled"} ${h}"
           data-type="combat" data-card="${c}" title="${y}">
        <div class="cc-top">
          <span class="cc-emoji">${f.emoji}</span>
          <span class="cc-name">${q[c]}</span>
          <span class="cc-type ${p}">${f.type}</span>
        </div>
        <div class="cc-desc">${f.desc}</div>
        <div class="cc-footer">
          <span>伤${d.damage}</span>
          <span>P${d.priority}</span>
          ${g!==0?`<span class="cc-mod ${g>0?"buff":"nerf"}">${g>0?"+":""}${g}伤</span>`:""}
        </div>
        ${h?'<div class="cc-weak-tag">⚠ 距离不佳</div>':""}
      </div>
    `}).join("")}function Ka(e,n){const t=n.spectator;return`
    <div class="center-area">
      ${n.isPaused?'<div class="paused-banner">⏸ 已暂停 — 点击「继续」恢复</div>':""}
      ${t?"":Va(e)}
      <div class="arena-wrapper">
        ${Ga(e,t)}
        ${za(e,t)}
      </div>
      ${qa(e,t)}
      ${Xa(e)}
    </div>
  `}function Va(e){const n=e.player,t=e.ai,a=e.distance,o=F[n.weapon],s=F[t.weapon],l=o.advantage.includes(a),c=s.advantage.includes(a),r=o.disadvantage.includes(a),u=[];l&&!c?u.push("✅ 你在优势间距！攻击伤害加成"):c&&!l?u.push("⚠️ 对手在优势间距！考虑用身法调整间距"):l&&c?u.push("⚔️ 双方都在优势区，正面较量！"):r&&u.push("❌ 你在劣势区，攻击受削弱！"),n.stance>=4?u.push("🔴 你架势快满了！被攻击可能触发处决(-5血)"):t.stance>=4&&u.push("🟢 对手架势快满了！攻击/擒拿可触发处决"),n.stamina<=1?u.push("🔋 体力不足！只能扎马，无法进退"):t.stamina<=1&&u.push("🎯 对手体力不足！无法移动，趁机调整间距"),n.staggered&&u.push("😵 僵直中！本回合无法使用攻击卡"),t.staggered&&u.push("💥 对手僵直！无法使用攻击卡，进攻好时机"),u.length===0&&u.push("💡 选择1张身法卡 + 1张攻防卡，点确认出牌");const f=ua(n.weapon,a),d=f.length>0?`<div class="trait-tags">${f.map(p=>`<span class="trait-tag ${p.cls}">${p.icon} ${p.text}</span>`).join("")}</div>`:"";return`<div class="situation-hint">${u.join('<span class="hint-sep">|</span>')}</div>${d}`}function qa(e,n=!1){const t=F[e.player.weapon],a=F[e.ai.weapon],o=e.distance,s=n?"🤖左":"👤",l=n?"🤖右":"🤖",c=(r,u)=>{const f=[0,1,2,3].map(d=>{const p=u.advantage.includes(d),m=u.disadvantage.includes(d),g=d===o;let y="azr-cell";return p?y+=" azr-adv":m&&(y+=" azr-dis"),g&&(y+=" azr-current"),`<span class="${y}">${p?"★":m?"✗":""}${ae[d]}</span>`}).join("");return`<div class="azr-row"><span class="azr-label">${r}</span>${f}</div>`};return`
    <div class="arena-zone-ribbon">
      ${c(s,t)}
      ${c(l,a)}
    </div>
  `}function Ga(e,n=!1){const t=I.MAX_HP,a=I.MAX_STANCE,o=ce[e.distance]||ce[2],s=(e.player.hp/t*100).toFixed(0),l=(e.ai.hp/t*100).toFixed(0),c=(e.player.stance/a*100).toFixed(0),r=(e.ai.stance/a*100).toFixed(0),u=o.player,f=o.ai-o.player,d=n?"左方":"玩家",p=e.aiName||(n?"右方":"AI"),m=e.player.staggered?"😵":n?"🤖":"🧑",g=e.ai.staggered?"😵":e.aiName?"👤":"🤖";return`
    <div class="battle-arena">
      <div class="arena-title">⚔️ 战斗场景</div>
      <div class="arena-stage dist-${e.distance}" id="arena-stage" style="--arena-cam:${e.distance}">
        <div class="arena-parallax-far"></div>
        <div class="arena-parallax-mid"></div>
        <div class="arena-dist-label">${ae[e.distance]}</div>
        <div class="arena-dist-line" style="left:${u}%;width:${f}%"></div>
        <div class="fighter player-fighter" id="player-fighter" style="left:${o.player}%">
          <div class="fighter-weapon-icon">${M[e.player.weapon]||"🗡️"}</div>
          <div class="fighter-body">${m}</div>
          <div class="fighter-label">${d}</div>
          <div class="mini-bars">
            <div class="mini-bar"><div class="mini-bar-fill hp-p" style="width:${s}%"></div></div>
            <div class="mini-bar"><div class="mini-bar-fill stance-f" style="width:${c}%"></div></div>
          </div>
        </div>
        <div class="fighter ai-fighter" id="ai-fighter" style="left:${o.ai}%">
          <div class="fighter-weapon-icon">${M[e.ai.weapon]||"🔱"}</div>
          <div class="fighter-body">${g}</div>
          <div class="fighter-label">${p}</div>
          <div class="mini-bars">
            <div class="mini-bar"><div class="mini-bar-fill hp-a" style="width:${l}%"></div></div>
            <div class="mini-bar"><div class="mini-bar-fill stance-f" style="width:${r}%"></div></div>
          </div>
        </div>
      </div>
    </div>
  `}function za(e,n=!1){if(e.history.length===0)return`<div class="round-result-banner">${n?"等待开战...":"等待出牌..."}</div>`;const t=e.history[e.history.length-1],a=ee[t.playerDistance],o=q[t.playerCombat],s=ee[t.aiDistance],l=q[t.aiCombat],c=U[t.playerCombat]?U[t.playerCombat].emoji:"",r=U[t.aiCombat]?U[t.aiCombat].emoji:"",u=n?"🤖":"👤";return`
    <div class="round-result-banner">
      <span class="rrb-label">第${e.round}回合</span>
      <span class="rrb-player">${u} ${a}+${c}${o}</span>
      <span class="rrb-vs">VS</span>
      <span class="rrb-ai">🤖 ${s}+${r}${l}</span>
    </div>
  `}function Xa(e){return`
    <div class="battle-log" id="battle-log">
      <div class="log-title">📜 战斗日志</div>
      ${e.log.map(t=>{let a="log-line";return(t.includes("处决")||t.includes("伤"))&&(a+=" damage"),t.includes("══")&&(a+=" highlight"),(t.includes("闪避成功")||t.includes("格挡"))&&(a+=" good"),`<div class="${a}">${t}</div>`}).join("")||'<div class="log-line">等待对局开始...</div>'}
    </div>
  `}function Za(e,n){const t=e.player;return`
    <div class="side-panel player-side">
      <div class="panel-header">
        <span class="panel-icon">🤖</span>
        <span class="panel-name">左方 ${t.staggered?'<span class="stagger-badge">⚠ 僵直</span>':""}</span>
        <span class="weapon-badge">${M[t.weapon]||""} ${O[t.weapon]}</span>
      </div>
      ${kt(t)}
      ${j(t.weapon,e.distance)}
      <div class="divider"></div>
      ${Ja(e)}
      <div class="divider"></div>
      ${Ya(n)}
    </div>
  `}function Ja(e){if(e.history.length===0)return`
      <div class="ai-last-action">
        <div class="ala-title">🀴 左方上回合</div>
        <div class="ala-waiting">等待第一回合...</div>
      </div>
    `;const n=e.history[e.history.length-1],t=Ze[n.playerDistance],a=U[n.playerCombat];return`
    <div class="ai-last-action">
      <div class="ala-title">🀴 左方上回合</div>
      <div class="ala-cards">
        <div class="ala-card">${t.emoji} ${ee[n.playerDistance]}</div>
        <div class="ala-card">${a.emoji} ${q[n.playerCombat]} <span class="cc-type ${a.type==="攻"?"atk":"def"}">${a.type}</span></div>
      </div>
    </div>
  `}function Ya(e){return`
    <div class="speed-controls">
      <div class="speed-title">⏩ 播放速度</div>
      <div class="speed-btns">
        ${[{label:"慢速",value:2e3},{label:"正常",value:800},{label:"快速",value:100},{label:"极速",value:0}].map(t=>`<button class="speed-btn ${e.autoPlaySpeed===t.value?"active":""}" data-speed="${t.value}">${t.label}</button>`).join("")}
      </div>
    </div>
  `}function Qa(e,n=!1){const t=e.ai,a=t.staggered?'<span class="stagger-badge">⚠ 僵直</span>':"",o=e.aiName?"👤":"🤖",s=e.aiName||(n?"右方":"AI"),l=n?"🀴 右方上回合出牌":"🀴 AI上回合出牌";return`
    <div class="side-panel ai-side">
      <div class="panel-header">
        <span class="panel-icon">${o}</span>
        <span class="panel-name">${s} ${a}</span>
        <span class="weapon-badge">${M[t.weapon]||""} ${O[t.weapon]}</span>
      </div>
      ${kt(t)}
      ${j(t.weapon,e.distance)}
      <div class="divider"></div>
      ${Wa(e,l)}
      <div class="divider"></div>
      ${es(e,n)}
    </div>
  `}function Wa(e,n){const t=n;if(e.history.length===0)return`
      <div class="ai-last-action">
        <div class="ala-title">${t}</div>
        <div class="ala-waiting">等待第一回合...</div>
      </div>
    `;const a=e.history[e.history.length-1],o=Ze[a.aiDistance],s=U[a.aiCombat];return`
    <div class="ai-last-action">
      <div class="ala-title">${t}</div>
      <div class="ala-cards">
        <div class="ala-card">${o.emoji} ${ee[a.aiDistance]}</div>
        <div class="ala-card">${s.emoji} ${q[a.aiCombat]} <span class="cc-type ${s.type==="攻"?"atk":"def"}">${s.type}</span></div>
      </div>
    </div>
  `}function es(e,n=!1){const t=n?"🤖左":"👤",a=n?"🤖右":"🤖";return`
    <div class="history-section">
      <div class="history-title">📜 历史记录 <span class="history-hint">点击回合查看详情</span></div>
      <div class="history-list" id="history-list">
        ${e.history.map((s,l)=>{const c=ee[s.playerDistance],r=q[s.playerCombat],u=ee[s.aiDistance],f=q[s.aiCombat],d=U[s.playerCombat]?U[s.playerCombat].emoji:"",p=U[s.aiCombat]?U[s.aiCombat].emoji:"",m=s.pMoveInterrupted?" 🔙":"",g=s.aMoveInterrupted?" 🔙":"";return`
      <div class="history-item history-clickable" data-round-idx="${l}" title="点击查看本回合详细解释">
        <div class="h-round">回合 ${l+1} <span class="h-explain-hint">🔍</span></div>
        <div class="h-player">${t} ${c} + ${d} ${r}${m}</div>
        <div class="h-ai">${a} ${u} + ${p} ${f}${g}</div>
      </div>
    `}).reverse().join("")||'<div class="history-item"><div class="h-detail">暂无记录</div></div>'}
      </div>
    </div>
  `}function ts(){return`
    <div class="bottom-bar">
      <div class="rule-summary">
        <span>身法控距</span>为第一核心 |
        <span>双向架势</span>为胜负根基 |
        <span>攻防预判</span>为博弈循环
      </div>
      <button class="btn-rules" data-action="rules">📖 完整规则</button>
    </div>
  `}function ns(){return`
    <div class="modal-overlay" id="modal-tutorial">
      <div class="modal-box modal-box-wide">
        <div class="modal-header">
          <div class="modal-tabs">
            <button class="modal-tab active" data-tab="guide">📚 新手入门</button>
            <button class="modal-tab" data-tab="rules">📖 完整规则</button>
          </div>
          <button class="modal-close" data-close="tutorial">✕</button>
        </div>
        <div class="modal-content-text tab-content active" id="tab-guide">
          ${Ln()}
        </div>

        <!-- Tab: 完整规则 -->
        <div class="modal-content-text tab-content" id="tab-rules">
          ${wn()}
        </div>
      </div>
    </div>
  `}function as(){return`
    <div class="modal-overlay" id="modal-round-detail">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title" id="round-detail-title">🔍 回合详情</div>
          <button class="modal-close" data-close="round-detail">关闭</button>
        </div>
        <div class="modal-content-text" id="round-detail-content"></div>
      </div>
    </div>
  `}function ss(e,n){var at,fe,me,ge,_e,st,Fe,Z;const t=e.history[n];if(!t)return;const a=ee[t.playerDistance],o=q[t.playerCombat],s=ee[t.aiDistance],l=q[t.aiCombat],c=((at=U[t.playerCombat])==null?void 0:at.emoji)||"",r=((fe=U[t.aiCombat])==null?void 0:fe.emoji)||"",u=e.player.weapon,f=e.ai.weapon;let d=I.INITIAL_DISTANCE??2;for(let ne=0;ne<n;ne++){const J=e.history[ne],Pe=((me=N[J.playerDistance])==null?void 0:me.delta)??0,ie=((ge=N[J.aiDistance])==null?void 0:ge.delta)??0;d=Math.max(0,Math.min(3,d+Pe+ie)),J.pMoveInterrupted&&(d=Math.max(0,Math.min(3,d-Pe))),J.aMoveInterrupted&&(d=Math.max(0,Math.min(3,d-ie)))}const p=d,m=((_e=N[t.playerDistance])==null?void 0:_e.delta)??0,g=((st=N[t.aiDistance])==null?void 0:st.delta)??0,y=Math.max(0,Math.min(3,p+m+g));let h=y;t.pMoveInterrupted&&(h=Math.max(0,Math.min(3,h-m))),t.aMoveInterrupted&&(h=Math.max(0,Math.min(3,h-g)));const w=(Fe=F[u])==null?void 0:Fe.advantage.includes(y),T=(Z=F[f])==null?void 0:Z.advantage.includes(y),E=[];if(E.push(`<h4>📋 第 ${n+1} 回合概要</h4>`),E.push('<div class="rd-cards">'),E.push(`<div class="rd-card-row"><span class="rd-p">👤 玩家：</span>${a} + ${c} ${o}（${M[u]} ${O[u]}）</div>`),E.push(`<div class="rd-card-row"><span class="rd-a">🤖 AI：</span>${s} + ${r} ${l}（${M[f]} ${O[f]}）</div>`),E.push("</div>"),E.push("<h4>① 身法结算</h4>"),E.push("<ul>"),E.push(`<li>回合前间距：<strong>${ae[p]}(${p})</strong></li>`),m!==0||g!==0)E.push(`<li>玩家${a}(${m>0?"+":""}${m}) + AI${s}(${g>0?"+":""}${g})</li>`),E.push(`<li>移动后间距：<strong>${ae[y]}(${y})</strong></li>`);else if(t.playerDistance==="dodge"||t.aiDistance==="dodge"){const ne=t.playerDistance==="dodge"?"闪避":"扎马",J=t.aiDistance==="dodge"?"闪避":"扎马";E.push(`<li>玩家${ne} + AI${J}，间距不变</li>`)}else E.push("<li>双方扎马，间距不变</li>");w&&E.push(`<li>✅ 玩家 ${O[u]} 在优势区</li>`),T&&E.push(`<li>⚠️ AI ${O[f]} 在优势区</li>`),E.push("</ul>"),E.push("<h4>② 攻防结算</h4>"),E.push("<ul>"),pa(t.playerCombat,t.aiCombat,u,f,y).forEach(ne=>E.push(`<li>${ne}</li>`)),E.push("</ul>"),(t.pMoveInterrupted||t.aMoveInterrupted)&&(E.push("<h4>③ ⚡ 身法打断</h4>"),E.push("<ul>"),t.pMoveInterrupted&&E.push(`<li>玩家在移动中（${a}）受到HP伤害 → <strong>移动被取消</strong>，间距回退</li>`),t.aMoveInterrupted&&E.push(`<li>AI在移动中（${s}）受到HP伤害 → <strong>移动被取消</strong>，间距回退</li>`),E.push(`<li>最终间距：<strong>${ae[h]}(${h})</strong></li>`),E.push("</ul>")),E.push("<h4>📍 最终间距</h4>"),E.push(`<p><strong>${ae[h]}(${h})</strong></p>`);const tt=document.getElementById("round-detail-title"),nt=document.getElementById("round-detail-content");tt&&(tt.textContent=`🔍 第 ${n+1} 回合详解`),nt&&(nt.innerHTML=E.join(`
`)),pt("modal-round-detail",!0)}function is(e,n,t,a){document.querySelectorAll(".dist-card:not(.disabled), .combat-card:not(.disabled)").forEach(s=>{s.addEventListener("click",()=>{a.onSelect(s.dataset.type,s.dataset.card)})});const o=document.getElementById("btn-confirm");o&&!o.disabled&&o.addEventListener("click",()=>a.onConfirm()),document.querySelectorAll("[data-action]").forEach(s=>{const l=s.dataset.action;if(l==="volume"){s.addEventListener("input",()=>{ya(parseInt(s.value)/100)});return}s.addEventListener(s.tagName==="SELECT"?"change":"click",()=>{switch(l){case"tutorial":pt("modal-tutorial",!0),wt("guide");break;case"rules":pt("modal-tutorial",!0),wt("rules");break;case"newgame":a.onNewGame();break;case"reset":a.onReset();break;case"pause":a.onTogglePause();break;case"undo":a.onUndo();break;case"togglemute":Ea(!Ht()),s.textContent=Ht()?"🔇":"🔊";break;case"difficulty":a.onDifficultyChange(parseInt(s.value));break}})}),document.querySelectorAll("[data-close]").forEach(s=>{s.addEventListener("click",()=>{pt("modal-"+s.dataset.close,!1)})}),document.querySelectorAll(".modal-overlay").forEach(s=>{s.addEventListener("click",l=>{l.target===s&&s.classList.remove("active")})}),document.querySelectorAll("#modal-tutorial .modal-tab").forEach(s=>{s.addEventListener("click",()=>wt(s.dataset.tab))}),document.querySelectorAll(".history-clickable").forEach(s=>{s.addEventListener("click",()=>{const l=parseInt(s.dataset.roundIdx);ss(e,l)})}),document.querySelectorAll(".speed-btn").forEach(s=>{s.addEventListener("click",()=>{a.onSpeedChange&&a.onSpeedChange(parseInt(s.dataset.speed))})})}function pt(e,n){const t=document.getElementById(e);t&&(n?t.classList.add("active"):t.classList.remove("active"))}function wt(e){document.querySelectorAll("#modal-tutorial .modal-tab").forEach(n=>{n.classList.toggle("active",n.dataset.tab===e)}),document.querySelectorAll("#modal-tutorial .tab-content").forEach(n=>{n.classList.toggle("active",n.id==="tab-"+e)})}function Hn(e,n,t,a){const o=I.MAX_HP,s=n.spectatorMode;let l,c;s?n.winner==="player"?(l="🏆 左方胜出！",c="win"):n.winner==="ai"?(l="🏆 右方胜出！",c="lose"):(l="🤝 平局",c="draw"):n.winner==="player"?(l="🏆 胜利！",c="win"):n.winner==="ai"?(l="💀 败北",c="lose"):(l="🤝 平局",c="draw");const r=s?"🤖 左方":"👤",u=s?"🤖 右方":n.aiName?"👤":"🤖",f=s?"右方":n.aiName||"AI",d=document.querySelector(".center-area");if(!d)return;const p=document.createElement("div");p.className="game-over-banner "+c,p.innerHTML=`
    <div class="gob-title">${l}</div>
    <div class="gob-stats">
      回合${n.round} ｜ 
      ${r} HP ${n.player.hp}/${o} ｜ 
      ${u} ${f} HP ${n.ai.hp}/${o}
    </div>
    <div class="gob-btns">
      <button class="gob-btn restart" id="btn-restart-same">🔄 再来一局</button>
      <button class="gob-btn back" id="btn-back-setup">🏠 返回选择</button>
    </div>
  `,d.insertBefore(p,d.firstChild),document.getElementById("btn-restart-same").addEventListener("click",()=>{t()}),document.getElementById("btn-back-setup").addEventListener("click",()=>{a()})}function os(){const e=document.getElementById("battle-log");e&&(e.scrollTop=e.scrollHeight)}const ls=50;function Rn(e,n){const t=JSON.parse(JSON.stringify(e)),a=t.player;return t.player=t.ai,t.ai=a,t.aiLevel=n,t.history=t.history.map(o=>({round:o.round,playerDistance:o.aiDistance,playerCombat:o.aiCombat,aiDistance:o.playerDistance,aiCombat:o.playerCombat})),t}function gt(e,n,t){const a=Qe(n),o=vt(n,t);let s=e.combatCard,l=e.distanceCard;return(!s||!a.includes(s))&&(s=a.length>0?a[Math.floor(Math.random()*a.length)]:i.BLOCK),(!l||!o.includes(l))&&(l=o.length>0?o[Math.floor(Math.random()*o.length)]:v.HOLD),{combatCard:s,distanceCard:l}}function cs(e,n,t,a){let o=ht(e,n,a),s=0;for(;!o.gameOver&&s<ls;){const l=Xe(o),c=Rn(o,t),r=Xe(c),u=gt(r,o.player,o.distance),f=gt(l,o.ai,o.distance);o=Bt(o,u,f),s++}return o.winner||"draw"}function rs(e,n,t,a){const o={};for(const s of e){o[s]={};for(const l of e){let c=0,r=0,u=0;for(let f=0;f<a;f++){const d=cs(s,l,n,t);d==="player"?c++:d==="ai"?r++:u++}o[s][l]={wins:c,losses:r,draws:u}}}return o}const Nn=Object.values(b);function ds(){const e=document.getElementById("sim-modal");e&&e.remove();const n=document.createElement("div");n.id="sim-modal",n.className="sim-modal-overlay",n.innerHTML=`
    <div class="sim-modal-box">
      <div class="sim-header">
        <h2>📊 对战模拟系统</h2>
        <button class="sim-close" id="sim-close">✕</button>
      </div>
      <div class="sim-config">
        <div class="sim-row">
          <label>左侧(行) AI等级</label>
          <select id="sim-player-level">
            <option value="1">1 - 纯随机</option>
            <option value="2">2 - 基础规则</option>
            <option value="3">3 - 简单策略</option>
            <option value="4">4 - 普通策略</option>
            <option value="5" selected>5 - 高级策略</option>
            <option value="6">6 - 顶级高手</option>
          </select>
        </div>
        <div class="sim-row">
          <label>右侧(列) AI等级</label>
          <select id="sim-ai-level">
            <option value="1">1 - 纯随机</option>
            <option value="2">2 - 基础规则</option>
            <option value="3">3 - 简单策略</option>
            <option value="4">4 - 普通策略</option>
            <option value="5" selected>5 - 高级策略</option>
            <option value="6">6 - 顶级高手</option>
          </select>
        </div>
        <div class="sim-row">
          <label>每组对局数</label>
          <select id="sim-num-games">
            <option value="50">50 (快速)</option>
            <option value="100" selected>100 (标准)</option>
            <option value="500">500 (精确)</option>
            <option value="1000">1000 (超精确)</option>
          </select>
        </div>
        <button class="sim-run-btn" id="sim-run">▶ 开始模拟</button>
      </div>
      <div class="sim-results" id="sim-results">
        <p class="sim-hint">点击「开始模拟」运行AI对战模拟<br>行 = 左侧武器, 列 = 右侧武器<br>格内数字 = 左侧胜率%</p>
      </div>
    </div>
  `,document.body.appendChild(n),document.getElementById("sim-close").addEventListener("click",()=>n.remove()),n.addEventListener("click",t=>{t.target===n&&n.remove()}),document.getElementById("sim-run").addEventListener("click",()=>{const t=parseInt(document.getElementById("sim-player-level").value),a=parseInt(document.getElementById("sim-ai-level").value),o=parseInt(document.getElementById("sim-num-games").value),s=document.getElementById("sim-results");s.innerHTML='<p class="sim-loading">⏳ 模拟运行中…</p>',setTimeout(()=>{const l=rs(Nn,t,a,o);us(s,l,o,t,a)},50)})}function us(e,n,t,a,o){const s=Nn,l=M||{},c=O;let r=0,u=0;for(const m of s)for(const g of s)r+=n[m][g].wins,u+=t;const f=(r/u*100).toFixed(1);let d=`<div class="sim-summary">L${a} vs L${o} · 每组${t}局 · 左侧总胜率 <strong>${f}%</strong></div>`;d+='<table class="sim-table"><thead><tr><th>左↓ \\ 右→</th>';for(const m of s)d+=`<th>${l[m]||""} ${c[m].slice(0,2)}</th>`;d+="</tr></thead><tbody>";for(const m of s){d+=`<tr><td class="sim-row-header">${l[m]||""} ${c[m]}</td>`;for(const g of s){const y=n[m][g],h=Math.round(y.wins/t*100),w=ps(h),T=`胜${y.wins} 负${y.losses} 平${y.draws}`;d+=`<td class="sim-cell ${w}" title="${T}">${h}%</td>`}d+="</tr>"}d+="</tbody></table>",d+='<div class="sim-ranking"><strong>武器综合胜率排名：</strong>';const p=s.map(m=>{let g=0,y=0;for(const h of s)g+=n[m][h].wins,y+=t;return{weapon:m,rate:Math.round(g/y*100)}}).sort((m,g)=>g.rate-m.rate);d+=p.map((m,g)=>`<span class="sim-rank-item">${g+1}. ${l[m.weapon]||""} ${c[m.weapon]} ${m.rate}%</span>`).join(" "),d+="</div>",e.innerHTML=d}function ps(e){return e>=65?"sim-hot":e>=55?"sim-warm":e>=45?"sim-neutral":e>=35?"sim-cool":"sim-cold"}const _t="lbq2_config";function fs(){const e={};for(const[n,t]of Object.entries(F))e[n]={advantage:[...t.advantage],disadvantage:[...t.disadvantage]};return{...I,WEAPON_ZONES:e}}const Ne=fs(),Te={MAX_HP:{label:"最大气血",min:5,max:30,step:1},MAX_STANCE:{label:"处决架势阈值",min:3,max:10,step:1},EXECUTION_DAMAGE:{label:"处决伤害",min:2,max:15,step:1},INITIAL_DISTANCE:{label:"初始间距",min:0,max:3,step:1},MAX_STAMINA:{label:"最大体力",min:2,max:8,step:1},STAMINA_RECOVERY:{label:"体力回复/回合",min:1,max:3,step:1}},bn=Ne;function Ge(e){return JSON.parse(JSON.stringify(e))}function Bn(){try{const e=localStorage.getItem(_t);return e?JSON.parse(e):null}catch{return null}}function ms(e){try{return localStorage.setItem(_t,JSON.stringify(e)),!0}catch{return!1}}function Ft(e){if(e){for(const n of Object.keys(Te))e[n]!==void 0&&(I[n]=e[n]);if(e.WEAPON_ZONES)for(const[n,t]of Object.entries(e.WEAPON_ZONES))F[n]&&(F[n]=Ge(t))}}function gs(){localStorage.removeItem(_t),Ft(Ge(Ne))}function yn(e){if(!e)return[];const n=[];for(const t of Object.keys(Te)){const a=Ne[t],o=e[t];o!==void 0&&o!==a&&n.push({key:t,label:Te[t].label,default:a,current:o})}if(e.WEAPON_ZONES)for(const[t,a]of Object.entries(e.WEAPON_ZONES)){const o=Ne.WEAPON_ZONES[t];if(!o)continue;const s=JSON.stringify(a.advantage)!==JSON.stringify(o.advantage),l=JSON.stringify(a.disadvantage)!==JSON.stringify(o.disadvantage);if(s||l){const c=O[t]||t;s&&n.push({key:t+"_adv",label:c+" 优势区",default:o.advantage.join(","),current:a.advantage.join(",")}),l&&n.push({key:t+"_disadv",label:c+" 劣势区",default:o.disadvantage.join(","),current:a.disadvantage.join(",")})}}return n}function Mn(){const e=Bn();if(!e)return Ge(Ne);const n=Ge(Ne);for(const t of Object.keys(Te))e[t]!==void 0&&(n[t]=e[t]);if(e.WEAPON_ZONES)for(const[t,a]of Object.entries(e.WEAPON_ZONES))n.WEAPON_ZONES[t]&&(n.WEAPON_ZONES[t]=Ge(a));return n}function hs(){const e=Bn();e&&Ft(e)}function Rt(e,n="info"){let t=document.getElementById("toast-container");t||(t=document.createElement("div"),t.id="toast-container",document.body.appendChild(t));const a=document.createElement("div");a.className=`game-toast toast-${n}`,a.textContent=e,t.appendChild(a),a.offsetWidth,a.classList.add("toast-show"),setTimeout(()=>{a.classList.add("toast-hide"),a.addEventListener("animationend",()=>a.remove())},2200)}function vs(){const e=document.getElementById("cfg-modal");e&&e.remove();const n=Mn(),t=["0-贴身","1-近战","2-中距","3-远距"],a=document.createElement("div");a.id="cfg-modal",a.className="sim-modal-overlay";let o="";for(const[r,u]of Object.entries(Te)){const f=n[r],d=bn[r],p=f!==d;o+=`
      <div class="cfg-row">
        <label>${u.label}</label>
        <input type="number" id="cfg-${r}" value="${f}" min="${u.min}" max="${u.max}" step="${u.step}" />
        <span class="cfg-default${p?" cfg-changed":""}">(默认: ${d})</span>
      </div>`}let s="";for(const[r,u]of Object.entries(n.WEAPON_ZONES)){const f=(M[r]||"")+" "+(O[r]||r),d=bn.WEAPON_ZONES[r],p=d&&JSON.stringify(u.advantage)!==JSON.stringify(d.advantage),m=d&&JSON.stringify(u.disadvantage)!==JSON.stringify(d.disadvantage);s+=`
      <div class="cfg-weapon-block">
        <div class="cfg-weapon-name">${f}</div>
        <div class="cfg-zone-row">
          <label>优势区</label>
          <div class="cfg-checkboxes" data-weapon="${r}" data-type="advantage">
            ${t.map((g,y)=>`<label class="cfg-cb"><input type="checkbox" value="${y}" ${u.advantage.includes(y)?"checked":""} /> ${g}</label>`).join("")}
          </div>
          ${p?'<span class="cfg-changed-dot">●</span>':""}
        </div>
        <div class="cfg-zone-row">
          <label>劣势区</label>
          <div class="cfg-checkboxes" data-weapon="${r}" data-type="disadvantage">
            ${t.map((g,y)=>`<label class="cfg-cb"><input type="checkbox" value="${y}" ${u.disadvantage.includes(y)?"checked":""} /> ${g}</label>`).join("")}
          </div>
          ${m?'<span class="cfg-changed-dot">●</span>':""}
        </div>
      </div>`}const l=yn(n);let c="";l.length>0&&(c='<div class="cfg-diff"><strong>与默认值差异：</strong>'+l.map(r=>`<div class="cfg-diff-item"><span class="cfg-diff-label">${r.label}</span> <span class="cfg-diff-old">${r.default}</span> → <span class="cfg-diff-new">${r.current}</span></div>`).join("")+"</div>"),a.innerHTML=`
    <div class="sim-modal-box cfg-modal-box">
      <div class="sim-header">
        <h2>⚙️ 参数配置</h2>
        <button class="sim-close" id="cfg-close">✕</button>
      </div>
      <div class="cfg-section">
        <h3>基础数值</h3>
        ${o}
      </div>
      <div class="cfg-section">
        <h3>兵器区间</h3>
        ${s}
      </div>
      <div id="cfg-diff-area">${c}</div>
      <div class="cfg-actions">
        <button class="cfg-btn cfg-save" id="cfg-save">💾 保存</button>
        <button class="cfg-btn cfg-reset" id="cfg-reset">↩ 恢复默认</button>
        <button class="cfg-btn cfg-cancel" id="cfg-cancel">取消</button>
      </div>
    </div>
  `,document.body.appendChild(a),a.addEventListener("click",r=>{r.target===a&&a.remove()}),document.getElementById("cfg-close").addEventListener("click",()=>a.remove()),document.getElementById("cfg-cancel").addEventListener("click",()=>a.remove()),document.getElementById("cfg-save").addEventListener("click",()=>{const r=An();ms(r),Ft(r),a.remove(),Rt("✅ 配置已保存！下次对局生效。","success")}),document.getElementById("cfg-reset").addEventListener("click",()=>{gs(),a.remove(),Rt("↩ 已恢复默认配置！","info")}),a.querySelectorAll("input").forEach(r=>{r.addEventListener("change",()=>{const u=An(),f=yn(u),d=document.getElementById("cfg-diff-area");f.length>0?d.innerHTML='<div class="cfg-diff"><strong>与默认值差异：</strong>'+f.map(p=>`<div class="cfg-diff-item"><span class="cfg-diff-label">${p.label}</span> <span class="cfg-diff-old">${p.default}</span> → <span class="cfg-diff-new">${p.current}</span></div>`).join("")+"</div>":d.innerHTML='<div class="cfg-diff"><em>无差异（全部为默认值）</em></div>'})})}function An(){const e=Mn();for(const n of Object.keys(Te)){const t=document.getElementById(`cfg-${n}`);t&&(e[n]=parseInt(t.value)||Te[n].min)}return document.querySelectorAll(".cfg-checkboxes").forEach(n=>{const t=n.dataset.weapon,a=n.dataset.type,o=[];n.querySelectorAll('input[type="checkbox"]:checked').forEach(s=>{o.push(parseInt(s.value))}),e.WEAPON_ZONES[t]||(e.WEAPON_ZONES[t]={advantage:[],disadvantage:[]}),e.WEAPON_ZONES[t][a]=o.sort()}),e}function bs(e,n){e.innerHTML=`
    <div class="title-screen">
      <h1>⚔️ 冷刃博弈</h1>
      <p class="subtitle">以「身法控距」为核心的回合制冷兵器对战</p>
      <div class="mode-cards">
        <div class="mode-card" id="mode-tower">
          <div class="mc-icon">🗼</div>
          <div class="mc-name">江湖行</div>
          <div class="mc-desc">十关闯荡，逐层挑战<br/>体验完整的江湖历程</div>
        </div>
        <div class="mode-card" id="mode-battle">
          <div class="mc-icon">⚔</div>
          <div class="mc-name">自由对战</div>
          <div class="mc-desc">自选兵器与难度<br/>自由切磋，钻研武学</div>
        </div>
        <div class="mode-card" id="mode-aivai">
          <div class="mc-icon">🦗</div>
          <div class="mc-name">斗蛐蛐</div>
          <div class="mc-desc">AI对决，全程观战<br/>选将押注，坐看风云</div>
        </div>
      </div>
      <div class="title-btns">
        <button id="btn-title-tutorial">📖 新手引导</button>
        <button id="btn-title-sim">📊 对战模拟</button>
        <button id="btn-title-config">⚙️ 参数配置</button>
      </div>
    </div>
  `,document.getElementById("mode-tower").addEventListener("click",()=>{qe(),n.onTower()}),document.getElementById("mode-battle").addEventListener("click",()=>{qe(),n.onBattle()}),document.getElementById("mode-aivai").addEventListener("click",()=>{qe(),n.onAiVsAi()}),document.getElementById("btn-title-tutorial").addEventListener("click",()=>Ts()),document.getElementById("btn-title-sim").addEventListener("click",()=>ds()),document.getElementById("btn-title-config").addEventListener("click",()=>vs())}function ys(e,n,t){const a=b.SHORT_BLADE,o=b.SPEAR;e.innerHTML=`
    <div class="mode-setup">
      <button class="back-link" id="btn-back">← 返回</button>
      <h2>⚔ 自由对战</h2>
      <div class="battle-setup-cols">
        <div class="setup-weapon-col">
          <div class="setup-col-title">👤 你的兵器</div>
          <select id="sel-player" class="setup-select">
            ${Object.entries(O).map(([s,l])=>`<option value="${s}">${M[s]||""} ${l}</option>`).join("")}
          </select>
          <div id="player-wz">${j(a)}</div>
        </div>
        <div class="setup-vs">VS</div>
        <div class="setup-weapon-col">
          <div class="setup-col-title">🤖 对手兵器</div>
          <select id="sel-ai" class="setup-select">
            ${Object.entries(O).map(([s,l])=>`<option value="${s}">${M[s]||""} ${l}</option>`).join("")}
          </select>
          <div id="ai-wz">${j(o)}</div>
        </div>
      </div>
      <div class="setup-row-center">
        <label>AI 难度</label>
        <select id="sel-level" class="setup-select">
          <option value="1">1 - 菜鸟</option>
          <option value="2">2 - 学徒</option>
          <option value="3">3 - 弟子</option>
          <option value="4" selected>4 - 镖师</option>
          <option value="5">5 - 武师</option>
          <option value="6">6 - 高手</option>
          <option value="7">7 - 宗师</option>
          <option value="8">8 - 绝世</option>
        </select>
      </div>
      <button class="primary-btn" id="btn-start">开始对局</button>
    </div>
  `,document.getElementById("sel-ai").value=o,document.getElementById("sel-player").addEventListener("change",s=>{document.getElementById("player-wz").innerHTML=j(s.target.value)}),document.getElementById("sel-ai").addEventListener("change",s=>{document.getElementById("ai-wz").innerHTML=j(s.target.value)}),document.getElementById("btn-start").addEventListener("click",()=>{n(document.getElementById("sel-player").value,document.getElementById("sel-ai").value,parseInt(document.getElementById("sel-level").value))}),document.getElementById("btn-back").addEventListener("click",t)}function As(e,n,t){let a=b.SHORT_BLADE;function o(){e.innerHTML=`
      <div class="mode-setup">
        <button class="back-link" id="btn-back">← 返回</button>
        <h2>🗼 江湖行 — 选择你的兵器</h2>
        <p class="setup-hint">兵器将伴随你走完全部十关</p>
        <div class="weapon-pick-grid">
          ${Object.values(b).map(s=>ba(s,s===a)).join("")}
        </div>
        <div id="weapon-preview">${j(a)}</div>
        <button class="primary-btn" id="btn-start">⚔ 启程</button>
      </div>
    `,document.querySelectorAll(".weapon-pick-btn").forEach(s=>{s.addEventListener("click",()=>{a=s.dataset.weapon,o()})}),document.getElementById("btn-start").addEventListener("click",()=>n(a)),document.getElementById("btn-back").addEventListener("click",t)}o()}const En=[{value:1,label:"1 - 菜鸟"},{value:2,label:"2 - 学徒"},{value:3,label:"3 - 弟子"},{value:4,label:"4 - 镖师"},{value:5,label:"5 - 武师"},{value:6,label:"6 - 高手"},{value:7,label:"7 - 宗师"},{value:8,label:"8 - 绝世"}];function Es(e,n,t){const a=b.SHORT_BLADE,o=b.SPEAR;e.innerHTML=`
    <div class="mode-setup">
      <button class="back-link" id="btn-back">← 返回</button>
      <h2>🦗 斗蛐蛐 — 选将观战</h2>
      <p class="setup-hint">选择双方兵器与AI等级，坐看AI对决</p>
      <div class="battle-setup-cols">
        <div class="setup-weapon-col">
          <div class="setup-col-title">🤖 左方 AI</div>
          <select id="sel-left-weapon" class="setup-select">
            ${Object.entries(O).map(([s,l])=>`<option value="${s}">${M[s]||""} ${l}</option>`).join("")}
          </select>
          <div id="left-wz">${j(a)}</div>
          <label class="setup-label">AI 等级</label>
          <select id="sel-left-level" class="setup-select">
            ${En.map(s=>`<option value="${s.value}" ${s.value===4?"selected":""}>${s.label}</option>`).join("")}
          </select>
        </div>
        <div class="setup-vs">VS</div>
        <div class="setup-weapon-col">
          <div class="setup-col-title">🤖 右方 AI</div>
          <select id="sel-right-weapon" class="setup-select">
            ${Object.entries(O).map(([s,l])=>`<option value="${s}">${M[s]||""} ${l}</option>`).join("")}
          </select>
          <div id="right-wz">${j(o)}</div>
          <label class="setup-label">AI 等级</label>
          <select id="sel-right-level" class="setup-select">
            ${En.map(s=>`<option value="${s.value}" ${s.value===4?"selected":""}>${s.label}</option>`).join("")}
          </select>
        </div>
      </div>
      <button class="primary-btn" id="btn-start">🦗 开始观战</button>
    </div>
  `,document.getElementById("sel-right-weapon").value=o,document.getElementById("sel-left-weapon").addEventListener("change",s=>{document.getElementById("left-wz").innerHTML=j(s.target.value)}),document.getElementById("sel-right-weapon").addEventListener("change",s=>{document.getElementById("right-wz").innerHTML=j(s.target.value)}),document.getElementById("btn-start").addEventListener("click",()=>{n(document.getElementById("sel-left-weapon").value,document.getElementById("sel-right-weapon").value,parseInt(document.getElementById("sel-left-level").value),parseInt(document.getElementById("sel-right-level").value))}),document.getElementById("btn-back").addEventListener("click",t)}function Ts(e="guide"){const n=document.getElementById("standalone-tutorial");n&&n.remove();const t=document.createElement("div");t.id="standalone-tutorial",t.className="modal-overlay active",t.innerHTML=`
    <div class="modal-box modal-box-wide">
      <div class="modal-header">
        <div class="modal-tabs">
          <button class="modal-tab ${e==="guide"?"active":""}" data-tab="guide">📚 新手入门</button>
          <button class="modal-tab ${e==="rules"?"active":""}" data-tab="rules">📖 完整规则</button>
        </div>
        <button class="modal-close" id="tut-close">✕</button>
      </div>

      <!-- Tab: 新手入门 -->
      <div class="modal-content-text tab-content ${e==="guide"?"active":""}" id="setup-tab-guide">
        ${Ln()}
      </div>

      <!-- Tab: 完整规则 -->
      <div class="modal-content-text tab-content ${e==="rules"?"active":""}" id="setup-tab-rules">
        ${wn()}
      </div>
    </div>
  `,document.body.appendChild(t),t.addEventListener("click",a=>{a.target===t&&t.remove()}),document.getElementById("tut-close").addEventListener("click",()=>t.remove()),t.querySelectorAll(".modal-tab").forEach(a=>{a.addEventListener("click",()=>{t.querySelectorAll(".modal-tab").forEach(o=>o.classList.toggle("active",o===a)),t.querySelectorAll(".tab-content").forEach(o=>o.classList.toggle("active",o.id==="setup-tab-"+a.dataset.tab))})})}const Cs={[`${i.DEFLECT}_${i.SLASH}`]:{pAnim:"anim-deflect",aAnim:"anim-recoil",spark:"🤺",desc:"卸力反制!"},[`${i.SLASH}_${i.DEFLECT}`]:{pAnim:"anim-recoil",aAnim:"anim-deflect",spark:"🤺",desc:"被卸力反制!"},[`${i.DEFLECT}_${i.THRUST}`]:{pAnim:"anim-deflect-fail",aAnim:"anim-thrust-p",spark:"🎯",desc:"卸力失败"},[`${i.THRUST}_${i.DEFLECT}`]:{pAnim:"anim-thrust-p",aAnim:"anim-deflect-fail",spark:"🎯",desc:"穿透卸力"},[`${i.DEFLECT}_${i.FEINT}`]:{pAnim:"anim-deflect-fail",aAnim:"anim-feint-a",spark:"🌀",desc:"擒拿骗卸力"},[`${i.FEINT}_${i.DEFLECT}`]:{pAnim:"anim-feint-p",aAnim:"anim-deflect-fail",spark:"🌀",desc:"擒拿骗卸力"},[`${i.SLASH}_${i.SLASH}`]:{pAnim:"anim-clash-p",aAnim:"anim-clash-a",spark:"⚡",desc:"互砍!"},[`${i.SLASH}_${i.THRUST}`]:{pAnim:"anim-slash-p",aAnim:"anim-hit",spark:"⚡",desc:"重击命中"},[`${i.THRUST}_${i.SLASH}`]:{pAnim:"anim-hit",aAnim:"anim-slash-a",spark:"⚡",desc:"被劈中"},[`${i.SLASH}_${i.BLOCK}`]:{pAnim:"anim-slash-p",aAnim:"anim-block-hit",spark:"🛡️",desc:"重击破格挡"},[`${i.BLOCK}_${i.SLASH}`]:{pAnim:"anim-block-hit",aAnim:"anim-slash-a",spark:"🛡️",desc:"格挡被破"},[`${i.SLASH}_${i.FEINT}`]:{pAnim:"anim-slash-p",aAnim:"anim-hit",spark:"⚡",desc:"重击命中"},[`${i.FEINT}_${i.SLASH}`]:{pAnim:"anim-hit",aAnim:"anim-slash-a",spark:"⚡",desc:"被劈中"},[`${i.THRUST}_${i.THRUST}`]:{pAnim:"anim-thrust-p",aAnim:"anim-thrust-a",spark:"🎯",desc:"互刺!"},[`${i.THRUST}_${i.BLOCK}`]:{pAnim:"anim-thrust-miss",aAnim:"anim-block",spark:"🛡️",desc:"被格挡"},[`${i.BLOCK}_${i.THRUST}`]:{pAnim:"anim-block",aAnim:"anim-thrust-miss",spark:"🛡️",desc:"格挡成功"},[`${i.THRUST}_${i.FEINT}`]:{pAnim:"anim-thrust-p",aAnim:"anim-hit",spark:"🎯",desc:"轻击命中"},[`${i.FEINT}_${i.THRUST}`]:{pAnim:"anim-hit",aAnim:"anim-thrust-a",spark:"🎯",desc:"被轻击"},[`${i.BLOCK}_${i.FEINT}`]:{pAnim:"anim-block-tricked",aAnim:"anim-feint-a",spark:"🌀",desc:"擒拿骗格挡"},[`${i.FEINT}_${i.BLOCK}`]:{pAnim:"anim-feint-p",aAnim:"anim-block-tricked",spark:"🌀",desc:"擒拿骗格挡"},[`${i.BLOCK}_${i.BLOCK}`]:{pAnim:"anim-block",aAnim:"anim-block",spark:null,desc:"双挡空过"},[`${i.FEINT}_${i.FEINT}`]:{pAnim:"anim-idle",aAnim:"anim-idle",spark:null,desc:"双晃空过"},[`${i.DEFLECT}_${i.DEFLECT}`]:{pAnim:"anim-clash-p",aAnim:"anim-clash-a",spark:"⚡",desc:"卸力对碰"},[`${i.DEFLECT}_${i.BLOCK}`]:{pAnim:"anim-deflect-fail",aAnim:"anim-block",spark:"🛡️",desc:"卸力被挡"},[`${i.BLOCK}_${i.DEFLECT}`]:{pAnim:"anim-block",aAnim:"anim-deflect-fail",spark:"🛡️",desc:"格挡卸力"}};function Ss(e,n){const t=`${e}_${n}`;return Cs[t]||{pAnim:"anim-idle",aAnim:"anim-idle",spark:null,desc:""}}function $(e){return new Promise(n=>setTimeout(n,e))}function $e(e,n,t,a){const o=document.createElement("div"),s=a==="stance"?" stance-dmg":a==="heal"?" heal":"";o.className="float-dmg"+s,o.textContent=t,o.style.left=n.style.left,o.style.top="30%",e.appendChild(o),setTimeout(()=>o.remove(),1300)}function Le(e,n,t,a){const o=document.querySelector(e);if(!o)return;const s=o.querySelector(`.stat-row[data-stat="${n}"]`);if(!s)return;const l=s.querySelector(".stat-bar"),c=s.querySelector(".stat-value");l&&(l.style.transition="none",l.style.width=Math.max(0,t/a*100)+"%",l.offsetWidth),c&&(c.textContent=`${Math.max(0,t)}/${a}`)}function G(e,n,t,a,o=500){const s=document.querySelector(e);if(!s)return;const l=s.querySelector(`.stat-row[data-stat="${n}"]`);if(!l)return;const c=l.querySelector(".stat-bar"),r=l.querySelector(".stat-value");c&&(c.style.transition=`width ${o}ms ease`,c.style.width=Math.max(0,t/a*100)+"%"),r&&(r.textContent=`${Math.max(0,Math.round(t))}/${a}`)}function z(e,n,t,a="cost"){const o=document.querySelector(e);if(!o)return;const s=o.querySelector(`.stat-row[data-stat="${n}"]`);if(!s)return;s.style.position="relative";const l=document.createElement("div");l.className=`stat-pop stat-pop-${a}`,l.textContent=t,s.appendChild(l),l.offsetWidth,l.classList.add("stat-pop-show"),setTimeout(()=>{l.classList.add("stat-pop-hide"),l.addEventListener("animationend",()=>l.remove())},1500)}function le(e,n,t){const a=document.querySelector(e);if(!a)return;const o=a.querySelector(`.stat-row[data-stat="${n}"]`);if(!o)return;const s=o.querySelector(".stat-bar");s&&(s.classList.add(t),setTimeout(()=>s.classList.remove(t),800))}function Tn(e,n,t){const a=document.createElement("div");a.className="clash-spark",a.innerHTML=`<span class="spark-emoji">${n}</span><span class="spark-desc">${t}</span>`,e.appendChild(a),setTimeout(()=>a.remove(),1200)}function ut(e,n,t,a,o){const s=document.createElement("div");return s.className=`action-tag action-tag-${o}`,s.innerHTML=`<span class="at-emoji">${t}</span><span class="at-text">${a}</span>`,s.style.left=n.style.left,e.appendChild(s),s}function Cn(e,n){const t=document.createElement("div");t.className="float-dmg interrupt-dmg",t.textContent="⚡ 身法被打断",t.style.left=n.style.left,t.style.top="12%",e.appendChild(t),setTimeout(()=>t.remove(),1400)}function $s(e,n){const t=e.querySelector(".round-banner");t&&t.remove();const a=document.createElement("div");a.className="round-banner",a.textContent=n,e.appendChild(a),setTimeout(()=>{a.classList.add("rb-fade"),setTimeout(()=>a.remove(),500)},1e3)}function Dt(e,n){e.style.setProperty("--arena-cam",n),e.classList.remove("dist-0","dist-1","dist-2","dist-3"),e.classList.add("dist-"+n)}async function kn(e,n){var zt,Xt,Zt,Jt;const t=document.getElementById("arena-stage"),a=document.getElementById("player-fighter"),o=document.getElementById("ai-fighter");if(!t||!a||!o)return;const s=n.history[n.history.length-1],l=s.playerCombat,c=s.aiCombat,r=s.playerDistance,u=s.aiDistance,f=I.MAX_HP,d=I.MAX_STANCE,p=I.MAX_STAMINA,m=ce[e.distance]||ce[2],g=ce[n.distance]||ce[2];a.style.transition="none",o.style.transition="none",a.style.left=m.player+"%",o.style.left=m.ai+"%";const y=a.querySelector(".fighter-body"),h=o.querySelector(".fighter-body"),w=e.spectatorMode?"🤖":"🧑";y&&(y.textContent=e.player.staggered?"😵":w),h&&(h.textContent=e.ai.staggered?"😵":e.aiName?"👤":"🤖");const T=t.querySelector(".arena-dist-line"),E=t.querySelector(".arena-dist-label");T&&(T.style.transition="none",T.style.left=m.player+"%",T.style.width=m.ai-m.player+"%"),E&&(E.textContent=ae[e.distance]),Dt(t,e.distance),a.offsetWidth,Le(".player-side","hp",e.player.hp,f),Le(".player-side","stamina",e.player.stamina,p),Le(".player-side","stance",e.player.stance,d),Le(".ai-side","hp",e.ai.hp,f),Le(".ai-side","stamina",e.ai.stamina,p),Le(".ai-side","stance",e.ai.stance,d);const jt=Ze[r],tt=Ze[u],nt=U[l],at=U[c];Ra(),$s(t,`⚔️  第 ${n.round} 回合`),await $(1200);const fe=((zt=N[r])==null?void 0:zt.delta)??0,me=((Xt=N[u])==null?void 0:Xt.delta)??0,ge=Math.max(0,Math.min(3,e.distance+fe+me)),_e=ce[ge]||ce[2],st=s.pMoveInterrupted||s.aMoveInterrupted,Fe=ut(t,a,jt.emoji,ee[r],"player"),Z=_e.player,ne=parseFloat(a.style.left),J=parseFloat(o.style.left);fe!==0?(fe<0?pn():fn(),a.classList.add(fe<0?"anim-dash-in":"anim-dash-out"),Math.abs(Z-ne)>.5&&(a.style.transition="left 0.5s ease",a.style.left=Z+"%",T&&(T.style.transition="left 0.5s ease, width 0.5s ease",T.style.left=Z+"%",T.style.width=J-Z+"%")),await $(600),a.classList.remove("anim-dash-in","anim-dash-out")):r===v.DODGE?(rn(),a.classList.add("anim-dodge"),await $(550),a.classList.remove("anim-dodge")):(mn(),a.classList.add("anim-brace"),Math.abs(Z-ne)>.5&&(a.style.transition="left 0.5s ease",a.style.left=Z+"%",T&&(T.style.transition="left 0.5s ease, width 0.5s ease",T.style.left=Z+"%",T.style.width=J-Z+"%")),await $(550),a.classList.remove("anim-brace"));const Pe=ut(t,o,tt.emoji,ee[u],"ai"),ie=_e.ai,xt=parseFloat(a.style.left);me!==0?(me<0?pn():fn(),o.classList.add(me<0?"anim-dash-in":"anim-dash-out"),Math.abs(ie-J)>.5&&(o.style.transition="left 0.5s ease",o.style.left=ie+"%",T&&(T.style.transition="width 0.5s ease",T.style.width=ie-xt+"%")),await $(600),o.classList.remove("anim-dash-in","anim-dash-out")):u===v.DODGE?(rn(),o.classList.add("anim-dodge"),await $(550),o.classList.remove("anim-dodge")):(mn(),o.classList.add("anim-brace"),Math.abs(ie-J)>.5&&(o.style.transition="left 0.5s ease",o.style.left=ie+"%",T&&(T.style.transition="width 0.5s ease",T.style.width=ie-xt+"%")),await $(550),o.classList.remove("anim-brace")),E&&(E.textContent=ae[ge]),Dt(t,ge),a.style.transition="",o.style.transition="",T&&(T.style.transition="");const Et=Math.max(0,e.player.stamina-(((Zt=N[r])==null?void 0:Zt.cost)??0)),Tt=Math.max(0,e.ai.stamina-(((Jt=N[u])==null?void 0:Jt.cost)??0)),Ct=e.player.stamina-Et,St=e.ai.stamina-Tt;Ct>0&&(G(".player-side","stamina",Et,p,400),z(".player-side","stamina",`-${Ct} 体力`,"cost"),le(".player-side","stamina","bar-flash-cost")),St>0&&(G(".ai-side","stamina",Tt,p,400),z(".ai-side","stamina",`-${St} 体力`,"cost"),le(".ai-side","stamina","bar-flash-cost")),(Ct>0||St>0)&&await $(400),Fe.classList.add("at-fade"),Pe.classList.add("at-fade"),setTimeout(()=>{Fe.remove(),Pe.remove()},350),await $(350);const Kt=ut(t,a,nt.emoji,q[l],"player");await $(350);const Vt=ut(t,o,at.emoji,q[c],"ai");await $(400);const he=Ss(l,c);he.pAnim&&a.classList.add(he.pAnim),he.aAnim&&o.classList.add(he.aAnim),he.spark&&Tn(t,he.spark,he.desc),l===c&&(l==="slash"||l==="thrust"||l==="deflect")?Ia():ka(l),await $(900);const Kn=n.spectatorMode?"🤖":"🧑";y&&(y.textContent=n.player.staggered?"😵":Kn),h&&(h.textContent=n.ai.staggered?"😵":n.aiName?"👤":"🤖"),Kt.classList.add("at-fade"),Vt.classList.add("at-fade"),setTimeout(()=>{Kt.remove(),Vt.remove()},350),await $(300),ge!==n.distance&&(st?(Oa(),s.pMoveInterrupted&&(a.classList.add("anim-shake"),Cn(t,a)),s.aMoveInterrupted&&(o.classList.add("anim-shake"),Cn(t,o)),await $(400)):(Ha(),Tn(t,"💥","击退!"),await $(300)),a.style.transition="left 0.4s ease-out",o.style.transition="left 0.4s ease-out",T&&(T.style.transition="left 0.4s ease-out, width 0.4s ease-out"),a.style.left=g.player+"%",o.style.left=g.ai+"%",T&&(T.style.left=g.player+"%",T.style.width=g.ai-g.player+"%"),E&&(E.textContent=ae[n.distance]),Dt(t,n.distance),await $(500),a.classList.remove("anim-shake"),o.classList.remove("anim-shake"),a.style.transition="",o.style.transition="",T&&(T.style.transition=""));const Ue=e.player.hp-n.player.hp,je=e.ai.hp-n.ai.hp,ve=n.player.stance-e.player.stance,be=n.ai.stance-e.ai.stance,qt=I.EXECUTION_DAMAGE,it=e.player.stance<d&&n.player.stance===0&&Ue>=qt,ot=e.ai.stance<d&&n.ai.stance===0&&je>=qt;Ue>0&&(dn(),a.classList.add("anim-hit"),$e(t,a,`-${Ue}`,"damage"),G(".player-side","hp",n.player.hp,f,500),z(".player-side","hp",`-${Ue} 气血`,"cost"),le(".player-side","hp","bar-flash-cost"),await $(600)),je>0&&(dn(),o.classList.add("anim-hit"),$e(t,o,`-${je}`,"damage"),G(".ai-side","hp",n.ai.hp,f,500),z(".ai-side","hp",`-${je} 气血`,"cost"),le(".ai-side","hp","bar-flash-cost"),await $(600)),Ue===0&&je===0&&await $(300),it?(un(),G(".player-side","stance",0,d,400),z(".player-side","stance","⚔ 处决!","exec")):ve>0?(hn(),$e(t,a,`+${ve} 架势`,"stance"),G(".player-side","stance",n.player.stance,d,400),z(".player-side","stance",`+${ve} 架势`,"warn"),le(".player-side","stance","bar-flash-warn")):ve<0&&(vn(),$e(t,a,`${ve} 架势`,"heal"),G(".player-side","stance",n.player.stance,d,400),z(".player-side","stance",`${ve} 架势`,"buff")),(it||ve!==0)&&await $(450),ot?(un(),G(".ai-side","stance",0,d,400),z(".ai-side","stance","⚔ 处决!","exec")):be>0?(hn(),$e(t,o,`+${be} 架势`,"stance"),G(".ai-side","stance",n.ai.stance,d,400),z(".ai-side","stance",`+${be} 架势`,"warn"),le(".ai-side","stance","bar-flash-warn")):be<0&&(vn(),$e(t,o,`${be} 架势`,"heal"),G(".ai-side","stance",n.ai.stance,d,400),z(".ai-side","stance",`${be} 架势`,"buff")),(ot||be!==0)&&await $(450),(it||ot)&&(t.classList.add("execution-flash"),await $(500)),await $(it||ot?500:600);const lt=n.player.stamina-Et,$t=n.ai.stamina-Tt;lt>0&&(gn(),G(".player-side","stamina",n.player.stamina,p,400),z(".player-side","stamina",`+${lt} 体力`,"buff"),le(".player-side","stamina","bar-flash-buff")),$t>0&&(lt<=0&&gn(),G(".ai-side","stamina",n.ai.stamina,p,400),z(".ai-side","stamina",`+${$t} 体力`,"buff"),le(".ai-side","stamina","bar-flash-buff")),(lt>0||$t>0)&&await $(500);const Gt=["anim-attack-p","anim-attack-a","anim-dodge","anim-hit","anim-shake","anim-slash-p","anim-slash-a","anim-slash-miss","anim-thrust-p","anim-thrust-a","anim-thrust-miss","anim-deflect","anim-deflect-fail","anim-recoil","anim-block","anim-block-hit","anim-block-tricked","anim-feint-p","anim-feint-a","anim-clash-p","anim-clash-a","anim-idle","anim-dash-in","anim-dash-out","anim-brace"];a.classList.remove(...Gt),o.classList.remove(...Gt),t.classList.remove("execution-flash")}const Ce=[{floor:1,npc:"李大壮",title:"村口恶霸",weapon:b.STAFF,aiLevel:2,intro:"路经偏僻村落，一名壮汉持棍拦路。",taunt:"此路是我开！留下买路钱！"},{floor:2,npc:"赵三",title:"山贼喽啰",weapon:b.SHORT_BLADE,aiLevel:3,intro:"山间小道，草丛中窜出一名手持短刀的毛贼。",taunt:"识相的把包袱留下！"},{floor:3,npc:"钱小六",title:"镖局镖师",weapon:b.SPEAR,aiLevel:4,intro:"误入镖队行进路线，一名镖师持枪喝止。",taunt:"何方人物？报上名来！"},{floor:4,npc:"孙铁柱",title:"武馆弟子",weapon:b.SWORD,aiLevel:4,intro:"途经武馆，一名弟子欣然邀战。",taunt:"久闻大名，请赐教！"},{floor:5,npc:"周大锤",title:"铁匠侠客",weapon:b.GREAT_BLADE,aiLevel:5,intro:"铁匠铺旁，一名大汉扛着长柄大刀拦住去路。",taunt:"我这把大刀早已饥渴难耐！"},{floor:6,npc:"吴影",title:"暗巷刺客",weapon:b.DUAL_STAB,aiLevel:6,intro:"夜入小巷，身后传来阴冷的脚步声……",taunt:"…………"},{floor:7,npc:"郑云飞",title:"青衫剑客",weapon:b.SWORD,aiLevel:6,intro:"客栈饮酒，邻桌青衫剑客放下酒杯，缓缓起身。",taunt:"以剑会友，不醉不归。"},{floor:8,npc:"王长风",title:"枪法名家",weapon:b.SPEAR,aiLevel:7,intro:"擂台之上，白发老者持枪而立，气势如渊。",taunt:"老夫征战三十年，尚未一败。"},{floor:9,npc:"陈残雪",title:"独臂刀客",weapon:b.GREAT_BLADE,aiLevel:7,intro:"古道尽头，独臂刀客横刀冷立，杀意凛然。",taunt:"这条路的尽头，只能有一个人。"},{floor:10,npc:"萧无名",title:"绝世高手",weapon:null,aiLevel:8,intro:"山巅之上，一个看不清面容的身影背对着你。",taunt:"你终于来了。"}];function Ls(e){return{playerWeapon:e,currentFloor:0,playerHp:I.MAX_HP,completed:!1,gameOver:!1}}function ws(e){const n=Ce[e.currentFloor];if(!n)return null;if(!n.weapon){const t=Object.values(b);return{...n,weapon:t[Math.floor(Math.random()*t.length)]}}return n}function Ds(e,n){const t={...e};return t.playerHp=I.MAX_HP,t.currentFloor+=1,t.currentFloor>=Ce.length&&(t.completed=!0),t}function Is(e){return e.completed}function Os(e,n,t,a,o){const s=I.MAX_HP,l=n.currentFloor+1,c=M[t.weapon]||"❓",r=O[t.weapon]||"???",u=M[n.playerWeapon]||"🗡️",f=O[n.playerWeapon]||"???";e.innerHTML=`
    <div class="tower-screen">
      <div class="tower-floor-header">🗼 江湖行 · 第 ${l} / ${Ce.length} 关</div>
      <div class="tower-progress">
        ${Ce.map((d,p)=>`<span class="tp-dot ${p<n.currentFloor?"tp-done":p===n.currentFloor?"tp-cur":""}">${p+1}</span>`).join("")}
      </div>
      <div class="tower-npc-display">
        <div class="tower-npc-weapon">${c}</div>
        <div class="tower-npc-name">${t.npc}</div>
        <div class="tower-npc-title">「${t.title}」</div>
        <div class="tower-npc-wp">持 ${c} ${r}</div>
      </div>
      <div class="tower-quote">❝ ${t.taunt} ❞</div>
      <div class="tower-story">${t.intro}</div>
      <div class="tower-player-info">
        <div class="tower-hp">❤️ 你的气血: <strong>${n.playerHp}</strong> / ${s}</div>
        <div class="tower-your-weapon">${u} ${f}</div>
      </div>
      <div class="tower-matchup">
        ${j(n.playerWeapon)}
        <div class="tower-matchup-vs">VS</div>
        ${j(t.weapon)}
      </div>
      <button class="primary-btn" id="btn-fight">⚔ 应战</button>
      <button class="link-btn" id="btn-back">放弃 · 返回</button>
    </div>
  `,document.getElementById("btn-fight").addEventListener("click",()=>{qe(),a()}),document.getElementById("btn-back").addEventListener("click",()=>{qe(),o()})}function Hs(e,n,t,a){const o=I.MAX_HP,s=n.currentFloor,l=Ce[s-1],c=Ce[s];let r="";if(c){const u=M[c.weapon]||"❓",f=O[c.weapon]||"???";r=`
      <div class="tower-next-preview">
        <div class="tower-next-label">下一关: 第 ${s+1} 关</div>
        <div class="tower-next-npc">${c.npc} 「${c.title}」</div>
        <div class="tower-next-wp">${u} ${f}</div>
      </div>
    `}e.innerHTML=`
    <div class="tower-screen">
      <div class="tower-floor-header">✅ 第 ${s} 关 — 胜利!</div>
      <div class="tower-between-msg">${l.npc} 已被击败</div>
      <div class="tower-between-hp">
        ❤️ 恢复气血 <span class="heal">已回满</span>
        <br/>
        ❤️ 当前气血: ${t} → <strong>${n.playerHp}</strong> / ${o}
      </div>
      ${r}
      <button class="primary-btn" id="btn-continue">继续前进 →</button>
    </div>
  `,document.getElementById("btn-continue").addEventListener("click",a)}function _n(e,n,t){const a=O[n.playerWeapon],o=M[n.playerWeapon];e.innerHTML=`
    <div class="tower-screen tower-victory">
      <h1>🏆 武林至尊</h1>
      <p class="tower-result-sub">击败全部 ${Ce.length} 位强敌!</p>
      <div class="tower-result-stats">
        ❤️ 最终气血: ${n.playerHp} / ${I.MAX_HP}<br/>
        ${o} 使用兵器: ${a}
      </div>
      <p class="tower-victory-msg">
        自此，江湖中流传着一个新的传说——<br/>
        一位持${a}的无名侠客，从乡野一路打到山巅，<br/>
        击败了天下第一高手萧无名。
      </p>
      <button class="primary-btn" id="btn-back">🏠 返回</button>
    </div>
  `,document.getElementById("btn-back").addEventListener("click",t)}function Rs(e,n,t,a,o){e.innerHTML=`
    <div class="tower-screen tower-gameover">
      <h1>💀 败北</h1>
      <p class="tower-result-sub">止步于第 ${n.currentFloor+1} 关</p>
      <div class="tower-result-npc">
        败于 ${t.npc}「${t.title}」之手
      </div>
      <button class="primary-btn" id="btn-retry">🔄 重新挑战</button>
      <button class="link-btn" id="btn-back">🏠 返回</button>
    </div>
  `,document.getElementById("btn-retry").addEventListener("click",a),document.getElementById("btn-back").addEventListener("click",o)}hs();const x=document.getElementById("app");let A=null,Be=null,_={distanceCard:null,combatCard:null},Ye=[],W=!1,k=null,se=!1,ke=!1,Pt=null,Q=null,et=800,H=null,De=null;function Ns(){return{isPaused:W,canUndo:Ye.length>0,spectator:ke,autoPlaySpeed:et}}function Bs(){return{onSelect:ks,onConfirm:_s,onUndo:Fs,onReset:Ps,onNewGame:Us,onTogglePause:js,onDifficultyChange:xs,onSpeedChange:Vs}}function X(){yt(),ke=!1,Pt=null,H=null,De=null,bs(x,{onTower:()=>As(x,Fn,X),onBattle:()=>ys(x,Ut,X),onAiVsAi:()=>Es(x,xn,X)})}function yt(){A=null,Be=null,_={distanceCard:null,combatCard:null},Ye=[],W=!1,se=!1,Q&&(clearTimeout(Q),Q=null)}function Ut(e,n,t){H=null,k={playerWeapon:e,aiWeapon:n,aiLevel:t},yt(),A=ht(e,n,t),On(),oe()}function Fn(e){H=Ls(e),k=null,Pn()}function Pn(){if(De=ws(H),!De){_n(x,H,X);return}Os(x,H,De,Un,X)}function Un(){const e=De;yt(),A=ht(H.playerWeapon,e.weapon,e.aiLevel),A.aiName=e.npc,A.aiTitle=e.title,A.player.hp=H.playerHp,k=null,On(),oe()}function Ms(){if(H)if(A.winner==="player"){const e=H.playerHp;H=Ds(H,A.player.hp),Is(H)?(Mt(),_n(x,H,X)):(Na(),Hs(x,H,e,Pn))}else Ba(),H.gameOver=!0,Rs(x,H,De,()=>Fn(H.playerWeapon),X)}function oe(){_a(x,A,_,Ns(),Bs()),os()}function ks(e,n){se||W||A.gameOver||(e==="distance"?_.distanceCard===n?(cn(),_.distanceCard=null):(ln(),_.distanceCard=n):_.combatCard===n?(cn(),_.combatCard=null):(ln(),_.combatCard=n),oe())}async function _s(){if(se||W||A.gameOver||!_.distanceCard||!_.combatCard)return;const e=ta(_.distanceCard,_.combatCard,A.player,A.distance);if(!e.valid){Ca(),Rt(e.reason,"warn");return}Ta(),Ye.push(JSON.parse(JSON.stringify(A))),Be=JSON.parse(JSON.stringify(A));const n=Xe(A),t={distanceCard:_.distanceCard,combatCard:_.combatCard};A=Bt(A,t,n),_={distanceCard:null,combatCard:null},se=!0;const a=x.querySelector(".game-wrapper");a&&a.classList.add("animating"),oe(),await kn(Be,A),se=!1,a&&a.classList.remove("animating"),A.gameOver&&(H?Ms():(A.winner==="player"?Mt():In(),Hn(x,A,jn,X)))}function Fs(){Ye.length!==0&&(A=Ye.pop(),Be=null,_={distanceCard:null,combatCard:null},W=!1,oe())}function Ps(){H?Un():k&&Ut(k.playerWeapon,k.aiWeapon,k.aiLevel)}function Us(){X()}function jn(){k?ke&&k.playerAiLevel!=null?xn(k.playerWeapon,k.aiWeapon,k.playerAiLevel,k.aiLevel):Ut(k.playerWeapon,k.aiWeapon,k.aiLevel):X()}function js(){A.gameOver||(W=!W,oe(),ke&&(W?Q&&(clearTimeout(Q),Q=null):At()))}function xs(e){A&&(A.aiLevel=e)}function xn(e,n,t,a){H=null,yt(),ke=!0,Pt=t,et=800,A=ht(e,n,a),A.spectatorMode=!0,k={playerWeapon:e,aiWeapon:n,aiLevel:a,playerAiLevel:t},oe(),At()}function At(){Q&&(clearTimeout(Q),Q=null),!(!A||A.gameOver||W||se)&&(Q=setTimeout(Ks,Math.max(et,50)))}async function Ks(){if(Q=null,!A||A.gameOver||W||se)return;const e=Xe(A),n=Rn(A,Pt),t=Xe(n),a=gt(t,A.player,A.distance),o=gt(e,A.ai,A.distance);Be=JSON.parse(JSON.stringify(A)),A=Bt(A,a,o),se=!0;const s=x.querySelector(".game-wrapper");s&&s.classList.add("animating"),oe(),et>0&&await kn(Be,A),se=!1,s&&s.classList.remove("animating"),A.gameOver?(A.winner==="player"?Mt():In(),Hn(x,A,jn,X)):At()}function Vs(e){et=e,oe(),ke&&!W&&!se&&!A.gameOver&&At()}X();
