(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function t(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(o){if(o.ep)return;o.ep=!0;const s=t(o);fetch(o.href,s)}})();const b=Object.freeze({SHORT_BLADE:"short_blade",SPEAR:"spear",SWORD:"sword",STAFF:"staff",GREAT_BLADE:"great_blade",DUAL_STAB:"dual_stab"}),v=Object.freeze({HOLD:"hold",ADVANCE:"advance",RETREAT:"retreat",DODGE:"dodge"}),i=Object.freeze({DEFLECT:"deflect",SLASH:"slash",THRUST:"thrust",BLOCK:"block",FEINT:"feint"}),Z=Object.freeze({ATTACK:"attack",DEFENSE:"defense"}),Ee=Object.freeze({SETUP:"setup",INFO_SYNC:"info_sync",PLAYER_PICK:"player_pick",AI_PICK:"ai_pick",DISTANCE_RESOLVE:"distance_resolve",COMBAT_RESOLVE:"combat_resolve",STATUS_RESOLVE:"status_resolve",ROUND_END:"round_end",GAME_OVER:"game_over"});function Ft(e){return{weapon:e,hp:10,stance:0,stamina:4,staggered:!1}}function va(e,a,t){return{distance:2,round:0,phase:Ee.SETUP,player:Ft(e),ai:Ft(a),aiLevel:t,aiName:null,aiTitle:null,history:[],log:[],gameOver:!1,winner:null}}const D={MAX_HP:10,MAX_STANCE:5,EXECUTION_DAMAGE:5,INITIAL_DISTANCE:2,MAX_STAMINA:4,STAMINA_RECOVERY:1},Me=0,_e=3,te=["贴身区","近战区","中距区","远距区"],Te={[i.DEFLECT]:Z.DEFENSE,[i.SLASH]:Z.ATTACK,[i.THRUST]:Z.ATTACK,[i.BLOCK]:Z.DEFENSE,[i.FEINT]:Z.ATTACK},Fe={[i.DEFLECT]:{cost:3,staminaCost:0,damage:2,stanceToOpponent:2,priority:2},[i.SLASH]:{cost:3,staminaCost:0,damage:3,stanceToOpponent:1,priority:3},[i.THRUST]:{cost:1,staminaCost:0,damage:1,stanceToOpponent:1,priority:4},[i.BLOCK]:{cost:2,staminaCost:0,damage:0,stanceToOpponent:0,priority:5},[i.FEINT]:{cost:1,staminaCost:0,damage:0,stanceToOpponent:2,priority:6}},N={[v.ADVANCE]:{cost:2,delta:-1},[v.RETREAT]:{cost:2,delta:1},[v.HOLD]:{cost:0,delta:0},[v.DODGE]:{cost:2,delta:0}},G={[i.DEFLECT]:"卸力",[i.SLASH]:"劈砍",[i.THRUST]:"点刺",[i.BLOCK]:"格挡",[i.FEINT]:"虚晃"},Q={[v.ADVANCE]:"冲步",[v.RETREAT]:"撤步",[v.HOLD]:"扎马",[v.DODGE]:"闪避"},I={[b.SHORT_BLADE]:"短刀",[b.SPEAR]:"长枪",[b.SWORD]:"剑",[b.STAFF]:"棍",[b.GREAT_BLADE]:"大刀",[b.DUAL_STAB]:"双刺"},B={[b.SHORT_BLADE]:"🗡️",[b.SPEAR]:"🔱",[b.SWORD]:"⚔️",[b.STAFF]:"🏑",[b.GREAT_BLADE]:"🪓",[b.DUAL_STAB]:"🥢"},_={[b.SHORT_BLADE]:{advantage:[0,1],disadvantage:[2,3]},[b.SPEAR]:{advantage:[2,3],disadvantage:[0]},[b.SWORD]:{advantage:[1,2],disadvantage:[0,3]},[b.STAFF]:{advantage:[1,2,3],disadvantage:[0]},[b.GREAT_BLADE]:{advantage:[2],disadvantage:[0]},[b.DUAL_STAB]:{advantage:[0],disadvantage:[2,3]}};function ba(e,a,t){const n=N[a].delta,o=N[t].delta,s=e+n+o;return Math.max(Me,Math.min(_e,s))}const Pt={deflectStagger:!0,deflectSelfStance:0,blockSlashReduction:1,advBlockSlashReduction:0,advDodgeCounter:0,advBlockPerfect:!1,advBlockBonusStance:0,advSlashBonusStance:0,advBlockPushDist:0,advFeintBonusStance:0,dodgeCostReduction:0,damageRules:[],pushRules:[]},ya={[b.SHORT_BLADE]:{advDodgeCounter:1,advFeintBonusStance:1,dodgeCostReduction:1,damageRules:[{minDist:3,card:i.SLASH,mod:-3}]},[b.SPEAR]:{advBlockPushDist:1,damageRules:[{adv:!0,card:i.SLASH,mod:2},{dist:0,card:i.SLASH,mod:-3}]},[b.SWORD]:{deflectStagger:!1,deflectSelfStance:-2,advBlockPerfect:!0,damageRules:[{dist:0,card:i.SLASH,mod:-2},{dist:3,card:i.SLASH,mod:-3}]},[b.STAFF]:{advBlockBonusStance:1,advSlashBonusStance:2,advFeintBonusStance:1,damageRules:[{dist:0,card:i.SLASH,mod:-3}],pushRules:[{card:i.FEINT,vs:i.BLOCK,adv:!0,push:1}]},[b.GREAT_BLADE]:{advBlockSlashReduction:1,damageRules:[{adv:!0,card:i.SLASH,mod:3},{dist:0,card:i.SLASH,mod:-3}],pushRules:[{card:i.SLASH,adv:!0,push:1}]},[b.DUAL_STAB]:{advFeintBonusStance:1,dodgeCostReduction:1,damageRules:[{adv:!0,card:i.THRUST,mod:1},{disadv:!0,card:i.SLASH,mod:-3}]}};function W(e){const a=ya[e];return a?{...Pt,...a}:{...Pt}}function C(e,a){return _[e].advantage.includes(a)}function At(e,a){return _[e].disadvantage.includes(a)}function Ce(e,a,t){const n=W(e);for(const o of n.damageRules)if(o.card===t&&!(o.adv&&!C(e,a))&&!(o.disadv&&!At(e,a))&&!(o.dist!==void 0&&o.dist!==a)&&!(o.minDist!==void 0&&a<o.minDist))return o.mod;return 0}function Ut(e,a){return C(e,a)?W(e).advDodgeCounter:0}function Be(e,a){return C(e,a)&&W(e).advBlockPerfect}function Ye(e,a){return C(e,a)?W(e).advBlockBonusStance:0}function $e(e,a){return C(e,a)?W(e).advSlashBonusStance:0}function Qe(e,a){return C(e,a)?W(e).advBlockPushDist:0}function bt(e,a){const t=W(e);return t.blockSlashReduction+(C(e,a)?t.advBlockSlashReduction:0)}function Ea(e){return W(e).deflectStagger}function yt(e,a){return 3+(C(e,a)?W(e).advFeintBonusStance:0)}function at(e){return W(e).dodgeCostReduction}function le(e,a,t,n){if(!C(e,a))return 0;const o=W(e);for(const s of o.pushRules)if(s.card===t&&!(s.adv&&!C(e,a))&&!(s.vs&&s.vs!==n))return s.push;return 0}function jt(e,a){return C(e,a)}function H(e,a,t){return At(a,t)?Math.floor(e/2):e}function Wt(){return{player:{hpChange:0,stanceChange:0,staggered:!1},ai:{hpChange:0,stanceChange:0,staggered:!1},distancePush:0,log:[]}}function K(e,a,t){const n=Fe[e].damage,o=Ce(a,t,e);return Math.max(0,n+o)}function Aa(e,a,t){const n=Wt(),o=e.distance,s=e.player.weapon,c=e.ai.weapon;return a===t?Ta(n,a,s,c,o):(Ca(n,a,t,s,c,o),n)}function Ta(e,a,t,n,o){switch(a){case i.BLOCK:e.log.push("双方空过");break;case i.DEFLECT:e.player.stanceChange+=2,e.ai.stanceChange+=2,e.log.push("卸力对碰，双方各+2架势");break;case i.SLASH:{const s=K(i.SLASH,t,o),c=K(i.SLASH,n,o);e.player.hpChange-=c,e.ai.hpChange-=s,e.player.stanceChange+=H(1,n,o),e.ai.stanceChange+=H(1,t,o);const l=$e(t,o),r=$e(n,o);l>0&&(e.ai.stanceChange+=l),r>0&&(e.player.stanceChange+=r),t==="spear"&&C(t,o)&&(e.ai.stanceChange+=1),n==="spear"&&C(n,o)&&(e.player.stanceChange+=1);const u=le(t,o,i.SLASH,i.SLASH),p=le(n,o,i.SLASH,i.SLASH);e.distancePush+=u+p,e.log.push(`互砍：玩家受${c}伤，AI受${s}伤`);break}case i.THRUST:{const s=K(i.THRUST,t,o),c=K(i.THRUST,n,o);e.player.hpChange-=c,e.ai.hpChange-=s,e.player.stanceChange+=H(1,n,o),e.ai.stanceChange+=H(1,t,o),e.log.push(`互刺：玩家受${c}伤，AI受${s}伤`);break}case i.FEINT:e.log.push("双方虚晃，空过");break}return e}function Ca(e,a,t,n,o,s){if(a===i.DEFLECT&&t===i.SLASH){Kt(e,"player","ai",n);return}if(t===i.DEFLECT&&a===i.SLASH){Kt(e,"ai","player",o);return}if(a===i.DEFLECT&&t===i.THRUST){const c=K(i.THRUST,o,s);e.player.hpChange-=c,e.player.stanceChange+=H(1,o,s),e.log.push(`玩家卸力失败遇点刺：受${c}伤+${H(1,o,s)}架势`);return}if(t===i.DEFLECT&&a===i.THRUST){const c=K(i.THRUST,n,s);e.ai.hpChange-=c,e.ai.stanceChange+=H(1,n,s),e.log.push(`AI卸力失败遇点刺：受${c}伤+${H(1,n,s)}架势`);return}if(a===i.DEFLECT&&t===i.FEINT){e.ai.stanceChange+=2,e.log.push("玩家卸力识破虚晃：AI+2架势");return}if(t===i.DEFLECT&&a===i.FEINT){e.player.stanceChange+=2,e.log.push("AI卸力识破虚晃：玩家+2架势");return}if(a===i.DEFLECT&&t===i.BLOCK){e.player.stanceChange+=1,e.log.push("玩家卸力失败(遇格挡)：+1架势");return}if(t===i.DEFLECT&&a===i.BLOCK){e.ai.stanceChange+=1,e.log.push("AI卸力失败(遇格挡)：+1架势");return}if(a===i.SLASH&&t===i.THRUST){We(e,"player","ai",n,o,s,i.THRUST);return}if(t===i.SLASH&&a===i.THRUST){We(e,"ai","player",o,n,s,i.THRUST);return}if(a===i.SLASH&&t===i.BLOCK){const c=K(i.SLASH,n,s),l=bt(o,s),r=Be(o,s)?0:Math.max(0,c-l);e.ai.hpChange-=r,e.ai.stanceChange+=H(1,n,s);const u=Ye(o,s);u>0&&(e.player.stanceChange+=u),n==="spear"&&C(n,s)&&(e.ai.stanceChange+=1);const p=$e(n,s);p>0&&(e.ai.stanceChange+=p);const d=le(n,s,i.SLASH,i.BLOCK),f=Qe(o,s);e.distancePush+=d+f,Be(o,s)?e.log.push("玩家劈砍被完美格挡(剑)：AI完全免伤"):e.log.push(`玩家劈砍破格挡：AI受${r}伤(减免${l})+架势`);return}if(t===i.SLASH&&a===i.BLOCK){const c=K(i.SLASH,o,s),l=bt(n,s),r=Be(n,s)?0:Math.max(0,c-l);e.player.hpChange-=r,e.player.stanceChange+=H(1,o,s);const u=Ye(n,s);u>0&&(e.ai.stanceChange+=u),o==="spear"&&C(o,s)&&(e.player.stanceChange+=1);const p=$e(o,s);p>0&&(e.player.stanceChange+=p);const d=le(o,s,i.SLASH,i.BLOCK),f=Qe(n,s);e.distancePush+=d+f,Be(n,s)?e.log.push("AI劈砍被完美格挡(剑)：玩家完全免伤"):e.log.push(`AI劈砍破格挡：玩家受${r}伤(减免${l})+架势`);return}if(a===i.SLASH&&t===i.FEINT){We(e,"player","ai",n,o,s,i.FEINT);return}if(t===i.SLASH&&a===i.FEINT){We(e,"ai","player",o,n,s,i.FEINT);return}if(a===i.THRUST&&t===i.BLOCK){const c=Ye(o,s);c>0&&(e.player.stanceChange+=c);const l=Qe(o,s);l>0&&(e.distancePush+=l),e.log.push(`玩家点刺被格挡完全抵消${c>0?"，棍震退+1架势":""}${l>0?"，被弹枪推开":""}`);return}if(t===i.THRUST&&a===i.BLOCK){const c=Ye(n,s);c>0&&(e.ai.stanceChange+=c);const l=Qe(n,s);l>0&&(e.distancePush+=l),e.log.push(`AI点刺被格挡完全抵消${c>0?"，棍震退+1架势":""}${l>0?"，被弹枪推开":""}`);return}if(a===i.THRUST&&t===i.FEINT){const c=K(i.THRUST,n,s);e.ai.hpChange-=c,e.ai.stanceChange+=H(1,n,s),e.log.push(`玩家点刺命中：AI受${c}伤+${H(1,n,s)}架势`);return}if(t===i.THRUST&&a===i.FEINT){const c=K(i.THRUST,o,s);e.player.hpChange-=c,e.player.stanceChange+=H(1,o,s),e.log.push(`AI点刺命中：玩家受${c}伤+${H(1,o,s)}架势`);return}if(a===i.BLOCK&&t===i.FEINT){const c=yt(o,s),l=H(c,o,s);e.player.stanceChange+=l;const r=le(o,s,i.FEINT,i.BLOCK);e.distancePush+=r,e.log.push(`AI虚晃命中格挡：玩家+${l}架势${r?"，距离+"+r:""}`);return}if(t===i.BLOCK&&a===i.FEINT){const c=yt(n,s),l=H(c,n,s);e.ai.stanceChange+=l;const r=le(n,s,i.FEINT,i.BLOCK);e.distancePush+=r,e.log.push(`玩家虚晃命中格挡：AI+${l}架势${r?"，距离+"+r:""}`);return}e.log.push("双方空过")}function Kt(e,a,t,n){const o=Fe[i.DEFLECT].damage;e[t].hpChange-=o,e[t].stanceChange+=2;const s=a==="player"?"玩家":"AI";Ea(n)?(e[t].staggered=!0,e.log.push(`${s}卸力反制成功：对手受${o}伤+2架势+僵直`)):(e[a].stanceChange-=2,e.log.push(`${s}(剑)卸力反制成功：对手受${o}伤+2架势，自身-2架势`))}function We(e,a,t,n,o,s,c){const l=K(i.SLASH,n,s);e[t].hpChange-=l,e[t].stanceChange+=H(1,n,s);const r=$e(n,s);r>0&&(e[t].stanceChange+=r),n==="spear"&&C(n,s)&&(e[t].stanceChange+=1);const u=le(n,s,i.SLASH,c);e.distancePush+=u,e.log.push(`${a==="player"?"玩家":"AI"}劈砍命中：对手受${l}伤+架势${u?"，距离+"+u:""}`)}function Gt(e,a,t){const n=Wt(),o=e.distance,s=e[a].weapon,c=a==="player"?"ai":"player",l=a==="player"?"玩家":"AI";switch(t){case i.SLASH:{const r=K(i.SLASH,s,o);n[c].hpChange-=r,n[c].stanceChange+=H(1,s,o);const u=$e(s,o);u>0&&(n[c].stanceChange+=u),s==="spear"&&C(s,o)&&(n[c].stanceChange+=1);const p=le(s,o,i.SLASH,null);n.distancePush+=p,n.log.push(`${l}劈砍命中(对手闪避失败)：对手受${r}伤+架势`);break}case i.THRUST:{const r=K(i.THRUST,s,o);n[c].hpChange-=r,n[c].stanceChange+=H(1,s,o),n.log.push(`${l}点刺命中(对手闪避失败)：对手受${r}伤`);break}case i.FEINT:{const r=yt(s,o),u=H(r,s,o);n[c].stanceChange+=u,n.log.push(`${l}虚晃命中(对手闪避失败)：对手+${u}架势`);break}case i.DEFLECT:case i.BLOCK:n.log.push(`${l}防守落空(无攻击可防)`);break}return n}function st(e,a,t){const n=va(e,a,t);return n.phase=Ee.INFO_SYNC,n}function Tt(e,a,t){let n=JSON.parse(JSON.stringify(e));return n.round+=1,n.log=[],n.log.push(`══════ 第 ${n.round} 回合 ══════`),n.player.staggered=!1,n.ai.staggered=!1,n._lastPDist=a.distanceCard,n._lastADist=t.distanceCard,n=$a(n,a.distanceCard,t.distanceCard),n=Sa(n,a.combatCard,t.combatCard),n=La(n),n=wa(n),n.history.push({round:n.round,playerDistance:a.distanceCard,playerCombat:a.combatCard,aiDistance:t.distanceCard,aiCombat:t.combatCard,pMoveInterrupted:n._pInterrupted||!1,aMoveInterrupted:n._aInterrupted||!1}),delete n._pInterrupted,delete n._aInterrupted,n}function $a(e,a,t){var c,l;const n=e.distance;e._pDodging=a===v.DODGE,e._aDodging=t===v.DODGE,e._pMoveDelta=N[a].delta,e._aMoveDelta=N[t].delta,e.distance=ba(n,a,t);let o=((c=N[a])==null?void 0:c.cost)??0,s=((l=N[t])==null?void 0:l.cost)??0;return a===v.DODGE&&(o=Math.max(0,o-at(e.player.weapon))),t===v.DODGE&&(s=Math.max(0,s-at(e.ai.weapon))),e.player.stamina=Math.max(0,e.player.stamina-o),e.ai.stamina=Math.max(0,e.ai.stamina-s),o>0&&e.log.push(`玩家身法消耗：-${o}体力`),s>0&&e.log.push(`AI身法消耗：-${s}体力`),e.log.push(`间距变化：${n} → ${e.distance}`),e}function Sa(e,a,t){const n=e._pDodging,o=e._aDodging;let s=!1,c=!1,l=!1,r=!1,u=0,p=0;if(n)if(t==="feint")e.log.push("🎭 AI虚晃穿透闪避！玩家闪避落空");else if(t&&Te[t]===Z.ATTACK)if(t==="thrust"&&jt(e.ai.weapon,e.distance))l=!0,e.log.push("⚡ 玩家闪避被AI点刺打断(优势区)！攻防卡取消");else{s=!0,e.log.push("💨 玩家闪避成功！AI攻击无效");const h=Ut(e.player.weapon,e.distance);h>0&&(e.ai.hp-=h,p-=h,e.log.push(`🗡️ 闪避反击！AI受${h}伤`)),e.player.weapon==="dual_stab"&&(e.ai.stance+=2,e.log.push("🥢 双刺闪避成功：AI+2架势"))}else e.log.push("💨 玩家闪避落空(对手无攻击)");if(o)if(a==="feint")e.log.push("🎭 玩家虚晃穿透闪避！AI闪避落空");else if(a&&Te[a]===Z.ATTACK)if(a==="thrust"&&jt(e.player.weapon,e.distance))r=!0,e.log.push("⚡ AI闪避被玩家点刺打断(优势区)！攻防卡取消");else{c=!0,e.log.push("💨 AI闪避成功！玩家攻击无效");const h=Ut(e.ai.weapon,e.distance);h>0&&(e.player.hp-=h,u-=h,e.log.push(`🗡️ 闪避反击！玩家受${h}伤`)),e.ai.weapon==="dual_stab"&&(e.player.stance+=2,e.log.push("🥢 双刺闪避成功：玩家+2架势"))}else e.log.push("💨 AI闪避落空(对手无攻击)");let d=l?null:a,f=r?null:t;s&&(f=null),c&&(d=null);let m;if(d&&f?m=Aa(e,d,f):d&&!f?m=Gt(e,"player",d):!d&&f?m=Gt(e,"ai",f):m={player:{hpChange:0,stanceChange:0,staggered:!1},ai:{hpChange:0,stanceChange:0,staggered:!1},distancePush:0,log:["双方攻防均被取消"]},e.player.hp+=m.player.hpChange,e.ai.hp+=m.ai.hpChange,e.player.stance+=m.player.stanceChange,e.ai.stance+=m.ai.stanceChange,m.player.staggered&&(e.player.staggered=!0),m.ai.staggered&&(e.ai.staggered=!0),e.distance===0&&(e.player.weapon==="dual_stab"&&(m.ai.hpChange<0||m.ai.stanceChange>0||m.ai.staggered)&&(e.ai.stance+=1,e.log.push("🥢 双刺贴身命中：AI额外+1架势")),e.ai.weapon==="dual_stab"&&(m.player.hpChange<0||m.player.stanceChange>0||m.player.staggered)&&(e.player.stance+=1,e.log.push("🥢 双刺贴身命中：玩家额外+1架势"))),e.distance===0&&(e.player.weapon==="dual_stab"&&d==="thrust"&&m.ai.hpChange<0&&(e.ai.hp-=1,e.log.push("🥢 双刺追击：贴身点刺二连，AI额外受1伤")),e.ai.weapon==="dual_stab"&&f==="thrust"&&m.player.hpChange<0&&(e.player.hp-=1,e.log.push("🥢 双刺追击：贴身点刺二连，玩家额外受1伤"))),m.distancePush!==0){const h=e.distance;e.distance=Math.max(Me,Math.min(_e,e.distance+m.distancePush)),e.distance!==h&&e.log.push(`间距被推动：${h} → ${e.distance}`)}e.log.push(...m.log);const g=m.player.hpChange+(u??0),y=m.ai.hpChange+(p??0);return e._pInterrupted=!1,e._aInterrupted=!1,(e._pMoveDelta??0)!==0&&g<0&&(e.distance=Math.max(Me,Math.min(_e,e.distance-e._pMoveDelta)),e._pInterrupted=!0,e.log.push("⚡ 玩家身法被打断！攻击命中，移动未完成")),(e._aMoveDelta??0)!==0&&y<0&&(e.distance=Math.max(Me,Math.min(_e,e.distance-e._aMoveDelta)),e._aInterrupted=!0,e.log.push("⚡ AI身法被打断！攻击命中，移动未完成")),delete e._pMoveDelta,delete e._aMoveDelta,delete e._pDodging,delete e._aDodging,e}function La(e){const a=D.MAX_STANCE,t=D.EXECUTION_DAMAGE;return e.player.stance=Math.max(0,e.player.stance),e.ai.stance=Math.max(0,e.ai.stance),e.player.stance>=a&&(e.player.hp-=t,e.player.stance=0,e.log.push(`⚔ 玩家被处决！-${t}气血`)),e.ai.stance>=a&&(e.ai.hp-=t,e.ai.stance=0,e.log.push(`⚔ AI被处决！-${t}气血`)),e.player.hp=Math.max(0,e.player.hp),e.ai.hp=Math.max(0,e.ai.hp),e}function wa(e){const a=D.MAX_STAMINA,t=D.STAMINA_RECOVERY;e.history.length>0&&e.history[e.history.length-1].playerDistance,e.history.length>0&&e.history[e.history.length-1].aiDistance;const n=e._lastPDist==="hold",o=e._lastADist==="hold",s=n?t+1:t,c=o?t+1:t;e.player.stamina=Math.min(a,e.player.stamina+s),e.ai.stamina=Math.min(a,e.ai.stamina+c),delete e._lastPDist,delete e._lastADist;const l=e.player.hp<=0,r=e.ai.hp<=0;return l&&r?(e.gameOver=!0,e.winner="draw",e.phase=Ee.GAME_OVER,e.log.push("双方同时倒下——平局！")):l?(e.gameOver=!0,e.winner="ai",e.phase=Ee.GAME_OVER,e.log.push("玩家气血归零——AI胜利！")):r?(e.gameOver=!0,e.winner="player",e.phase=Ee.GAME_OVER,e.log.push("AI气血归零——玩家胜利！")):e.phase=Ee.INFO_SYNC,e}function Ke(e,a,t=0){const{weapon:n,staggered:o,stamina:s}=e;return Object.values(i).filter(l=>!(o&&Te[l]===Z.ATTACK))}function it(e,a){const{stamina:t,weapon:n}=e;return Object.values(v).filter(s=>{var l;if(s===v.HOLD)return!0;if(s===v.ADVANCE&&a<=Me||s===v.RETREAT&&a>=_e)return!1;let c=((l=N[s])==null?void 0:l.cost)??0;return s===v.DODGE&&n&&(c=Math.max(0,c-at(n))),!(t<c)})}function Da(e,a,t,n){var l;if(!it(t,n).includes(e))return{valid:!1,reason:"身法卡不可用"};const s=((l=N[e])==null?void 0:l.cost)??0;return Ke(t,n,s).includes(a)?{valid:!0}:{valid:!1,reason:"攻防卡不可用（体力不足）"}}function Pe(e){const a=e.aiLevel;let t;switch(a){case 1:t=xt(e);break;case 2:t=Ha(e);break;case 3:t=Na(e);break;case 4:t=Ra(e);break;case 5:t=Ba(e);break;case 6:t=Ma(e);break;case 7:t=_a(e);break;case 8:t=ka(e);break;default:t=xt(e);break}return Ia(e,t)}function Ia(e,a){var o;const t=((o=N[a.distanceCard])==null?void 0:o.cost)??0,n=Ke(e.ai,e.distance,t);return n.includes(a.combatCard)||(a.combatCard=$(n)),a}function $(e){if(!(!e||e.length===0))return e[Math.floor(Math.random()*e.length)]}function j(e,a){const t=a.reduce((o,s)=>o+s,0);let n=Math.random()*t;for(let o=0;o<e.length;o++)if(n-=a[o],n<=0)return e[o];return e[e.length-1]}function ce(e){const a=e.distance,t=e.ai,n=it(t,a),o=Ke(t);return{distCards:n,combatCards:o}}function Oa(e){return _[e].advantage}function Se(e,a){const t=Oa(e);if(t.includes(a))return v.HOLD;const n=t.reduce((o,s)=>o+s,0)/t.length;return a>n?v.ADVANCE:v.RETREAT}function R(e,a){const n={[i.SLASH]:[i.DEFLECT,i.BLOCK],[i.THRUST]:[i.BLOCK,i.SLASH],[i.FEINT]:[i.DEFLECT,i.SLASH,i.THRUST],[i.BLOCK]:[i.FEINT,i.SLASH],[i.DEFLECT]:[i.THRUST,i.BLOCK]}[e]||[];for(const o of n)if(a.includes(o))return o;return null}function Ge(e,a){var s,c;const t=e.slice(-a),n={};for(const l of Object.values(i))n[l]=0;t.forEach(l=>n[l.playerCombat]++);const o=Object.entries(n).sort((l,r)=>r[1]-l[1]);return{freq:n,sorted:o,mostUsed:(s=o[0])==null?void 0:s[0],mostCount:((c=o[0])==null?void 0:c[1])||0}}function ot(e,a){const t=e.slice(-a),n={};for(const o of Object.values(v))n[o]=0;return t.forEach(o=>n[o.playerDistance]++),n}function ea(e,a,t){var l;if(!a.includes(v.DODGE)||e.ai.stamina<2)return!1;const n=e.ai.stance,o=e.player.weapon,s=e.distance,c=(l=_[o])==null?void 0:l.advantage.includes(s);return!!(n>=3&&Math.random()<t+.15||c&&Math.random()<t)}function ge(e,a,t={}){const{weapon:n,stamina:o}=e.ai,s=e.player.weapon,c=e.distance,l=_[n].advantage,r=_[s].advantage,u=l.includes(c),p=r.includes(c),d=t.dodgeUrgency||0,f=t.staminaAware||!1,m=t.escapeChance||.4;if(d>0&&ea(e,a,d))return v.DODGE;if(f&&o<=1&&!p)return v.HOLD;let g;if(p&&!u){const y=Se(n,c),h=c<2?v.RETREAT:v.ADVANCE;g=Math.random()<m?h:y}else if(u&&!p)g=v.HOLD;else if(u&&p){const y=l.filter(h=>!r.includes(h));if(y.length){const h=y[0];g=h<c?v.ADVANCE:h>c?v.RETREAT:v.HOLD}else{const h=c<2?v.RETREAT:v.ADVANCE;g=a.includes(h)?h:v.HOLD}}else g=Se(n,c);return a.includes(g)||(g=$(a)),g}function xt(e){const{distCards:a,combatCards:t}=ce(e),n=e.ai.weapon,o=e.distance;let s;Math.random()<.6?(s=Se(n,o),a.includes(s)||(s=$(a))):s=$(a);let c;if(C(n,o)){const l=t.filter(r=>Te[r]===Z.ATTACK);c=l.length&&Math.random()<.65?$(l):$(t)}else{const l=[i.BLOCK,i.THRUST,i.SLASH].filter(r=>t.includes(r));c=l.length?j(l,[3,2,1]):$(t)}return{distanceCard:s,combatCard:c}}function Ha(e){const{distCards:a,combatCards:t}=ce(e),n=e.ai.weapon,o=e.distance,s=e.history;let c=ge(e,a,{escapeChance:.3}),l;const r=s.length>0?s[s.length-1]:null;if(r&&Math.random()<.4&&(l=R(r.playerCombat,t)),!l)if(C(n,o)){const u=[i.SLASH,i.THRUST,i.FEINT].filter(p=>t.includes(p));l=u.length?$(u):$(t)}else{const u=[i.BLOCK,i.THRUST].filter(p=>t.includes(p));l=u.length?$(u):$(t)}return{distanceCard:c,combatCard:l}}function Na(e){const{distCards:a,combatCards:t}=ce(e),n=e.ai.weapon,o=e.distance,s=e.history;let c=ge(e,a,{staminaAware:!0,escapeChance:.45,dodgeUrgency:.15}),l;const r=e.ai.stance,u=e.player.stance,p=s.length>0?s[s.length-1]:null;if(r>=3&&t.includes(i.BLOCK)&&Math.random()<.7&&(l=i.BLOCK),!l&&e.player.staggered){const d=[i.SLASH].filter(f=>t.includes(f));d.length&&(l=d[0])}if(!l&&u>=3){const d=[i.THRUST,i.FEINT].filter(f=>t.includes(f));d.length&&(l=$(d))}if(!l&&p&&Math.random()<.55&&(l=R(p.playerCombat,t)),!l&&s.length>=2){const d=s.slice(-2).map(f=>f.playerCombat);if(d[0]===d[1]){const f=R(d[1],t);f&&Math.random()<.65&&(l=f)}}if(!l)if(C(n,o)){const d=[i.SLASH,i.THRUST,i.FEINT].filter(f=>t.includes(f));l=d.length?j(d,[3,2,2]):$(t)}else{const d=[i.BLOCK,i.THRUST,i.DEFLECT].filter(f=>t.includes(f));l=d.length?j(d,[3,2,1]):$(t)}return{distanceCard:c,combatCard:l}}function Ra(e){const{distCards:a,combatCards:t}=ce(e),n=e.ai.weapon,o=e.distance,s=e.history;let c=ge(e,a,{staminaAware:!0,escapeChance:.55,dodgeUrgency:.2}),l;const r=e.ai.stance,u=e.player.stance,p=s.length>0?s[s.length-1]:null;if(r>=3&&t.includes(i.BLOCK)&&(l=i.BLOCK),!l&&e.player.staggered&&t.includes(i.SLASH)&&(l=i.SLASH),!l&&u>=3){const d=[i.THRUST,i.FEINT,i.SLASH].filter(f=>t.includes(f));d.length&&(l=d[0])}if(!l&&p&&(p.aiCombat===i.FEINT&&(p.playerCombat===i.BLOCK||p.playerCombat===i.DEFLECT)&&t.includes(i.SLASH)&&(l=i.SLASH),!l&&p.aiCombat===i.SLASH&&p.playerCombat===i.DEFLECT&&t.includes(i.THRUST)&&(l=i.THRUST)),!l&&s.length>=2){const{mostUsed:d,mostCount:f}=Ge(s,3);if(f>=2){const m=R(d,t);m&&Math.random()<.65&&(l=m)}}if(!l&&p&&Math.random()<.55&&(l=R(p.playerCombat,t)),!l)if(C(n,o)){const d=[i.SLASH,i.THRUST,i.FEINT].filter(f=>t.includes(f));l=d.length?j(d,[3,2,2]):$(t)}else{const d=[i.BLOCK,i.THRUST,i.DEFLECT].filter(f=>t.includes(f));l=d.length?j(d,[3,2,2]):$(t)}return{distanceCard:c,combatCard:l}}function Ba(e){const{distCards:a,combatCards:t}=ce(e),n=e.ai.weapon;e.player.weapon;const o=e.distance,s=e.history;let c;if(s.length>=3){const d=ot(s,4);d[v.DODGE]>=2,d[v.ADVANCE]>=3&&a.includes(v.RETREAT)&&(c=v.RETREAT)}c||(c=ge(e,a,{staminaAware:!0,escapeChance:.6,dodgeUrgency:.3}));let l;const r=e.ai.stance,u=e.player.stance,p=s.length>0?s[s.length-1]:null;if(r>=4&&t.includes(i.BLOCK)&&(l=i.BLOCK),!l&&r>=3){const d=[i.BLOCK,i.DEFLECT].filter(f=>t.includes(f));d.length&&Math.random()<.75&&(l=$(d))}if(!l&&e.player.staggered&&t.includes(i.SLASH)&&(l=i.SLASH),!l&&u>=3){const d=[i.FEINT,i.SLASH,i.THRUST].filter(f=>t.includes(f));d.length&&(l=d[0])}if(!l&&p&&(p.aiCombat===i.FEINT&&(p.playerCombat===i.BLOCK||p.playerCombat===i.DEFLECT)&&t.includes(i.SLASH)&&(l=i.SLASH),!l&&p.aiCombat===i.SLASH&&p.playerCombat===i.DEFLECT&&t.includes(i.THRUST)&&(l=i.THRUST),!l&&p.playerDistance===v.DODGE&&t.includes(i.FEINT)&&Math.random()<.6&&(l=i.FEINT)),!l&&s.length>=3){const{mostUsed:d,mostCount:f,sorted:m}=Ge(s,5);if(f>=2){const g=R(d,t);g&&Math.random()<.75&&(l=g)}if(!l&&m[1]&&m[1][1]>=2){const g=R(m[1][0],t);g&&Math.random()<.5&&(l=g)}}if(!l&&p&&Math.random()<.6&&(l=R(p.playerCombat,t)),!l)if(C(n,o)){const d=[i.SLASH,i.THRUST,i.FEINT,i.DEFLECT].filter(f=>t.includes(f));l=d.length?j(d,[3,2,2,1]):$(t)}else{const d=[i.BLOCK,i.THRUST,i.DEFLECT,i.FEINT].filter(f=>t.includes(f));l=d.length?j(d,[3,2,2,1]):$(t)}return{distanceCard:c,combatCard:l}}function Ma(e){var d;const{distCards:a,combatCards:t}=ce(e),n=e.ai.weapon;e.player.weapon;const o=e.distance,s=e.history,c=s.length>0?s[s.length-1]:null;let l;if(s.length>=3){const f=ot(s,5);f[v.DODGE]>=2&&(C(n,o)?l=v.HOLD:l=Se(n,o)),!l&&f[v.ADVANCE]>=3&&(C(n,o)?l=v.HOLD:l=a.includes(v.RETREAT)?v.RETREAT:Se(n,o))}l||(l=ge(e,a,{staminaAware:!0,escapeChance:.65,dodgeUrgency:.35})),a.includes(l)||(l=$(a));let r;const u=e.ai.stance,p=e.player.stance;if(u>=3)if(u>=4&&t.includes(i.BLOCK))r=i.BLOCK;else{const f=[i.BLOCK,i.DEFLECT].filter(m=>t.includes(m));f.length&&(r=$(f))}if(!r&&e.player.staggered&&(r=t.includes(i.SLASH)?i.SLASH:null),!r&&p>=3){const f=[i.FEINT,i.THRUST,i.SLASH].filter(m=>t.includes(m));f.length&&(r=f[0])}if(!r&&c&&(c.aiCombat===i.FEINT&&(c.playerCombat===i.BLOCK||c.playerCombat===i.DEFLECT)&&(r=t.includes(i.SLASH)?i.SLASH:null),!r&&c.aiCombat===i.SLASH&&c.playerCombat===i.DEFLECT&&(r=t.includes(i.THRUST)?i.THRUST:null),!r&&c.aiCombat===i.THRUST&&c.playerCombat===i.BLOCK&&(r=t.includes(i.FEINT)?i.FEINT:null),!r&&c.playerDistance===v.DODGE&&t.includes(i.FEINT)&&Math.random()<.7&&(r=i.FEINT)),!r&&s.length>=3){const{mostUsed:f,mostCount:m,sorted:g}=Ge(s,6);if(m>=2){const y=R(f,t);y&&Math.random()<.85&&(r=y)}if(!r&&((d=g[1])==null?void 0:d[1])>=2){const y=R(g[1][0],t);y&&Math.random()<.6&&(r=y)}}if(!r&&c&&(r=R(c.playerCombat,t)),!r)if(C(n,o)){const f=[i.SLASH,i.THRUST,i.FEINT,i.DEFLECT].filter(m=>t.includes(m));r=f.length?j(f,[3,3,2,1]):$(t)}else{const f=[i.BLOCK,i.DEFLECT,i.THRUST,i.FEINT].filter(m=>t.includes(m));r=f.length?j(f,[3,2,2,1]):$(t)}return{distanceCard:l,combatCard:r}}function _a(e){var f;const{distCards:a,combatCards:t}=ce(e),n=e.ai.weapon;e.player.weapon;const o=e.distance,s=e.history,c=s.length>0?s[s.length-1]:null;let l;s.length>=3&&ot(s,5)[v.DODGE]>=2&&(l=C(n,o)?v.HOLD:Se(n,o)),l||(l=ge(e,a,{staminaAware:!0,escapeChance:.7,dodgeUrgency:.35})),a.includes(l)||(l=$(a));let r;const u=e.ai.stance,p=e.player.stance;let d=!1;if(s.length>=2){const m=s.slice(-2).map(g=>g.aiCombat);d=m[0]===m[1]}if(u>=3){const m=[i.BLOCK,i.DEFLECT].filter(g=>t.includes(g));m.length&&(r=u>=4?i.BLOCK:$(m))}if(!r&&e.player.staggered&&(r=t.includes(i.SLASH)?i.SLASH:null),!r&&p>=3){const m=[i.FEINT,i.THRUST,i.SLASH].filter(g=>t.includes(g));m.length&&(r=m[0])}if(!r&&c&&(c.aiCombat===i.FEINT&&(c.playerCombat===i.BLOCK||c.playerCombat===i.DEFLECT)&&(r=t.includes(i.SLASH)?i.SLASH:null),!r&&c.aiCombat===i.SLASH&&c.playerCombat===i.DEFLECT&&(r=t.includes(i.THRUST)?i.THRUST:null),!r&&c.aiCombat===i.THRUST&&c.playerCombat===i.BLOCK&&(r=t.includes(i.FEINT)?i.FEINT:null),!r&&c.playerDistance===v.DODGE&&t.includes(i.FEINT)&&(r=i.FEINT)),!r&&s.length>=3){const{mostUsed:m,mostCount:g,sorted:y}=Ge(s,6);if(g>=2){const h=R(m,t);h&&(r=h)}if(!r&&((f=y[1])==null?void 0:f[1])>=2){const h=R(y[1][0],t);h&&Math.random()<.7&&(r=h)}}if(!r&&c&&(r=R(c.playerCombat,t)),r&&d&&c&&r===c.aiCombat&&Math.random()<.2){const m=t.filter(g=>g!==r);m.length&&(r=$(m))}if(!r)if(C(n,o)){const m=[i.SLASH,i.THRUST,i.FEINT,i.DEFLECT].filter(g=>t.includes(g));r=m.length?j(m,[3,3,2,1]):$(t)}else{const m=[i.BLOCK,i.DEFLECT,i.THRUST,i.FEINT].filter(g=>t.includes(g));r=m.length?j(m,[3,2,2,1]):$(t)}return{distanceCard:l,combatCard:r}}function ka(e){var y;const{distCards:a,combatCards:t}=ce(e),n=e.ai.weapon,o=e.player.weapon,s=e.distance,c=e.history,l=c.length>0?c[c.length-1]:null;let r;const u=C(n,s),p=C(o,s);c.length>=3&&ot(c,5)[v.DODGE]>=2&&u&&(r=v.HOLD),r||e.ai.stamina<=1&&!p&&e.ai.stance<3&&(r=v.HOLD),r||ea(e,a,.45)&&(r=v.DODGE),r||(r=ge(e,a,{staminaAware:!0,escapeChance:.75,dodgeUrgency:0})),a.includes(r)||(r=$(a));let d;const f=e.ai.stance,m=e.player.stance;e.ai.hp;const g=e.player.hp;if(f>=4&&t.includes(i.BLOCK)&&(d=i.BLOCK),!d&&f>=3){const h=[i.BLOCK,i.DEFLECT].filter(L=>t.includes(L));h.length&&(d=$(h))}if(!d&&e.player.staggered&&(d=t.includes(i.SLASH)?i.SLASH:null),!d&&g<=3&&(C(n,s)&&t.includes(i.SLASH)?d=i.SLASH:t.includes(i.THRUST)&&(d=i.THRUST)),!d&&m>=3){const h=[i.FEINT,i.THRUST,i.SLASH].filter(L=>t.includes(L));h.length&&(d=h[0])}if(!d&&l){const h=l.aiCombat,L=R(h,Object.values(i));if(L){const T=R(L,t);T&&Math.random()<.6&&(d=T)}}if(!d&&l&&(l.aiCombat===i.FEINT&&(l.playerCombat===i.BLOCK||l.playerCombat===i.DEFLECT)&&(d=t.includes(i.SLASH)?i.SLASH:null),!d&&l.aiCombat===i.SLASH&&l.playerCombat===i.DEFLECT&&(d=t.includes(i.THRUST)?i.THRUST:null),!d&&l.aiCombat===i.THRUST&&l.playerCombat===i.BLOCK&&(d=t.includes(i.FEINT)?i.FEINT:null),!d&&l.playerDistance===v.DODGE&&(d=t.includes(i.FEINT)?i.FEINT:null)),!d&&c.length>=2){const{mostUsed:h,mostCount:L,sorted:T}=Ge(c,8);if(L>=2){const A=R(h,t);A&&(d=A)}if(!d&&((y=T[1])==null?void 0:y[1])>=2){const A=R(T[1][0],t);A&&(d=A)}}if(!d&&l&&(d=R(l.playerCombat,t)),d&&c.length>=4&&Math.random()<.15){const h=t.filter(L=>L!==d);if(h.length){const L=h.map(T=>Te[T]===Z.ATTACK&&C(n,s)?3:T===i.BLOCK&&f>=2?2:1);d=j(h,L)}}if(!d)if(C(n,s)){const h=[i.SLASH,i.THRUST,i.FEINT,i.DEFLECT].filter(L=>t.includes(L));d=h.length?j(h,[4,3,2,1]):$(t)}else{const h=[i.BLOCK,i.DEFLECT,i.THRUST,i.FEINT].filter(L=>t.includes(L));d=h.length?j(h,[3,3,2,1]):$(t)}return{distanceCard:r,combatCard:d}}function Fa(e,a){const t=C(e,a),n=At(e,a),o=[];switch(t&&o.push({icon:"★",text:"优势区",cls:"trait-buff"}),n&&o.push({icon:"✗",text:"劣势区",cls:"trait-nerf"}),e){case b.SHORT_BLADE:t&&(o.push({icon:"🎯",text:"点刺破闪避",cls:"trait-buff"}),o.push({icon:"🗡️",text:"闪避时反击1伤",cls:"trait-buff"})),a>=3&&o.push({icon:"⚠",text:"劈砍几乎无效",cls:"trait-nerf"});break;case b.SPEAR:t&&(o.push({icon:"🔱",text:"劈砍+2伤+额外架势",cls:"trait-buff"}),o.push({icon:"🛡️",text:"格挡弹枪推1距",cls:"trait-buff"})),a===0&&o.push({icon:"⚠",text:"劈砍几乎无效",cls:"trait-nerf"});break;case b.SWORD:t&&(o.push({icon:"⚔️",text:"卸力不造成僵直",cls:"trait-buff"}),o.push({icon:"🛡️",text:"完美格挡(劈砍免伤)",cls:"trait-buff"})),a===0&&o.push({icon:"⚠",text:"劈砍大幅削弱",cls:"trait-nerf"}),a===3&&o.push({icon:"⚠",text:"劈砍大幅削弱",cls:"trait-nerf"});break;case b.STAFF:t&&(o.push({icon:"🏑",text:"虚晃+3架势",cls:"trait-buff"}),o.push({icon:"↗",text:"虚晃破格挡→推距",cls:"trait-buff"}),o.push({icon:"⚡",text:"劈砍额外+2架势",cls:"trait-buff"}),o.push({icon:"🛡️",text:"格挡震退+1架势",cls:"trait-buff"})),a===0&&o.push({icon:"⚠",text:"劈砍几乎无效",cls:"trait-nerf"});break;case b.GREAT_BLADE:t&&(o.push({icon:"🪓",text:"劈砍+3伤(共6)",cls:"trait-buff"}),o.push({icon:"↗",text:"劈砍命中→推距+1",cls:"trait-buff"}),o.push({icon:"🛡️",text:"格挡额外减1伤",cls:"trait-buff"})),a===0&&o.push({icon:"⚠",text:"劈砍几乎无效",cls:"trait-nerf"});break;case b.DUAL_STAB:t&&(o.push({icon:"🥢",text:"点刺追击+1伤",cls:"trait-buff"}),o.push({icon:"💨",text:"闪避→对手+2架势",cls:"trait-buff"}),o.push({icon:"✦",text:"命中额外+1架势",cls:"trait-buff"})),n&&o.push({icon:"⚠",text:"劈砍几乎无效",cls:"trait-nerf"});break}return o}function Pa(e,a,t,n,o){const s=[],c=G[e],l=G[a];if(s.push(`玩家出 <strong>${c}</strong> vs AI出 <strong>${l}</strong>`),e===a){switch(e){case i.BLOCK:case i.FEINT:s.push("双方出了相同的牌 → <strong>空过</strong>，无事发生");break;case i.DEFLECT:s.push("卸力对碰 → <strong>双方各+2架势</strong>");break;case i.SLASH:s.push("互砍 → <strong>双方各受劈砍伤害+1架势</strong>");break;case i.THRUST:s.push("互刺 → <strong>双方各受点刺伤害+1架势</strong>");break}return s}if(qt(s,e,a,t,n,o,"玩家"),s.length===1&&qt(s,a,e,n,t,o,"AI"),C(t,o)){const r=Ce(t,o,e);r>0&&s.push(`📈 玩家 ${I[t]} 优势区加成：${c}伤害+${r}`)}if(C(n,o)){const r=Ce(n,o,a);r>0&&s.push(`📈 AI ${I[n]} 优势区加成：${l}伤害+${r}`)}return s}function qt(e,a,t,n,o,s,c){if(a===i.DEFLECT)t===i.SLASH?(e.push(`${c}卸力 vs 劈砍 → <strong>卸力反制成功！</strong>劈砍方受2伤+2架势+僵直`),n==="sword"&&e.push("（⚔️ 剑的卸力：不造成僵直，改为自身-2架势）")):t===i.THRUST?e.push(`${c}卸力 vs 点刺 → <strong>卸力失败</strong>（点刺穿透卸力），卸力方受点刺伤害+1架势`):t===i.FEINT?e.push(`${c}卸力 vs 虚晃 → <strong>卸力识破！</strong>虚晃方+2架势`):t===i.BLOCK&&e.push(`${c}卸力 vs 格挡 → <strong>卸力落空</strong>，卸力方+1架势`);else if(a===i.SLASH){const l=Fe[i.SLASH].damage,r=Ce(n,s,i.SLASH),u=Math.max(0,l+r),p=r<0?`（势区惩罚${r}，实际${u}伤）`:"";if(t===i.THRUST)e.push(`${c}劈砍 vs 点刺 → <strong>劈砍克制点刺！</strong>点刺方受${u}伤+1架势${p}`);else if(t===i.BLOCK){const d=bt(o,s);if(Be(o,s))e.push(`${c}劈砍 vs 格挡 → <strong>完美格挡！</strong>格挡方完全免伤${p}`);else{const f=Math.max(0,u-d);e.push(`${c}劈砍 vs 格挡 → <strong>劈砍破格挡</strong>，格挡方减免${d}伤后受${f}伤+1架势${p}`)}}else t===i.FEINT&&e.push(`${c}劈砍 vs 虚晃 → <strong>劈砍命中！</strong>虚晃方受${u}伤+1架势${p}`)}else if(a===i.THRUST){const l=Fe[i.THRUST].damage,r=Ce(n,s,i.THRUST),u=Math.max(0,l+r),p=r!==0?`（距离修正${r>0?"+":""}${r}，实际${u}伤）`:"";t===i.BLOCK?e.push(`${c}点刺 vs 格挡 → <strong>格挡完全抵消</strong>点刺，无伤害`):t===i.FEINT&&e.push(`${c}点刺 vs 虚晃 → <strong>点刺命中！</strong>虚晃方受${u}伤+1架势${p}`)}else a===i.BLOCK&&t===i.FEINT&&e.push(`${c}格挡 vs 虚晃 → <strong>格挡被虚晃骗</strong>，格挡方+3架势`)}function ta(){return`
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
      <tr><td>🤺 卸力</td><td>防守</td><td>克劈砍(反打2伤+僵直)＋识破虚晃(对手+2架势)。遇其他牌吃亏</td></tr>
      <tr><td>⚡ 劈砍</td><td>攻击</td><td>重击3伤，克制点刺和虚晃，但怕卸力</td></tr>
      <tr><td>🎯 点刺</td><td>攻击</td><td>快攻1伤，穿透卸力，但被劈砍完克、被格挡抵消</td></tr>
      <li><strong>🛡️ 格挡</strong></td><td>防守</td><td>完全挡住点刺，减1点劈砍伤害，但被虚晃骗+3架势</li>
      <tr><td>🌀 虚晃</td><td>攻击</td><td>0伤害但给对手+3架势，克格挡和闪避，怕劈砍和卸力</td></tr>
    </table>

    <h4>🔄 核心克制链 · 记住这个就够了</h4>
    <div class="tutorial-chain">
      <p><strong>⚡劈砍</strong> → 克 → 🎯点刺、🌀虚晃、🛡️格挡(破防)</p>
      <p><strong>🎯点刺</strong> → 克 → 🤺卸力、🌀虚晃</p>
      <p><strong>🤺卸力</strong> → 克 → ⚡劈砍 (反制2伤+僵直)、🌀虚晃 (识破+2架势)</p>
      <p><strong>🛡️格挡</strong> → 克 → 🎯点刺 (完全抵消)</p>
      <p><strong>🌀虚晃</strong> → 克 → 🛡️格挡 (骗出+3架势)、💨闪避 (穿透闪避)</p>
      <p><strong>💨闪避</strong>(身法卡) → 闪开对手劈砍/点刺，但<strong>无法闪避虚晃</strong>，同时自己的攻防卡照常生效</p>
    </div>

    <h4>⚠️ 容易被忽略的重要规则</h4>
    <ul>
      <li><strong>💨 闪避</strong>：闪避与冲步/撤步/扎马互斥。闪避消耗<strong>2体力</strong>（短刀/双刺仅耗1），但可以同时出一张攻防卡。</li>
      <li><strong>闪避成功</strong>：对手的劈砍/点刺被无效化，你的攻防卡照常生效（可能单方面命中对手！）。</li>
      <li><strong>虚晃穿透闪避</strong>：对手出虚晃时，你的闪避会<strong>落空</strong>！体力白耗。</li>
      <li><strong>闪避被打断</strong>：对手在<strong>优势区使用点刺</strong>可以打断闪避，且你的攻防卡也会被<strong>连带取消</strong>（级联打断）。</li>
      <li><strong>身法打断</strong>：如果你在移动（冲步/撤步）的同时被攻击命中扣血，你的移动会被<strong>取消</strong>！距离回到移动前的位置。</li>
      <li><strong>劣势区架势减半</strong>：在劣势区攻击时，造成的架势效果<strong>减半</strong>（向下取整）。劣势区进攻只能割血，无法有效累积架势。</li>
      <li><strong>架势 → 处决</strong>：架势累计到5点自动触发「处决」<strong>扣5血</strong>，然后架势清零。管好架势比管血更重要！</li>
      <li><strong>僵直</strong>：被卸力反制后下回合<strong>所有攻击卡禁用</strong>，只能防守。</li>
      <li><strong>体力限制</strong>：体力上限4，每回合恢复1（扎马恢复2）。冲步/撤步/闪避消耗体力，体力不够则无法使用。</li>
    </ul>

    <h4>🏹 兵器一览</h4>
    <ul>
      <li><strong>� 短刀</strong>：优势区0-1 | 点刺破闪避，闪避反击1伤，闪避仅耗1体力 | 远距劈砍几乎无效</li>
      <li><strong>🔱 长枪</strong>：优势区2-3 | 劈砍+2伤，劈砍额外+1架势，格挡弹枪推1距 | 贴身劈砍几乎无力</li>
      <li><strong>⚔️ 剑</strong>：优势区1-2 | 卸力不僵直改为自身-2架势，完美格挡(劈砍免伤) | 贴身/远距劈砍削弱</li>
      <li><strong>🏏 棍</strong>：优势区1-3(最广) | 虚晃+3架势+推距，劈砍额外+2架势，格挡震退+1架势 | 贴身劈砍无力</li>
      <li><strong>🪓 大刀</strong>：优势区仅2 | 劈砍+3伤(全场最高)+推1距，格挡额外减伤 | 贴身劈砍无力</li>
      <li><strong>🥢 双刺</strong>：优势区仅0 | 贴身点刺追击+1伤，闪避+2架势，闪避仅耗1体力，贴身命中+1架势 | 远距攻击大幅削弱</li>
    </ul>

    <h4>💡 操作提示</h4>
    <ul>
      <li>点击已选卡牌可取消选择</li>
      <li>虚线卡牌 = 距离不佳，伤害几乎为0；灰色卡牌 = 僵直/体力不足</li>
      <li>鼠标悬停卡牌可看详细提示</li>
      <li>⏪ 回退按钮可撤销上一回合</li>
      <li>右侧历史记录中<strong>点击任意回合</strong>可查看该回合的详细解释</li>
    </ul>
  `}function aa(){return`
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
    ${Ua()}

    <h4>★ 闪避机制（身法卡）</h4>
    <ul>
      <li>闪避是<strong>身法卡</strong>，与冲步/撤步/扎马互斥，选了闪避就不能移动。</li>
      <li>选择闪避后<strong>仍然要选一张攻防卡</strong>（5选1）。</li>
      <li>闪避成功：对手的<strong>劈砍/点刺被无效化</strong>，你的攻防卡<strong>照常生效</strong>（可能单方面命中！）。对手的防御卡仍有效。</li>
      <li><strong>虚晃穿透闪避</strong>：对手出虚晃时，你的闪避会<strong>落空</strong>，体力白耗。</li>
      <li><strong>优势区点刺破闪避</strong>：当点刺方处于自身兵器优势区时，点刺可无视闪避直接命中。</li>
      <li><strong>级联打断</strong>：闪避被点刺打断时，你的攻防卡也会被<strong>连带取消</strong>！</li>
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
    ${ja()}

    <h4>📉 距离对伤害的影响</h4>
    <ul>
      <li>在<strong>劣势区</strong>攻击会受到伤害惩罚，卡牌显示为"虚线框" + "⚠ 距离不佳"</li>
      <li>伤害惩罚严重时（-3），基础伤害会降为0，等于空招</li>
      <li>所有卡牌始终可用，但要注意距离对效果的影响</li>
    </ul>
  `}function Ua(){return`
    <table class="rules-matrix">
      <tr><th>我方＼对手</th><th>🤺卸力</th><th>⚡劈砍</th><th>🎯点刺</th><th>🛡️格挡</th><th>🌀虚晃</th></tr>
      <tr><td><strong>🤺卸力</strong></td><td>各+2架势</td><td class="rule-win">反制！对手受2伤+2架势+僵直</td><td class="rule-lose">被刺穿：受点刺伤+1架势</td><td class="rule-lose">浪费：自身+1架势</td><td class="rule-win">识破！对手+2架势</td></tr>
      <tr><td><strong>⚡劈砍</strong></td><td class="rule-lose">被反制！受2伤+2架势+僵直</td><td>互砍各受伤</td><td class="rule-win">命中！对手受3伤+1架势</td><td class="rule-win">破防！减1伤后命中</td><td class="rule-win">命中！对手受3伤+1架势</td></tr>
      <tr><td><strong>🎯点刺</strong></td><td class="rule-win">穿透！对手受1伤+1架势</td><td class="rule-lose">被克：受3伤+1架势</td><td>互刺各受伤</td><td class="rule-lose">被挡：完全抵消</td><td class="rule-win">命中！对手受1伤+1架势</td></tr>
      <tr><td><strong>🛡️格挡</strong></td><td>空过(对手+1架势)</td><td class="rule-lose">被破：受减伤后伤害+1架势</td><td class="rule-win">格挡：完全抵消</td><td>空过</td><td class="rule-lose">被骗：自身+3架势</td></tr>
      <tr><td><strong>🌀虚晃</strong></td><td class="rule-lose">被识破：自身+2架势</td><td class="rule-lose">被砍：受3伤+1架势</td><td class="rule-lose">被刺：受1伤+1架势</td><td class="rule-win">骗到：对手+3架势</td><td>空过</td></tr>
    </table>
  `}function ja(){return`
    <table class="rules-matrix">
      <tr><th>兵器</th><th>优势区</th><th>劣势区</th><th>核心特点</th></tr>
      <tr><td>🗡️ 短刀</td><td>0, 1</td><td>2, 3</td><td>优势区点刺破闪避、闪避反击1伤、远距劈砍几乎无伤</td></tr>
      <tr><td>🔱 长枪</td><td>2, 3</td><td>0</td><td>劈砍+2伤、劈砍额外+1架势、格挡弹枪推1距、贴身劈砍几乎无伤</td></tr>
      <tr><td>⚔️ 剑</td><td>1, 2</td><td>0, 3</td><td>卸力不僵直/自身-2架势、完美格挡(劈砍免伤)、贴身远距劈砍削弱</td></tr>
      <tr><td>🏏 棍</td><td>1, 2, 3</td><td>0</td><td>虚晃+3架势+推距、劈砍额外+2架势、格挡震退+1架势、贴身劈砍几乎无伤</td></tr>
      <tr><td>🪓 大刀</td><td>2</td><td>0</td><td>劈砍+3伤(全场最高)+推1距、格挡额外减伤、贴身劈砍几乎无伤</td></tr>
      <tr><td>🥢 双刺</td><td>0</td><td>2, 3</td><td>贴身点刺追击+1伤、闪避+2架势、贴身命中+1架势</td></tr>
    </table>
  `}const k={[i.DEFLECT]:{emoji:"🤺",type:"防",desc:"反制劈砍+识破虚晃，克劈砍/虚晃"},[i.SLASH]:{emoji:"⚡",type:"攻",desc:"3伤+1架势，高威力"},[i.THRUST]:{emoji:"🎯",type:"攻",desc:"1伤+1架势，快速打击"},[i.BLOCK]:{emoji:"🛡️",type:"防",desc:"减免攻击伤害"},[i.FEINT]:{emoji:"🌀",type:"攻",desc:"0伤+3架势，克格挡/闪避，被卸力识破"}},Ue={[v.ADVANCE]:{emoji:"⬆️",desc:"冲步：间距-1"},[v.RETREAT]:{emoji:"⬇️",desc:"撤步：间距+1"},[v.HOLD]:{emoji:"⏸️",desc:"不变"},[v.DODGE]:{emoji:"💨",desc:"闪避(耗2体力，短刀/双刺耗1)：闪开劈砍/点刺，无法躲虚晃"}},oe={0:{player:42,ai:58},1:{player:35,ai:65},2:{player:24,ai:76},3:{player:12,ai:88}},w=(e,a)=>({cat:e,text:a}),na={[b.SHORT_BLADE]:{style:"近身刺客",traits:[w("core","优势区闪避反击1伤"),w("core","闪避仅耗1体力"),w("buff","优势区虚晃+4架势"),w("weak","远距(3)劈砍无伤")]},[b.SPEAR]:{style:"中远控距",traits:[w("core","优势区格挡弹枪→推距+1"),w("buff","优势区劈砍5伤，额外+1架势"),w("weak","贴身(0)劈砍无伤")]},[b.SWORD]:{style:"均衡防反",traits:[w("core","卸力不僵直，自身回2架势"),w("core","优势区格挡完全免劈砍"),w("weak","贴身劈砍仅1伤，远距劈砍无伤")]},[b.STAFF]:{style:"广域压制",traits:[w("core","优势区虚晃命中格挡→推距+1"),w("core","优势区格挡给对手+1架势"),w("buff","优势区虚晃+4架势 / 劈砍+2架势"),w("weak","贴身(0)劈砍无伤")]},[b.GREAT_BLADE]:{style:"重击爆发",traits:[w("core","优势区劈砍命中→推距+1"),w("core","优势区格挡减2伤(常规1)"),w("buff","优势区劈砍6伤(全场最高)"),w("weak","贴身(0)劈砍无伤")]},[b.DUAL_STAB]:{style:"贴身缠斗",traits:[w("core","闪避成功→对手+2架势"),w("core","闪避仅耗1体力"),w("buff","贴身：点刺3伤(追击) / 虚晃+4架势"),w("weak","中远距(2-3)劈砍无伤")]}},Ka={core:{label:"特",cls:"wz-cat-core"},buff:{label:"强",cls:"wz-cat-buff"},weak:{label:"弱",cls:"wz-cat-weak"}},zt=["core","buff","weak"],Ga={[b.SHORT_BLADE]:[{name:"贴身步",emoji:"👣",desc:"间距-1，贴身区额外减体力消耗"}],[b.SPEAR]:[{name:"撑杆退",emoji:"🔱",desc:"间距+1，阻止对手下回合靠近超过1格"}],[b.SWORD]:[{name:"游身换位",emoji:"🌊",desc:"间距不变，获得下回合优先结算权"}],[b.STAFF]:[{name:"拨草寻蛇",emoji:"🐍",desc:"间距+1，并给对手+1架势"}],[b.GREAT_BLADE]:[{name:"沉肩带步",emoji:"🏋️",desc:"间距-1，下回合劈砍消耗-1"}],[b.DUAL_STAB]:[{name:"蛇行缠步",emoji:"🥢",desc:"间距-2，消耗2体力"}]};function xa(e){return(Ga[e]||[]).map(t=>`
    <div class="dist-card disabled weapon-skill-card" title="${t.desc}（未开发）">
      <span class="dc-emoji">${t.emoji}</span>
      <span class="dc-name">${t.name}</span>
      <span class="dc-cost">🔒</span>
    </div>
  `).join("")}function P(e,a=null){const t=_[e],n=na[e],o=[0,1,2,3].map(l=>{const r=t.advantage.includes(l),u=t.disadvantage.includes(l),p=l===a;let d="wz-cell";r?d+=" wz-adv":u?d+=" wz-dis":d+=" wz-neutral",p&&(d+=" wz-current");const f=r?"★":u?"✗":"·";return`<div class="${d}">
      <div class="wz-dist-name">${te[l]}</div>
      <div class="wz-marker">${f}</div>
      ${p?'<div class="wz-here">▲</div>':""}
    </div>`}).join(""),c=(n?[...n.traits].sort((l,r)=>zt.indexOf(l.cat)-zt.indexOf(r.cat)):[]).map(l=>{const r=Ka[l.cat];return`<span class="wz-trait ${r.cls}"><span class="wz-cat-label">${r.label}</span>${l.text}</span>`}).join("");return`
    <div class="wz-strip">
      <div class="wz-header">${B[e]} ${I[e]} · ${(n==null?void 0:n.style)||""}</div>
      <div class="wz-bar">${o}</div>
      ${c?`<div class="wz-traits">${c}</div>`:""}
    </div>
  `}function qa(e,a=!1){const t=na[e];return`
    <div class="weapon-pick-btn ${a?"selected":""}" data-weapon="${e}">
      <span class="wpb-emoji">${B[e]}</span>
      <span class="wpb-name">${I[e]}</span>
      <span class="wpb-style">${(t==null?void 0:t.style)||""}</span>
    </div>
  `}function za(e,a,t,n,o){const s=n.spectator,c=s?sn(a,n):Va(a,t),l=`
    <div class="game-wrapper">
      ${Xa(a,n)}
      <div class="game-layout">
        ${c}
        ${Qa(a,n)}
        ${cn(a,s)}
      </div>
      ${un()}
    </div>
    ${pn()}
    ${fn()}
  `;e.innerHTML=l,gn(a,t,n,o)}function Xa(e,a){return a.spectator?`
      <div class="top-bar">
        <div class="game-title">🦗 斗蛐蛐</div>
        <div class="top-controls">
          <button class="ctrl-btn" data-action="tutorial">📚 引导</button>
          <button class="ctrl-btn" data-action="newgame">🏠 返回</button>
          <button class="ctrl-btn" data-action="pause">${a.isPaused?"▶️ 继续":"⏸️ 暂停"}</button>
          <span class="round-badge">第 ${e.round+1} 回合</span>
        </div>
      </div>
    `:`
    <div class="top-bar">
      <div class="game-title">⚔️ 冷刃博弈</div>
      <div class="top-controls">
        <button class="ctrl-btn" data-action="tutorial">📚 引导</button>
        <select class="diff-select" data-action="difficulty">
          ${[1,2,3,4,5,6].map(t=>`<option value="${t}" ${t===e.aiLevel?"selected":""}>难度${t}</option>`).join("")}
        </select>
        <button class="ctrl-btn" data-action="newgame">🎮 新对局</button>
        <button class="ctrl-btn" data-action="reset">🔄 重置</button>
        <button class="ctrl-btn" data-action="pause">${a.isPaused?"▶️ 继续":"⏸️ 暂停"}</button>
        <button class="ctrl-btn" data-action="undo" ${a.canUndo?"":"disabled"}>⏪ 回退</button>
        <span class="round-badge">第 ${e.round+1} 回合</span>
      </div>
    </div>
  `}function Va(e,a){var r;const t=e.player,n=e.distance,o=t.staggered?'<span class="stagger-badge">⚠ 僵直</span>':"",s=it(t,n),c=a.distanceCard?((r=N[a.distanceCard])==null?void 0:r.cost)??0:0,l=Ke(t,n,c);return`
    <div class="side-panel player-side">
      <div class="panel-header">
        <span class="panel-icon">👤</span>
        <span class="panel-name">玩家 ${o}</span>
        <span class="weapon-badge">${B[t.weapon]||""} ${I[t.weapon]}</span>
      </div>
      ${Ct(t)}
      ${P(t.weapon,e.distance)}
      <div class="divider"></div>
      <div class="card-sel-title">🃏 选择出牌</div>
      <div class="card-group-label">身法卡（必选）</div>
      <div class="cards-row">
        ${Za(e,a,t,s)}
      </div>
      <div class="card-group-label weapon-skill-label">🔒 兵器专属身法 <span class="dev-tag">未开发</span></div>
      <div class="cards-row weapon-skills-row">
        ${xa(e.player.weapon)}
      </div>
      <div class="card-group-label">攻防卡（必选）</div>
      <div class="cards-grid compact">
        ${Ya(e,a,t,l)}
      </div>
      <button class="btn-confirm" id="btn-confirm"
        ${!a.distanceCard||!a.combatCard?"disabled":""}>
        确认出牌
      </button>
    </div>
  `}function Ct(e,a){const t=D.MAX_HP,n=D.MAX_STANCE,o=D.MAX_STAMINA;return`
    ${gt("❤️ 气血","hp",e.hp,t)}
    ${gt("💨 体力","stamina",e.stamina,o,!1)}
    ${gt("⚡ 架势","stance",e.stance,n,e.stance>=4)}
  `}function gt(e,a,t,n,o){const s=Math.max(0,t/n*100);return`
    <div class="stat-row" data-stat="${a}">
      <span class="stat-label">${e}</span>
      <div class="stat-bar-wrap">
        <div class="stat-bar ${a}${o?" danger":""}" data-max="${n}" style="width: ${s}%"></div>
      </div>
      <span class="stat-value">${t}/${n}</span>
    </div>
  `}function Za(e,a,t,n){const o=e.player;return e.distance,[v.ADVANCE,v.RETREAT,v.HOLD,v.DODGE].map(c=>{var m;const l=n.includes(c),r=a.distanceCard===c,u=Ue[c];let p=((m=N[c])==null?void 0:m.cost)??0;c===v.DODGE&&o.weapon&&(p=Math.max(0,p-at(o.weapon)));const d=[u.desc];p>0&&d.push(`耗${p}体力`),!l&&p>0&&o.stamina<p&&d.push(`⛔ 体力不足（需要${p}）`);const f=d.join(`
`);return`
      <div class="dist-card ${r?"selected":""} ${l?"":"disabled"}"
           data-type="distance" data-card="${c}" title="${f}">
        <span class="dc-emoji">${u.emoji}</span>
        <span class="dc-name">${Q[c]}</span>
        ${p>0?`<span class="dc-cost">${p}体</span>`:""}
      </div>
    `}).join("")}function Ja(e,a,t,n,o,s){return n&&Te[e]===Z.ATTACK?"⛔ 僵直中，无法使用攻击":""}function Ya(e,a,t,n){var c;const o=e.player,s=e.distance;return a.distanceCard&&((c=N[a.distanceCard])==null||c.cost),Object.values(i).map(l=>{const r=n.includes(l),u=a.combatCard===l,p=k[l],d=Fe[l],f=p.type==="攻"?"atk":"def",m=[p.desc],g=Ce(o.weapon,s,l);g>0&&m.push(`📈 优势区加成：伤害+${g}`),g<0&&g>=-2&&m.push(`📉 劣势区减益：伤害${g}`),g<=-3&&m.push(`⚠️ 距离不佳：伤害${g}，几乎无效`),r||m.push(Ja(l,o.weapon,s,o.staggered,o.stamina));const y=m.join(`
`),h=g<=-3&&d.damage>0?"cc-weak":"";return`
      <div class="combat-card ${u?"selected":""} ${r?"":"disabled"} ${h}"
           data-type="combat" data-card="${l}" title="${y}">
        <div class="cc-top">
          <span class="cc-emoji">${p.emoji}</span>
          <span class="cc-name">${G[l]}</span>
          <span class="cc-type ${f}">${p.type}</span>
        </div>
        <div class="cc-desc">${p.desc}</div>
        <div class="cc-footer">
          <span>伤${d.damage}</span>
          <span>P${d.priority}</span>
          ${g!==0?`<span class="cc-mod ${g>0?"buff":"nerf"}">${g>0?"+":""}${g}伤</span>`:""}
        </div>
        ${h?'<div class="cc-weak-tag">⚠ 距离不佳</div>':""}
      </div>
    `}).join("")}function Qa(e,a){const t=a.spectator;return`
    <div class="center-area">
      ${a.isPaused?'<div class="paused-banner">⏸ 已暂停 — 点击「继续」恢复</div>':""}
      ${t?"":Wa(e)}
      <div class="arena-wrapper">
        ${tn(e,t)}
        ${an(e,t)}
      </div>
      ${en(e,t)}
      ${nn(e)}
    </div>
  `}function Wa(e){const a=e.player,t=e.ai,n=e.distance,o=_[a.weapon],s=_[t.weapon],c=o.advantage.includes(n),l=s.advantage.includes(n),r=o.disadvantage.includes(n),u=[];c&&!l?u.push("✅ 你在优势间距！攻击伤害加成"):l&&!c?u.push("⚠️ 对手在优势间距！考虑用身法调整间距"):c&&l?u.push("⚔️ 双方都在优势区，正面较量！"):r&&u.push("❌ 你在劣势区，攻击受削弱！"),a.stance>=4?u.push("🔴 你架势快满了！被攻击可能触发处决(-5血)"):t.stance>=4&&u.push("🟢 对手架势快满了！攻击/虚晃可触发处决"),a.stamina<=1?u.push("🔋 体力不足！只能扎马，无法进退"):t.stamina<=1&&u.push("🎯 对手体力不足！无法移动，趁机调整间距"),a.staggered&&u.push("😵 僵直中！本回合无法使用攻击卡"),t.staggered&&u.push("💥 对手僵直！无法使用攻击卡，进攻好时机"),u.length===0&&u.push("💡 选择1张身法卡 + 1张攻防卡，点确认出牌");const p=Fa(a.weapon,n),d=p.length>0?`<div class="trait-tags">${p.map(f=>`<span class="trait-tag ${f.cls}">${f.icon} ${f.text}</span>`).join("")}</div>`:"";return`<div class="situation-hint">${u.join('<span class="hint-sep">|</span>')}</div>${d}`}function en(e,a=!1){const t=_[e.player.weapon],n=_[e.ai.weapon],o=e.distance,s=a?"🤖左":"👤",c=a?"🤖右":"🤖",l=(r,u)=>{const p=[0,1,2,3].map(d=>{const f=u.advantage.includes(d),m=u.disadvantage.includes(d),g=d===o;let y="azr-cell";return f?y+=" azr-adv":m&&(y+=" azr-dis"),g&&(y+=" azr-current"),`<span class="${y}">${f?"★":m?"✗":""}${te[d]}</span>`}).join("");return`<div class="azr-row"><span class="azr-label">${r}</span>${p}</div>`};return`
    <div class="arena-zone-ribbon">
      ${l(s,t)}
      ${l(c,n)}
    </div>
  `}function tn(e,a=!1){const t=D.MAX_HP,n=D.MAX_STANCE,o=oe[e.distance]||oe[2],s=(e.player.hp/t*100).toFixed(0),c=(e.ai.hp/t*100).toFixed(0),l=(e.player.stance/n*100).toFixed(0),r=(e.ai.stance/n*100).toFixed(0),u=o.player,p=o.ai-o.player,d=a?"左方":"玩家",f=e.aiName||(a?"右方":"AI"),m=e.player.staggered?"😵":a?"🤖":"🧑",g=e.ai.staggered?"😵":e.aiName?"👤":"🤖";return`
    <div class="battle-arena">
      <div class="arena-title">⚔️ 战斗场景</div>
      <div class="arena-stage dist-${e.distance}" id="arena-stage" style="--arena-cam:${e.distance}">
        <div class="arena-parallax-far"></div>
        <div class="arena-parallax-mid"></div>
        <div class="arena-dist-label">${te[e.distance]}</div>
        <div class="arena-dist-line" style="left:${u}%;width:${p}%"></div>
        <div class="fighter player-fighter" id="player-fighter" style="left:${o.player}%">
          <div class="fighter-weapon-icon">${B[e.player.weapon]||"🗡️"}</div>
          <div class="fighter-body">${m}</div>
          <div class="fighter-label">${d}</div>
          <div class="mini-bars">
            <div class="mini-bar"><div class="mini-bar-fill hp-p" style="width:${s}%"></div></div>
            <div class="mini-bar"><div class="mini-bar-fill stance-f" style="width:${l}%"></div></div>
          </div>
        </div>
        <div class="fighter ai-fighter" id="ai-fighter" style="left:${o.ai}%">
          <div class="fighter-weapon-icon">${B[e.ai.weapon]||"🔱"}</div>
          <div class="fighter-body">${g}</div>
          <div class="fighter-label">${f}</div>
          <div class="mini-bars">
            <div class="mini-bar"><div class="mini-bar-fill hp-a" style="width:${c}%"></div></div>
            <div class="mini-bar"><div class="mini-bar-fill stance-f" style="width:${r}%"></div></div>
          </div>
        </div>
      </div>
    </div>
  `}function an(e,a=!1){if(e.history.length===0)return`<div class="round-result-banner">${a?"等待开战...":"等待出牌..."}</div>`;const t=e.history[e.history.length-1],n=Q[t.playerDistance],o=G[t.playerCombat],s=Q[t.aiDistance],c=G[t.aiCombat],l=k[t.playerCombat]?k[t.playerCombat].emoji:"",r=k[t.aiCombat]?k[t.aiCombat].emoji:"",u=a?"🤖":"👤";return`
    <div class="round-result-banner">
      <span class="rrb-label">第${e.round}回合</span>
      <span class="rrb-player">${u} ${n}+${l}${o}</span>
      <span class="rrb-vs">VS</span>
      <span class="rrb-ai">🤖 ${s}+${r}${c}</span>
    </div>
  `}function nn(e){return`
    <div class="battle-log" id="battle-log">
      <div class="log-title">📜 战斗日志</div>
      ${e.log.map(t=>{let n="log-line";return(t.includes("处决")||t.includes("伤"))&&(n+=" damage"),t.includes("══")&&(n+=" highlight"),(t.includes("闪避成功")||t.includes("格挡"))&&(n+=" good"),`<div class="${n}">${t}</div>`}).join("")||'<div class="log-line">等待对局开始...</div>'}
    </div>
  `}function sn(e,a){const t=e.player;return`
    <div class="side-panel player-side">
      <div class="panel-header">
        <span class="panel-icon">🤖</span>
        <span class="panel-name">左方 ${t.staggered?'<span class="stagger-badge">⚠ 僵直</span>':""}</span>
        <span class="weapon-badge">${B[t.weapon]||""} ${I[t.weapon]}</span>
      </div>
      ${Ct(t)}
      ${P(t.weapon,e.distance)}
      <div class="divider"></div>
      ${on(e)}
      <div class="divider"></div>
      ${ln(a)}
    </div>
  `}function on(e){if(e.history.length===0)return`
      <div class="ai-last-action">
        <div class="ala-title">🀴 左方上回合</div>
        <div class="ala-waiting">等待第一回合...</div>
      </div>
    `;const a=e.history[e.history.length-1],t=Ue[a.playerDistance],n=k[a.playerCombat];return`
    <div class="ai-last-action">
      <div class="ala-title">🀴 左方上回合</div>
      <div class="ala-cards">
        <div class="ala-card">${t.emoji} ${Q[a.playerDistance]}</div>
        <div class="ala-card">${n.emoji} ${G[a.playerCombat]} <span class="cc-type ${n.type==="攻"?"atk":"def"}">${n.type}</span></div>
      </div>
    </div>
  `}function ln(e){return`
    <div class="speed-controls">
      <div class="speed-title">⏩ 播放速度</div>
      <div class="speed-btns">
        ${[{label:"慢速",value:2e3},{label:"正常",value:800},{label:"快速",value:100},{label:"极速",value:0}].map(t=>`<button class="speed-btn ${e.autoPlaySpeed===t.value?"active":""}" data-speed="${t.value}">${t.label}</button>`).join("")}
      </div>
    </div>
  `}function cn(e,a=!1){const t=e.ai,n=t.staggered?'<span class="stagger-badge">⚠ 僵直</span>':"",o=e.aiName?"👤":"🤖",s=e.aiName||(a?"右方":"AI"),c=a?"🀴 右方上回合出牌":"🀴 AI上回合出牌";return`
    <div class="side-panel ai-side">
      <div class="panel-header">
        <span class="panel-icon">${o}</span>
        <span class="panel-name">${s} ${n}</span>
        <span class="weapon-badge">${B[t.weapon]||""} ${I[t.weapon]}</span>
      </div>
      ${Ct(t)}
      ${P(t.weapon,e.distance)}
      <div class="divider"></div>
      ${rn(e,c)}
      <div class="divider"></div>
      ${dn(e,a)}
    </div>
  `}function rn(e,a){const t=a;if(e.history.length===0)return`
      <div class="ai-last-action">
        <div class="ala-title">${t}</div>
        <div class="ala-waiting">等待第一回合...</div>
      </div>
    `;const n=e.history[e.history.length-1],o=Ue[n.aiDistance],s=k[n.aiCombat];return`
    <div class="ai-last-action">
      <div class="ala-title">${t}</div>
      <div class="ala-cards">
        <div class="ala-card">${o.emoji} ${Q[n.aiDistance]}</div>
        <div class="ala-card">${s.emoji} ${G[n.aiCombat]} <span class="cc-type ${s.type==="攻"?"atk":"def"}">${s.type}</span></div>
      </div>
    </div>
  `}function dn(e,a=!1){const t=a?"🤖左":"👤",n=a?"🤖右":"🤖";return`
    <div class="history-section">
      <div class="history-title">📜 历史记录 <span class="history-hint">点击回合查看详情</span></div>
      <div class="history-list" id="history-list">
        ${e.history.map((s,c)=>{const l=Q[s.playerDistance],r=G[s.playerCombat],u=Q[s.aiDistance],p=G[s.aiCombat],d=k[s.playerCombat]?k[s.playerCombat].emoji:"",f=k[s.aiCombat]?k[s.aiCombat].emoji:"",m=s.pMoveInterrupted?" 🔙":"",g=s.aMoveInterrupted?" 🔙":"";return`
      <div class="history-item history-clickable" data-round-idx="${c}" title="点击查看本回合详细解释">
        <div class="h-round">回合 ${c+1} <span class="h-explain-hint">🔍</span></div>
        <div class="h-player">${t} ${l} + ${d} ${r}${m}</div>
        <div class="h-ai">${n} ${u} + ${f} ${p}${g}</div>
      </div>
    `}).reverse().join("")||'<div class="history-item"><div class="h-detail">暂无记录</div></div>'}
      </div>
    </div>
  `}function un(){return`
    <div class="bottom-bar">
      <div class="rule-summary">
        <span>身法控距</span>为第一核心 |
        <span>双向架势</span>为胜负根基 |
        <span>攻防预判</span>为博弈循环
      </div>
      <button class="btn-rules" data-action="rules">📖 完整规则</button>
    </div>
  `}function pn(){return`
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
          ${ta()}
        </div>

        <!-- Tab: 完整规则 -->
        <div class="modal-content-text tab-content" id="tab-rules">
          ${aa()}
        </div>
      </div>
    </div>
  `}function fn(){return`
    <div class="modal-overlay" id="modal-round-detail">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title" id="round-detail-title">🔍 回合详情</div>
          <button class="modal-close" data-close="round-detail">关闭</button>
        </div>
        <div class="modal-content-text" id="round-detail-content"></div>
      </div>
    </div>
  `}function mn(e,a){var Xe,he,ve,re,Ie,Ve,Oe,X;const t=e.history[a];if(!t)return;const n=Q[t.playerDistance],o=G[t.playerCombat],s=Q[t.aiDistance],c=G[t.aiCombat],l=((Xe=k[t.playerCombat])==null?void 0:Xe.emoji)||"",r=((he=k[t.aiCombat])==null?void 0:he.emoji)||"",u=e.player.weapon,p=e.ai.weapon;let d=D.INITIAL_DISTANCE??2;for(let ee=0;ee<a;ee++){const V=e.history[ee],He=((ve=N[V.playerDistance])==null?void 0:ve.delta)??0,ne=((re=N[V.aiDistance])==null?void 0:re.delta)??0;d=Math.max(0,Math.min(3,d+He+ne)),V.pMoveInterrupted&&(d=Math.max(0,Math.min(3,d-He))),V.aMoveInterrupted&&(d=Math.max(0,Math.min(3,d-ne)))}const f=d,m=((Ie=N[t.playerDistance])==null?void 0:Ie.delta)??0,g=((Ve=N[t.aiDistance])==null?void 0:Ve.delta)??0,y=Math.max(0,Math.min(3,f+m+g));let h=y;t.pMoveInterrupted&&(h=Math.max(0,Math.min(3,h-m))),t.aMoveInterrupted&&(h=Math.max(0,Math.min(3,h-g)));const L=(Oe=_[u])==null?void 0:Oe.advantage.includes(y),T=(X=_[p])==null?void 0:X.advantage.includes(y),A=[];if(A.push(`<h4>📋 第 ${a+1} 回合概要</h4>`),A.push('<div class="rd-cards">'),A.push(`<div class="rd-card-row"><span class="rd-p">👤 玩家：</span>${n} + ${l} ${o}（${B[u]} ${I[u]}）</div>`),A.push(`<div class="rd-card-row"><span class="rd-a">🤖 AI：</span>${s} + ${r} ${c}（${B[p]} ${I[p]}）</div>`),A.push("</div>"),A.push("<h4>① 身法结算</h4>"),A.push("<ul>"),A.push(`<li>回合前间距：<strong>${te[f]}(${f})</strong></li>`),m!==0||g!==0)A.push(`<li>玩家${n}(${m>0?"+":""}${m}) + AI${s}(${g>0?"+":""}${g})</li>`),A.push(`<li>移动后间距：<strong>${te[y]}(${y})</strong></li>`);else if(t.playerDistance==="dodge"||t.aiDistance==="dodge"){const ee=t.playerDistance==="dodge"?"闪避":"扎马",V=t.aiDistance==="dodge"?"闪避":"扎马";A.push(`<li>玩家${ee} + AI${V}，间距不变</li>`)}else A.push("<li>双方扎马，间距不变</li>");L&&A.push(`<li>✅ 玩家 ${I[u]} 在优势区</li>`),T&&A.push(`<li>⚠️ AI ${I[p]} 在优势区</li>`),A.push("</ul>"),A.push("<h4>② 攻防结算</h4>"),A.push("<ul>"),Pa(t.playerCombat,t.aiCombat,u,p,y).forEach(ee=>A.push(`<li>${ee}</li>`)),A.push("</ul>"),(t.pMoveInterrupted||t.aMoveInterrupted)&&(A.push("<h4>③ ⚡ 身法打断</h4>"),A.push("<ul>"),t.pMoveInterrupted&&A.push(`<li>玩家在移动中（${n}）受到HP伤害 → <strong>移动被取消</strong>，间距回退</li>`),t.aMoveInterrupted&&A.push(`<li>AI在移动中（${s}）受到HP伤害 → <strong>移动被取消</strong>，间距回退</li>`),A.push(`<li>最终间距：<strong>${te[h]}(${h})</strong></li>`),A.push("</ul>")),A.push("<h4>📍 最终间距</h4>"),A.push(`<p><strong>${te[h]}(${h})</strong></p>`);const qe=document.getElementById("round-detail-title"),ze=document.getElementById("round-detail-content");qe&&(qe.textContent=`🔍 第 ${a+1} 回合详解`),ze&&(ze.innerHTML=A.join(`
`)),tt("modal-round-detail",!0)}function gn(e,a,t,n){document.querySelectorAll(".dist-card:not(.disabled), .combat-card:not(.disabled)").forEach(s=>{s.addEventListener("click",()=>{n.onSelect(s.dataset.type,s.dataset.card)})});const o=document.getElementById("btn-confirm");o&&!o.disabled&&o.addEventListener("click",()=>n.onConfirm()),document.querySelectorAll("[data-action]").forEach(s=>{const c=s.dataset.action;s.addEventListener(s.tagName==="SELECT"?"change":"click",()=>{switch(c){case"tutorial":tt("modal-tutorial",!0),ht("guide");break;case"rules":tt("modal-tutorial",!0),ht("rules");break;case"newgame":n.onNewGame();break;case"reset":n.onReset();break;case"pause":n.onTogglePause();break;case"undo":n.onUndo();break;case"difficulty":n.onDifficultyChange(parseInt(s.value));break}})}),document.querySelectorAll("[data-close]").forEach(s=>{s.addEventListener("click",()=>{tt("modal-"+s.dataset.close,!1)})}),document.querySelectorAll(".modal-overlay").forEach(s=>{s.addEventListener("click",c=>{c.target===s&&s.classList.remove("active")})}),document.querySelectorAll("#modal-tutorial .modal-tab").forEach(s=>{s.addEventListener("click",()=>ht(s.dataset.tab))}),document.querySelectorAll(".history-clickable").forEach(s=>{s.addEventListener("click",()=>{const c=parseInt(s.dataset.roundIdx);mn(e,c)})}),document.querySelectorAll(".speed-btn").forEach(s=>{s.addEventListener("click",()=>{n.onSpeedChange&&n.onSpeedChange(parseInt(s.dataset.speed))})})}function tt(e,a){const t=document.getElementById(e);t&&(a?t.classList.add("active"):t.classList.remove("active"))}function ht(e){document.querySelectorAll("#modal-tutorial .modal-tab").forEach(a=>{a.classList.toggle("active",a.dataset.tab===e)}),document.querySelectorAll("#modal-tutorial .tab-content").forEach(a=>{a.classList.toggle("active",a.id==="tab-"+e)})}function sa(e,a,t,n){const o=D.MAX_HP,s=a.spectatorMode;let c,l;s?a.winner==="player"?(c="🏆 左方胜出！",l="win"):a.winner==="ai"?(c="🏆 右方胜出！",l="lose"):(c="🤝 平局",l="draw"):a.winner==="player"?(c="🏆 胜利！",l="win"):a.winner==="ai"?(c="💀 败北",l="lose"):(c="🤝 平局",l="draw");const r=s?"🤖 左方":"👤",u=s?"🤖 右方":a.aiName?"👤":"🤖",p=s?"右方":a.aiName||"AI",d=document.querySelector(".center-area");if(!d)return;const f=document.createElement("div");f.className="game-over-banner "+l,f.innerHTML=`
    <div class="gob-title">${c}</div>
    <div class="gob-stats">
      回合${a.round} ｜ 
      ${r} HP ${a.player.hp}/${o} ｜ 
      ${u} ${p} HP ${a.ai.hp}/${o}
    </div>
    <div class="gob-btns">
      <button class="gob-btn restart" id="btn-restart-same">🔄 再来一局</button>
      <button class="gob-btn back" id="btn-back-setup">🏠 返回选择</button>
    </div>
  `,d.insertBefore(f,d.firstChild),document.getElementById("btn-restart-same").addEventListener("click",()=>{t()}),document.getElementById("btn-back-setup").addEventListener("click",()=>{n()})}function hn(){const e=document.getElementById("battle-log");e&&(e.scrollTop=e.scrollHeight)}const vn=50;function ia(e,a){const t=JSON.parse(JSON.stringify(e)),n=t.player;return t.player=t.ai,t.ai=n,t.aiLevel=a,t.history=t.history.map(o=>({round:o.round,playerDistance:o.aiDistance,playerCombat:o.aiCombat,aiDistance:o.playerDistance,aiCombat:o.playerCombat})),t}function nt(e,a,t){const n=Ke(a),o=it(a,t);let s=e.combatCard,c=e.distanceCard;return(!s||!n.includes(s))&&(s=n.length>0?n[Math.floor(Math.random()*n.length)]:i.BLOCK),(!c||!o.includes(c))&&(c=o.length>0?o[Math.floor(Math.random()*o.length)]:v.HOLD),{combatCard:s,distanceCard:c}}function bn(e,a,t,n){let o=st(e,a,n),s=0;for(;!o.gameOver&&s<vn;){const c=Pe(o),l=ia(o,t),r=Pe(l),u=nt(r,o.player,o.distance),p=nt(c,o.ai,o.distance);o=Tt(o,u,p),s++}return o.winner||"draw"}function yn(e,a,t,n){const o={};for(const s of e){o[s]={};for(const c of e){let l=0,r=0,u=0;for(let p=0;p<n;p++){const d=bn(s,c,a,t);d==="player"?l++:d==="ai"?r++:u++}o[s][c]={wins:l,losses:r,draws:u}}}return o}const oa=Object.values(b);function En(){const e=document.getElementById("sim-modal");e&&e.remove();const a=document.createElement("div");a.id="sim-modal",a.className="sim-modal-overlay",a.innerHTML=`
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
  `,document.body.appendChild(a),document.getElementById("sim-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",t=>{t.target===a&&a.remove()}),document.getElementById("sim-run").addEventListener("click",()=>{const t=parseInt(document.getElementById("sim-player-level").value),n=parseInt(document.getElementById("sim-ai-level").value),o=parseInt(document.getElementById("sim-num-games").value),s=document.getElementById("sim-results");s.innerHTML='<p class="sim-loading">⏳ 模拟运行中…</p>',setTimeout(()=>{const c=yn(oa,t,n,o);An(s,c,o,t,n)},50)})}function An(e,a,t,n,o){const s=oa,c=B||{},l=I;let r=0,u=0;for(const m of s)for(const g of s)r+=a[m][g].wins,u+=t;const p=(r/u*100).toFixed(1);let d=`<div class="sim-summary">L${n} vs L${o} · 每组${t}局 · 左侧总胜率 <strong>${p}%</strong></div>`;d+='<table class="sim-table"><thead><tr><th>左↓ \\ 右→</th>';for(const m of s)d+=`<th>${c[m]||""} ${l[m].slice(0,2)}</th>`;d+="</tr></thead><tbody>";for(const m of s){d+=`<tr><td class="sim-row-header">${c[m]||""} ${l[m]}</td>`;for(const g of s){const y=a[m][g],h=Math.round(y.wins/t*100),L=Tn(h),T=`胜${y.wins} 负${y.losses} 平${y.draws}`;d+=`<td class="sim-cell ${L}" title="${T}">${h}%</td>`}d+="</tr>"}d+="</tbody></table>",d+='<div class="sim-ranking"><strong>武器综合胜率排名：</strong>';const f=s.map(m=>{let g=0,y=0;for(const h of s)g+=a[m][h].wins,y+=t;return{weapon:m,rate:Math.round(g/y*100)}}).sort((m,g)=>g.rate-m.rate);d+=f.map((m,g)=>`<span class="sim-rank-item">${g+1}. ${c[m.weapon]||""} ${l[m.weapon]} ${m.rate}%</span>`).join(" "),d+="</div>",e.innerHTML=d}function Tn(e){return e>=65?"sim-hot":e>=55?"sim-warm":e>=45?"sim-neutral":e>=35?"sim-cool":"sim-cold"}const $t="lbq2_config";function Cn(){const e={};for(const[a,t]of Object.entries(_))e[a]={advantage:[...t.advantage],disadvantage:[...t.disadvantage]};return{...D,WEAPON_ZONES:e}}const Le=Cn(),fe={MAX_HP:{label:"最大气血",min:5,max:30,step:1},MAX_STANCE:{label:"处决架势阈值",min:3,max:10,step:1},EXECUTION_DAMAGE:{label:"处决伤害",min:2,max:15,step:1},INITIAL_DISTANCE:{label:"初始间距",min:0,max:3,step:1},MAX_STAMINA:{label:"最大体力",min:2,max:8,step:1},STAMINA_RECOVERY:{label:"体力回复/回合",min:1,max:3,step:1}},Xt=Le;function ke(e){return JSON.parse(JSON.stringify(e))}function la(){try{const e=localStorage.getItem($t);return e?JSON.parse(e):null}catch{return null}}function $n(e){try{return localStorage.setItem($t,JSON.stringify(e)),!0}catch{return!1}}function St(e){if(e){for(const a of Object.keys(fe))e[a]!==void 0&&(D[a]=e[a]);if(e.WEAPON_ZONES)for(const[a,t]of Object.entries(e.WEAPON_ZONES))_[a]&&(_[a]=ke(t))}}function Sn(){localStorage.removeItem($t),St(ke(Le))}function Vt(e){if(!e)return[];const a=[];for(const t of Object.keys(fe)){const n=Le[t],o=e[t];o!==void 0&&o!==n&&a.push({key:t,label:fe[t].label,default:n,current:o})}if(e.WEAPON_ZONES)for(const[t,n]of Object.entries(e.WEAPON_ZONES)){const o=Le.WEAPON_ZONES[t];if(!o)continue;const s=JSON.stringify(n.advantage)!==JSON.stringify(o.advantage),c=JSON.stringify(n.disadvantage)!==JSON.stringify(o.disadvantage);if(s||c){const l=I[t]||t;s&&a.push({key:t+"_adv",label:l+" 优势区",default:o.advantage.join(","),current:n.advantage.join(",")}),c&&a.push({key:t+"_disadv",label:l+" 劣势区",default:o.disadvantage.join(","),current:n.disadvantage.join(",")})}}return a}function ca(){const e=la();if(!e)return ke(Le);const a=ke(Le);for(const t of Object.keys(fe))e[t]!==void 0&&(a[t]=e[t]);if(e.WEAPON_ZONES)for(const[t,n]of Object.entries(e.WEAPON_ZONES))a.WEAPON_ZONES[t]&&(a.WEAPON_ZONES[t]=ke(n));return a}function Ln(){const e=la();e&&St(e)}function Et(e,a="info"){let t=document.getElementById("toast-container");t||(t=document.createElement("div"),t.id="toast-container",document.body.appendChild(t));const n=document.createElement("div");n.className=`game-toast toast-${a}`,n.textContent=e,t.appendChild(n),n.offsetWidth,n.classList.add("toast-show"),setTimeout(()=>{n.classList.add("toast-hide"),n.addEventListener("animationend",()=>n.remove())},2200)}function wn(){const e=document.getElementById("cfg-modal");e&&e.remove();const a=ca(),t=["0-贴身","1-近战","2-中距","3-远距"],n=document.createElement("div");n.id="cfg-modal",n.className="sim-modal-overlay";let o="";for(const[r,u]of Object.entries(fe)){const p=a[r],d=Xt[r],f=p!==d;o+=`
      <div class="cfg-row">
        <label>${u.label}</label>
        <input type="number" id="cfg-${r}" value="${p}" min="${u.min}" max="${u.max}" step="${u.step}" />
        <span class="cfg-default${f?" cfg-changed":""}">(默认: ${d})</span>
      </div>`}let s="";for(const[r,u]of Object.entries(a.WEAPON_ZONES)){const p=(B[r]||"")+" "+(I[r]||r),d=Xt.WEAPON_ZONES[r],f=d&&JSON.stringify(u.advantage)!==JSON.stringify(d.advantage),m=d&&JSON.stringify(u.disadvantage)!==JSON.stringify(d.disadvantage);s+=`
      <div class="cfg-weapon-block">
        <div class="cfg-weapon-name">${p}</div>
        <div class="cfg-zone-row">
          <label>优势区</label>
          <div class="cfg-checkboxes" data-weapon="${r}" data-type="advantage">
            ${t.map((g,y)=>`<label class="cfg-cb"><input type="checkbox" value="${y}" ${u.advantage.includes(y)?"checked":""} /> ${g}</label>`).join("")}
          </div>
          ${f?'<span class="cfg-changed-dot">●</span>':""}
        </div>
        <div class="cfg-zone-row">
          <label>劣势区</label>
          <div class="cfg-checkboxes" data-weapon="${r}" data-type="disadvantage">
            ${t.map((g,y)=>`<label class="cfg-cb"><input type="checkbox" value="${y}" ${u.disadvantage.includes(y)?"checked":""} /> ${g}</label>`).join("")}
          </div>
          ${m?'<span class="cfg-changed-dot">●</span>':""}
        </div>
      </div>`}const c=Vt(a);let l="";c.length>0&&(l='<div class="cfg-diff"><strong>与默认值差异：</strong>'+c.map(r=>`<div class="cfg-diff-item"><span class="cfg-diff-label">${r.label}</span> <span class="cfg-diff-old">${r.default}</span> → <span class="cfg-diff-new">${r.current}</span></div>`).join("")+"</div>"),n.innerHTML=`
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
      <div id="cfg-diff-area">${l}</div>
      <div class="cfg-actions">
        <button class="cfg-btn cfg-save" id="cfg-save">💾 保存</button>
        <button class="cfg-btn cfg-reset" id="cfg-reset">↩ 恢复默认</button>
        <button class="cfg-btn cfg-cancel" id="cfg-cancel">取消</button>
      </div>
    </div>
  `,document.body.appendChild(n),n.addEventListener("click",r=>{r.target===n&&n.remove()}),document.getElementById("cfg-close").addEventListener("click",()=>n.remove()),document.getElementById("cfg-cancel").addEventListener("click",()=>n.remove()),document.getElementById("cfg-save").addEventListener("click",()=>{const r=Zt();$n(r),St(r),n.remove(),Et("✅ 配置已保存！下次对局生效。","success")}),document.getElementById("cfg-reset").addEventListener("click",()=>{Sn(),n.remove(),Et("↩ 已恢复默认配置！","info")}),n.querySelectorAll("input").forEach(r=>{r.addEventListener("change",()=>{const u=Zt(),p=Vt(u),d=document.getElementById("cfg-diff-area");p.length>0?d.innerHTML='<div class="cfg-diff"><strong>与默认值差异：</strong>'+p.map(f=>`<div class="cfg-diff-item"><span class="cfg-diff-label">${f.label}</span> <span class="cfg-diff-old">${f.default}</span> → <span class="cfg-diff-new">${f.current}</span></div>`).join("")+"</div>":d.innerHTML='<div class="cfg-diff"><em>无差异（全部为默认值）</em></div>'})})}function Zt(){const e=ca();for(const a of Object.keys(fe)){const t=document.getElementById(`cfg-${a}`);t&&(e[a]=parseInt(t.value)||fe[a].min)}return document.querySelectorAll(".cfg-checkboxes").forEach(a=>{const t=a.dataset.weapon,n=a.dataset.type,o=[];a.querySelectorAll('input[type="checkbox"]:checked').forEach(s=>{o.push(parseInt(s.value))}),e.WEAPON_ZONES[t]||(e.WEAPON_ZONES[t]={advantage:[],disadvantage:[]}),e.WEAPON_ZONES[t][n]=o.sort()}),e}function Dn(e,a){e.innerHTML=`
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
  `,document.getElementById("mode-tower").addEventListener("click",a.onTower),document.getElementById("mode-battle").addEventListener("click",a.onBattle),document.getElementById("mode-aivai").addEventListener("click",a.onAiVsAi),document.getElementById("btn-title-tutorial").addEventListener("click",()=>Nn()),document.getElementById("btn-title-sim").addEventListener("click",()=>En()),document.getElementById("btn-title-config").addEventListener("click",()=>wn())}function In(e,a,t){const n=b.SHORT_BLADE,o=b.SPEAR;e.innerHTML=`
    <div class="mode-setup">
      <button class="back-link" id="btn-back">← 返回</button>
      <h2>⚔ 自由对战</h2>
      <div class="battle-setup-cols">
        <div class="setup-weapon-col">
          <div class="setup-col-title">👤 你的兵器</div>
          <select id="sel-player" class="setup-select">
            ${Object.entries(I).map(([s,c])=>`<option value="${s}">${B[s]||""} ${c}</option>`).join("")}
          </select>
          <div id="player-wz">${P(n)}</div>
        </div>
        <div class="setup-vs">VS</div>
        <div class="setup-weapon-col">
          <div class="setup-col-title">🤖 对手兵器</div>
          <select id="sel-ai" class="setup-select">
            ${Object.entries(I).map(([s,c])=>`<option value="${s}">${B[s]||""} ${c}</option>`).join("")}
          </select>
          <div id="ai-wz">${P(o)}</div>
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
  `,document.getElementById("sel-ai").value=o,document.getElementById("sel-player").addEventListener("change",s=>{document.getElementById("player-wz").innerHTML=P(s.target.value)}),document.getElementById("sel-ai").addEventListener("change",s=>{document.getElementById("ai-wz").innerHTML=P(s.target.value)}),document.getElementById("btn-start").addEventListener("click",()=>{a(document.getElementById("sel-player").value,document.getElementById("sel-ai").value,parseInt(document.getElementById("sel-level").value))}),document.getElementById("btn-back").addEventListener("click",t)}function On(e,a,t){let n=b.SHORT_BLADE;function o(){e.innerHTML=`
      <div class="mode-setup">
        <button class="back-link" id="btn-back">← 返回</button>
        <h2>🗼 江湖行 — 选择你的兵器</h2>
        <p class="setup-hint">兵器将伴随你走完全部十关</p>
        <div class="weapon-pick-grid">
          ${Object.values(b).map(s=>qa(s,s===n)).join("")}
        </div>
        <div id="weapon-preview">${P(n)}</div>
        <button class="primary-btn" id="btn-start">⚔ 启程</button>
      </div>
    `,document.querySelectorAll(".weapon-pick-btn").forEach(s=>{s.addEventListener("click",()=>{n=s.dataset.weapon,o()})}),document.getElementById("btn-start").addEventListener("click",()=>a(n)),document.getElementById("btn-back").addEventListener("click",t)}o()}const Jt=[{value:1,label:"1 - 菜鸟"},{value:2,label:"2 - 学徒"},{value:3,label:"3 - 弟子"},{value:4,label:"4 - 镖师"},{value:5,label:"5 - 武师"},{value:6,label:"6 - 高手"},{value:7,label:"7 - 宗师"},{value:8,label:"8 - 绝世"}];function Hn(e,a,t){const n=b.SHORT_BLADE,o=b.SPEAR;e.innerHTML=`
    <div class="mode-setup">
      <button class="back-link" id="btn-back">← 返回</button>
      <h2>🦗 斗蛐蛐 — 选将观战</h2>
      <p class="setup-hint">选择双方兵器与AI等级，坐看AI对决</p>
      <div class="battle-setup-cols">
        <div class="setup-weapon-col">
          <div class="setup-col-title">🤖 左方 AI</div>
          <select id="sel-left-weapon" class="setup-select">
            ${Object.entries(I).map(([s,c])=>`<option value="${s}">${B[s]||""} ${c}</option>`).join("")}
          </select>
          <div id="left-wz">${P(n)}</div>
          <label class="setup-label">AI 等级</label>
          <select id="sel-left-level" class="setup-select">
            ${Jt.map(s=>`<option value="${s.value}" ${s.value===4?"selected":""}>${s.label}</option>`).join("")}
          </select>
        </div>
        <div class="setup-vs">VS</div>
        <div class="setup-weapon-col">
          <div class="setup-col-title">🤖 右方 AI</div>
          <select id="sel-right-weapon" class="setup-select">
            ${Object.entries(I).map(([s,c])=>`<option value="${s}">${B[s]||""} ${c}</option>`).join("")}
          </select>
          <div id="right-wz">${P(o)}</div>
          <label class="setup-label">AI 等级</label>
          <select id="sel-right-level" class="setup-select">
            ${Jt.map(s=>`<option value="${s.value}" ${s.value===4?"selected":""}>${s.label}</option>`).join("")}
          </select>
        </div>
      </div>
      <button class="primary-btn" id="btn-start">🦗 开始观战</button>
    </div>
  `,document.getElementById("sel-right-weapon").value=o,document.getElementById("sel-left-weapon").addEventListener("change",s=>{document.getElementById("left-wz").innerHTML=P(s.target.value)}),document.getElementById("sel-right-weapon").addEventListener("change",s=>{document.getElementById("right-wz").innerHTML=P(s.target.value)}),document.getElementById("btn-start").addEventListener("click",()=>{a(document.getElementById("sel-left-weapon").value,document.getElementById("sel-right-weapon").value,parseInt(document.getElementById("sel-left-level").value),parseInt(document.getElementById("sel-right-level").value))}),document.getElementById("btn-back").addEventListener("click",t)}function Nn(e="guide"){const a=document.getElementById("standalone-tutorial");a&&a.remove();const t=document.createElement("div");t.id="standalone-tutorial",t.className="modal-overlay active",t.innerHTML=`
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
        ${ta()}
      </div>

      <!-- Tab: 完整规则 -->
      <div class="modal-content-text tab-content ${e==="rules"?"active":""}" id="setup-tab-rules">
        ${aa()}
      </div>
    </div>
  `,document.body.appendChild(t),t.addEventListener("click",n=>{n.target===t&&t.remove()}),document.getElementById("tut-close").addEventListener("click",()=>t.remove()),t.querySelectorAll(".modal-tab").forEach(n=>{n.addEventListener("click",()=>{t.querySelectorAll(".modal-tab").forEach(o=>o.classList.toggle("active",o===n)),t.querySelectorAll(".tab-content").forEach(o=>o.classList.toggle("active",o.id==="setup-tab-"+n.dataset.tab))})})}const Rn={[`${i.DEFLECT}_${i.SLASH}`]:{pAnim:"anim-deflect",aAnim:"anim-recoil",spark:"🤺",desc:"卸力反制!"},[`${i.SLASH}_${i.DEFLECT}`]:{pAnim:"anim-recoil",aAnim:"anim-deflect",spark:"🤺",desc:"被卸力反制!"},[`${i.DEFLECT}_${i.THRUST}`]:{pAnim:"anim-deflect-fail",aAnim:"anim-thrust-p",spark:"🎯",desc:"卸力失败"},[`${i.THRUST}_${i.DEFLECT}`]:{pAnim:"anim-thrust-p",aAnim:"anim-deflect-fail",spark:"🎯",desc:"穿透卸力"},[`${i.DEFLECT}_${i.FEINT}`]:{pAnim:"anim-deflect-fail",aAnim:"anim-feint-a",spark:"🌀",desc:"虚晃骗卸力"},[`${i.FEINT}_${i.DEFLECT}`]:{pAnim:"anim-feint-p",aAnim:"anim-deflect-fail",spark:"🌀",desc:"虚晃骗卸力"},[`${i.SLASH}_${i.SLASH}`]:{pAnim:"anim-clash-p",aAnim:"anim-clash-a",spark:"⚡",desc:"互砍!"},[`${i.SLASH}_${i.THRUST}`]:{pAnim:"anim-slash-p",aAnim:"anim-hit",spark:"⚡",desc:"劈砍命中"},[`${i.THRUST}_${i.SLASH}`]:{pAnim:"anim-hit",aAnim:"anim-slash-a",spark:"⚡",desc:"被劈中"},[`${i.SLASH}_${i.BLOCK}`]:{pAnim:"anim-slash-p",aAnim:"anim-block-hit",spark:"🛡️",desc:"劈砍破格挡"},[`${i.BLOCK}_${i.SLASH}`]:{pAnim:"anim-block-hit",aAnim:"anim-slash-a",spark:"🛡️",desc:"格挡被破"},[`${i.SLASH}_${i.FEINT}`]:{pAnim:"anim-slash-p",aAnim:"anim-hit",spark:"⚡",desc:"劈砍命中"},[`${i.FEINT}_${i.SLASH}`]:{pAnim:"anim-hit",aAnim:"anim-slash-a",spark:"⚡",desc:"被劈中"},[`${i.THRUST}_${i.THRUST}`]:{pAnim:"anim-thrust-p",aAnim:"anim-thrust-a",spark:"🎯",desc:"互刺!"},[`${i.THRUST}_${i.BLOCK}`]:{pAnim:"anim-thrust-miss",aAnim:"anim-block",spark:"🛡️",desc:"被格挡"},[`${i.BLOCK}_${i.THRUST}`]:{pAnim:"anim-block",aAnim:"anim-thrust-miss",spark:"🛡️",desc:"格挡成功"},[`${i.THRUST}_${i.FEINT}`]:{pAnim:"anim-thrust-p",aAnim:"anim-hit",spark:"🎯",desc:"点刺命中"},[`${i.FEINT}_${i.THRUST}`]:{pAnim:"anim-hit",aAnim:"anim-thrust-a",spark:"🎯",desc:"被点刺"},[`${i.BLOCK}_${i.FEINT}`]:{pAnim:"anim-block-tricked",aAnim:"anim-feint-a",spark:"🌀",desc:"虚晃骗格挡"},[`${i.FEINT}_${i.BLOCK}`]:{pAnim:"anim-feint-p",aAnim:"anim-block-tricked",spark:"🌀",desc:"虚晃骗格挡"},[`${i.BLOCK}_${i.BLOCK}`]:{pAnim:"anim-block",aAnim:"anim-block",spark:null,desc:"双挡空过"},[`${i.FEINT}_${i.FEINT}`]:{pAnim:"anim-idle",aAnim:"anim-idle",spark:null,desc:"双晃空过"},[`${i.DEFLECT}_${i.DEFLECT}`]:{pAnim:"anim-clash-p",aAnim:"anim-clash-a",spark:"⚡",desc:"卸力对碰"},[`${i.DEFLECT}_${i.BLOCK}`]:{pAnim:"anim-deflect-fail",aAnim:"anim-block",spark:"🛡️",desc:"卸力被挡"},[`${i.BLOCK}_${i.DEFLECT}`]:{pAnim:"anim-block",aAnim:"anim-deflect-fail",spark:"🛡️",desc:"格挡卸力"}};function Bn(e,a){const t=`${e}_${a}`;return Rn[t]||{pAnim:"anim-idle",aAnim:"anim-idle",spark:null,desc:""}}function S(e){return new Promise(a=>setTimeout(a,e))}function be(e,a,t,n){const o=document.createElement("div"),s=n==="stance"?" stance-dmg":n==="heal"?" heal":"";o.className="float-dmg"+s,o.textContent=t,o.style.left=a.style.left,o.style.top="30%",e.appendChild(o),setTimeout(()=>o.remove(),1300)}function ye(e,a,t,n){const o=document.querySelector(e);if(!o)return;const s=o.querySelector(`.stat-row[data-stat="${a}"]`);if(!s)return;const c=s.querySelector(".stat-bar"),l=s.querySelector(".stat-value");c&&(c.style.transition="none",c.style.width=Math.max(0,t/n*100)+"%",c.offsetWidth),l&&(l.textContent=`${Math.max(0,t)}/${n}`)}function x(e,a,t,n,o=500){const s=document.querySelector(e);if(!s)return;const c=s.querySelector(`.stat-row[data-stat="${a}"]`);if(!c)return;const l=c.querySelector(".stat-bar"),r=c.querySelector(".stat-value");l&&(l.style.transition=`width ${o}ms ease`,l.style.width=Math.max(0,t/n*100)+"%"),r&&(r.textContent=`${Math.max(0,Math.round(t))}/${n}`)}function q(e,a,t,n="cost"){const o=document.querySelector(e);if(!o)return;const s=o.querySelector(`.stat-row[data-stat="${a}"]`);if(!s)return;s.style.position="relative";const c=document.createElement("div");c.className=`stat-pop stat-pop-${n}`,c.textContent=t,s.appendChild(c),c.offsetWidth,c.classList.add("stat-pop-show"),setTimeout(()=>{c.classList.add("stat-pop-hide"),c.addEventListener("animationend",()=>c.remove())},1500)}function ie(e,a,t){const n=document.querySelector(e);if(!n)return;const o=n.querySelector(`.stat-row[data-stat="${a}"]`);if(!o)return;const s=o.querySelector(".stat-bar");s&&(s.classList.add(t),setTimeout(()=>s.classList.remove(t),800))}function Yt(e,a,t){const n=document.createElement("div");n.className="clash-spark",n.innerHTML=`<span class="spark-emoji">${a}</span><span class="spark-desc">${t}</span>`,e.appendChild(n),setTimeout(()=>n.remove(),1200)}function et(e,a,t,n,o){const s=document.createElement("div");return s.className=`action-tag action-tag-${o}`,s.innerHTML=`<span class="at-emoji">${t}</span><span class="at-text">${n}</span>`,s.style.left=a.style.left,e.appendChild(s),s}function Qt(e,a){const t=document.createElement("div");t.className="float-dmg interrupt-dmg",t.textContent="⚡ 身法被打断",t.style.left=a.style.left,t.style.top="12%",e.appendChild(t),setTimeout(()=>t.remove(),1400)}function Mn(e,a){const t=e.querySelector(".round-banner");t&&t.remove();const n=document.createElement("div");n.className="round-banner",n.textContent=a,e.appendChild(n),setTimeout(()=>{n.classList.add("rb-fade"),setTimeout(()=>n.remove(),500)},1e3)}function vt(e,a){e.style.setProperty("--arena-cam",a),e.classList.remove("dist-0","dist-1","dist-2","dist-3"),e.classList.add("dist-"+a)}async function ra(e,a){var Bt,Mt,_t,kt;const t=document.getElementById("arena-stage"),n=document.getElementById("player-fighter"),o=document.getElementById("ai-fighter");if(!t||!n||!o)return;const s=a.history[a.history.length-1],c=s.playerCombat,l=s.aiCombat,r=s.playerDistance,u=s.aiDistance,p=D.MAX_HP,d=D.MAX_STANCE,f=D.MAX_STAMINA,m=oe[e.distance]||oe[2],g=oe[a.distance]||oe[2];n.style.transition="none",o.style.transition="none",n.style.left=m.player+"%",o.style.left=m.ai+"%";const y=n.querySelector(".fighter-body"),h=o.querySelector(".fighter-body"),L=e.spectatorMode?"🤖":"🧑";y&&(y.textContent=e.player.staggered?"😵":L),h&&(h.textContent=e.ai.staggered?"😵":e.aiName?"👤":"🤖");const T=t.querySelector(".arena-dist-line"),A=t.querySelector(".arena-dist-label");T&&(T.style.transition="none",T.style.left=m.player+"%",T.style.width=m.ai-m.player+"%"),A&&(A.textContent=te[e.distance]),vt(t,e.distance),n.offsetWidth,ye(".player-side","hp",e.player.hp,p),ye(".player-side","stamina",e.player.stamina,f),ye(".player-side","stance",e.player.stance,d),ye(".ai-side","hp",e.ai.hp,p),ye(".ai-side","stamina",e.ai.stamina,f),ye(".ai-side","stance",e.ai.stance,d);const Dt=Ue[r],qe=Ue[u],ze=k[c],Xe=k[l];Mn(t,`⚔️  第 ${a.round} 回合`),await S(1200);const he=((Bt=N[r])==null?void 0:Bt.delta)??0,ve=((Mt=N[u])==null?void 0:Mt.delta)??0,re=Math.max(0,Math.min(3,e.distance+he+ve)),Ie=oe[re]||oe[2],Ve=s.pMoveInterrupted||s.aMoveInterrupted,Oe=et(t,n,Dt.emoji,Q[r],"player"),X=Ie.player,ee=parseFloat(n.style.left),V=parseFloat(o.style.left);he!==0?(n.classList.add(he<0?"anim-dash-in":"anim-dash-out"),Math.abs(X-ee)>.5&&(n.style.transition="left 0.5s ease",n.style.left=X+"%",T&&(T.style.transition="left 0.5s ease, width 0.5s ease",T.style.left=X+"%",T.style.width=V-X+"%")),await S(600),n.classList.remove("anim-dash-in","anim-dash-out")):r===v.DODGE?(n.classList.add("anim-dodge"),await S(550),n.classList.remove("anim-dodge")):(n.classList.add("anim-brace"),Math.abs(X-ee)>.5&&(n.style.transition="left 0.5s ease",n.style.left=X+"%",T&&(T.style.transition="left 0.5s ease, width 0.5s ease",T.style.left=X+"%",T.style.width=V-X+"%")),await S(550),n.classList.remove("anim-brace"));const He=et(t,o,qe.emoji,Q[u],"ai"),ne=Ie.ai,It=parseFloat(n.style.left);ve!==0?(o.classList.add(ve<0?"anim-dash-in":"anim-dash-out"),Math.abs(ne-V)>.5&&(o.style.transition="left 0.5s ease",o.style.left=ne+"%",T&&(T.style.transition="width 0.5s ease",T.style.width=ne-It+"%")),await S(600),o.classList.remove("anim-dash-in","anim-dash-out")):u===v.DODGE?(o.classList.add("anim-dodge"),await S(550),o.classList.remove("anim-dodge")):(o.classList.add("anim-brace"),Math.abs(ne-V)>.5&&(o.style.transition="left 0.5s ease",o.style.left=ne+"%",T&&(T.style.transition="width 0.5s ease",T.style.width=ne-It+"%")),await S(550),o.classList.remove("anim-brace")),A&&(A.textContent=te[re]),vt(t,re),n.style.transition="",o.style.transition="",T&&(T.style.transition="");const rt=Math.max(0,e.player.stamina-(((_t=N[r])==null?void 0:_t.cost)??0)),dt=Math.max(0,e.ai.stamina-(((kt=N[u])==null?void 0:kt.cost)??0)),ut=e.player.stamina-rt,pt=e.ai.stamina-dt;ut>0&&(x(".player-side","stamina",rt,f,400),q(".player-side","stamina",`-${ut} 体力`,"cost"),ie(".player-side","stamina","bar-flash-cost")),pt>0&&(x(".ai-side","stamina",dt,f,400),q(".ai-side","stamina",`-${pt} 体力`,"cost"),ie(".ai-side","stamina","bar-flash-cost")),(ut>0||pt>0)&&await S(400),Oe.classList.add("at-fade"),He.classList.add("at-fade"),setTimeout(()=>{Oe.remove(),He.remove()},350),await S(350);const Ot=et(t,n,ze.emoji,G[c],"player");await S(350);const Ht=et(t,o,Xe.emoji,G[l],"ai");await S(400);const de=Bn(c,l);de.pAnim&&n.classList.add(de.pAnim),de.aAnim&&o.classList.add(de.aAnim),de.spark&&Yt(t,de.spark,de.desc),await S(900);const ha=a.spectatorMode?"🤖":"🧑";y&&(y.textContent=a.player.staggered?"😵":ha),h&&(h.textContent=a.ai.staggered?"😵":a.aiName?"👤":"🤖"),Ot.classList.add("at-fade"),Ht.classList.add("at-fade"),setTimeout(()=>{Ot.remove(),Ht.remove()},350),await S(300),re!==a.distance&&(Ve?(s.pMoveInterrupted&&(n.classList.add("anim-shake"),Qt(t,n)),s.aMoveInterrupted&&(o.classList.add("anim-shake"),Qt(t,o)),await S(400)):(Yt(t,"💥","击退!"),await S(300)),n.style.transition="left 0.4s ease-out",o.style.transition="left 0.4s ease-out",T&&(T.style.transition="left 0.4s ease-out, width 0.4s ease-out"),n.style.left=g.player+"%",o.style.left=g.ai+"%",T&&(T.style.left=g.player+"%",T.style.width=g.ai-g.player+"%"),A&&(A.textContent=te[a.distance]),vt(t,a.distance),await S(500),n.classList.remove("anim-shake"),o.classList.remove("anim-shake"),n.style.transition="",o.style.transition="",T&&(T.style.transition=""));const Ne=e.player.hp-a.player.hp,Re=e.ai.hp-a.ai.hp,ue=a.player.stance-e.player.stance,pe=a.ai.stance-e.ai.stance,Nt=D.EXECUTION_DAMAGE,Ze=e.player.stance<d&&a.player.stance===0&&Ne>=Nt,Je=e.ai.stance<d&&a.ai.stance===0&&Re>=Nt;Ne>0&&(n.classList.add("anim-hit"),be(t,n,`-${Ne}`,"damage"),x(".player-side","hp",a.player.hp,p,500),q(".player-side","hp",`-${Ne} 气血`,"cost"),ie(".player-side","hp","bar-flash-cost"),await S(600)),Re>0&&(o.classList.add("anim-hit"),be(t,o,`-${Re}`,"damage"),x(".ai-side","hp",a.ai.hp,p,500),q(".ai-side","hp",`-${Re} 气血`,"cost"),ie(".ai-side","hp","bar-flash-cost"),await S(600)),Ne===0&&Re===0&&await S(300),Ze?(x(".player-side","stance",0,d,400),q(".player-side","stance","⚔ 处决!","exec")):ue>0?(be(t,n,`+${ue} 架势`,"stance"),x(".player-side","stance",a.player.stance,d,400),q(".player-side","stance",`+${ue} 架势`,"warn"),ie(".player-side","stance","bar-flash-warn")):ue<0&&(be(t,n,`${ue} 架势`,"heal"),x(".player-side","stance",a.player.stance,d,400),q(".player-side","stance",`${ue} 架势`,"buff")),(Ze||ue!==0)&&await S(450),Je?(x(".ai-side","stance",0,d,400),q(".ai-side","stance","⚔ 处决!","exec")):pe>0?(be(t,o,`+${pe} 架势`,"stance"),x(".ai-side","stance",a.ai.stance,d,400),q(".ai-side","stance",`+${pe} 架势`,"warn"),ie(".ai-side","stance","bar-flash-warn")):pe<0&&(be(t,o,`${pe} 架势`,"heal"),x(".ai-side","stance",a.ai.stance,d,400),q(".ai-side","stance",`${pe} 架势`,"buff")),(Je||pe!==0)&&await S(450),(Ze||Je)&&(t.classList.add("execution-flash"),await S(500)),await S(Ze||Je?500:600);const ft=a.player.stamina-rt,mt=a.ai.stamina-dt;ft>0&&(x(".player-side","stamina",a.player.stamina,f,400),q(".player-side","stamina",`+${ft} 体力`,"buff"),ie(".player-side","stamina","bar-flash-buff")),mt>0&&(x(".ai-side","stamina",a.ai.stamina,f,400),q(".ai-side","stamina",`+${mt} 体力`,"buff"),ie(".ai-side","stamina","bar-flash-buff")),(ft>0||mt>0)&&await S(500);const Rt=["anim-attack-p","anim-attack-a","anim-dodge","anim-hit","anim-shake","anim-slash-p","anim-slash-a","anim-slash-miss","anim-thrust-p","anim-thrust-a","anim-thrust-miss","anim-deflect","anim-deflect-fail","anim-recoil","anim-block","anim-block-hit","anim-block-tricked","anim-feint-p","anim-feint-a","anim-clash-p","anim-clash-a","anim-idle","anim-dash-in","anim-dash-out","anim-brace"];n.classList.remove(...Rt),o.classList.remove(...Rt),t.classList.remove("execution-flash")}const me=[{floor:1,npc:"李大壮",title:"村口恶霸",weapon:b.STAFF,aiLevel:2,intro:"路经偏僻村落，一名壮汉持棍拦路。",taunt:"此路是我开！留下买路钱！"},{floor:2,npc:"赵三",title:"山贼喽啰",weapon:b.SHORT_BLADE,aiLevel:3,intro:"山间小道，草丛中窜出一名手持短刀的毛贼。",taunt:"识相的把包袱留下！"},{floor:3,npc:"钱小六",title:"镖局镖师",weapon:b.SPEAR,aiLevel:4,intro:"误入镖队行进路线，一名镖师持枪喝止。",taunt:"何方人物？报上名来！"},{floor:4,npc:"孙铁柱",title:"武馆弟子",weapon:b.SWORD,aiLevel:4,intro:"途经武馆，一名弟子欣然邀战。",taunt:"久闻大名，请赐教！"},{floor:5,npc:"周大锤",title:"铁匠侠客",weapon:b.GREAT_BLADE,aiLevel:5,intro:"铁匠铺旁，一名大汉扛着长柄大刀拦住去路。",taunt:"我这把大刀早已饥渴难耐！"},{floor:6,npc:"吴影",title:"暗巷刺客",weapon:b.DUAL_STAB,aiLevel:6,intro:"夜入小巷，身后传来阴冷的脚步声……",taunt:"…………"},{floor:7,npc:"郑云飞",title:"青衫剑客",weapon:b.SWORD,aiLevel:6,intro:"客栈饮酒，邻桌青衫剑客放下酒杯，缓缓起身。",taunt:"以剑会友，不醉不归。"},{floor:8,npc:"王长风",title:"枪法名家",weapon:b.SPEAR,aiLevel:7,intro:"擂台之上，白发老者持枪而立，气势如渊。",taunt:"老夫征战三十年，尚未一败。"},{floor:9,npc:"陈残雪",title:"独臂刀客",weapon:b.GREAT_BLADE,aiLevel:7,intro:"古道尽头，独臂刀客横刀冷立，杀意凛然。",taunt:"这条路的尽头，只能有一个人。"},{floor:10,npc:"萧无名",title:"绝世高手",weapon:null,aiLevel:8,intro:"山巅之上，一个看不清面容的身影背对着你。",taunt:"你终于来了。"}];function _n(e){return{playerWeapon:e,currentFloor:0,playerHp:D.MAX_HP,completed:!1,gameOver:!1}}function kn(e){const a=me[e.currentFloor];if(!a)return null;if(!a.weapon){const t=Object.values(b);return{...a,weapon:t[Math.floor(Math.random()*t.length)]}}return a}function Fn(e,a){const t={...e};return t.playerHp=D.MAX_HP,t.currentFloor+=1,t.currentFloor>=me.length&&(t.completed=!0),t}function Pn(e){return e.completed}function Un(e,a,t,n,o){const s=D.MAX_HP,c=a.currentFloor+1,l=B[t.weapon]||"❓",r=I[t.weapon]||"???",u=B[a.playerWeapon]||"🗡️",p=I[a.playerWeapon]||"???";e.innerHTML=`
    <div class="tower-screen">
      <div class="tower-floor-header">🗼 江湖行 · 第 ${c} / ${me.length} 关</div>
      <div class="tower-progress">
        ${me.map((d,f)=>`<span class="tp-dot ${f<a.currentFloor?"tp-done":f===a.currentFloor?"tp-cur":""}">${f+1}</span>`).join("")}
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
        <div class="tower-hp">❤️ 你的气血: <strong>${a.playerHp}</strong> / ${s}</div>
        <div class="tower-your-weapon">${u} ${p}</div>
      </div>
      <div class="tower-matchup">
        ${P(a.playerWeapon)}
        <div class="tower-matchup-vs">VS</div>
        ${P(t.weapon)}
      </div>
      <button class="primary-btn" id="btn-fight">⚔ 应战</button>
      <button class="link-btn" id="btn-back">放弃 · 返回</button>
    </div>
  `,document.getElementById("btn-fight").addEventListener("click",n),document.getElementById("btn-back").addEventListener("click",o)}function jn(e,a,t,n){const o=D.MAX_HP,s=a.currentFloor,c=me[s-1],l=me[s];let r="";if(l){const u=B[l.weapon]||"❓",p=I[l.weapon]||"???";r=`
      <div class="tower-next-preview">
        <div class="tower-next-label">下一关: 第 ${s+1} 关</div>
        <div class="tower-next-npc">${l.npc} 「${l.title}」</div>
        <div class="tower-next-wp">${u} ${p}</div>
      </div>
    `}e.innerHTML=`
    <div class="tower-screen">
      <div class="tower-floor-header">✅ 第 ${s} 关 — 胜利!</div>
      <div class="tower-between-msg">${c.npc} 已被击败</div>
      <div class="tower-between-hp">
        ❤️ 恢复气血 <span class="heal">已回满</span>
        <br/>
        ❤️ 当前气血: ${t} → <strong>${a.playerHp}</strong> / ${o}
      </div>
      ${r}
      <button class="primary-btn" id="btn-continue">继续前进 →</button>
    </div>
  `,document.getElementById("btn-continue").addEventListener("click",n)}function da(e,a,t){const n=I[a.playerWeapon],o=B[a.playerWeapon];e.innerHTML=`
    <div class="tower-screen tower-victory">
      <h1>🏆 武林至尊</h1>
      <p class="tower-result-sub">击败全部 ${me.length} 位强敌!</p>
      <div class="tower-result-stats">
        ❤️ 最终气血: ${a.playerHp} / ${D.MAX_HP}<br/>
        ${o} 使用兵器: ${n}
      </div>
      <p class="tower-victory-msg">
        自此，江湖中流传着一个新的传说——<br/>
        一位持${n}的无名侠客，从乡野一路打到山巅，<br/>
        击败了天下第一高手萧无名。
      </p>
      <button class="primary-btn" id="btn-back">🏠 返回</button>
    </div>
  `,document.getElementById("btn-back").addEventListener("click",t)}function Kn(e,a,t,n,o){e.innerHTML=`
    <div class="tower-screen tower-gameover">
      <h1>💀 败北</h1>
      <p class="tower-result-sub">止步于第 ${a.currentFloor+1} 关</p>
      <div class="tower-result-npc">
        败于 ${t.npc}「${t.title}」之手
      </div>
      <button class="primary-btn" id="btn-retry">🔄 重新挑战</button>
      <button class="link-btn" id="btn-back">🏠 返回</button>
    </div>
  `,document.getElementById("btn-retry").addEventListener("click",n),document.getElementById("btn-back").addEventListener("click",o)}Ln();const U=document.getElementById("app");let E=null,we=null,F={distanceCard:null,combatCard:null},je=[],Y=!1,M=null,ae=!1,De=!1,Lt=null,J=null,xe=800,O=null,Ae=null;function Gn(){return{isPaused:Y,canUndo:je.length>0,spectator:De,autoPlaySpeed:xe}}function xn(){return{onSelect:zn,onConfirm:Xn,onUndo:Vn,onReset:Zn,onNewGame:Jn,onTogglePause:Yn,onDifficultyChange:Qn,onSpeedChange:es}}function z(){lt(),De=!1,Lt=null,O=null,Ae=null,Dn(U,{onTower:()=>On(U,ua,z),onBattle:()=>In(U,wt,z),onAiVsAi:()=>Hn(U,ga,z)})}function lt(){E=null,we=null,F={distanceCard:null,combatCard:null},je=[],Y=!1,ae=!1,J&&(clearTimeout(J),J=null)}function wt(e,a,t){O=null,M={playerWeapon:e,aiWeapon:a,aiLevel:t},lt(),E=st(e,a,t),se()}function ua(e){O=_n(e),M=null,pa()}function pa(){if(Ae=kn(O),!Ae){da(U,O,z);return}Un(U,O,Ae,fa,z)}function fa(){const e=Ae;lt(),E=st(O.playerWeapon,e.weapon,e.aiLevel),E.aiName=e.npc,E.aiTitle=e.title,E.player.hp=O.playerHp,M=null,se()}function qn(){if(O)if(E.winner==="player"){const e=O.playerHp;O=Fn(O,E.player.hp),Pn(O)?da(U,O,z):jn(U,O,e,pa)}else O.gameOver=!0,Kn(U,O,Ae,()=>ua(O.playerWeapon),z)}function se(){za(U,E,F,Gn(),xn()),hn()}function zn(e,a){ae||Y||E.gameOver||(e==="distance"?F.distanceCard=F.distanceCard===a?null:a:F.combatCard=F.combatCard===a?null:a,se())}async function Xn(){if(ae||Y||E.gameOver||!F.distanceCard||!F.combatCard)return;const e=Da(F.distanceCard,F.combatCard,E.player,E.distance);if(!e.valid){Et(e.reason,"warn");return}je.push(JSON.parse(JSON.stringify(E))),we=JSON.parse(JSON.stringify(E));const a=Pe(E),t={distanceCard:F.distanceCard,combatCard:F.combatCard};E=Tt(E,t,a),F={distanceCard:null,combatCard:null},ae=!0;const n=U.querySelector(".game-wrapper");n&&n.classList.add("animating"),se(),await ra(we,E),ae=!1,n&&n.classList.remove("animating"),E.gameOver&&(O?qn():sa(U,E,ma,z))}function Vn(){je.length!==0&&(E=je.pop(),we=null,F={distanceCard:null,combatCard:null},Y=!1,se())}function Zn(){O?fa():M&&wt(M.playerWeapon,M.aiWeapon,M.aiLevel)}function Jn(){z()}function ma(){M?De&&M.playerAiLevel!=null?ga(M.playerWeapon,M.aiWeapon,M.playerAiLevel,M.aiLevel):wt(M.playerWeapon,M.aiWeapon,M.aiLevel):z()}function Yn(){E.gameOver||(Y=!Y,se(),De&&(Y?J&&(clearTimeout(J),J=null):ct()))}function Qn(e){E&&(E.aiLevel=e)}function ga(e,a,t,n){O=null,lt(),De=!0,Lt=t,xe=800,E=st(e,a,n),E.spectatorMode=!0,M={playerWeapon:e,aiWeapon:a,aiLevel:n,playerAiLevel:t},se(),ct()}function ct(){J&&(clearTimeout(J),J=null),!(!E||E.gameOver||Y||ae)&&(J=setTimeout(Wn,Math.max(xe,50)))}async function Wn(){if(J=null,!E||E.gameOver||Y||ae)return;const e=Pe(E),a=ia(E,Lt),t=Pe(a),n=nt(t,E.player,E.distance),o=nt(e,E.ai,E.distance);we=JSON.parse(JSON.stringify(E)),E=Tt(E,n,o),ae=!0;const s=U.querySelector(".game-wrapper");s&&s.classList.add("animating"),se(),xe>0&&await ra(we,E),ae=!1,s&&s.classList.remove("animating"),E.gameOver?sa(U,E,ma,z):ct()}function es(e){xe=e,se(),De&&!Y&&!ae&&!E.gameOver&&ct()}z();
