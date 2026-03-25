(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function t(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(o){if(o.ep)return;o.ep=!0;const i=t(o);fetch(o.href,i)}})();const b=Object.freeze({SHORT_BLADE:"short_blade",SPEAR:"spear",SWORD:"sword",STAFF:"staff",GREAT_BLADE:"great_blade",DUAL_STAB:"dual_stab"}),v=Object.freeze({HOLD:"hold",ADVANCE:"advance",RETREAT:"retreat",DODGE:"dodge"}),s=Object.freeze({DEFLECT:"deflect",SLASH:"slash",THRUST:"thrust",BLOCK:"block",FEINT:"feint"}),Z=Object.freeze({ATTACK:"attack",DEFENSE:"defense"}),Fe=Object.freeze({SETUP:"setup",INFO_SYNC:"info_sync",PLAYER_PICK:"player_pick",AI_PICK:"ai_pick",DISTANCE_RESOLVE:"distance_resolve",COMBAT_RESOLVE:"combat_resolve",STATUS_RESOLVE:"status_resolve",ROUND_END:"round_end",GAME_OVER:"game_over"});function Qt(e){return{weapon:e,hp:10,stance:0,stamina:4,staggered:!1}}function Vn(e,n,t){return{distance:2,round:0,phase:Fe.SETUP,player:Qt(e),ai:Qt(n),aiLevel:t,aiName:null,aiTitle:null,history:[],log:[],gameOver:!1,winner:null}}const I={MAX_HP:10,MAX_STANCE:5,EXECUTION_DAMAGE:5,INITIAL_DISTANCE:2,MAX_STAMINA:4,STAMINA_RECOVERY:1},Ye=0,Qe=3,ie=["贴身区","近战区","中距区","远距区"],Le={[s.DEFLECT]:Z.DEFENSE,[s.SLASH]:Z.ATTACK,[s.THRUST]:Z.ATTACK,[s.BLOCK]:Z.DEFENSE,[s.FEINT]:Z.ATTACK},we={[s.DEFLECT]:{cost:3,staminaCost:0,damage:2,stanceToOpponent:2,priority:2},[s.SLASH]:{cost:3,staminaCost:0,damage:3,stanceToOpponent:1,priority:3},[s.THRUST]:{cost:1,staminaCost:0,damage:1,stanceToOpponent:1,priority:4},[s.BLOCK]:{cost:2,staminaCost:0,damage:0,stanceToOpponent:0,priority:5},[s.FEINT]:{cost:1,staminaCost:0,damage:0,stanceToOpponent:2,priority:6}},N={[v.ADVANCE]:{cost:2,delta:-1},[v.RETREAT]:{cost:2,delta:1},[v.HOLD]:{cost:0,delta:0},[v.DODGE]:{cost:2,delta:0}},k={[s.DEFLECT]:"卸力",[s.SLASH]:"重击",[s.THRUST]:"轻击",[s.BLOCK]:"格挡",[s.FEINT]:"擒拿"},te={[v.ADVANCE]:"冲步",[v.RETREAT]:"撤步",[v.HOLD]:"扎马",[v.DODGE]:"闪避"},O={[b.SHORT_BLADE]:"短刀",[b.SPEAR]:"长枪",[b.SWORD]:"剑",[b.STAFF]:"棍",[b.GREAT_BLADE]:"大刀",[b.DUAL_STAB]:"双刺"},B={[b.SHORT_BLADE]:"🗡️",[b.SPEAR]:"🔱",[b.SWORD]:"⚔️",[b.STAFF]:"🏑",[b.GREAT_BLADE]:"🪓",[b.DUAL_STAB]:"🥢"},P={[b.SHORT_BLADE]:{advantage:[0,1],disadvantage:[2,3]},[b.SPEAR]:{advantage:[2,3],disadvantage:[0]},[b.SWORD]:{advantage:[1,2],disadvantage:[0,3]},[b.STAFF]:{advantage:[1,2,3],disadvantage:[0]},[b.GREAT_BLADE]:{advantage:[2],disadvantage:[0]},[b.DUAL_STAB]:{advantage:[0],disadvantage:[2,3]}};function qn(e,n,t){const a=N[n].delta,o=N[t].delta,i=e+a+o;return Math.max(Ye,Math.min(Qe,i))}const Wt={deflectStagger:!0,deflectSelfStance:0,blockSlashReduction:1,advBlockSlashReduction:0,advDodgeCounter:0,advBlockPerfect:!1,advBlockBonusStance:0,advSlashBonusStance:0,advBlockPushDist:0,advFeintBonusStance:0,dodgeCostReduction:0,damageRules:[],pushRules:[]},zn={[b.SHORT_BLADE]:{advDodgeCounter:1,advFeintBonusStance:1,dodgeCostReduction:1,damageRules:[{minDist:3,card:s.SLASH,mod:-3}]},[b.SPEAR]:{advBlockPushDist:1,damageRules:[{adv:!0,card:s.SLASH,mod:2},{dist:0,card:s.SLASH,mod:-3}]},[b.SWORD]:{deflectStagger:!1,deflectSelfStance:-2,advBlockPerfect:!0,damageRules:[{dist:0,card:s.SLASH,mod:-2},{dist:3,card:s.SLASH,mod:-3}]},[b.STAFF]:{advBlockBonusStance:1,advSlashBonusStance:2,advFeintBonusStance:1,damageRules:[{dist:0,card:s.SLASH,mod:-3}],pushRules:[{card:s.FEINT,vs:s.BLOCK,adv:!0,push:1}]},[b.GREAT_BLADE]:{advBlockSlashReduction:1,damageRules:[{adv:!0,card:s.SLASH,mod:3},{dist:0,card:s.SLASH,mod:-3}],pushRules:[{card:s.SLASH,adv:!0,push:1}]},[b.DUAL_STAB]:{advFeintBonusStance:1,dodgeCostReduction:1,damageRules:[{adv:!0,card:s.THRUST,mod:1},{disadv:!0,card:s.SLASH,mod:-3}]}};function ne(e){const n=zn[e];return n?{...Wt,...n}:{...Wt}}function S(e,n){return P[e].advantage.includes(n)}function Ft(e,n){return P[e].disadvantage.includes(n)}function me(e,n,t){const a=ne(e);for(const o of a.damageRules)if(o.card===t&&!(o.adv&&!S(e,n))&&!(o.disadv&&!Ft(e,n))&&!(o.dist!==void 0&&o.dist!==n)&&!(o.minDist!==void 0&&n<o.minDist))return o.mod;return 0}function en(e,n){return S(e,n)?ne(e).advDodgeCounter:0}function Je(e,n){return S(e,n)&&ne(e).advBlockPerfect}function pt(e,n){return S(e,n)?ne(e).advBlockBonusStance:0}function _e(e,n){return S(e,n)?ne(e).advSlashBonusStance:0}function ft(e,n){return S(e,n)?ne(e).advBlockPushDist:0}function Rt(e,n){const t=ne(e);return t.blockSlashReduction+(S(e,n)?t.advBlockSlashReduction:0)}function Xn(e){return ne(e).deflectStagger}function Nt(e,n){return 3+(S(e,n)?ne(e).advFeintBonusStance:0)}function vt(e){return ne(e).dodgeCostReduction}function pe(e,n,t,a){if(!S(e,n))return 0;const o=ne(e);for(const i of o.pushRules)if(i.card===t&&!(i.adv&&!S(e,n))&&!(i.vs&&i.vs!==a))return i.push;return 0}function bt(e,n){return S(e,n)}function R(e,n,t){return Ft(n,t)?Math.floor(e/2):e}function $n(){return{player:{hpChange:0,stanceChange:0,staggered:!1},ai:{hpChange:0,stanceChange:0,staggered:!1},distancePush:0,log:[]}}function V(e,n,t){const a=we[e].damage,o=me(n,t,e);return Math.max(0,a+o)}function Zn(e,n,t){const a=$n(),o=e.distance,i=e.player.weapon,c=e.ai.weapon;return n===t?Jn(a,n,i,c,o):(Yn(a,n,t,i,c,o),a)}function Jn(e,n,t,a,o){switch(n){case s.BLOCK:e.log.push("双方空过");break;case s.DEFLECT:e.player.stanceChange+=2,e.ai.stanceChange+=2,e.log.push("卸力对碰，双方各+2架势");break;case s.SLASH:{const i=V(s.SLASH,t,o),c=V(s.SLASH,a,o);e.player.hpChange-=c,e.ai.hpChange-=i,e.player.stanceChange+=R(1,a,o),e.ai.stanceChange+=R(1,t,o);const l=_e(t,o),r=_e(a,o);l>0&&(e.ai.stanceChange+=l),r>0&&(e.player.stanceChange+=r),t==="spear"&&S(t,o)&&(e.ai.stanceChange+=1),a==="spear"&&S(a,o)&&(e.player.stanceChange+=1);const u=pe(t,o,s.SLASH,s.SLASH),m=pe(a,o,s.SLASH,s.SLASH);e.distancePush+=u+m,e.log.push(`互砍：玩家受${c}伤，AI受${i}伤`);break}case s.THRUST:{const i=V(s.THRUST,t,o),c=V(s.THRUST,a,o);e.player.hpChange-=c,e.ai.hpChange-=i,e.player.stanceChange+=R(1,a,o),e.ai.stanceChange+=R(1,t,o),e.log.push(`互刺：玩家受${c}伤，AI受${i}伤`);break}case s.FEINT:e.log.push("双方擒拿，空过");break}return e}function Yn(e,n,t,a,o,i){if(n===s.DEFLECT&&t===s.SLASH){tn(e,"player","ai",a);return}if(t===s.DEFLECT&&n===s.SLASH){tn(e,"ai","player",o);return}if(n===s.DEFLECT&&t===s.THRUST){const c=V(s.THRUST,o,i);e.player.hpChange-=c,e.player.stanceChange+=R(1,o,i),e.log.push(`玩家卸力失败遇轻击：受${c}伤+${R(1,o,i)}架势`);return}if(t===s.DEFLECT&&n===s.THRUST){const c=V(s.THRUST,a,i);e.ai.hpChange-=c,e.ai.stanceChange+=R(1,a,i),e.log.push(`AI卸力失败遇轻击：受${c}伤+${R(1,a,i)}架势`);return}if(n===s.DEFLECT&&t===s.FEINT){e.ai.stanceChange+=2,e.log.push("玩家卸力识破擒拿：AI+2架势");return}if(t===s.DEFLECT&&n===s.FEINT){e.player.stanceChange+=2,e.log.push("AI卸力识破擒拿：玩家+2架势");return}if(n===s.DEFLECT&&t===s.BLOCK){e.player.stanceChange+=1,e.log.push("玩家卸力失败(遇格挡)：+1架势");return}if(t===s.DEFLECT&&n===s.BLOCK){e.ai.stanceChange+=1,e.log.push("AI卸力失败(遇格挡)：+1架势");return}if(n===s.SLASH&&t===s.THRUST){mt(e,"player","ai",a,o,i,s.THRUST);return}if(t===s.SLASH&&n===s.THRUST){mt(e,"ai","player",o,a,i,s.THRUST);return}if(n===s.SLASH&&t===s.BLOCK){const c=V(s.SLASH,a,i),l=Rt(o,i),r=Je(o,i)?0:Math.max(0,c-l);e.ai.hpChange-=r,e.ai.stanceChange+=R(1,a,i);const u=pt(o,i);u>0&&(e.player.stanceChange+=u),a==="spear"&&S(a,i)&&(e.ai.stanceChange+=1);const m=_e(a,i);m>0&&(e.ai.stanceChange+=m);const d=pe(a,i,s.SLASH,s.BLOCK),p=ft(o,i);e.distancePush+=d+p,Je(o,i)?e.log.push("玩家重击被完美格挡(剑)：AI完全免伤"):e.log.push(`玩家重击破格挡：AI受${r}伤(减免${l})+架势`);return}if(t===s.SLASH&&n===s.BLOCK){const c=V(s.SLASH,o,i),l=Rt(a,i),r=Je(a,i)?0:Math.max(0,c-l);e.player.hpChange-=r,e.player.stanceChange+=R(1,o,i);const u=pt(a,i);u>0&&(e.ai.stanceChange+=u),o==="spear"&&S(o,i)&&(e.player.stanceChange+=1);const m=_e(o,i);m>0&&(e.player.stanceChange+=m);const d=pe(o,i,s.SLASH,s.BLOCK),p=ft(a,i);e.distancePush+=d+p,Je(a,i)?e.log.push("AI重击被完美格挡(剑)：玩家完全免伤"):e.log.push(`AI重击破格挡：玩家受${r}伤(减免${l})+架势`);return}if(n===s.SLASH&&t===s.FEINT){mt(e,"player","ai",a,o,i,s.FEINT);return}if(t===s.SLASH&&n===s.FEINT){mt(e,"ai","player",o,a,i,s.FEINT);return}if(n===s.THRUST&&t===s.BLOCK){const c=pt(o,i);c>0&&(e.player.stanceChange+=c);const l=ft(o,i);l>0&&(e.distancePush+=l),e.log.push(`玩家轻击被格挡完全抵消${c>0?"，棍震退+1架势":""}${l>0?"，被弹枪推开":""}`);return}if(t===s.THRUST&&n===s.BLOCK){const c=pt(a,i);c>0&&(e.ai.stanceChange+=c);const l=ft(a,i);l>0&&(e.distancePush+=l),e.log.push(`AI轻击被格挡完全抵消${c>0?"，棍震退+1架势":""}${l>0?"，被弹枪推开":""}`);return}if(n===s.THRUST&&t===s.FEINT){const c=V(s.THRUST,a,i);e.ai.hpChange-=c,e.ai.stanceChange+=R(1,a,i),e.log.push(`玩家轻击命中：AI受${c}伤+${R(1,a,i)}架势`);return}if(t===s.THRUST&&n===s.FEINT){const c=V(s.THRUST,o,i);e.player.hpChange-=c,e.player.stanceChange+=R(1,o,i),e.log.push(`AI轻击命中：玩家受${c}伤+${R(1,o,i)}架势`);return}if(n===s.BLOCK&&t===s.FEINT){const c=Nt(o,i),l=R(c,o,i);e.player.stanceChange+=l;const r=pe(o,i,s.FEINT,s.BLOCK);e.distancePush+=r,e.log.push(`AI擒拿命中格挡：玩家+${l}架势${r?"，距离+"+r:""}`);return}if(t===s.BLOCK&&n===s.FEINT){const c=Nt(a,i),l=R(c,a,i);e.ai.stanceChange+=l;const r=pe(a,i,s.FEINT,s.BLOCK);e.distancePush+=r,e.log.push(`玩家擒拿命中格挡：AI+${l}架势${r?"，距离+"+r:""}`);return}e.log.push("双方空过")}function tn(e,n,t,a){const o=we[s.DEFLECT].damage;e[t].hpChange-=o,e[t].stanceChange+=2;const i=n==="player"?"玩家":"AI";Xn(a)?(e[t].staggered=!0,e.log.push(`${i}卸力反制成功：对手受${o}伤+2架势+僵直`)):(e[n].stanceChange-=2,e.log.push(`${i}(剑)卸力反制成功：对手受${o}伤+2架势，自身-2架势`))}function mt(e,n,t,a,o,i,c){const l=V(s.SLASH,a,i);e[t].hpChange-=l,e[t].stanceChange+=R(1,a,i);const r=_e(a,i);r>0&&(e[t].stanceChange+=r),a==="spear"&&S(a,i)&&(e[t].stanceChange+=1);const u=pe(a,i,s.SLASH,c);e.distancePush+=u,e.log.push(`${n==="player"?"玩家":"AI"}重击命中：对手受${l}伤+架势${u?"，距离+"+u:""}`)}function nn(e,n,t){const a=$n(),o=e.distance,i=e[n].weapon,c=n==="player"?"ai":"player",l=n==="player"?"玩家":"AI";switch(t){case s.SLASH:{const r=V(s.SLASH,i,o);a[c].hpChange-=r,a[c].stanceChange+=R(1,i,o);const u=_e(i,o);u>0&&(a[c].stanceChange+=u),i==="spear"&&S(i,o)&&(a[c].stanceChange+=1);const m=pe(i,o,s.SLASH,null);a.distancePush+=m,a.log.push(`${l}重击命中(对手闪避失败)：对手受${r}伤+架势`);break}case s.THRUST:{const r=V(s.THRUST,i,o);a[c].hpChange-=r,a[c].stanceChange+=R(1,i,o),a.log.push(`${l}轻击命中(对手闪避失败)：对手受${r}伤`);break}case s.FEINT:{const r=Nt(i,o),u=R(r,i,o);a[c].stanceChange+=u,a.log.push(`${l}擒拿命中(对手闪避失败)：对手+${u}架势`);break}case s.DEFLECT:case s.BLOCK:a.log.push(`${l}防守落空(无攻击可防)`);break}return a}function Et(e,n,t){const a=Vn(e,n,t);return a.phase=Fe.INFO_SYNC,a}function kt(e,n,t){let a=JSON.parse(JSON.stringify(e));return a.round+=1,a.log=[],a.log.push(`══════ 第 ${a.round} 回合 ══════`),a.player.staggered=!1,a.ai.staggered=!1,a._lastPDist=n.distanceCard,a._lastADist=t.distanceCard,a=Qn(a,n.distanceCard,t.distanceCard),a=Wn(a,n.combatCard,t.combatCard),a=ea(a),a=ta(a),a.history.push({round:a.round,playerDistance:n.distanceCard,playerCombat:n.combatCard,aiDistance:t.distanceCard,aiCombat:t.combatCard,pMoveInterrupted:a._pInterrupted||!1,aMoveInterrupted:a._aInterrupted||!1}),delete a._pInterrupted,delete a._aInterrupted,a}function Qn(e,n,t){var c,l;const a=e.distance;e._pDodging=n===v.DODGE,e._aDodging=t===v.DODGE,e._pMoveDelta=N[n].delta,e._aMoveDelta=N[t].delta,e.distance=qn(a,n,t);let o=((c=N[n])==null?void 0:c.cost)??0,i=((l=N[t])==null?void 0:l.cost)??0;return n===v.DODGE&&(o=Math.max(0,o-vt(e.player.weapon))),t===v.DODGE&&(i=Math.max(0,i-vt(e.ai.weapon))),e.player.stamina=Math.max(0,e.player.stamina-o),e.ai.stamina=Math.max(0,e.ai.stamina-i),o>0&&e.log.push(`玩家身法消耗：-${o}体力`),i>0&&e.log.push(`AI身法消耗：-${i}体力`),e.log.push(`间距变化：${a} → ${e.distance}`),e}function Wn(e,n,t){const a=e._pDodging,o=e._aDodging;let i=!1,c=!1,l=!1,r=!1,u=0,m=0;if(a)if(t==="feint")e.log.push("🎭 AI擒拿穿透闪避！玩家闪避落空");else if(t&&Le[t]===Z.ATTACK)if(t==="thrust"&&bt(e.ai.weapon,e.distance))l=!0,e.log.push("⚡ 玩家闪避被AI轻击打断(优势区)！攻防卡取消");else{i=!0,e.log.push("💨 玩家闪避成功！AI攻击无效");const h=en(e.player.weapon,e.distance);h>0&&(e.ai.hp-=h,m-=h,e.log.push(`🗡️ 闪避反击！AI受${h}伤`)),e.player.weapon==="dual_stab"&&(e.ai.stance+=2,e.log.push("🥢 双刺闪避成功：AI+2架势"))}else e.log.push("💨 玩家闪避落空(对手无攻击)");if(o)if(n==="feint")e.log.push("🎭 玩家擒拿穿透闪避！AI闪避落空");else if(n&&Le[n]===Z.ATTACK)if(n==="thrust"&&bt(e.player.weapon,e.distance))r=!0,e.log.push("⚡ AI闪避被玩家轻击打断(优势区)！攻防卡取消");else{c=!0,e.log.push("💨 AI闪避成功！玩家攻击无效");const h=en(e.ai.weapon,e.distance);h>0&&(e.player.hp-=h,u-=h,e.log.push(`🗡️ 闪避反击！玩家受${h}伤`)),e.ai.weapon==="dual_stab"&&(e.player.stance+=2,e.log.push("🥢 双刺闪避成功：玩家+2架势"))}else e.log.push("💨 AI闪避落空(对手无攻击)");let d=l?null:n,p=r?null:t;i&&(p=null),c&&(d=null);let f;if(d&&p?f=Zn(e,d,p):d&&!p?f=nn(e,"player",d):!d&&p?f=nn(e,"ai",p):f={player:{hpChange:0,stanceChange:0,staggered:!1},ai:{hpChange:0,stanceChange:0,staggered:!1},distancePush:0,log:["双方攻防均被取消"]},e.player.hp+=f.player.hpChange,e.ai.hp+=f.ai.hpChange,e.player.stance+=f.player.stanceChange,e.ai.stance+=f.ai.stanceChange,f.player.staggered&&(e.player.staggered=!0),f.ai.staggered&&(e.ai.staggered=!0),e.distance===0&&(e.player.weapon==="dual_stab"&&(f.ai.hpChange<0||f.ai.stanceChange>0||f.ai.staggered)&&(e.ai.stance+=1,e.log.push("🥢 双刺贴身命中：AI额外+1架势")),e.ai.weapon==="dual_stab"&&(f.player.hpChange<0||f.player.stanceChange>0||f.player.staggered)&&(e.player.stance+=1,e.log.push("🥢 双刺贴身命中：玩家额外+1架势"))),e.distance===0&&(e.player.weapon==="dual_stab"&&d==="thrust"&&f.ai.hpChange<0&&(e.ai.hp-=1,e.log.push("🥢 双刺追击：贴身轻击二连，AI额外受1伤")),e.ai.weapon==="dual_stab"&&p==="thrust"&&f.player.hpChange<0&&(e.player.hp-=1,e.log.push("🥢 双刺追击：贴身轻击二连，玩家额外受1伤"))),f.distancePush!==0){const h=e.distance;e.distance=Math.max(Ye,Math.min(Qe,e.distance+f.distancePush)),e.distance!==h&&e.log.push(`间距被推动：${h} → ${e.distance}`)}e.log.push(...f.log);const g=f.player.hpChange+(u??0),y=f.ai.hpChange+(m??0);return e._pInterrupted=!1,e._aInterrupted=!1,(e._pMoveDelta??0)!==0&&g<0&&(e.distance=Math.max(Ye,Math.min(Qe,e.distance-e._pMoveDelta)),e._pInterrupted=!0,e.log.push("⚡ 玩家身法被打断！攻击命中，移动未完成")),(e._aMoveDelta??0)!==0&&y<0&&(e.distance=Math.max(Ye,Math.min(Qe,e.distance-e._aMoveDelta)),e._aInterrupted=!0,e.log.push("⚡ AI身法被打断！攻击命中，移动未完成")),delete e._pMoveDelta,delete e._aMoveDelta,delete e._pDodging,delete e._aDodging,e}function ea(e){const n=I.MAX_STANCE,t=I.EXECUTION_DAMAGE;return e.player.stance=Math.max(0,e.player.stance),e.ai.stance=Math.max(0,e.ai.stance),e.player.stance>=n&&(e.player.hp-=t,e.player.stance=0,e.log.push(`⚔ 玩家被处决！-${t}气血`)),e.ai.stance>=n&&(e.ai.hp-=t,e.ai.stance=0,e.log.push(`⚔ AI被处决！-${t}气血`)),e.player.hp=Math.max(0,e.player.hp),e.ai.hp=Math.max(0,e.ai.hp),e}function ta(e){const n=I.MAX_STAMINA,t=I.STAMINA_RECOVERY;e.history.length>0&&e.history[e.history.length-1].playerDistance,e.history.length>0&&e.history[e.history.length-1].aiDistance;const a=e._lastPDist==="hold",o=e._lastADist==="hold",i=a?t+1:t,c=o?t+1:t;e.player.stamina=Math.min(n,e.player.stamina+i),e.ai.stamina=Math.min(n,e.ai.stamina+c),delete e._lastPDist,delete e._lastADist;const l=e.player.hp<=0,r=e.ai.hp<=0;return l&&r?(e.gameOver=!0,e.winner="draw",e.phase=Fe.GAME_OVER,e.log.push("双方同时倒下——平局！")):l?(e.gameOver=!0,e.winner="ai",e.phase=Fe.GAME_OVER,e.log.push("玩家气血归零——AI胜利！")):r?(e.gameOver=!0,e.winner="player",e.phase=Fe.GAME_OVER,e.log.push("AI气血归零——玩家胜利！")):e.phase=Fe.INFO_SYNC,e}function it(e,n,t=0){const{weapon:a,staggered:o,stamina:i}=e;return Object.values(s).filter(l=>!(o&&Le[l]===Z.ATTACK))}function Tt(e,n){const{stamina:t,weapon:a}=e;return Object.values(v).filter(i=>{var l;if(i===v.HOLD)return!0;if(i===v.ADVANCE&&n<=Ye||i===v.RETREAT&&n>=Qe)return!1;let c=((l=N[i])==null?void 0:l.cost)??0;return i===v.DODGE&&a&&(c=Math.max(0,c-vt(a))),!(t<c)})}function na(e,n,t,a){var l;if(!Tt(t,a).includes(e))return{valid:!1,reason:"身法卡不可用"};const i=((l=N[e])==null?void 0:l.cost)??0;return it(t,a,i).includes(n)?{valid:!0}:{valid:!1,reason:"攻防卡不可用（体力不足）"}}function tt(e){const n=e.aiLevel;let t;switch(n){case 1:t=an(e);break;case 2:t=ia(e);break;case 3:t=oa(e);break;case 4:t=la(e);break;case 5:t=ca(e);break;case 6:t=ra(e);break;case 7:t=da(e);break;case 8:t=ua(e);break;default:t=an(e);break}return aa(e,t)}function aa(e,n){var o;const t=((o=N[n.distanceCard])==null?void 0:o.cost)??0,a=it(e.ai,e.distance,t);return a.includes(n.combatCard)||(n.combatCard=T(a)),n}function T(e){if(!(!e||e.length===0))return e[Math.floor(Math.random()*e.length)]}function G(e,n){const t=n.reduce((o,i)=>o+i,0);let a=Math.random()*t;for(let o=0;o<e.length;o++)if(a-=n[o],a<=0)return e[o];return e[e.length-1]}function ge(e){const n=e.distance,t=e.ai,a=Tt(t,n),o=it(t);return{distCards:a,combatCards:o}}function sa(e){return P[e].advantage}function Pe(e,n){const t=sa(e);if(t.includes(n))return v.HOLD;const a=t.reduce((o,i)=>o+i,0)/t.length;return n>a?v.ADVANCE:v.RETREAT}function M(e,n){const a={[s.SLASH]:[s.DEFLECT,s.BLOCK],[s.THRUST]:[s.BLOCK,s.SLASH],[s.FEINT]:[s.DEFLECT,s.SLASH,s.THRUST],[s.BLOCK]:[s.FEINT,s.SLASH],[s.DEFLECT]:[s.THRUST,s.BLOCK]}[e]||[];for(const o of a)if(n.includes(o))return o;return null}function ot(e,n){var i,c;const t=e.slice(-n),a={};for(const l of Object.values(s))a[l]=0;t.forEach(l=>a[l.playerCombat]++);const o=Object.entries(a).sort((l,r)=>r[1]-l[1]);return{freq:a,sorted:o,mostUsed:(i=o[0])==null?void 0:i[0],mostCount:((c=o[0])==null?void 0:c[1])||0}}function Ct(e,n){const t=e.slice(-n),a={};for(const o of Object.values(v))a[o]=0;return t.forEach(o=>a[o.playerDistance]++),a}function Ln(e,n,t){var l;if(!n.includes(v.DODGE)||e.ai.stamina<2)return!1;const a=e.ai.stance,o=e.player.weapon,i=e.distance,c=(l=P[o])==null?void 0:l.advantage.includes(i);return!!(a>=3&&Math.random()<t+.15||c&&Math.random()<t)}function He(e,n,t={}){const{weapon:a,stamina:o}=e.ai,i=e.player.weapon,c=e.distance,l=P[a].advantage,r=P[i].advantage,u=l.includes(c),m=r.includes(c),d=t.dodgeUrgency||0,p=t.staminaAware||!1,f=t.escapeChance||.4;if(d>0&&Ln(e,n,d))return v.DODGE;if(p&&o<=1&&!m)return v.HOLD;let g;if(m&&!u){const y=Pe(a,c),h=c<2?v.RETREAT:v.ADVANCE;g=Math.random()<f?h:y}else if(u&&!m)g=v.HOLD;else if(u&&m){const y=l.filter(h=>!r.includes(h));if(y.length){const h=y[0];g=h<c?v.ADVANCE:h>c?v.RETREAT:v.HOLD}else{const h=c<2?v.RETREAT:v.ADVANCE;g=n.includes(h)?h:v.HOLD}}else g=Pe(a,c);return n.includes(g)||(g=T(n)),g}function an(e){const{distCards:n,combatCards:t}=ge(e),a=e.ai.weapon,o=e.distance;let i;Math.random()<.6?(i=Pe(a,o),n.includes(i)||(i=T(n))):i=T(n);let c;if(S(a,o)){const l=t.filter(r=>Le[r]===Z.ATTACK);c=l.length&&Math.random()<.65?T(l):T(t)}else{const l=[s.BLOCK,s.THRUST,s.SLASH].filter(r=>t.includes(r));c=l.length?G(l,[3,2,1]):T(t)}return{distanceCard:i,combatCard:c}}function ia(e){const{distCards:n,combatCards:t}=ge(e),a=e.ai.weapon,o=e.distance,i=e.history;let c=He(e,n,{escapeChance:.3}),l;const r=i.length>0?i[i.length-1]:null;if(r&&Math.random()<.4&&(l=M(r.playerCombat,t)),!l)if(S(a,o)){const u=[s.SLASH,s.THRUST,s.FEINT].filter(m=>t.includes(m));l=u.length?T(u):T(t)}else{const u=[s.BLOCK,s.THRUST].filter(m=>t.includes(m));l=u.length?T(u):T(t)}return{distanceCard:c,combatCard:l}}function oa(e){const{distCards:n,combatCards:t}=ge(e),a=e.ai.weapon,o=e.distance,i=e.history;let c=He(e,n,{staminaAware:!0,escapeChance:.45,dodgeUrgency:.15}),l;const r=e.ai.stance,u=e.player.stance,m=i.length>0?i[i.length-1]:null;if(r>=4){const d=[s.BLOCK,s.DEFLECT].filter(p=>t.includes(p));d.length&&Math.random()<.7&&(l=T(d))}else if(r>=3&&Math.random()<.5){const d=[s.BLOCK,s.DEFLECT].filter(p=>t.includes(p));d.length&&(l=T(d))}if(!l&&e.player.staggered){const d=[s.SLASH].filter(p=>t.includes(p));d.length&&(l=d[0])}if(!l&&u>=3){const d=[s.THRUST,s.FEINT].filter(p=>t.includes(p));d.length&&(l=T(d))}if(!l&&m&&Math.random()<.55&&(l=M(m.playerCombat,t)),!l&&i.length>=2){const d=i.slice(-2).map(p=>p.playerCombat);if(d[0]===d[1]){const p=M(d[1],t);p&&Math.random()<.65&&(l=p)}}if(!l)if(S(a,o)){const d=[s.SLASH,s.THRUST,s.FEINT].filter(p=>t.includes(p));l=d.length?G(d,[3,2,2]):T(t)}else{const d=[s.BLOCK,s.THRUST,s.DEFLECT].filter(p=>t.includes(p));l=d.length?G(d,[3,2,1]):T(t)}return{distanceCard:c,combatCard:l}}function la(e){const{distCards:n,combatCards:t}=ge(e),a=e.ai.weapon,o=e.distance,i=e.history;let c=He(e,n,{staminaAware:!0,escapeChance:.55,dodgeUrgency:.2}),l;const r=e.ai.stance,u=e.player.stance,m=i.length>0?i[i.length-1]:null;if(r>=4){const d=[s.BLOCK,s.DEFLECT].filter(p=>t.includes(p));d.length&&Math.random()<.75&&(l=T(d))}else if(r>=3){const d=[s.BLOCK,s.DEFLECT].filter(p=>t.includes(p));d.length&&Math.random()<.55&&(l=T(d))}if(!l&&e.player.staggered&&t.includes(s.SLASH)&&(l=s.SLASH),!l&&u>=3){const d=[s.THRUST,s.FEINT,s.SLASH].filter(p=>t.includes(p));d.length&&(l=d[0])}if(!l&&m&&(m.aiCombat===s.FEINT&&(m.playerCombat===s.BLOCK||m.playerCombat===s.DEFLECT)&&t.includes(s.SLASH)&&(l=s.SLASH),!l&&m.aiCombat===s.SLASH&&m.playerCombat===s.DEFLECT&&t.includes(s.THRUST)&&(l=s.THRUST)),!l&&i.length>=2){const{mostUsed:d,mostCount:p}=ot(i,3);if(p>=2){const f=M(d,t);f&&Math.random()<.65&&(l=f)}}if(!l&&m&&Math.random()<.55&&(l=M(m.playerCombat,t)),!l)if(S(a,o)){const d=[s.SLASH,s.THRUST,s.FEINT].filter(p=>t.includes(p));l=d.length?G(d,[3,2,2]):T(t)}else{const d=[s.BLOCK,s.THRUST,s.DEFLECT].filter(p=>t.includes(p));l=d.length?G(d,[3,2,2]):T(t)}return{distanceCard:c,combatCard:l}}function ca(e){const{distCards:n,combatCards:t}=ge(e),a=e.ai.weapon;e.player.weapon;const o=e.distance,i=e.history;let c;if(i.length>=3){const d=Ct(i,4);d[v.DODGE]>=2,d[v.ADVANCE]>=3&&n.includes(v.RETREAT)&&(c=v.RETREAT)}c||(c=He(e,n,{staminaAware:!0,escapeChance:.6,dodgeUrgency:.3}));let l;const r=e.ai.stance,u=e.player.stance,m=i.length>0?i[i.length-1]:null;if(r>=4){const d=[s.SLASH,s.THRUST].filter(f=>t.includes(f)),p=[s.BLOCK,s.DEFLECT].filter(f=>t.includes(f));Math.random()<.35&&d.length?l=T(d):p.length&&(l=T(p))}else if(r>=3){const d=[s.BLOCK,s.DEFLECT].filter(p=>t.includes(p));d.length&&Math.random()<.6&&(l=T(d))}if(!l&&e.player.staggered&&t.includes(s.SLASH)&&(l=s.SLASH),!l&&u>=3){const d=[s.FEINT,s.SLASH,s.THRUST].filter(p=>t.includes(p));d.length&&(l=d[0])}if(!l&&m&&(m.aiCombat===s.FEINT&&(m.playerCombat===s.BLOCK||m.playerCombat===s.DEFLECT)&&t.includes(s.SLASH)&&(l=s.SLASH),!l&&m.aiCombat===s.SLASH&&m.playerCombat===s.DEFLECT&&t.includes(s.THRUST)&&(l=s.THRUST),!l&&m.playerDistance===v.DODGE&&t.includes(s.FEINT)&&Math.random()<.6&&(l=s.FEINT)),!l&&i.length>=3){const{mostUsed:d,mostCount:p,sorted:f}=ot(i,5);if(p>=2){const g=M(d,t);g&&Math.random()<.75&&(l=g)}if(!l&&f[1]&&f[1][1]>=2){const g=M(f[1][0],t);g&&Math.random()<.5&&(l=g)}}if(!l&&m&&Math.random()<.6&&(l=M(m.playerCombat,t)),!l)if(S(a,o)){const d=[s.SLASH,s.THRUST,s.FEINT,s.DEFLECT].filter(p=>t.includes(p));l=d.length?G(d,[3,2,2,1]):T(t)}else{const d=[s.BLOCK,s.THRUST,s.DEFLECT,s.FEINT].filter(p=>t.includes(p));l=d.length?G(d,[3,2,2,1]):T(t)}return{distanceCard:c,combatCard:l}}function ra(e){var d;const{distCards:n,combatCards:t}=ge(e),a=e.ai.weapon;e.player.weapon;const o=e.distance,i=e.history,c=i.length>0?i[i.length-1]:null;let l;if(i.length>=3){const p=Ct(i,5);p[v.DODGE]>=2&&(S(a,o)?l=v.HOLD:l=Pe(a,o)),!l&&p[v.ADVANCE]>=3&&(S(a,o)?l=v.HOLD:l=n.includes(v.RETREAT)?v.RETREAT:Pe(a,o))}l||(l=He(e,n,{staminaAware:!0,escapeChance:.65,dodgeUrgency:.35})),n.includes(l)||(l=T(n));let r;const u=e.ai.stance,m=e.player.stance;if(u>=4){const p=[s.SLASH,s.THRUST].filter(h=>t.includes(h)),f=[s.BLOCK,s.DEFLECT].filter(h=>t.includes(h)),y=i.slice(-3).filter(h=>h.playerCombat===s.FEINT).length>=1?.45:.3;Math.random()<y&&p.length?r=T(p):f.length&&(r=T(f))}else if(u>=3){const p=[s.BLOCK,s.DEFLECT].filter(f=>t.includes(f));p.length&&Math.random()<.55&&(r=T(p))}if(!r&&e.player.staggered&&(r=t.includes(s.SLASH)?s.SLASH:null),!r&&m>=3){const p=[s.FEINT,s.THRUST,s.SLASH].filter(f=>t.includes(f));p.length&&(r=p[0])}if(!r&&c&&(c.aiCombat===s.FEINT&&(c.playerCombat===s.BLOCK||c.playerCombat===s.DEFLECT)&&(r=t.includes(s.SLASH)?s.SLASH:null),!r&&c.aiCombat===s.SLASH&&c.playerCombat===s.DEFLECT&&(r=t.includes(s.THRUST)?s.THRUST:null),!r&&c.aiCombat===s.THRUST&&c.playerCombat===s.BLOCK&&(r=t.includes(s.FEINT)?s.FEINT:null),!r&&c.playerDistance===v.DODGE&&t.includes(s.FEINT)&&Math.random()<.7&&(r=s.FEINT)),!r&&i.length>=3){const{mostUsed:p,mostCount:f,sorted:g}=ot(i,6);if(f>=2){const y=M(p,t);y&&Math.random()<.85&&(r=y)}if(!r&&((d=g[1])==null?void 0:d[1])>=2){const y=M(g[1][0],t);y&&Math.random()<.6&&(r=y)}}if(!r&&c&&(r=M(c.playerCombat,t)),!r)if(S(a,o)){const p=[s.SLASH,s.THRUST,s.FEINT,s.DEFLECT].filter(f=>t.includes(f));r=p.length?G(p,[3,3,2,1]):T(t)}else{const p=[s.BLOCK,s.DEFLECT,s.THRUST,s.FEINT].filter(f=>t.includes(f));r=p.length?G(p,[3,2,2,1]):T(t)}return{distanceCard:l,combatCard:r}}function da(e){var p;const{distCards:n,combatCards:t}=ge(e),a=e.ai.weapon;e.player.weapon;const o=e.distance,i=e.history,c=i.length>0?i[i.length-1]:null;let l;i.length>=3&&Ct(i,5)[v.DODGE]>=2&&(l=S(a,o)?v.HOLD:Pe(a,o)),l||(l=He(e,n,{staminaAware:!0,escapeChance:.7,dodgeUrgency:.35})),n.includes(l)||(l=T(n));let r;const u=e.ai.stance,m=e.player.stance;let d=!1;if(i.length>=2){const f=i.slice(-2).map(g=>g.aiCombat);d=f[0]===f[1]}if(u>=4){const f=[s.SLASH,s.THRUST].filter($=>t.includes($)),g=[s.BLOCK,s.DEFLECT].filter($=>t.includes($)),h=i.slice(-3).filter($=>$.playerCombat===s.FEINT).length>=1?.5:.35;Math.random()<h&&f.length?r=T(f):g.length&&(r=T(g))}else if(u>=3){const f=[s.BLOCK,s.DEFLECT].filter(g=>t.includes(g));f.length&&Math.random()<.5&&(r=T(f))}if(!r&&e.player.staggered&&(r=t.includes(s.SLASH)?s.SLASH:null),!r&&m>=3){const f=[s.FEINT,s.THRUST,s.SLASH].filter(g=>t.includes(g));f.length&&(r=f[0])}if(!r&&c&&(c.aiCombat===s.FEINT&&(c.playerCombat===s.BLOCK||c.playerCombat===s.DEFLECT)&&(r=t.includes(s.SLASH)?s.SLASH:null),!r&&c.aiCombat===s.SLASH&&c.playerCombat===s.DEFLECT&&(r=t.includes(s.THRUST)?s.THRUST:null),!r&&c.aiCombat===s.THRUST&&c.playerCombat===s.BLOCK&&(r=t.includes(s.FEINT)?s.FEINT:null),!r&&c.playerDistance===v.DODGE&&t.includes(s.FEINT)&&(r=s.FEINT)),!r&&i.length>=3){const{mostUsed:f,mostCount:g,sorted:y}=ot(i,6);if(g>=2){const h=M(f,t);h&&(r=h)}if(!r&&((p=y[1])==null?void 0:p[1])>=2){const h=M(y[1][0],t);h&&Math.random()<.7&&(r=h)}}if(!r&&c&&(r=M(c.playerCombat,t)),r&&d&&c&&r===c.aiCombat&&Math.random()<.2){const f=t.filter(g=>g!==r);f.length&&(r=T(f))}if(!r)if(S(a,o)){const f=[s.SLASH,s.THRUST,s.FEINT,s.DEFLECT].filter(g=>t.includes(g));r=f.length?G(f,[3,3,2,1]):T(t)}else{const f=[s.BLOCK,s.DEFLECT,s.THRUST,s.FEINT].filter(g=>t.includes(g));r=f.length?G(f,[3,2,2,1]):T(t)}return{distanceCard:l,combatCard:r}}function ua(e){var y;const{distCards:n,combatCards:t}=ge(e),a=e.ai.weapon,o=e.player.weapon,i=e.distance,c=e.history,l=c.length>0?c[c.length-1]:null;let r;const u=S(a,i),m=S(o,i);c.length>=3&&Ct(c,5)[v.DODGE]>=2&&u&&(r=v.HOLD),r||e.ai.stamina<=1&&!m&&e.ai.stance<3&&(r=v.HOLD),r||Ln(e,n,.45)&&(r=v.DODGE),r||(r=He(e,n,{staminaAware:!0,escapeChance:.75,dodgeUrgency:0})),n.includes(r)||(r=T(n));let d;const p=e.ai.stance,f=e.player.stance;e.ai.hp;const g=e.player.hp;if(p>=4){const h=[s.SLASH,s.THRUST].filter(le=>t.includes(le)),$=[s.BLOCK,s.DEFLECT].filter(le=>t.includes(le)),A=c.slice(-3).filter(le=>le.playerCombat===s.FEINT).length>=1?.5:.35;Math.random()<A&&h.length?d=T(h):$.length&&(d=T($))}if(!d&&p>=3){const h=[s.BLOCK,s.DEFLECT].filter($=>t.includes($));h.length&&Math.random()<.55&&(d=T(h))}if(!d&&e.player.staggered&&(d=t.includes(s.SLASH)?s.SLASH:null),!d&&g<=3&&(S(a,i)&&t.includes(s.SLASH)?d=s.SLASH:t.includes(s.THRUST)&&(d=s.THRUST)),!d&&f>=3){const h=[s.FEINT,s.THRUST,s.SLASH].filter($=>t.includes($));h.length&&(d=h[0])}if(!d&&l){const h=l.aiCombat,$=M(h,Object.values(s));if($){const C=M($,t);C&&Math.random()<.6&&(d=C)}}if(!d&&l&&(l.aiCombat===s.FEINT&&(l.playerCombat===s.BLOCK||l.playerCombat===s.DEFLECT)&&(d=t.includes(s.SLASH)?s.SLASH:null),!d&&l.aiCombat===s.SLASH&&l.playerCombat===s.DEFLECT&&(d=t.includes(s.THRUST)?s.THRUST:null),!d&&l.aiCombat===s.THRUST&&l.playerCombat===s.BLOCK&&(d=t.includes(s.FEINT)?s.FEINT:null),!d&&l.playerDistance===v.DODGE&&(d=t.includes(s.FEINT)?s.FEINT:null)),!d&&c.length>=2){const{mostUsed:h,mostCount:$,sorted:C}=ot(c,8);if($>=2){const A=M(h,t);A&&(d=A)}if(!d&&((y=C[1])==null?void 0:y[1])>=2){const A=M(C[1][0],t);A&&(d=A)}}if(!d&&l&&(d=M(l.playerCombat,t)),d&&c.length>=4&&Math.random()<.15){const h=t.filter($=>$!==d);if(h.length){const $=h.map(C=>Le[C]===Z.ATTACK&&S(a,i)?3:C===s.BLOCK&&p>=2?2:1);d=G(h,$)}}if(!d)if(S(a,i)){const h=[s.SLASH,s.THRUST,s.FEINT,s.DEFLECT].filter($=>t.includes($));d=h.length?G(h,[4,3,2,1]):T(t)}else{const h=[s.BLOCK,s.DEFLECT,s.THRUST,s.FEINT].filter($=>t.includes($));d=h.length?G(h,[3,3,2,1]):T(t)}return{distanceCard:r,combatCard:d}}function pa(e,n){const t=S(e,n),a=Ft(e,n),o=[];switch(t&&o.push({icon:"★",text:"优势区",cls:"trait-buff"}),a&&o.push({icon:"✗",text:"劣势区",cls:"trait-nerf"}),e){case b.SHORT_BLADE:t&&(o.push({icon:"🎯",text:"轻击破闪避",cls:"trait-buff"}),o.push({icon:"🗡️",text:"闪避时反击1伤",cls:"trait-buff"})),n>=3&&o.push({icon:"⚠",text:"重击几乎无效",cls:"trait-nerf"});break;case b.SPEAR:t&&(o.push({icon:"🔱",text:"重击+2伤+额外架势",cls:"trait-buff"}),o.push({icon:"🛡️",text:"格挡弹枪推1距",cls:"trait-buff"})),n===0&&o.push({icon:"⚠",text:"重击几乎无效",cls:"trait-nerf"});break;case b.SWORD:t&&(o.push({icon:"⚔️",text:"卸力不造成僵直",cls:"trait-buff"}),o.push({icon:"🛡️",text:"完美格挡(重击免伤)",cls:"trait-buff"})),n===0&&o.push({icon:"⚠",text:"重击大幅削弱",cls:"trait-nerf"}),n===3&&o.push({icon:"⚠",text:"重击大幅削弱",cls:"trait-nerf"});break;case b.STAFF:t&&(o.push({icon:"🏑",text:"擒拿+3架势",cls:"trait-buff"}),o.push({icon:"↗",text:"擒拿破格挡→推距",cls:"trait-buff"}),o.push({icon:"⚡",text:"重击额外+2架势",cls:"trait-buff"}),o.push({icon:"🛡️",text:"格挡震退+1架势",cls:"trait-buff"})),n===0&&o.push({icon:"⚠",text:"重击几乎无效",cls:"trait-nerf"});break;case b.GREAT_BLADE:t&&(o.push({icon:"🪓",text:"重击+3伤(共6)",cls:"trait-buff"}),o.push({icon:"↗",text:"重击命中→推距+1",cls:"trait-buff"}),o.push({icon:"🛡️",text:"格挡额外减1伤",cls:"trait-buff"})),n===0&&o.push({icon:"⚠",text:"重击几乎无效",cls:"trait-nerf"});break;case b.DUAL_STAB:t&&(o.push({icon:"🥢",text:"轻击追击+1伤",cls:"trait-buff"}),o.push({icon:"💨",text:"闪避→对手+2架势",cls:"trait-buff"}),o.push({icon:"✦",text:"命中额外+1架势",cls:"trait-buff"})),a&&o.push({icon:"⚠",text:"重击几乎无效",cls:"trait-nerf"});break}return o}function fa(e,n,t,a,o){const i=[],c=k[e],l=k[n];if(i.push(`玩家出 <strong>${c}</strong> vs AI出 <strong>${l}</strong>`),e===n){switch(e){case s.BLOCK:case s.FEINT:i.push("双方出了相同的牌 → <strong>空过</strong>，无事发生");break;case s.DEFLECT:i.push("卸力对碰 → <strong>双方各+2架势</strong>");break;case s.SLASH:i.push("互砍 → <strong>双方各受重击伤害+1架势</strong>");break;case s.THRUST:i.push("互刺 → <strong>双方各受轻击伤害+1架势</strong>");break}return i}if(sn(i,e,n,t,a,o,"玩家"),i.length===1&&sn(i,n,e,a,t,o,"AI"),S(t,o)){const r=me(t,o,e);r>0&&i.push(`📈 玩家 ${O[t]} 优势区加成：${c}伤害+${r}`)}if(S(a,o)){const r=me(a,o,n);r>0&&i.push(`📈 AI ${O[a]} 优势区加成：${l}伤害+${r}`)}return i}function sn(e,n,t,a,o,i,c){if(n===s.DEFLECT)t===s.SLASH?(e.push(`${c}卸力 vs 重击 → <strong>卸力反制成功！</strong>重击方受2伤+2架势+僵直`),a==="sword"&&e.push("（⚔️ 剑的卸力：不造成僵直，改为自身-2架势）")):t===s.THRUST?e.push(`${c}卸力 vs 轻击 → <strong>卸力失败</strong>（轻击穿透卸力），卸力方受轻击伤害+1架势`):t===s.FEINT?e.push(`${c}卸力 vs 擒拿 → <strong>卸力识破！</strong>擒拿方+2架势`):t===s.BLOCK&&e.push(`${c}卸力 vs 格挡 → <strong>卸力落空</strong>，卸力方+1架势`);else if(n===s.SLASH){const l=we[s.SLASH].damage,r=me(a,i,s.SLASH),u=Math.max(0,l+r),m=r<0?`（势区惩罚${r}，实际${u}伤）`:"";if(t===s.THRUST)e.push(`${c}重击 vs 轻击 → <strong>重击克制轻击！</strong>轻击方受${u}伤+1架势${m}`);else if(t===s.BLOCK){const d=Rt(o,i);if(Je(o,i))e.push(`${c}重击 vs 格挡 → <strong>完美格挡！</strong>格挡方完全免伤${m}`);else{const p=Math.max(0,u-d);e.push(`${c}重击 vs 格挡 → <strong>重击破格挡</strong>，格挡方减免${d}伤后受${p}伤+1架势${m}`)}}else t===s.FEINT&&e.push(`${c}重击 vs 擒拿 → <strong>重击命中！</strong>擒拿方受${u}伤+1架势${m}`)}else if(n===s.THRUST){const l=we[s.THRUST].damage,r=me(a,i,s.THRUST),u=Math.max(0,l+r),m=r!==0?`（距离修正${r>0?"+":""}${r}，实际${u}伤）`:"";t===s.BLOCK?e.push(`${c}轻击 vs 格挡 → <strong>格挡完全抵消</strong>轻击，无伤害`):t===s.FEINT&&e.push(`${c}轻击 vs 擒拿 → <strong>轻击命中！</strong>擒拿方受${u}伤+1架势${m}`)}else n===s.BLOCK&&t===s.FEINT&&e.push(`${c}格挡 vs 擒拿 → <strong>格挡被擒拿骗</strong>，格挡方+3架势`)}function wn(){return`
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
  `}function Dn(){return`
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
    ${ma()}

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
    ${ga()}

    <h4>📉 距离对伤害的影响</h4>
    <ul>
      <li>在<strong>劣势区</strong>攻击会受到伤害惩罚，卡牌显示为"虚线框" + "⚠ 距离不佳"</li>
      <li>伤害惩罚严重时（-3），基础伤害会降为0，等于空招</li>
      <li>所有卡牌始终可用，但要注意距离对效果的影响</li>
    </ul>
  `}function ma(){return`
    <table class="rules-matrix">
      <tr><th>我方＼对手</th><th>🤺卸力</th><th>⚡重击</th><th>🎯轻击</th><th>🛡️格挡</th><th>🌀擒拿</th></tr>
      <tr><td><strong>🤺卸力</strong></td><td>各+2架势</td><td class="rule-win">反制！对手受2伤+2架势+僵直</td><td class="rule-lose">被刺穿：受轻击伤+1架势</td><td class="rule-lose">浪费：自身+1架势</td><td class="rule-win">识破！对手+2架势</td></tr>
      <tr><td><strong>⚡重击</strong></td><td class="rule-lose">被反制！受2伤+2架势+僵直</td><td>互砍各受伤</td><td class="rule-win">命中！对手受3伤+1架势</td><td class="rule-win">破防！减1伤后命中</td><td class="rule-win">命中！对手受3伤+1架势</td></tr>
      <tr><td><strong>🎯轻击</strong></td><td class="rule-win">穿透！对手受1伤+1架势</td><td class="rule-lose">被克：受3伤+1架势</td><td>互刺各受伤</td><td class="rule-lose">被挡：完全抵消</td><td class="rule-win">命中！对手受1伤+1架势</td></tr>
      <tr><td><strong>🛡️格挡</strong></td><td>空过(对手+1架势)</td><td class="rule-lose">被破：受减伤后伤害+1架势</td><td class="rule-win">格挡：完全抵消</td><td>空过</td><td class="rule-lose">被骗：自身+3架势</td></tr>
      <tr><td><strong>🌀擒拿</strong></td><td class="rule-lose">被识破：自身+2架势</td><td class="rule-lose">被砍：受3伤+1架势</td><td class="rule-lose">被刺：受1伤+1架势</td><td class="rule-win">骗到：对手+3架势</td><td>空过</td></tr>
    </table>
  `}function ga(){return`
    <table class="rules-matrix">
      <tr><th>兵器</th><th>优势区</th><th>劣势区</th><th>核心特点</th></tr>
      <tr><td>🗡️ 短刀</td><td>0, 1</td><td>2, 3</td><td>优势区轻击破闪避、闪避反击1伤、远距重击几乎无伤</td></tr>
      <tr><td>🔱 长枪</td><td>2, 3</td><td>0</td><td>重击+2伤、重击额外+1架势、格挡弹枪推1距、贴身重击几乎无伤</td></tr>
      <tr><td>⚔️ 剑</td><td>1, 2</td><td>0, 3</td><td>卸力不僵直/自身-2架势、完美格挡(重击免伤)、贴身远距重击削弱</td></tr>
      <tr><td>🏏 棍</td><td>1, 2, 3</td><td>0</td><td>擒拿+3架势+推距、重击额外+2架势、格挡震退+1架势、贴身重击几乎无伤</td></tr>
      <tr><td>🪓 大刀</td><td>2</td><td>0</td><td>重击+3伤(全场最高)+推1距、格挡额外减伤、贴身重击几乎无伤</td></tr>
      <tr><td>🥢 双刺</td><td>0</td><td>2, 3</td><td>贴身轻击追击+1伤、闪避+2架势、贴身命中+1架势</td></tr>
    </table>
  `}const j={[s.DEFLECT]:{emoji:"🤺",type:"防",desc:"反制重击+识破擒拿，克重击/擒拿"},[s.SLASH]:{emoji:"⚡",type:"攻",desc:"3伤+1架势，高威力"},[s.THRUST]:{emoji:"🎯",type:"攻",desc:"1伤+1架势，快速打击"},[s.BLOCK]:{emoji:"🛡️",type:"防",desc:"减免攻击伤害"},[s.FEINT]:{emoji:"🌀",type:"攻",desc:"0伤+3架势，克格挡/闪避，被卸力识破"}},nt={[v.ADVANCE]:{emoji:"⬆️",desc:"冲步：间距-1"},[v.RETREAT]:{emoji:"⬇️",desc:"撤步：间距+1"},[v.HOLD]:{emoji:"⏸️",desc:"不变"},[v.DODGE]:{emoji:"💨",desc:"闪避(耗2体力，短刀/双刺耗1)：闪开重击/轻击，无法躲擒拿"}},ue={0:{player:42,ai:58},1:{player:35,ai:65},2:{player:24,ai:76},3:{player:12,ai:88}},D=(e,n)=>({cat:e,text:n}),In={[b.SHORT_BLADE]:{style:"近身刺客",traits:[D("core","优势区闪避反击1伤"),D("core","闪避仅耗1体力"),D("buff","优势区擒拿+4架势"),D("weak","远距(3)重击无伤")]},[b.SPEAR]:{style:"中远控距",traits:[D("core","优势区格挡弹枪→推距+1"),D("buff","优势区重击5伤，额外+1架势"),D("weak","贴身(0)重击无伤")]},[b.SWORD]:{style:"均衡防反",traits:[D("core","卸力不僵直，自身回2架势"),D("core","优势区格挡完全免重击"),D("weak","贴身重击仅1伤，远距重击无伤")]},[b.STAFF]:{style:"广域压制",traits:[D("core","优势区擒拿命中格挡→推距+1"),D("core","优势区格挡给对手+1架势"),D("buff","优势区擒拿+4架势 / 重击+2架势"),D("weak","贴身(0)重击无伤")]},[b.GREAT_BLADE]:{style:"重击爆发",traits:[D("core","优势区重击命中→推距+1"),D("core","优势区格挡减2伤(常规1)"),D("buff","优势区重击6伤(全场最高)"),D("weak","贴身(0)重击无伤")]},[b.DUAL_STAB]:{style:"贴身缠斗",traits:[D("core","闪避成功→对手+2架势"),D("core","闪避仅耗1体力"),D("buff","贴身：轻击3伤(追击) / 擒拿+4架势"),D("weak","中远距(2-3)重击无伤")]}},ha={core:{label:"特",cls:"wz-cat-core"},buff:{label:"强",cls:"wz-cat-buff"},weak:{label:"弱",cls:"wz-cat-weak"}},on=["core","buff","weak"],va={[b.SHORT_BLADE]:[{name:"贴身步",emoji:"👣",desc:"间距-1，贴身区额外减体力消耗"}],[b.SPEAR]:[{name:"撑杆退",emoji:"🔱",desc:"间距+1，阻止对手下回合靠近超过1格"}],[b.SWORD]:[{name:"游身换位",emoji:"🌊",desc:"间距不变，获得下回合优先结算权"}],[b.STAFF]:[{name:"拨草寻蛇",emoji:"🐍",desc:"间距+1，并给对手+1架势"}],[b.GREAT_BLADE]:[{name:"沉肩带步",emoji:"🏋️",desc:"间距-1，下回合重击消耗-1"}],[b.DUAL_STAB]:[{name:"蛇行缠步",emoji:"🥢",desc:"间距-2，消耗2体力"}]};function ba(e){return(va[e]||[]).map(t=>`
    <div class="dist-card disabled weapon-skill-card" title="${t.desc}（未开发）">
      <span class="dc-emoji">${t.emoji}</span>
      <span class="dc-name">${t.name}</span>
      <span class="dc-cost">🔒</span>
    </div>
  `).join("")}function x(e,n=null){const t=P[e],a=In[e],o=[0,1,2,3].map(l=>{const r=t.advantage.includes(l),u=t.disadvantage.includes(l),m=l===n;let d="wz-cell";r?d+=" wz-adv":u?d+=" wz-dis":d+=" wz-neutral",m&&(d+=" wz-current");const p=r?"★":u?"✗":"·";return`<div class="${d}">
      <div class="wz-dist-name">${ie[l]}</div>
      <div class="wz-marker">${p}</div>
      ${m?'<div class="wz-here">▲</div>':""}
    </div>`}).join(""),c=(a?[...a.traits].sort((l,r)=>on.indexOf(l.cat)-on.indexOf(r.cat)):[]).map(l=>{const r=ha[l.cat];return`<span class="wz-trait ${r.cls}"><span class="wz-cat-label">${r.label}</span>${l.text}</span>`}).join("");return`
    <div class="wz-strip">
      <div class="wz-header">${B[e]} ${O[e]} · ${(a==null?void 0:a.style)||""}</div>
      <div class="wz-bar">${o}</div>
      ${c?`<div class="wz-traits">${c}</div>`:""}
    </div>
  `}function ya(e,n=!1){const t=In[e];return`
    <div class="weapon-pick-btn ${n?"selected":""}" data-weapon="${e}">
      <span class="wpb-emoji">${B[e]}</span>
      <span class="wpb-name">${O[e]}</span>
      <span class="wpb-style">${(t==null?void 0:t.style)||""}</span>
    </div>
  `}let Se=null,fe=null,$e=.5,at=!1;function he(){return Se||(Se=new(window.AudioContext||window.webkitAudioContext),fe=Se.createGain(),fe.gain.value=$e,fe.connect(Se.destination)),Se.state==="suspended"&&Se.resume(),Se}function xe(){return he(),fe}function Aa(e){$e=Math.max(0,Math.min(1,e)),fe&&(fe.gain.value=at?0:$e);try{localStorage.setItem("lbq_sfxVol",$e)}catch{}}function Ea(){return $e}function Ta(e){at=e,fe&&(fe.gain.value=at?0:$e);try{localStorage.setItem("lbq_muted",e?"1":"0")}catch{}}function Mt(){return at}try{const e=localStorage.getItem("lbq_sfxVol");e!==null&&($e=parseFloat(e)),localStorage.getItem("lbq_muted")==="1"&&(at=!0)}catch{}function U(e,n,t,a,o,i){const c=he(),l=e*c.sampleRate,r=c.createBuffer(1,l,c.sampleRate),u=r.getChannelData(0);for(let g=0;g<l;g++)u[g]=Math.random()*2-1;const m=c.createBufferSource();m.buffer=r;const d=c.createBiquadFilter();d.type=t||"lowpass",d.frequency.value=n||2e3;const p=c.createGain(),f=c.currentTime;p.gain.setValueAtTime(0,f),p.gain.linearRampToValueAtTime(a||.3,f+(o||.01)),p.gain.linearRampToValueAtTime(0,f+e),m.connect(d),d.connect(p),p.connect(xe()),m.start(f),m.stop(f+e)}function w(e,n,t,a,o,i){const c=he(),l=c.createOscillator();l.type=t||"sine",l.frequency.value=e;const r=c.createGain(),u=c.currentTime;r.gain.setValueAtTime(0,u),r.gain.linearRampToValueAtTime(a||.3,u+(o||.01)),r.gain.linearRampToValueAtTime(0,u+n),l.connect(r),r.connect(xe()),l.start(u),l.stop(u+n)}function De(e,n,t){const a=he();let i=a.currentTime;for(const[c,l]of e){const r=a.createOscillator();r.type=n||"sine",r.frequency.value=c;const u=a.createGain();u.gain.setValueAtTime(0,i),u.gain.linearRampToValueAtTime(t||.25,i+.01),u.gain.linearRampToValueAtTime(0,i+l),r.connect(u),u.connect(xe()),r.start(i),r.stop(i+l),i+=l*.85}}function We(){w(800,.08,"sine",.15,.005)}function ln(){w(600,.06,"square",.1,.005),w(900,.08,"sine",.12,.02)}function cn(){w(500,.06,"sine",.08,.005)}function Ca(){De([[520,.08],[780,.12]],"sine",.2)}function Sa(){De([[400,.1],[300,.15]],"triangle",.15)}function $a(){U(.25,3e3,"bandpass",.35,.005),w(150,.15,"sawtooth",.2,.005)}function La(){U(.12,5e3,"highpass",.25,.005),w(400,.08,"square",.15,.005)}function wa(){w(200,.2,"triangle",.25,.005),U(.1,1500,"lowpass",.2,.005)}function Da(){const e=he(),n=e.createOscillator();n.type="sawtooth";const t=e.currentTime;n.frequency.setValueAtTime(800,t),n.frequency.linearRampToValueAtTime(200,t+.2);const a=e.createGain();a.gain.setValueAtTime(0,t),a.gain.linearRampToValueAtTime(.2,t+.02),a.gain.linearRampToValueAtTime(0,t+.25),n.connect(a),a.connect(xe()),n.start(t),n.stop(t+.25),U(.15,4e3,"highpass",.15,.01)}function Ia(){w(300,.1,"square",.12,.005),U(.08,2e3,"lowpass",.15,.01)}function rn(){const e=he(),n=e.createOscillator();n.type="sine";const t=e.currentTime;n.frequency.setValueAtTime(300,t),n.frequency.linearRampToValueAtTime(800,t+.1),n.frequency.linearRampToValueAtTime(200,t+.3);const a=e.createGain();a.gain.setValueAtTime(0,t),a.gain.linearRampToValueAtTime(.15,t+.05),a.gain.linearRampToValueAtTime(0,t+.3),n.connect(a),a.connect(xe()),n.start(t),n.stop(t+.3),U(.2,6e3,"highpass",.1,.02)}function Oa(){w(250,.08,"square",.3,.002),w(500,.12,"sawtooth",.2,.005),U(.18,3500,"bandpass",.3,.005)}function dn(){U(.15,800,"lowpass",.35,.005),w(100,.12,"sine",.25,.005)}function un(){U(.3,600,"lowpass",.4,.005),w(80,.3,"sawtooth",.3,.005),setTimeout(()=>{w(60,.4,"sine",.25,.01),U(.2,2e3,"bandpass",.25,.02)},150)}function Ha(){const e=he(),n=e.createOscillator();n.type="sawtooth";const t=e.currentTime;n.frequency.setValueAtTime(150,t),n.frequency.linearRampToValueAtTime(80,t+.3);const a=e.createGain();a.gain.setValueAtTime(0,t),a.gain.linearRampToValueAtTime(.2,t+.02),a.gain.linearRampToValueAtTime(0,t+.35),n.connect(a),a.connect(xe()),n.start(t),n.stop(t+.35)}function Ra(){U(.2,1200,"lowpass",.25,.005),w(200,.15,"triangle",.15,.01)}function pn(){U(.1,3e3,"lowpass",.15,.005),w(250,.06,"sine",.1,.005)}function fn(){U(.12,2e3,"lowpass",.12,.005),w(180,.08,"sine",.08,.005)}function mn(){U(.06,1500,"lowpass",.08,.005)}function Na(){w(120,.15,"triangle",.2,.005),U(.1,800,"lowpass",.15,.02)}function _t(){De([[523,.15],[659,.15],[784,.15],[1047,.3]],"triangle",.25),setTimeout(()=>{De([[784,.12],[1047,.25]],"sine",.15)},200)}function On(){De([[400,.2],[350,.2],[300,.25],[200,.4]],"triangle",.2)}function Ma(){De([[600,.1],[800,.1],[1e3,.2]],"sine",.2)}function Ba(){De([[300,.25],[250,.25],[200,.3],[150,.5]],"sawtooth",.15)}function Hn(){U(.15,5e3,"highpass",.2,.005),setTimeout(()=>{w(400,.1,"sawtooth",.15,.005),w(600,.15,"sine",.12,.02)},80)}function gn(){w(500,.08,"sine",.08,.005),w(700,.1,"sine",.06,.03)}function hn(){w(350,.1,"triangle",.12,.005)}function vn(){w(600,.08,"sine",.08,.005),w(800,.1,"sine",.06,.02)}const Fa={slash:$a,thrust:La,block:wa,deflect:Da,feint:Ia};function ka(e){const n=Fa[e];n&&n()}function yt(){he(),document.removeEventListener("click",yt),document.removeEventListener("keydown",yt)}document.addEventListener("click",yt);document.addEventListener("keydown",yt);function _a(e,n,t,a,o){const i=a.spectator,c=i?Ja(n,a):Ua(n,t),l=`
    <div class="game-wrapper">
      ${Pa(n,a)}
      <div class="game-layout">
        ${c}
        ${Ga(n,a)}
        ${Wa(n,i)}
      </div>
      ${ns()}
    </div>
    ${as()}
    ${ss()}
  `;e.innerHTML=l,os(n,t,a,o)}function Pa(e,n){const t=`<button class="ctrl-btn" data-action="togglemute">${Mt()?"🔇":"🔊"}</button>`,a=`<input type="range" class="vol-slider" data-action="volume" min="0" max="100" value="${Math.round(Ea()*100)}" title="音量">`;return n.spectator?`
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
  `}function Ua(e,n){var r;const t=e.player,a=e.distance,o=t.staggered?'<span class="stagger-badge">⚠ 僵直</span>':"",i=Tt(t,a),c=n.distanceCard?((r=N[n.distanceCard])==null?void 0:r.cost)??0:0,l=it(t,a,c);return`
    <div class="side-panel player-side">
      <div class="panel-header">
        <span class="panel-icon">👤</span>
        <span class="panel-name">玩家 ${o}</span>
        <span class="weapon-badge">${B[t.weapon]||""} ${O[t.weapon]}</span>
      </div>
      ${Pt(t)}
      ${x(t.weapon,e.distance)}
      <div class="divider"></div>
      <div class="card-sel-title">🃏 选择出牌</div>
      <div class="card-group-label">身法卡（必选）</div>
      <div class="cards-row">
        ${ja(e,n,t,i)}
      </div>
      <div class="card-group-label weapon-skill-label">🔒 兵器专属身法 <span class="dev-tag">未开发</span></div>
      <div class="cards-row weapon-skills-row">
        ${ba(e.player.weapon)}
      </div>
      <div class="card-group-label">攻防卡（必选）</div>
      <div class="cards-grid compact">
        ${Ka(e,n,t,l)}
      </div>
      <button class="btn-confirm" id="btn-confirm"
        ${!n.distanceCard||!n.combatCard?"disabled":""}>
        确认出牌
      </button>
    </div>
  `}function Pt(e,n){const t=I.MAX_HP,a=I.MAX_STANCE,o=I.MAX_STAMINA;return`
    ${It("❤️ 气血","hp",e.hp,t)}
    ${It("💨 体力","stamina",e.stamina,o,!1)}
    ${It("⚡ 架势","stance",e.stance,a,e.stance>=4)}
  `}function It(e,n,t,a,o){const i=Math.max(0,t/a*100);return`
    <div class="stat-row" data-stat="${n}">
      <span class="stat-label">${e}</span>
      <div class="stat-bar-wrap">
        <div class="stat-bar ${n}${o?" danger":""}" data-max="${a}" style="width: ${i}%"></div>
      </div>
      <span class="stat-value">${t}/${a}</span>
    </div>
  `}function ja(e,n,t,a){const o=e.player;return e.distance,[v.ADVANCE,v.RETREAT,v.HOLD,v.DODGE].map(c=>{var f;const l=a.includes(c),r=n.distanceCard===c,u=nt[c];let m=((f=N[c])==null?void 0:f.cost)??0;c===v.DODGE&&o.weapon&&(m=Math.max(0,m-vt(o.weapon)));const d=[u.desc];m>0&&d.push(`耗${m}体力`),!l&&m>0&&o.stamina<m&&d.push(`⛔ 体力不足（需要${m}）`);const p=d.join(`
`);return`
      <div class="dist-card ${r?"selected":""} ${l?"":"disabled"}"
           data-type="distance" data-card="${c}" title="${p}">
        <span class="dc-emoji">${u.emoji}</span>
        <span class="dc-name">${te[c]}</span>
        ${m>0?`<span class="dc-cost">${m}体</span>`:""}
      </div>
    `}).join("")}function xa(e,n,t,a,o,i){return a&&Le[e]===Z.ATTACK?"⛔ 僵直中，无法使用攻击":""}function Ka(e,n,t,a){var c;const o=e.player,i=e.distance;return n.distanceCard&&((c=N[n.distanceCard])==null||c.cost),Object.values(s).map(l=>{const r=a.includes(l),u=n.combatCard===l,m=j[l],d=we[l],p=m.type==="攻"?"atk":"def",f=[m.desc],g=me(o.weapon,i,l);g>0&&f.push(`📈 优势区加成：伤害+${g}`),g<0&&g>=-2&&f.push(`📉 劣势区减益：伤害${g}`),g<=-3&&f.push(`⚠️ 距离不佳：伤害${g}，几乎无效`),r||f.push(xa(l,o.weapon,i,o.staggered,o.stamina));const y=f.join(`
`),h=g<=-3&&d.damage>0?"cc-weak":"";return`
      <div class="combat-card ${u?"selected":""} ${r?"":"disabled"} ${h}"
           data-type="combat" data-card="${l}" title="${y}">
        <div class="cc-top">
          <span class="cc-emoji">${m.emoji}</span>
          <span class="cc-name">${k[l]}</span>
          <span class="cc-type ${p}">${m.type}</span>
        </div>
        <div class="cc-desc">${m.desc}</div>
        <div class="cc-footer">
          <span>伤${d.damage}</span>
          <span>P${d.priority}</span>
          ${g!==0?`<span class="cc-mod ${g>0?"buff":"nerf"}">${g>0?"+":""}${g}伤</span>`:""}
        </div>
        ${h?'<div class="cc-weak-tag">⚠ 距离不佳</div>':""}
      </div>
    `}).join("")}function Ga(e,n){const t=n.spectator;return`
    <div class="center-area">
      ${n.isPaused?'<div class="paused-banner">⏸ 已暂停 — 点击「继续」恢复</div>':""}
      ${t?"":Va(e)}
      <div class="arena-wrapper">
        ${za(e,t)}
        ${Xa(e,t)}
      </div>
      ${qa(e,t)}
      ${Za(e)}
    </div>
  `}function Va(e){const n=e.player,t=e.ai,a=e.distance,o=P[n.weapon],i=P[t.weapon],c=o.advantage.includes(a),l=i.advantage.includes(a),r=o.disadvantage.includes(a),u=[];c&&!l?u.push("✅ 你在优势间距！攻击伤害加成"):l&&!c?u.push("⚠️ 对手在优势间距！考虑用身法调整间距"):c&&l?u.push("⚔️ 双方都在优势区，正面较量！"):r&&u.push("❌ 你在劣势区，攻击受削弱！"),n.stance>=4?u.push("🔴 你架势快满了！被攻击可能触发处决(-5血)"):t.stance>=4&&u.push("🟢 对手架势快满了！攻击/擒拿可触发处决"),n.stamina<=1?u.push("🔋 体力不足！只能扎马，无法进退"):t.stamina<=1&&u.push("🎯 对手体力不足！无法移动，趁机调整间距"),n.staggered&&u.push("😵 僵直中！本回合无法使用攻击卡"),t.staggered&&u.push("💥 对手僵直！无法使用攻击卡，进攻好时机"),u.length===0&&u.push("💡 选择1张身法卡 + 1张攻防卡，点确认出牌");const m=pa(n.weapon,a),d=m.length>0?`<div class="trait-tags">${m.map(p=>`<span class="trait-tag ${p.cls}">${p.icon} ${p.text}</span>`).join("")}</div>`:"";return`<div class="situation-hint">${u.join('<span class="hint-sep">|</span>')}</div>${d}`}function qa(e,n=!1){const t=P[e.player.weapon],a=P[e.ai.weapon],o=e.distance,i=n?"🤖左":"👤",c=n?"🤖右":"🤖",l=(r,u)=>{const m=[0,1,2,3].map(d=>{const p=u.advantage.includes(d),f=u.disadvantage.includes(d),g=d===o;let y="azr-cell";return p?y+=" azr-adv":f&&(y+=" azr-dis"),g&&(y+=" azr-current"),`<span class="${y}">${p?"★":f?"✗":""}${ie[d]}</span>`}).join("");return`<div class="azr-row"><span class="azr-label">${r}</span>${m}</div>`};return`
    <div class="arena-zone-ribbon">
      ${l(i,t)}
      ${l(c,a)}
    </div>
  `}function za(e,n=!1){const t=I.MAX_HP,a=I.MAX_STANCE,o=ue[e.distance]||ue[2],i=(e.player.hp/t*100).toFixed(0),c=(e.ai.hp/t*100).toFixed(0),l=(e.player.stance/a*100).toFixed(0),r=(e.ai.stance/a*100).toFixed(0),u=o.player,m=o.ai-o.player,d=n?"左方":"玩家",p=e.aiName||(n?"右方":"AI"),f=e.player.staggered?"😵":n?"🤖":"🧑",g=e.ai.staggered?"😵":e.aiName?"👤":"🤖";return`
    <div class="battle-arena">
      <div class="arena-title">⚔️ 战斗场景</div>
      <div class="arena-stage dist-${e.distance}" id="arena-stage" style="--arena-cam:${e.distance}">
        <div class="arena-parallax-far"></div>
        <div class="arena-parallax-mid"></div>
        <div class="arena-dist-label">${ie[e.distance]}</div>
        <div class="arena-dist-line" style="left:${u}%;width:${m}%"></div>
        <div class="fighter player-fighter" id="player-fighter" style="left:${o.player}%">
          <div class="fighter-weapon-icon">${B[e.player.weapon]||"🗡️"}</div>
          <div class="fighter-body">${f}</div>
          <div class="fighter-label">${d}</div>
          <div class="mini-bars">
            <div class="mini-bar"><div class="mini-bar-fill hp-p" style="width:${i}%"></div></div>
            <div class="mini-bar"><div class="mini-bar-fill stance-f" style="width:${l}%"></div></div>
          </div>
        </div>
        <div class="fighter ai-fighter" id="ai-fighter" style="left:${o.ai}%">
          <div class="fighter-weapon-icon">${B[e.ai.weapon]||"🔱"}</div>
          <div class="fighter-body">${g}</div>
          <div class="fighter-label">${p}</div>
          <div class="mini-bars">
            <div class="mini-bar"><div class="mini-bar-fill hp-a" style="width:${c}%"></div></div>
            <div class="mini-bar"><div class="mini-bar-fill stance-f" style="width:${r}%"></div></div>
          </div>
        </div>
      </div>
    </div>
  `}function Xa(e,n=!1){if(e.history.length===0)return`<div class="round-result-banner">${n?"等待开战...":"等待出牌..."}</div>`;const t=e.history[e.history.length-1],a=te[t.playerDistance],o=k[t.playerCombat],i=te[t.aiDistance],c=k[t.aiCombat],l=j[t.playerCombat]?j[t.playerCombat].emoji:"",r=j[t.aiCombat]?j[t.aiCombat].emoji:"",u=n?"🤖":"👤";return`
    <div class="round-result-banner">
      <span class="rrb-label">第${e.round}回合</span>
      <span class="rrb-player">${u} ${a}+${l}${o}</span>
      <span class="rrb-vs">VS</span>
      <span class="rrb-ai">🤖 ${i}+${r}${c}</span>
    </div>
  `}function Za(e){return`
    <div class="battle-log" id="battle-log">
      <div class="log-title">📜 战斗日志</div>
      ${e.log.map(t=>{let a="log-line";return(t.includes("处决")||t.includes("伤"))&&(a+=" damage"),t.includes("══")&&(a+=" highlight"),(t.includes("闪避成功")||t.includes("格挡"))&&(a+=" good"),`<div class="${a}">${t}</div>`}).join("")||'<div class="log-line">等待对局开始...</div>'}
    </div>
  `}function Ja(e,n){const t=e.player;return`
    <div class="side-panel player-side">
      <div class="panel-header">
        <span class="panel-icon">🤖</span>
        <span class="panel-name">左方 ${t.staggered?'<span class="stagger-badge">⚠ 僵直</span>':""}</span>
        <span class="weapon-badge">${B[t.weapon]||""} ${O[t.weapon]}</span>
      </div>
      ${Pt(t)}
      ${x(t.weapon,e.distance)}
      <div class="divider"></div>
      ${Ya(e)}
      <div class="divider"></div>
      ${Qa(n)}
    </div>
  `}function Ya(e){if(e.history.length===0)return`
      <div class="ai-last-action">
        <div class="ala-title">🀴 左方上回合</div>
        <div class="ala-waiting">等待第一回合...</div>
      </div>
    `;const n=e.history[e.history.length-1],t=nt[n.playerDistance],a=j[n.playerCombat];return`
    <div class="ai-last-action">
      <div class="ala-title">🀴 左方上回合</div>
      <div class="ala-cards">
        <div class="ala-card">${t.emoji} ${te[n.playerDistance]}</div>
        <div class="ala-card">${a.emoji} ${k[n.playerCombat]} <span class="cc-type ${a.type==="攻"?"atk":"def"}">${a.type}</span></div>
      </div>
    </div>
  `}function Qa(e){return`
    <div class="speed-controls">
      <div class="speed-title">⏩ 播放速度</div>
      <div class="speed-btns">
        ${[{label:"慢速",value:2e3},{label:"正常",value:800},{label:"快速",value:100},{label:"极速",value:0}].map(t=>`<button class="speed-btn ${e.autoPlaySpeed===t.value?"active":""}" data-speed="${t.value}">${t.label}</button>`).join("")}
      </div>
    </div>
  `}function Wa(e,n=!1){const t=e.ai,a=t.staggered?'<span class="stagger-badge">⚠ 僵直</span>':"",o=e.aiName?"👤":"🤖",i=e.aiName||(n?"右方":"AI"),c=n?"🀴 右方上回合出牌":"🀴 AI上回合出牌";return`
    <div class="side-panel ai-side">
      <div class="panel-header">
        <span class="panel-icon">${o}</span>
        <span class="panel-name">${i} ${a}</span>
        <span class="weapon-badge">${B[t.weapon]||""} ${O[t.weapon]}</span>
      </div>
      ${Pt(t)}
      ${x(t.weapon,e.distance)}
      <div class="divider"></div>
      ${es(e,c)}
      <div class="divider"></div>
      ${ts(e,n)}
    </div>
  `}function es(e,n){const t=n;if(e.history.length===0)return`
      <div class="ai-last-action">
        <div class="ala-title">${t}</div>
        <div class="ala-waiting">等待第一回合...</div>
      </div>
    `;const a=e.history[e.history.length-1],o=nt[a.aiDistance],i=j[a.aiCombat];return`
    <div class="ai-last-action">
      <div class="ala-title">${t}</div>
      <div class="ala-cards">
        <div class="ala-card">${o.emoji} ${te[a.aiDistance]}</div>
        <div class="ala-card">${i.emoji} ${k[a.aiCombat]} <span class="cc-type ${i.type==="攻"?"atk":"def"}">${i.type}</span></div>
      </div>
    </div>
  `}function ts(e,n=!1){const t=n?"🤖左":"👤",a=n?"🤖右":"🤖";return`
    <div class="history-section">
      <div class="history-title">📜 历史记录 <span class="history-hint">点击回合查看详情</span></div>
      <div class="history-list" id="history-list">
        ${e.history.map((i,c)=>{const l=te[i.playerDistance],r=k[i.playerCombat],u=te[i.aiDistance],m=k[i.aiCombat],d=j[i.playerCombat]?j[i.playerCombat].emoji:"",p=j[i.aiCombat]?j[i.aiCombat].emoji:"",f=i.pMoveInterrupted?" 🔙":"",g=i.aMoveInterrupted?" 🔙":"";return`
      <div class="history-item history-clickable" data-round-idx="${c}" title="点击查看本回合详细解释">
        <div class="h-round">回合 ${c+1} <span class="h-explain-hint">🔍</span></div>
        <div class="h-player">${t} ${l} + ${d} ${r}${f}</div>
        <div class="h-ai">${a} ${u} + ${p} ${m}${g}</div>
      </div>
    `}).reverse().join("")||'<div class="history-item"><div class="h-detail">暂无记录</div></div>'}
      </div>
    </div>
  `}function ns(){return`
    <div class="bottom-bar">
      <div class="rule-summary">
        <span>身法控距</span>为第一核心 |
        <span>双向架势</span>为胜负根基 |
        <span>攻防预判</span>为博弈循环
      </div>
      <button class="btn-rules" data-action="rules">📖 完整规则</button>
    </div>
  `}function as(){return`
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
          ${wn()}
        </div>

        <!-- Tab: 完整规则 -->
        <div class="modal-content-text tab-content" id="tab-rules">
          ${Dn()}
        </div>
      </div>
    </div>
  `}function ss(){return`
    <div class="modal-overlay" id="modal-round-detail">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title" id="round-detail-title">🔍 回合详情</div>
          <button class="modal-close" data-close="round-detail">关闭</button>
        </div>
        <div class="modal-content-text" id="round-detail-content"></div>
      </div>
    </div>
  `}function bn(e,n,t,a,o,i,c){const l=e==="player"?"玩家":"AI",r=i[n];if(n===s.BLOCK||n===s.DEFLECT)return`${l}出 <strong>${r}</strong>：<span style="color:#aaa">防守落空（无攻击可接）</span>`;if(n===s.SLASH){const u=we[s.SLASH].damage,m=me(t,o,s.SLASH),d=Math.max(0,u+m);return`${l}出 <strong>${r}</strong> 命中（对手无防守）：对手受 <strong>${d} 伤 +1 架势</strong>`}if(n===s.THRUST){const u=we[s.THRUST].damage,m=me(t,o,s.THRUST),d=Math.max(0,u+m);return`${l}出 <strong>${r}</strong> 命中（对手无防守）：对手受 <strong>${d} 伤 +1 架势</strong>`}return n===s.FEINT?`${l}出 <strong>${r}</strong>（对手无防守）：对手 <strong>+2 架势</strong>`:`${l}出 <strong>${r}</strong>`}function is(e,n){var Ge,ct,Ve,Y,qe,Ae,ze,ce;const t=e.history[n];if(!t)return;const a=te[t.playerDistance],o=k[t.playerCombat],i=te[t.aiDistance],c=k[t.aiCombat],l=((Ge=j[t.playerCombat])==null?void 0:Ge.emoji)||"",r=((ct=j[t.aiCombat])==null?void 0:ct.emoji)||"",u=e.player.weapon,m=e.ai.weapon;let d=I.INITIAL_DISTANCE??2;for(let Q=0;Q<n;Q++){const q=e.history[Q],Re=((Ve=N[q.playerDistance])==null?void 0:Ve.delta)??0,Ne=((Y=N[q.aiDistance])==null?void 0:Y.delta)??0;d=Math.max(0,Math.min(3,d+Re+Ne)),q.pMoveInterrupted&&(d=Math.max(0,Math.min(3,d-Re))),q.aMoveInterrupted&&(d=Math.max(0,Math.min(3,d-Ne)))}const p=d,f=((qe=N[t.playerDistance])==null?void 0:qe.delta)??0,g=((Ae=N[t.aiDistance])==null?void 0:Ae.delta)??0,y=Math.max(0,Math.min(3,p+f+g));let h=y;t.pMoveInterrupted&&(h=Math.max(0,Math.min(3,h-f))),t.aMoveInterrupted&&(h=Math.max(0,Math.min(3,h-g)));const $=(ze=P[u])==null?void 0:ze.advantage.includes(y),C=(ce=P[m])==null?void 0:ce.advantage.includes(y),A=[];if(A.push(`<h4>📋 第 ${n+1} 回合概要</h4>`),A.push('<div class="rd-cards">'),A.push(`<div class="rd-card-row"><span class="rd-p">👤 玩家：</span>${a} + ${l} ${o}（${B[u]} ${O[u]}）</div>`),A.push(`<div class="rd-card-row"><span class="rd-a">🤖 AI：</span>${i} + ${r} ${c}（${B[m]} ${O[m]}）</div>`),A.push("</div>"),A.push("<h4>① 身法结算</h4>"),A.push("<ul>"),A.push(`<li>回合前间距：<strong>${ie[p]}(${p})</strong></li>`),f!==0||g!==0)A.push(`<li>玩家${a}(${f>0?"+":""}${f}) + AI${i}(${g>0?"+":""}${g})</li>`),A.push(`<li>移动后间距：<strong>${ie[y]}(${y})</strong></li>`);else if(t.playerDistance==="dodge"||t.aiDistance==="dodge"){const Q=t.playerDistance==="dodge"?"闪避":"扎马",q=t.aiDistance==="dodge"?"闪避":"扎马";A.push(`<li>玩家${Q} + AI${q}，间距不变</li>`)}else A.push("<li>双方扎马，间距不变</li>");$&&A.push(`<li>✅ 玩家 ${O[u]} 在优势区</li>`),C&&A.push(`<li>⚠️ AI ${O[m]} 在优势区</li>`),A.push("</ul>"),A.push("<h4>② 攻防结算</h4>"),A.push("<ul>");const le=t.playerDistance===v.DODGE,Lt=t.aiDistance===v.DODGE;let ae=t.playerCombat,se=t.aiCombat;const ve=Q=>Le[Q]===Z.ATTACK;le&&(t.aiCombat===s.FEINT?A.push("<li>🎭 <strong>AI擒拿穿透闪避！</strong>玩家闪避落空，攻防正常结算</li>"):ve(t.aiCombat)?t.aiCombat===s.THRUST&&bt(m,y)?(A.push("<li>⚡ <strong>玩家闪避被AI轻击打断</strong>（优势区穿透）！双方攻防卡均取消</li>"),ae=null,se=null):(A.push(`<li>💨 <strong>玩家闪避成功！</strong>AI的${k[t.aiCombat]}被完全破解</li>`),se=null):A.push("<li>💨 玩家闪避落空（AI未出攻击牌），攻防正常结算</li>")),Lt&&(t.playerCombat===s.FEINT?A.push("<li>🎭 <strong>玩家擒拿穿透闪避！</strong>AI闪避落空，攻防正常结算</li>"):ve(t.playerCombat)?t.playerCombat===s.THRUST&&bt(u,y)?(A.push("<li>⚡ <strong>AI闪避被玩家轻击打断</strong>（优势区穿透）！双方攻防卡均取消</li>"),ae=null,se=null):(A.push(`<li>💨 <strong>AI闪避成功！</strong>玩家的${k[t.playerCombat]}被完全破解</li>`),ae=null):A.push("<li>💨 AI闪避落空（玩家未出攻击牌），攻防正常结算</li>")),ae&&se?fa(ae,se,u,m,y).forEach(q=>A.push(`<li>${q}</li>`)):ae&&!se?A.push(`<li>${bn("player",ae,u,m,y,k)}</li>`):!ae&&se?A.push(`<li>${bn("ai",se,m,u,y,k)}</li>`):A.push('<li><span style="color:#aaa">双方攻防均被取消</span></li>'),A.push("</ul>"),(t.pMoveInterrupted||t.aMoveInterrupted)&&(A.push("<h4>③ ⚡ 身法打断</h4>"),A.push("<ul>"),t.pMoveInterrupted&&A.push(`<li>玩家在移动中（${a}）受到HP伤害 → <strong>移动被取消</strong>，间距回退</li>`),t.aMoveInterrupted&&A.push(`<li>AI在移动中（${i}）受到HP伤害 → <strong>移动被取消</strong>，间距回退</li>`),A.push(`<li>最终间距：<strong>${ie[h]}(${h})</strong></li>`),A.push("</ul>")),A.push("<h4>📍 最终间距</h4>"),A.push(`<p><strong>${ie[h]}(${h})</strong></p>`);const be=document.getElementById("round-detail-title"),ye=document.getElementById("round-detail-content");be&&(be.textContent=`🔍 第 ${n+1} 回合详解`),ye&&(ye.innerHTML=A.join(`
`)),ht("modal-round-detail",!0)}function os(e,n,t,a){document.querySelectorAll(".dist-card:not(.disabled), .combat-card:not(.disabled)").forEach(i=>{i.addEventListener("click",()=>{a.onSelect(i.dataset.type,i.dataset.card)})});const o=document.getElementById("btn-confirm");o&&!o.disabled&&o.addEventListener("click",()=>a.onConfirm()),document.querySelectorAll("[data-action]").forEach(i=>{const c=i.dataset.action;if(c==="volume"){i.addEventListener("input",()=>{Aa(parseInt(i.value)/100)});return}i.addEventListener(i.tagName==="SELECT"?"change":"click",()=>{switch(c){case"tutorial":ht("modal-tutorial",!0),Ot("guide");break;case"rules":ht("modal-tutorial",!0),Ot("rules");break;case"newgame":a.onNewGame();break;case"reset":a.onReset();break;case"pause":a.onTogglePause();break;case"undo":a.onUndo();break;case"togglemute":Ta(!Mt()),i.textContent=Mt()?"🔇":"🔊";break;case"difficulty":a.onDifficultyChange(parseInt(i.value));break}})}),document.querySelectorAll("[data-close]").forEach(i=>{i.addEventListener("click",()=>{ht("modal-"+i.dataset.close,!1)})}),document.querySelectorAll(".modal-overlay").forEach(i=>{i.addEventListener("click",c=>{c.target===i&&i.classList.remove("active")})}),document.querySelectorAll("#modal-tutorial .modal-tab").forEach(i=>{i.addEventListener("click",()=>Ot(i.dataset.tab))}),document.querySelectorAll(".history-clickable").forEach(i=>{i.addEventListener("click",()=>{const c=parseInt(i.dataset.roundIdx);is(e,c)})}),document.querySelectorAll(".speed-btn").forEach(i=>{i.addEventListener("click",()=>{a.onSpeedChange&&a.onSpeedChange(parseInt(i.dataset.speed))})})}function ht(e,n){const t=document.getElementById(e);t&&(n?t.classList.add("active"):t.classList.remove("active"))}function Ot(e){document.querySelectorAll("#modal-tutorial .modal-tab").forEach(n=>{n.classList.toggle("active",n.dataset.tab===e)}),document.querySelectorAll("#modal-tutorial .tab-content").forEach(n=>{n.classList.toggle("active",n.id==="tab-"+e)})}function Rn(e,n,t,a){const o=I.MAX_HP,i=n.spectatorMode;let c,l;i?n.winner==="player"?(c="🏆 左方胜出！",l="win"):n.winner==="ai"?(c="🏆 右方胜出！",l="lose"):(c="🤝 平局",l="draw"):n.winner==="player"?(c="🏆 胜利！",l="win"):n.winner==="ai"?(c="💀 败北",l="lose"):(c="🤝 平局",l="draw");const r=i?"🤖 左方":"👤",u=i?"🤖 右方":n.aiName?"👤":"🤖",m=i?"右方":n.aiName||"AI",d=document.querySelector(".center-area");if(!d)return;const p=document.createElement("div");p.className="game-over-banner "+l,p.innerHTML=`
    <div class="gob-title">${c}</div>
    <div class="gob-stats">
      回合${n.round} ｜ 
      ${r} HP ${n.player.hp}/${o} ｜ 
      ${u} ${m} HP ${n.ai.hp}/${o}
    </div>
    <div class="gob-btns">
      <button class="gob-btn restart" id="btn-restart-same">🔄 再来一局</button>
      <button class="gob-btn back" id="btn-back-setup">🏠 返回选择</button>
    </div>
  `,d.insertBefore(p,d.firstChild),document.getElementById("btn-restart-same").addEventListener("click",()=>{t()}),document.getElementById("btn-back-setup").addEventListener("click",()=>{a()})}function ls(){const e=document.getElementById("battle-log");e&&(e.scrollTop=e.scrollHeight)}const cs=50;function Nn(e,n){const t=JSON.parse(JSON.stringify(e)),a=t.player;return t.player=t.ai,t.ai=a,t.aiLevel=n,t.history=t.history.map(o=>({round:o.round,playerDistance:o.aiDistance,playerCombat:o.aiCombat,aiDistance:o.playerDistance,aiCombat:o.playerCombat})),t}function At(e,n,t){const a=it(n),o=Tt(n,t);let i=e.combatCard,c=e.distanceCard;return(!i||!a.includes(i))&&(i=a.length>0?a[Math.floor(Math.random()*a.length)]:s.BLOCK),(!c||!o.includes(c))&&(c=o.length>0?o[Math.floor(Math.random()*o.length)]:v.HOLD),{combatCard:i,distanceCard:c}}function rs(e,n,t,a){let o=Et(e,n,a),i=0;for(;!o.gameOver&&i<cs;){const c=tt(o),l=Nn(o,t),r=tt(l),u=At(r,o.player,o.distance),m=At(c,o.ai,o.distance);o=kt(o,u,m),i++}return o.winner||"draw"}function ds(e,n,t,a){const o={};for(const i of e){o[i]={};for(const c of e){let l=0,r=0,u=0;for(let m=0;m<a;m++){const d=rs(i,c,n,t);d==="player"?l++:d==="ai"?r++:u++}o[i][c]={wins:l,losses:r,draws:u}}}return o}const Mn=Object.values(b);function us(){const e=document.getElementById("sim-modal");e&&e.remove();const n=document.createElement("div");n.id="sim-modal",n.className="sim-modal-overlay",n.innerHTML=`
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
  `,document.body.appendChild(n),document.getElementById("sim-close").addEventListener("click",()=>n.remove()),n.addEventListener("click",t=>{t.target===n&&n.remove()}),document.getElementById("sim-run").addEventListener("click",()=>{const t=parseInt(document.getElementById("sim-player-level").value),a=parseInt(document.getElementById("sim-ai-level").value),o=parseInt(document.getElementById("sim-num-games").value),i=document.getElementById("sim-results");i.innerHTML='<p class="sim-loading">⏳ 模拟运行中…</p>',setTimeout(()=>{const c=ds(Mn,t,a,o);ps(i,c,o,t,a)},50)})}function ps(e,n,t,a,o){const i=Mn,c=B||{},l=O;let r=0,u=0;for(const f of i)for(const g of i)r+=n[f][g].wins,u+=t;const m=(r/u*100).toFixed(1);let d=`<div class="sim-summary">L${a} vs L${o} · 每组${t}局 · 左侧总胜率 <strong>${m}%</strong></div>`;d+='<table class="sim-table"><thead><tr><th>左↓ \\ 右→</th>';for(const f of i)d+=`<th>${c[f]||""} ${l[f].slice(0,2)}</th>`;d+="</tr></thead><tbody>";for(const f of i){d+=`<tr><td class="sim-row-header">${c[f]||""} ${l[f]}</td>`;for(const g of i){const y=n[f][g],h=Math.round(y.wins/t*100),$=fs(h),C=`胜${y.wins} 负${y.losses} 平${y.draws}`;d+=`<td class="sim-cell ${$}" title="${C}">${h}%</td>`}d+="</tr>"}d+="</tbody></table>",d+='<div class="sim-ranking"><strong>武器综合胜率排名：</strong>';const p=i.map(f=>{let g=0,y=0;for(const h of i)g+=n[f][h].wins,y+=t;return{weapon:f,rate:Math.round(g/y*100)}}).sort((f,g)=>g.rate-f.rate);d+=p.map((f,g)=>`<span class="sim-rank-item">${g+1}. ${c[f.weapon]||""} ${l[f.weapon]} ${f.rate}%</span>`).join(" "),d+="</div>",e.innerHTML=d}function fs(e){return e>=65?"sim-hot":e>=55?"sim-warm":e>=45?"sim-neutral":e>=35?"sim-cool":"sim-cold"}const Ut="lbq2_config";function ms(){const e={};for(const[n,t]of Object.entries(P))e[n]={advantage:[...t.advantage],disadvantage:[...t.disadvantage]};return{...I,WEAPON_ZONES:e}}const Ue=ms(),Ie={MAX_HP:{label:"最大气血",min:5,max:30,step:1},MAX_STANCE:{label:"处决架势阈值",min:3,max:10,step:1},EXECUTION_DAMAGE:{label:"处决伤害",min:2,max:15,step:1},INITIAL_DISTANCE:{label:"初始间距",min:0,max:3,step:1},MAX_STAMINA:{label:"最大体力",min:2,max:8,step:1},STAMINA_RECOVERY:{label:"体力回复/回合",min:1,max:3,step:1}},yn=Ue;function et(e){return JSON.parse(JSON.stringify(e))}function Bn(){try{const e=localStorage.getItem(Ut);return e?JSON.parse(e):null}catch{return null}}function gs(e){try{return localStorage.setItem(Ut,JSON.stringify(e)),!0}catch{return!1}}function jt(e){if(e){for(const n of Object.keys(Ie))e[n]!==void 0&&(I[n]=e[n]);if(e.WEAPON_ZONES)for(const[n,t]of Object.entries(e.WEAPON_ZONES))P[n]&&(P[n]=et(t))}}function hs(){localStorage.removeItem(Ut),jt(et(Ue))}function An(e){if(!e)return[];const n=[];for(const t of Object.keys(Ie)){const a=Ue[t],o=e[t];o!==void 0&&o!==a&&n.push({key:t,label:Ie[t].label,default:a,current:o})}if(e.WEAPON_ZONES)for(const[t,a]of Object.entries(e.WEAPON_ZONES)){const o=Ue.WEAPON_ZONES[t];if(!o)continue;const i=JSON.stringify(a.advantage)!==JSON.stringify(o.advantage),c=JSON.stringify(a.disadvantage)!==JSON.stringify(o.disadvantage);if(i||c){const l=O[t]||t;i&&n.push({key:t+"_adv",label:l+" 优势区",default:o.advantage.join(","),current:a.advantage.join(",")}),c&&n.push({key:t+"_disadv",label:l+" 劣势区",default:o.disadvantage.join(","),current:a.disadvantage.join(",")})}}return n}function Fn(){const e=Bn();if(!e)return et(Ue);const n=et(Ue);for(const t of Object.keys(Ie))e[t]!==void 0&&(n[t]=e[t]);if(e.WEAPON_ZONES)for(const[t,a]of Object.entries(e.WEAPON_ZONES))n.WEAPON_ZONES[t]&&(n.WEAPON_ZONES[t]=et(a));return n}function vs(){const e=Bn();e&&jt(e)}function Bt(e,n="info"){let t=document.getElementById("toast-container");t||(t=document.createElement("div"),t.id="toast-container",document.body.appendChild(t));const a=document.createElement("div");a.className=`game-toast toast-${n}`,a.textContent=e,t.appendChild(a),a.offsetWidth,a.classList.add("toast-show"),setTimeout(()=>{a.classList.add("toast-hide"),a.addEventListener("animationend",()=>a.remove())},2200)}function bs(){const e=document.getElementById("cfg-modal");e&&e.remove();const n=Fn(),t=["0-贴身","1-近战","2-中距","3-远距"],a=document.createElement("div");a.id="cfg-modal",a.className="sim-modal-overlay";let o="";for(const[r,u]of Object.entries(Ie)){const m=n[r],d=yn[r],p=m!==d;o+=`
      <div class="cfg-row">
        <label>${u.label}</label>
        <input type="number" id="cfg-${r}" value="${m}" min="${u.min}" max="${u.max}" step="${u.step}" />
        <span class="cfg-default${p?" cfg-changed":""}">(默认: ${d})</span>
      </div>`}let i="";for(const[r,u]of Object.entries(n.WEAPON_ZONES)){const m=(B[r]||"")+" "+(O[r]||r),d=yn.WEAPON_ZONES[r],p=d&&JSON.stringify(u.advantage)!==JSON.stringify(d.advantage),f=d&&JSON.stringify(u.disadvantage)!==JSON.stringify(d.disadvantage);i+=`
      <div class="cfg-weapon-block">
        <div class="cfg-weapon-name">${m}</div>
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
          ${f?'<span class="cfg-changed-dot">●</span>':""}
        </div>
      </div>`}const c=An(n);let l="";c.length>0&&(l='<div class="cfg-diff"><strong>与默认值差异：</strong>'+c.map(r=>`<div class="cfg-diff-item"><span class="cfg-diff-label">${r.label}</span> <span class="cfg-diff-old">${r.default}</span> → <span class="cfg-diff-new">${r.current}</span></div>`).join("")+"</div>"),a.innerHTML=`
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
        ${i}
      </div>
      <div id="cfg-diff-area">${l}</div>
      <div class="cfg-actions">
        <button class="cfg-btn cfg-save" id="cfg-save">💾 保存</button>
        <button class="cfg-btn cfg-reset" id="cfg-reset">↩ 恢复默认</button>
        <button class="cfg-btn cfg-cancel" id="cfg-cancel">取消</button>
      </div>
    </div>
  `,document.body.appendChild(a),a.addEventListener("click",r=>{r.target===a&&a.remove()}),document.getElementById("cfg-close").addEventListener("click",()=>a.remove()),document.getElementById("cfg-cancel").addEventListener("click",()=>a.remove()),document.getElementById("cfg-save").addEventListener("click",()=>{const r=En();gs(r),jt(r),a.remove(),Bt("✅ 配置已保存！下次对局生效。","success")}),document.getElementById("cfg-reset").addEventListener("click",()=>{hs(),a.remove(),Bt("↩ 已恢复默认配置！","info")}),a.querySelectorAll("input").forEach(r=>{r.addEventListener("change",()=>{const u=En(),m=An(u),d=document.getElementById("cfg-diff-area");m.length>0?d.innerHTML='<div class="cfg-diff"><strong>与默认值差异：</strong>'+m.map(p=>`<div class="cfg-diff-item"><span class="cfg-diff-label">${p.label}</span> <span class="cfg-diff-old">${p.default}</span> → <span class="cfg-diff-new">${p.current}</span></div>`).join("")+"</div>":d.innerHTML='<div class="cfg-diff"><em>无差异（全部为默认值）</em></div>'})})}function En(){const e=Fn();for(const n of Object.keys(Ie)){const t=document.getElementById(`cfg-${n}`);t&&(e[n]=parseInt(t.value)||Ie[n].min)}return document.querySelectorAll(".cfg-checkboxes").forEach(n=>{const t=n.dataset.weapon,a=n.dataset.type,o=[];n.querySelectorAll('input[type="checkbox"]:checked').forEach(i=>{o.push(parseInt(i.value))}),e.WEAPON_ZONES[t]||(e.WEAPON_ZONES[t]={advantage:[],disadvantage:[]}),e.WEAPON_ZONES[t][a]=o.sort()}),e}function ys(e,n){e.innerHTML=`
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
  `,document.getElementById("mode-tower").addEventListener("click",()=>{We(),n.onTower()}),document.getElementById("mode-battle").addEventListener("click",()=>{We(),n.onBattle()}),document.getElementById("mode-aivai").addEventListener("click",()=>{We(),n.onAiVsAi()}),document.getElementById("btn-title-tutorial").addEventListener("click",()=>Cs()),document.getElementById("btn-title-sim").addEventListener("click",()=>us()),document.getElementById("btn-title-config").addEventListener("click",()=>bs())}function As(e,n,t){const a=b.SHORT_BLADE,o=b.SPEAR;e.innerHTML=`
    <div class="mode-setup">
      <button class="back-link" id="btn-back">← 返回</button>
      <h2>⚔ 自由对战</h2>
      <div class="battle-setup-cols">
        <div class="setup-weapon-col">
          <div class="setup-col-title">👤 你的兵器</div>
          <select id="sel-player" class="setup-select">
            ${Object.entries(O).map(([i,c])=>`<option value="${i}">${B[i]||""} ${c}</option>`).join("")}
          </select>
          <div id="player-wz">${x(a)}</div>
        </div>
        <div class="setup-vs">VS</div>
        <div class="setup-weapon-col">
          <div class="setup-col-title">🤖 对手兵器</div>
          <select id="sel-ai" class="setup-select">
            ${Object.entries(O).map(([i,c])=>`<option value="${i}">${B[i]||""} ${c}</option>`).join("")}
          </select>
          <div id="ai-wz">${x(o)}</div>
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
  `,document.getElementById("sel-ai").value=o,document.getElementById("sel-player").addEventListener("change",i=>{document.getElementById("player-wz").innerHTML=x(i.target.value)}),document.getElementById("sel-ai").addEventListener("change",i=>{document.getElementById("ai-wz").innerHTML=x(i.target.value)}),document.getElementById("btn-start").addEventListener("click",()=>{n(document.getElementById("sel-player").value,document.getElementById("sel-ai").value,parseInt(document.getElementById("sel-level").value))}),document.getElementById("btn-back").addEventListener("click",t)}function Es(e,n,t){let a=b.SHORT_BLADE;function o(){e.innerHTML=`
      <div class="mode-setup">
        <button class="back-link" id="btn-back">← 返回</button>
        <h2>🗼 江湖行 — 选择你的兵器</h2>
        <p class="setup-hint">兵器将伴随你走完全部十关</p>
        <div class="weapon-pick-grid">
          ${Object.values(b).map(i=>ya(i,i===a)).join("")}
        </div>
        <div id="weapon-preview">${x(a)}</div>
        <button class="primary-btn" id="btn-start">⚔ 启程</button>
      </div>
    `,document.querySelectorAll(".weapon-pick-btn").forEach(i=>{i.addEventListener("click",()=>{a=i.dataset.weapon,o()})}),document.getElementById("btn-start").addEventListener("click",()=>n(a)),document.getElementById("btn-back").addEventListener("click",t)}o()}const Tn=[{value:1,label:"1 - 菜鸟"},{value:2,label:"2 - 学徒"},{value:3,label:"3 - 弟子"},{value:4,label:"4 - 镖师"},{value:5,label:"5 - 武师"},{value:6,label:"6 - 高手"},{value:7,label:"7 - 宗师"},{value:8,label:"8 - 绝世"}];function Ts(e,n,t){const a=b.SHORT_BLADE,o=b.SPEAR;e.innerHTML=`
    <div class="mode-setup">
      <button class="back-link" id="btn-back">← 返回</button>
      <h2>🦗 斗蛐蛐 — 选将观战</h2>
      <p class="setup-hint">选择双方兵器与AI等级，坐看AI对决</p>
      <div class="battle-setup-cols">
        <div class="setup-weapon-col">
          <div class="setup-col-title">🤖 左方 AI</div>
          <select id="sel-left-weapon" class="setup-select">
            ${Object.entries(O).map(([i,c])=>`<option value="${i}">${B[i]||""} ${c}</option>`).join("")}
          </select>
          <div id="left-wz">${x(a)}</div>
          <label class="setup-label">AI 等级</label>
          <select id="sel-left-level" class="setup-select">
            ${Tn.map(i=>`<option value="${i.value}" ${i.value===4?"selected":""}>${i.label}</option>`).join("")}
          </select>
        </div>
        <div class="setup-vs">VS</div>
        <div class="setup-weapon-col">
          <div class="setup-col-title">🤖 右方 AI</div>
          <select id="sel-right-weapon" class="setup-select">
            ${Object.entries(O).map(([i,c])=>`<option value="${i}">${B[i]||""} ${c}</option>`).join("")}
          </select>
          <div id="right-wz">${x(o)}</div>
          <label class="setup-label">AI 等级</label>
          <select id="sel-right-level" class="setup-select">
            ${Tn.map(i=>`<option value="${i.value}" ${i.value===4?"selected":""}>${i.label}</option>`).join("")}
          </select>
        </div>
      </div>
      <button class="primary-btn" id="btn-start">🦗 开始观战</button>
    </div>
  `,document.getElementById("sel-right-weapon").value=o,document.getElementById("sel-left-weapon").addEventListener("change",i=>{document.getElementById("left-wz").innerHTML=x(i.target.value)}),document.getElementById("sel-right-weapon").addEventListener("change",i=>{document.getElementById("right-wz").innerHTML=x(i.target.value)}),document.getElementById("btn-start").addEventListener("click",()=>{n(document.getElementById("sel-left-weapon").value,document.getElementById("sel-right-weapon").value,parseInt(document.getElementById("sel-left-level").value),parseInt(document.getElementById("sel-right-level").value))}),document.getElementById("btn-back").addEventListener("click",t)}function Cs(e="guide"){const n=document.getElementById("standalone-tutorial");n&&n.remove();const t=document.createElement("div");t.id="standalone-tutorial",t.className="modal-overlay active",t.innerHTML=`
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
        ${wn()}
      </div>

      <!-- Tab: 完整规则 -->
      <div class="modal-content-text tab-content ${e==="rules"?"active":""}" id="setup-tab-rules">
        ${Dn()}
      </div>
    </div>
  `,document.body.appendChild(t),t.addEventListener("click",a=>{a.target===t&&t.remove()}),document.getElementById("tut-close").addEventListener("click",()=>t.remove()),t.querySelectorAll(".modal-tab").forEach(a=>{a.addEventListener("click",()=>{t.querySelectorAll(".modal-tab").forEach(o=>o.classList.toggle("active",o===a)),t.querySelectorAll(".tab-content").forEach(o=>o.classList.toggle("active",o.id==="setup-tab-"+a.dataset.tab))})})}const Ss={[`${s.DEFLECT}_${s.SLASH}`]:{pAnim:"anim-deflect",aAnim:"anim-recoil",spark:"🤺",desc:"卸力反制!"},[`${s.SLASH}_${s.DEFLECT}`]:{pAnim:"anim-recoil",aAnim:"anim-deflect",spark:"🤺",desc:"被卸力反制!"},[`${s.DEFLECT}_${s.THRUST}`]:{pAnim:"anim-deflect-fail",aAnim:"anim-thrust-p",spark:"🎯",desc:"卸力失败"},[`${s.THRUST}_${s.DEFLECT}`]:{pAnim:"anim-thrust-p",aAnim:"anim-deflect-fail",spark:"🎯",desc:"穿透卸力"},[`${s.DEFLECT}_${s.FEINT}`]:{pAnim:"anim-deflect-fail",aAnim:"anim-feint-a",spark:"🌀",desc:"擒拿骗卸力"},[`${s.FEINT}_${s.DEFLECT}`]:{pAnim:"anim-feint-p",aAnim:"anim-deflect-fail",spark:"🌀",desc:"擒拿骗卸力"},[`${s.SLASH}_${s.SLASH}`]:{pAnim:"anim-clash-p",aAnim:"anim-clash-a",spark:"⚡",desc:"互砍!"},[`${s.SLASH}_${s.THRUST}`]:{pAnim:"anim-slash-p",aAnim:"anim-hit",spark:"⚡",desc:"重击命中"},[`${s.THRUST}_${s.SLASH}`]:{pAnim:"anim-hit",aAnim:"anim-slash-a",spark:"⚡",desc:"被劈中"},[`${s.SLASH}_${s.BLOCK}`]:{pAnim:"anim-slash-p",aAnim:"anim-block-hit",spark:"🛡️",desc:"重击破格挡"},[`${s.BLOCK}_${s.SLASH}`]:{pAnim:"anim-block-hit",aAnim:"anim-slash-a",spark:"🛡️",desc:"格挡被破"},[`${s.SLASH}_${s.FEINT}`]:{pAnim:"anim-slash-p",aAnim:"anim-hit",spark:"⚡",desc:"重击命中"},[`${s.FEINT}_${s.SLASH}`]:{pAnim:"anim-hit",aAnim:"anim-slash-a",spark:"⚡",desc:"被劈中"},[`${s.THRUST}_${s.THRUST}`]:{pAnim:"anim-thrust-p",aAnim:"anim-thrust-a",spark:"🎯",desc:"互刺!"},[`${s.THRUST}_${s.BLOCK}`]:{pAnim:"anim-thrust-miss",aAnim:"anim-block",spark:"🛡️",desc:"被格挡"},[`${s.BLOCK}_${s.THRUST}`]:{pAnim:"anim-block",aAnim:"anim-thrust-miss",spark:"🛡️",desc:"格挡成功"},[`${s.THRUST}_${s.FEINT}`]:{pAnim:"anim-thrust-p",aAnim:"anim-hit",spark:"🎯",desc:"轻击命中"},[`${s.FEINT}_${s.THRUST}`]:{pAnim:"anim-hit",aAnim:"anim-thrust-a",spark:"🎯",desc:"被轻击"},[`${s.BLOCK}_${s.FEINT}`]:{pAnim:"anim-block-tricked",aAnim:"anim-feint-a",spark:"🌀",desc:"擒拿骗格挡"},[`${s.FEINT}_${s.BLOCK}`]:{pAnim:"anim-feint-p",aAnim:"anim-block-tricked",spark:"🌀",desc:"擒拿骗格挡"},[`${s.BLOCK}_${s.BLOCK}`]:{pAnim:"anim-block",aAnim:"anim-block",spark:null,desc:"双挡空过"},[`${s.FEINT}_${s.FEINT}`]:{pAnim:"anim-idle",aAnim:"anim-idle",spark:null,desc:"双晃空过"},[`${s.DEFLECT}_${s.DEFLECT}`]:{pAnim:"anim-clash-p",aAnim:"anim-clash-a",spark:"⚡",desc:"卸力对碰"},[`${s.DEFLECT}_${s.BLOCK}`]:{pAnim:"anim-deflect-fail",aAnim:"anim-block",spark:"🛡️",desc:"卸力被挡"},[`${s.BLOCK}_${s.DEFLECT}`]:{pAnim:"anim-block",aAnim:"anim-deflect-fail",spark:"🛡️",desc:"格挡卸力"}};function $s(e,n){const t=`${e}_${n}`;return Ss[t]||{pAnim:"anim-idle",aAnim:"anim-idle",spark:null,desc:""}}function L(e){return new Promise(n=>setTimeout(n,e))}function Me(e,n,t,a){const o=document.createElement("div"),i=a==="stance"?" stance-dmg":a==="heal"?" heal":"";o.className="float-dmg"+i,o.textContent=t,o.style.left=n.style.left,o.style.top="30%",e.appendChild(o),setTimeout(()=>o.remove(),1300)}function Be(e,n,t,a){const o=document.querySelector(e);if(!o)return;const i=o.querySelector(`.stat-row[data-stat="${n}"]`);if(!i)return;const c=i.querySelector(".stat-bar"),l=i.querySelector(".stat-value");c&&(c.style.transition="none",c.style.width=Math.max(0,t/a*100)+"%",c.offsetWidth),l&&(l.textContent=`${Math.max(0,t)}/${a}`)}function z(e,n,t,a,o=500){const i=document.querySelector(e);if(!i)return;const c=i.querySelector(`.stat-row[data-stat="${n}"]`);if(!c)return;const l=c.querySelector(".stat-bar"),r=c.querySelector(".stat-value");l&&(l.style.transition=`width ${o}ms ease`,l.style.width=Math.max(0,t/a*100)+"%"),r&&(r.textContent=`${Math.max(0,Math.round(t))}/${a}`)}function X(e,n,t,a="cost"){const o=document.querySelector(e);if(!o)return;const i=o.querySelector(`.stat-row[data-stat="${n}"]`);if(!i)return;i.style.position="relative";const c=document.createElement("div");c.className=`stat-pop stat-pop-${a}`,c.textContent=t,i.appendChild(c),c.offsetWidth,c.classList.add("stat-pop-show"),setTimeout(()=>{c.classList.add("stat-pop-hide"),c.addEventListener("animationend",()=>c.remove())},1500)}function de(e,n,t){const a=document.querySelector(e);if(!a)return;const o=a.querySelector(`.stat-row[data-stat="${n}"]`);if(!o)return;const i=o.querySelector(".stat-bar");i&&(i.classList.add(t),setTimeout(()=>i.classList.remove(t),800))}function Cn(e,n,t){const a=document.createElement("div");a.className="clash-spark",a.innerHTML=`<span class="spark-emoji">${n}</span><span class="spark-desc">${t}</span>`,e.appendChild(a),setTimeout(()=>a.remove(),1200)}function gt(e,n,t,a,o){const i=document.createElement("div");return i.className=`action-tag action-tag-${o}`,i.innerHTML=`<span class="at-emoji">${t}</span><span class="at-text">${a}</span>`,i.style.left=n.style.left,e.appendChild(i),i}function Sn(e,n){const t=document.createElement("div");t.className="float-dmg interrupt-dmg",t.textContent="⚡ 身法被打断",t.style.left=n.style.left,t.style.top="12%",e.appendChild(t),setTimeout(()=>t.remove(),1400)}function Ls(e,n){const t=e.querySelector(".round-banner");t&&t.remove();const a=document.createElement("div");a.className="round-banner",a.textContent=n,e.appendChild(a),setTimeout(()=>{a.classList.add("rb-fade"),setTimeout(()=>a.remove(),500)},1e3)}function Ht(e,n){e.style.setProperty("--arena-cam",n),e.classList.remove("dist-0","dist-1","dist-2","dist-3"),e.classList.add("dist-"+n)}async function kn(e,n){var Xt,Zt,Jt,Yt;const t=document.getElementById("arena-stage"),a=document.getElementById("player-fighter"),o=document.getElementById("ai-fighter");if(!t||!a||!o)return;const i=n.history[n.history.length-1],c=i.playerCombat,l=i.aiCombat,r=i.playerDistance,u=i.aiDistance,m=I.MAX_HP,d=I.MAX_STANCE,p=I.MAX_STAMINA,f=ue[e.distance]||ue[2],g=ue[n.distance]||ue[2];a.style.transition="none",o.style.transition="none",a.style.left=f.player+"%",o.style.left=f.ai+"%";const y=a.querySelector(".fighter-body"),h=o.querySelector(".fighter-body"),$=e.spectatorMode?"🤖":"🧑";y&&(y.textContent=e.player.staggered?"😵":$),h&&(h.textContent=e.ai.staggered?"😵":e.aiName?"👤":"🤖");const C=t.querySelector(".arena-dist-line"),A=t.querySelector(".arena-dist-label");C&&(C.style.transition="none",C.style.left=f.player+"%",C.style.width=f.ai-f.player+"%"),A&&(A.textContent=ie[e.distance]),Ht(t,e.distance),a.offsetWidth,Be(".player-side","hp",e.player.hp,m),Be(".player-side","stamina",e.player.stamina,p),Be(".player-side","stance",e.player.stance,d),Be(".ai-side","hp",e.ai.hp,m),Be(".ai-side","stamina",e.ai.stamina,p),Be(".ai-side","stance",e.ai.stance,d);const le=nt[r],Lt=nt[u],ae=j[c],se=j[l];Na(),Ls(t,`⚔️  第 ${n.round} 回合`),await L(1200);const ve=((Xt=N[r])==null?void 0:Xt.delta)??0,be=((Zt=N[u])==null?void 0:Zt.delta)??0,ye=Math.max(0,Math.min(3,e.distance+ve+be)),Ge=ue[ye]||ue[2],ct=i.pMoveInterrupted||i.aMoveInterrupted,Ve=gt(t,a,le.emoji,te[r],"player"),Y=Ge.player,qe=parseFloat(a.style.left),Ae=parseFloat(o.style.left);ve!==0?(ve<0?pn():fn(),a.classList.add(ve<0?"anim-dash-in":"anim-dash-out"),Math.abs(Y-qe)>.5&&(a.style.transition="left 0.5s ease",a.style.left=Y+"%",C&&(C.style.transition="left 0.5s ease, width 0.5s ease",C.style.left=Y+"%",C.style.width=Ae-Y+"%")),await L(600),a.classList.remove("anim-dash-in","anim-dash-out")):r===v.DODGE?(rn(),a.classList.add("anim-dodge"),await L(550),a.classList.remove("anim-dodge")):(mn(),a.classList.add("anim-brace"),Math.abs(Y-qe)>.5&&(a.style.transition="left 0.5s ease",a.style.left=Y+"%",C&&(C.style.transition="left 0.5s ease, width 0.5s ease",C.style.left=Y+"%",C.style.width=Ae-Y+"%")),await L(550),a.classList.remove("anim-brace"));const ze=gt(t,o,Lt.emoji,te[u],"ai"),ce=Ge.ai,Q=parseFloat(a.style.left);be!==0?(be<0?pn():fn(),o.classList.add(be<0?"anim-dash-in":"anim-dash-out"),Math.abs(ce-Ae)>.5&&(o.style.transition="left 0.5s ease",o.style.left=ce+"%",C&&(C.style.transition="width 0.5s ease",C.style.width=ce-Q+"%")),await L(600),o.classList.remove("anim-dash-in","anim-dash-out")):u===v.DODGE?(rn(),o.classList.add("anim-dodge"),await L(550),o.classList.remove("anim-dodge")):(mn(),o.classList.add("anim-brace"),Math.abs(ce-Ae)>.5&&(o.style.transition="left 0.5s ease",o.style.left=ce+"%",C&&(C.style.transition="width 0.5s ease",C.style.width=ce-Q+"%")),await L(550),o.classList.remove("anim-brace")),A&&(A.textContent=ie[ye]),Ht(t,ye),a.style.transition="",o.style.transition="",C&&(C.style.transition="");const q=Math.max(0,e.player.stamina-(((Jt=N[r])==null?void 0:Jt.cost)??0)),Re=Math.max(0,e.ai.stamina-(((Yt=N[u])==null?void 0:Yt.cost)??0)),Ne=e.player.stamina-q,wt=e.ai.stamina-Re;Ne>0&&(z(".player-side","stamina",q,p,400),X(".player-side","stamina",`-${Ne} 体力`,"cost"),de(".player-side","stamina","bar-flash-cost")),wt>0&&(z(".ai-side","stamina",Re,p,400),X(".ai-side","stamina",`-${wt} 体力`,"cost"),de(".ai-side","stamina","bar-flash-cost")),(Ne>0||wt>0)&&await L(400),Ve.classList.add("at-fade"),ze.classList.add("at-fade"),setTimeout(()=>{Ve.remove(),ze.remove()},350),await L(350);const Gt=gt(t,a,ae.emoji,k[c],"player");await L(350);const Vt=gt(t,o,se.emoji,k[l],"ai");await L(400);const Ee=$s(c,l);Ee.pAnim&&a.classList.add(Ee.pAnim),Ee.aAnim&&o.classList.add(Ee.aAnim),Ee.spark&&Cn(t,Ee.spark,Ee.desc),c===l&&(c==="slash"||c==="thrust"||c==="deflect")?Oa():ka(c),await L(900);const Gn=n.spectatorMode?"🤖":"🧑";y&&(y.textContent=n.player.staggered?"😵":Gn),h&&(h.textContent=n.ai.staggered?"😵":n.aiName?"👤":"🤖"),Gt.classList.add("at-fade"),Vt.classList.add("at-fade"),setTimeout(()=>{Gt.remove(),Vt.remove()},350),await L(300),ye!==n.distance&&(ct?(Ha(),i.pMoveInterrupted&&(a.classList.add("anim-shake"),Sn(t,a)),i.aMoveInterrupted&&(o.classList.add("anim-shake"),Sn(t,o)),await L(400)):(Ra(),Cn(t,"💥","击退!"),await L(300)),a.style.transition="left 0.4s ease-out",o.style.transition="left 0.4s ease-out",C&&(C.style.transition="left 0.4s ease-out, width 0.4s ease-out"),a.style.left=g.player+"%",o.style.left=g.ai+"%",C&&(C.style.left=g.player+"%",C.style.width=g.ai-g.player+"%"),A&&(A.textContent=ie[n.distance]),Ht(t,n.distance),await L(500),a.classList.remove("anim-shake"),o.classList.remove("anim-shake"),a.style.transition="",o.style.transition="",C&&(C.style.transition=""));const Xe=e.player.hp-n.player.hp,Ze=e.ai.hp-n.ai.hp,Te=n.player.stance-e.player.stance,Ce=n.ai.stance-e.ai.stance,qt=I.EXECUTION_DAMAGE,rt=e.player.stance<d&&n.player.stance===0&&Xe>=qt,dt=e.ai.stance<d&&n.ai.stance===0&&Ze>=qt;Xe>0&&(dn(),a.classList.add("anim-hit"),Me(t,a,`-${Xe}`,"damage"),z(".player-side","hp",n.player.hp,m,500),X(".player-side","hp",`-${Xe} 气血`,"cost"),de(".player-side","hp","bar-flash-cost"),await L(600)),Ze>0&&(dn(),o.classList.add("anim-hit"),Me(t,o,`-${Ze}`,"damage"),z(".ai-side","hp",n.ai.hp,m,500),X(".ai-side","hp",`-${Ze} 气血`,"cost"),de(".ai-side","hp","bar-flash-cost"),await L(600)),Xe===0&&Ze===0&&await L(300),rt?(un(),z(".player-side","stance",0,d,400),X(".player-side","stance","⚔ 处决!","exec")):Te>0?(hn(),Me(t,a,`+${Te} 架势`,"stance"),z(".player-side","stance",n.player.stance,d,400),X(".player-side","stance",`+${Te} 架势`,"warn"),de(".player-side","stance","bar-flash-warn")):Te<0&&(vn(),Me(t,a,`${Te} 架势`,"heal"),z(".player-side","stance",n.player.stance,d,400),X(".player-side","stance",`${Te} 架势`,"buff")),(rt||Te!==0)&&await L(450),dt?(un(),z(".ai-side","stance",0,d,400),X(".ai-side","stance","⚔ 处决!","exec")):Ce>0?(hn(),Me(t,o,`+${Ce} 架势`,"stance"),z(".ai-side","stance",n.ai.stance,d,400),X(".ai-side","stance",`+${Ce} 架势`,"warn"),de(".ai-side","stance","bar-flash-warn")):Ce<0&&(vn(),Me(t,o,`${Ce} 架势`,"heal"),z(".ai-side","stance",n.ai.stance,d,400),X(".ai-side","stance",`${Ce} 架势`,"buff")),(dt||Ce!==0)&&await L(450),(rt||dt)&&(t.classList.add("execution-flash"),await L(500)),await L(rt||dt?500:600);const ut=n.player.stamina-q,Dt=n.ai.stamina-Re;ut>0&&(gn(),z(".player-side","stamina",n.player.stamina,p,400),X(".player-side","stamina",`+${ut} 体力`,"buff"),de(".player-side","stamina","bar-flash-buff")),Dt>0&&(ut<=0&&gn(),z(".ai-side","stamina",n.ai.stamina,p,400),X(".ai-side","stamina",`+${Dt} 体力`,"buff"),de(".ai-side","stamina","bar-flash-buff")),(ut>0||Dt>0)&&await L(500);const zt=["anim-attack-p","anim-attack-a","anim-dodge","anim-hit","anim-shake","anim-slash-p","anim-slash-a","anim-slash-miss","anim-thrust-p","anim-thrust-a","anim-thrust-miss","anim-deflect","anim-deflect-fail","anim-recoil","anim-block","anim-block-hit","anim-block-tricked","anim-feint-p","anim-feint-a","anim-clash-p","anim-clash-a","anim-idle","anim-dash-in","anim-dash-out","anim-brace"];a.classList.remove(...zt),o.classList.remove(...zt),t.classList.remove("execution-flash")}const Oe=[{floor:1,npc:"李大壮",title:"村口恶霸",weapon:b.STAFF,aiLevel:2,intro:"路经偏僻村落，一名壮汉持棍拦路。",taunt:"此路是我开！留下买路钱！"},{floor:2,npc:"赵三",title:"山贼喽啰",weapon:b.SHORT_BLADE,aiLevel:3,intro:"山间小道，草丛中窜出一名手持短刀的毛贼。",taunt:"识相的把包袱留下！"},{floor:3,npc:"钱小六",title:"镖局镖师",weapon:b.SPEAR,aiLevel:4,intro:"误入镖队行进路线，一名镖师持枪喝止。",taunt:"何方人物？报上名来！"},{floor:4,npc:"孙铁柱",title:"武馆弟子",weapon:b.SWORD,aiLevel:4,intro:"途经武馆，一名弟子欣然邀战。",taunt:"久闻大名，请赐教！"},{floor:5,npc:"周大锤",title:"铁匠侠客",weapon:b.GREAT_BLADE,aiLevel:5,intro:"铁匠铺旁，一名大汉扛着长柄大刀拦住去路。",taunt:"我这把大刀早已饥渴难耐！"},{floor:6,npc:"吴影",title:"暗巷刺客",weapon:b.DUAL_STAB,aiLevel:6,intro:"夜入小巷，身后传来阴冷的脚步声……",taunt:"…………"},{floor:7,npc:"郑云飞",title:"青衫剑客",weapon:b.SWORD,aiLevel:6,intro:"客栈饮酒，邻桌青衫剑客放下酒杯，缓缓起身。",taunt:"以剑会友，不醉不归。"},{floor:8,npc:"王长风",title:"枪法名家",weapon:b.SPEAR,aiLevel:7,intro:"擂台之上，白发老者持枪而立，气势如渊。",taunt:"老夫征战三十年，尚未一败。"},{floor:9,npc:"陈残雪",title:"独臂刀客",weapon:b.GREAT_BLADE,aiLevel:7,intro:"古道尽头，独臂刀客横刀冷立，杀意凛然。",taunt:"这条路的尽头，只能有一个人。"},{floor:10,npc:"萧无名",title:"绝世高手",weapon:null,aiLevel:8,intro:"山巅之上，一个看不清面容的身影背对着你。",taunt:"你终于来了。"}];function ws(e){return{playerWeapon:e,currentFloor:0,playerHp:I.MAX_HP,completed:!1,gameOver:!1}}function Ds(e){const n=Oe[e.currentFloor];if(!n)return null;if(!n.weapon){const t=Object.values(b);return{...n,weapon:t[Math.floor(Math.random()*t.length)]}}return n}function Is(e,n){const t={...e};return t.playerHp=I.MAX_HP,t.currentFloor+=1,t.currentFloor>=Oe.length&&(t.completed=!0),t}function Os(e){return e.completed}function Hs(e,n,t,a,o){const i=I.MAX_HP,c=n.currentFloor+1,l=B[t.weapon]||"❓",r=O[t.weapon]||"???",u=B[n.playerWeapon]||"🗡️",m=O[n.playerWeapon]||"???";e.innerHTML=`
    <div class="tower-screen">
      <div class="tower-floor-header">🗼 江湖行 · 第 ${c} / ${Oe.length} 关</div>
      <div class="tower-progress">
        ${Oe.map((d,p)=>`<span class="tp-dot ${p<n.currentFloor?"tp-done":p===n.currentFloor?"tp-cur":""}">${p+1}</span>`).join("")}
      </div>
      <div class="tower-npc-display">
        <div class="tower-npc-weapon">${l}</div>
        <div class="tower-npc-name">${t.npc}</div>
        <div class="tower-npc-title">「${t.title}」</div>
        <div class="tower-npc-wp">持 ${l} ${r}</div>
      </div>
      <div class="tower-quote">❝ ${t.taunt} ❞</div>
      <div class="tower-story">${t.intro}</div>
      <div class="tower-player-info">
        <div class="tower-hp">❤️ 你的气血: <strong>${n.playerHp}</strong> / ${i}</div>
        <div class="tower-your-weapon">${u} ${m}</div>
      </div>
      <div class="tower-matchup">
        ${x(n.playerWeapon)}
        <div class="tower-matchup-vs">VS</div>
        ${x(t.weapon)}
      </div>
      <button class="primary-btn" id="btn-fight">⚔ 应战</button>
      <button class="link-btn" id="btn-back">放弃 · 返回</button>
    </div>
  `,document.getElementById("btn-fight").addEventListener("click",()=>{We(),a()}),document.getElementById("btn-back").addEventListener("click",()=>{We(),o()})}function Rs(e,n,t,a){const o=I.MAX_HP,i=n.currentFloor,c=Oe[i-1],l=Oe[i];let r="";if(l){const u=B[l.weapon]||"❓",m=O[l.weapon]||"???";r=`
      <div class="tower-next-preview">
        <div class="tower-next-label">下一关: 第 ${i+1} 关</div>
        <div class="tower-next-npc">${l.npc} 「${l.title}」</div>
        <div class="tower-next-wp">${u} ${m}</div>
      </div>
    `}e.innerHTML=`
    <div class="tower-screen">
      <div class="tower-floor-header">✅ 第 ${i} 关 — 胜利!</div>
      <div class="tower-between-msg">${c.npc} 已被击败</div>
      <div class="tower-between-hp">
        ❤️ 恢复气血 <span class="heal">已回满</span>
        <br/>
        ❤️ 当前气血: ${t} → <strong>${n.playerHp}</strong> / ${o}
      </div>
      ${r}
      <button class="primary-btn" id="btn-continue">继续前进 →</button>
    </div>
  `,document.getElementById("btn-continue").addEventListener("click",a)}function _n(e,n,t){const a=O[n.playerWeapon],o=B[n.playerWeapon];e.innerHTML=`
    <div class="tower-screen tower-victory">
      <h1>🏆 武林至尊</h1>
      <p class="tower-result-sub">击败全部 ${Oe.length} 位强敌!</p>
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
  `,document.getElementById("btn-back").addEventListener("click",t)}function Ns(e,n,t,a,o){e.innerHTML=`
    <div class="tower-screen tower-gameover">
      <h1>💀 败北</h1>
      <p class="tower-result-sub">止步于第 ${n.currentFloor+1} 关</p>
      <div class="tower-result-npc">
        败于 ${t.npc}「${t.title}」之手
      </div>
      <button class="primary-btn" id="btn-retry">🔄 重新挑战</button>
      <button class="link-btn" id="btn-back">🏠 返回</button>
    </div>
  `,document.getElementById("btn-retry").addEventListener("click",a),document.getElementById("btn-back").addEventListener("click",o)}vs();const K=document.getElementById("app");let E=null,je=null,_={distanceCard:null,combatCard:null},st=[],ee=!1,F=null,oe=!1,Ke=!1,xt=null,W=null,lt=800,H=null,ke=null;function Ms(){return{isPaused:ee,canUndo:st.length>0,spectator:Ke,autoPlaySpeed:lt}}function Bs(){return{onSelect:ks,onConfirm:_s,onUndo:Ps,onReset:Us,onNewGame:js,onTogglePause:xs,onDifficultyChange:Ks,onSpeedChange:Vs}}function J(){St(),Ke=!1,xt=null,H=null,ke=null,ys(K,{onTower:()=>Es(K,Pn,J),onBattle:()=>As(K,Kt,J),onAiVsAi:()=>Ts(K,Kn,J)})}function St(){E=null,je=null,_={distanceCard:null,combatCard:null},st=[],ee=!1,oe=!1,W&&(clearTimeout(W),W=null)}function Kt(e,n,t){H=null,F={playerWeapon:e,aiWeapon:n,aiLevel:t},St(),E=Et(e,n,t),Hn(),re()}function Pn(e){H=ws(e),F=null,Un()}function Un(){if(ke=Ds(H),!ke){_n(K,H,J);return}Hs(K,H,ke,jn,J)}function jn(){const e=ke;St(),E=Et(H.playerWeapon,e.weapon,e.aiLevel),E.aiName=e.npc,E.aiTitle=e.title,E.player.hp=H.playerHp,F=null,Hn(),re()}function Fs(){if(H)if(E.winner==="player"){const e=H.playerHp;H=Is(H,E.player.hp),Os(H)?(_t(),_n(K,H,J)):(Ma(),Rs(K,H,e,Un))}else Ba(),H.gameOver=!0,Ns(K,H,ke,()=>Pn(H.playerWeapon),J)}function re(){_a(K,E,_,Ms(),Bs()),ls()}function ks(e,n){oe||ee||E.gameOver||(e==="distance"?_.distanceCard===n?(cn(),_.distanceCard=null):(ln(),_.distanceCard=n):_.combatCard===n?(cn(),_.combatCard=null):(ln(),_.combatCard=n),re())}async function _s(){if(oe||ee||E.gameOver||!_.distanceCard||!_.combatCard)return;const e=na(_.distanceCard,_.combatCard,E.player,E.distance);if(!e.valid){Sa(),Bt(e.reason,"warn");return}Ca(),st.push(JSON.parse(JSON.stringify(E))),je=JSON.parse(JSON.stringify(E));const n=tt(E),t={distanceCard:_.distanceCard,combatCard:_.combatCard};E=kt(E,t,n),_={distanceCard:null,combatCard:null},oe=!0;const a=K.querySelector(".game-wrapper");a&&a.classList.add("animating"),re(),await kn(je,E),oe=!1,a&&a.classList.remove("animating"),E.gameOver&&(H?Fs():(E.winner==="player"?_t():On(),Rn(K,E,xn,J)))}function Ps(){st.length!==0&&(E=st.pop(),je=null,_={distanceCard:null,combatCard:null},ee=!1,re())}function Us(){H?jn():F&&Kt(F.playerWeapon,F.aiWeapon,F.aiLevel)}function js(){J()}function xn(){F?Ke&&F.playerAiLevel!=null?Kn(F.playerWeapon,F.aiWeapon,F.playerAiLevel,F.aiLevel):Kt(F.playerWeapon,F.aiWeapon,F.aiLevel):J()}function xs(){E.gameOver||(ee=!ee,re(),Ke&&(ee?W&&(clearTimeout(W),W=null):$t()))}function Ks(e){E&&(E.aiLevel=e)}function Kn(e,n,t,a){H=null,St(),Ke=!0,xt=t,lt=800,E=Et(e,n,a),E.spectatorMode=!0,F={playerWeapon:e,aiWeapon:n,aiLevel:a,playerAiLevel:t},re(),$t()}function $t(){W&&(clearTimeout(W),W=null),!(!E||E.gameOver||ee||oe)&&(W=setTimeout(Gs,Math.max(lt,50)))}async function Gs(){if(W=null,!E||E.gameOver||ee||oe)return;const e=tt(E),n=Nn(E,xt),t=tt(n),a=At(t,E.player,E.distance),o=At(e,E.ai,E.distance);je=JSON.parse(JSON.stringify(E)),E=kt(E,a,o),oe=!0;const i=K.querySelector(".game-wrapper");i&&i.classList.add("animating"),re(),lt>0&&await kn(je,E),oe=!1,i&&i.classList.remove("animating"),E.gameOver?(E.winner==="player"?_t():On(),Rn(K,E,xn,J)):$t()}function Vs(e){lt=e,re(),Ke&&!ee&&!oe&&!E.gameOver&&$t()}J();
