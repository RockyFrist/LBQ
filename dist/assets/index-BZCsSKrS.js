(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function e(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=e(s);fetch(s.href,i)}})();const v=Object.freeze({SHORT_BLADE:"short_blade",SPEAR:"spear",SWORD:"sword",STAFF:"staff",GREAT_BLADE:"great_blade",DUAL_STAB:"dual_stab"}),b=Object.freeze({ADVANCE:"advance",RETREAT:"retreat",HOLD:"hold",DODGE:"dodge"}),o=Object.freeze({DEFLECT:"deflect",SLASH:"slash",THRUST:"thrust",BLOCK:"block",FEINT:"feint"}),V=Object.freeze({ATTACK:"attack",DEFENSE:"defense"}),bt=Object.freeze({SETUP:"setup",INFO_SYNC:"info_sync",PLAYER_PICK:"player_pick",AI_PICK:"ai_pick",DISTANCE_RESOLVE:"distance_resolve",COMBAT_RESOLVE:"combat_resolve",STATUS_RESOLVE:"status_resolve",ROUND_END:"round_end",GAME_OVER:"game_over"});function Te(t){return{weapon:t,hp:10,stance:0,stamina:4,staggered:!1}}function Qe(t,a,e){return{distance:2,round:0,phase:bt.SETUP,player:Te(t),ai:Te(a),aiLevel:e,aiName:null,aiTitle:null,history:[],log:[],gameOver:!1,winner:null}}const D={MAX_HP:10,MAX_STANCE:5,EXECUTION_DAMAGE:5,INITIAL_DISTANCE:2,MAX_STAMINA:4,STAMINA_RECOVERY:1},Ot=0,Nt=3,Z=["贴身区","近战区","中距区","远距区"],Mt={[o.DEFLECT]:V.DEFENSE,[o.SLASH]:V.ATTACK,[o.THRUST]:V.ATTACK,[o.BLOCK]:V.DEFENSE,[o.FEINT]:V.ATTACK},rt={[o.DEFLECT]:{cost:3,staminaCost:0,damage:2,stanceToOpponent:2,priority:2},[o.SLASH]:{cost:3,staminaCost:0,damage:3,stanceToOpponent:1,priority:3},[o.THRUST]:{cost:1,staminaCost:0,damage:1,stanceToOpponent:1,priority:4},[o.BLOCK]:{cost:2,staminaCost:0,damage:0,stanceToOpponent:0,priority:5},[o.FEINT]:{cost:1,staminaCost:0,damage:0,stanceToOpponent:2,priority:6}},H={[b.ADVANCE]:{cost:2,delta:-1},[b.RETREAT]:{cost:2,delta:1},[b.HOLD]:{cost:0,delta:0},[b.DODGE]:{cost:2,delta:0}},G={[o.DEFLECT]:"卸力",[o.SLASH]:"劈砍",[o.THRUST]:"点刺",[o.BLOCK]:"格挡",[o.FEINT]:"虚晃"},J={[b.ADVANCE]:"冲步",[b.RETREAT]:"撤步",[b.HOLD]:"扎马",[b.DODGE]:"闪避"},_={[v.SHORT_BLADE]:"短刀",[v.SPEAR]:"长枪",[v.SWORD]:"剑",[v.STAFF]:"棍",[v.GREAT_BLADE]:"大刀",[v.DUAL_STAB]:"双刺"},R={[v.SHORT_BLADE]:"🗡️",[v.SPEAR]:"🔱",[v.SWORD]:"⚔️",[v.STAFF]:"🏑",[v.GREAT_BLADE]:"🪓",[v.DUAL_STAB]:"🥢"},O={[v.SHORT_BLADE]:{advantage:[0,1],disadvantage:[2,3]},[v.SPEAR]:{advantage:[2,3],disadvantage:[0]},[v.SWORD]:{advantage:[1,2],disadvantage:[0,3]},[v.STAFF]:{advantage:[1,2,3],disadvantage:[0]},[v.GREAT_BLADE]:{advantage:[2],disadvantage:[0]},[v.DUAL_STAB]:{advantage:[0],disadvantage:[2,3]}};function We(t,a,e){const n=H[a].delta,s=H[e].delta,i=t+n+s;return Math.max(Ot,Math.min(Nt,i))}const Ce={deflectStagger:!0,deflectSelfStance:0,blockSlashReduction:1,advBlockSlashReduction:0,advDodgeCounter:0,advBlockPerfect:!1,advBlockBonusStance:0,advSlashBonusStance:0,advBlockPushDist:0,advFeintBonusStance:0,damageRules:[],pushRules:[]},ta={[v.SHORT_BLADE]:{advDodgeCounter:1,advFeintBonusStance:1,damageRules:[{minDist:3,card:o.SLASH,mod:-3}]},[v.SPEAR]:{advBlockPushDist:1,damageRules:[{adv:!0,card:o.SLASH,mod:2},{dist:0,card:o.SLASH,mod:-3}]},[v.SWORD]:{deflectStagger:!1,deflectSelfStance:-2,advBlockPerfect:!0,damageRules:[{dist:0,card:o.SLASH,mod:-2},{dist:3,card:o.SLASH,mod:-3}]},[v.STAFF]:{advBlockBonusStance:1,advSlashBonusStance:2,advFeintBonusStance:1,damageRules:[{dist:0,card:o.SLASH,mod:-3}],pushRules:[{card:o.FEINT,vs:o.BLOCK,adv:!0,push:1}]},[v.GREAT_BLADE]:{advBlockSlashReduction:1,damageRules:[{adv:!0,card:o.SLASH,mod:3},{dist:0,card:o.SLASH,mod:-3}],pushRules:[{card:o.SLASH,adv:!0,push:1}]},[v.DUAL_STAB]:{advFeintBonusStance:1,damageRules:[{adv:!0,card:o.THRUST,mod:1},{disadv:!0,card:o.SLASH,mod:-3}]}};function Q(t){const a=ta[t];return a?{...Ce,...a}:{...Ce}}function w(t,a){return O[t].advantage.includes(a)}function ce(t,a){return O[t].disadvantage.includes(a)}function zt(t,a,e){const n=Q(t);for(const s of n.damageRules)if(s.card===e&&!(s.adv&&!w(t,a))&&!(s.disadv&&!ce(t,a))&&!(s.dist!==void 0&&s.dist!==a)&&!(s.minDist!==void 0&&a<s.minDist))return s.mod;return 0}function Se(t,a){return w(t,a)?Q(t).advDodgeCounter:0}function Ut(t,a){return w(t,a)&&Q(t).advBlockPerfect}function Kt(t,a){return w(t,a)?Q(t).advBlockBonusStance:0}function At(t,a){return w(t,a)?Q(t).advSlashBonusStance:0}function Gt(t,a){return w(t,a)?Q(t).advBlockPushDist:0}function Le(t,a){const e=Q(t);return e.blockSlashReduction+(w(t,a)?e.advBlockSlashReduction:0)}function ea(t){return Q(t).deflectStagger}function se(t,a){return 2+(w(t,a)?Q(t).advFeintBonusStance:0)}function nt(t,a,e,n){if(!w(t,a))return 0;const s=Q(t);for(const i of s.pushRules)if(i.card===e&&!(i.adv&&!w(t,a))&&!(i.vs&&i.vs!==n))return i.push;return 0}function De(t,a){return w(t,a)}function L(t,a,e){return ce(a,e)?Math.floor(t/2):t}function Fe(){return{player:{hpChange:0,stanceChange:0,staggered:!1},ai:{hpChange:0,stanceChange:0,staggered:!1},distancePush:0,log:[]}}function j(t,a,e){const n=rt[t].damage,s=zt(a,e,t);return Math.max(0,n+s)}function aa(t,a,e){const n=Fe(),s=t.distance,i=t.player.weapon,l=t.ai.weapon;return a===e?na(n,a,i,l,s):(sa(n,a,e,i,l,s),n)}function na(t,a,e,n,s){switch(a){case o.BLOCK:t.log.push("双方空过");break;case o.DEFLECT:t.player.stanceChange+=2,t.ai.stanceChange+=2,t.log.push("卸力对碰，双方各+2架势");break;case o.SLASH:{const i=j(o.SLASH,e,s),l=j(o.SLASH,n,s);t.player.hpChange-=l,t.ai.hpChange-=i,t.player.stanceChange+=L(1,n,s),t.ai.stanceChange+=L(1,e,s);const c=At(e,s),r=At(n,s);c>0&&(t.ai.stanceChange+=c),r>0&&(t.player.stanceChange+=r),e==="spear"&&w(e,s)&&(t.ai.stanceChange+=1),n==="spear"&&w(n,s)&&(t.player.stanceChange+=1);const u=nt(e,s,o.SLASH,o.SLASH),p=nt(n,s,o.SLASH,o.SLASH);t.distancePush+=u+p,t.log.push(`互砍：玩家受${l}伤，AI受${i}伤`);break}case o.THRUST:{const i=j(o.THRUST,e,s),l=j(o.THRUST,n,s);t.player.hpChange-=l,t.ai.hpChange-=i,t.player.stanceChange+=L(1,n,s),t.ai.stanceChange+=L(1,e,s),t.log.push(`互刺：玩家受${l}伤，AI受${i}伤`);break}case o.FEINT:t.log.push("双方虚晃，空过");break}return t}function sa(t,a,e,n,s,i){if(a===o.DEFLECT&&e===o.SLASH){we(t,"player","ai",n);return}if(e===o.DEFLECT&&a===o.SLASH){we(t,"ai","player",s);return}if(a===o.DEFLECT&&e===o.THRUST){const l=j(o.THRUST,s,i);t.player.hpChange-=l,t.player.stanceChange+=L(1,s,i),t.log.push(`玩家卸力失败遇点刺：受${l}伤+${L(1,s,i)}架势`);return}if(e===o.DEFLECT&&a===o.THRUST){const l=j(o.THRUST,n,i);t.ai.hpChange-=l,t.ai.stanceChange+=L(1,n,i),t.log.push(`AI卸力失败遇点刺：受${l}伤+${L(1,n,i)}架势`);return}if(a===o.DEFLECT&&e===o.FEINT){const l=L(2,s,i);t.player.stanceChange+=l,t.log.push(`玩家卸力被虚晃骗：+${l}架势`);return}if(e===o.DEFLECT&&a===o.FEINT){const l=L(2,n,i);t.ai.stanceChange+=l,t.log.push(`AI卸力被虚晃骗：+${l}架势`);return}if(a===o.DEFLECT&&e===o.BLOCK){t.player.stanceChange+=1,t.log.push("玩家卸力失败(遇格挡)：+1架势");return}if(e===o.DEFLECT&&a===o.BLOCK){t.ai.stanceChange+=1,t.log.push("AI卸力失败(遇格挡)：+1架势");return}if(a===o.SLASH&&e===o.THRUST){Xt(t,"player","ai",n,s,i,o.THRUST);return}if(e===o.SLASH&&a===o.THRUST){Xt(t,"ai","player",s,n,i,o.THRUST);return}if(a===o.SLASH&&e===o.BLOCK){const l=j(o.SLASH,n,i),c=Le(s,i),r=Ut(s,i)?0:Math.max(0,l-c);t.ai.hpChange-=r,t.ai.stanceChange+=L(1,n,i);const u=Kt(s,i);u>0&&(t.player.stanceChange+=u),n==="spear"&&w(n,i)&&(t.ai.stanceChange+=1);const p=At(n,i);p>0&&(t.ai.stanceChange+=p);const m=nt(n,i,o.SLASH,o.BLOCK),d=Gt(s,i);t.distancePush+=m+d,Ut(s,i)?t.log.push("玩家劈砍被完美格挡(剑)：AI完全免伤"):t.log.push(`玩家劈砍破格挡：AI受${r}伤(减免${c})+架势`);return}if(e===o.SLASH&&a===o.BLOCK){const l=j(o.SLASH,s,i),c=Le(n,i),r=Ut(n,i)?0:Math.max(0,l-c);t.player.hpChange-=r,t.player.stanceChange+=L(1,s,i);const u=Kt(n,i);u>0&&(t.ai.stanceChange+=u),s==="spear"&&w(s,i)&&(t.player.stanceChange+=1);const p=At(s,i);p>0&&(t.player.stanceChange+=p);const m=nt(s,i,o.SLASH,o.BLOCK),d=Gt(n,i);t.distancePush+=m+d,Ut(n,i)?t.log.push("AI劈砍被完美格挡(剑)：玩家完全免伤"):t.log.push(`AI劈砍破格挡：玩家受${r}伤(减免${c})+架势`);return}if(a===o.SLASH&&e===o.FEINT){Xt(t,"player","ai",n,s,i,o.FEINT);return}if(e===o.SLASH&&a===o.FEINT){Xt(t,"ai","player",s,n,i,o.FEINT);return}if(a===o.THRUST&&e===o.BLOCK){const l=Kt(s,i);l>0&&(t.player.stanceChange+=l);const c=Gt(s,i);c>0&&(t.distancePush+=c),t.log.push(`玩家点刺被格挡完全抵消${l>0?"，棍震退+1架势":""}${c>0?"，被弹枪推开":""}`);return}if(e===o.THRUST&&a===o.BLOCK){const l=Kt(n,i);l>0&&(t.ai.stanceChange+=l);const c=Gt(n,i);c>0&&(t.distancePush+=c),t.log.push(`AI点刺被格挡完全抵消${l>0?"，棍震退+1架势":""}${c>0?"，被弹枪推开":""}`);return}if(a===o.THRUST&&e===o.FEINT){const l=j(o.THRUST,n,i);t.ai.hpChange-=l,t.ai.stanceChange+=L(1,n,i),t.log.push(`玩家点刺命中：AI受${l}伤+${L(1,n,i)}架势`);return}if(e===o.THRUST&&a===o.FEINT){const l=j(o.THRUST,s,i);t.player.hpChange-=l,t.player.stanceChange+=L(1,s,i),t.log.push(`AI点刺命中：玩家受${l}伤+${L(1,s,i)}架势`);return}if(a===o.BLOCK&&e===o.FEINT){const l=se(s,i),c=L(l,s,i);t.player.stanceChange+=c;const r=nt(s,i,o.FEINT,o.BLOCK);t.distancePush+=r,t.log.push(`AI虚晃命中格挡：玩家+${c}架势${r?"，距离+"+r:""}`);return}if(e===o.BLOCK&&a===o.FEINT){const l=se(n,i),c=L(l,n,i);t.ai.stanceChange+=c;const r=nt(n,i,o.FEINT,o.BLOCK);t.distancePush+=r,t.log.push(`玩家虚晃命中格挡：AI+${c}架势${r?"，距离+"+r:""}`);return}t.log.push("双方空过")}function we(t,a,e,n){const s=rt[o.DEFLECT].damage;t[e].hpChange-=s,t[e].stanceChange+=2;const i=a==="player"?"玩家":"AI";ea(n)?(t[e].staggered=!0,t.log.push(`${i}卸力反制成功：对手受${s}伤+2架势+僵直`)):(t[a].stanceChange-=2,t.log.push(`${i}(剑)卸力反制成功：对手受${s}伤+2架势，自身-2架势`))}function Xt(t,a,e,n,s,i,l){const c=j(o.SLASH,n,i);t[e].hpChange-=c,t[e].stanceChange+=L(1,n,i);const r=At(n,i);r>0&&(t[e].stanceChange+=r),n==="spear"&&w(n,i)&&(t[e].stanceChange+=1);const u=nt(n,i,o.SLASH,l);t.distancePush+=u,t.log.push(`${a==="player"?"玩家":"AI"}劈砍命中：对手受${c}伤+架势${u?"，距离+"+u:""}`)}function Ie(t,a,e){const n=Fe(),s=t.distance,i=t[a].weapon,l=a==="player"?"ai":"player",c=a==="player"?"玩家":"AI";switch(e){case o.SLASH:{const r=j(o.SLASH,i,s);n[l].hpChange-=r,n[l].stanceChange+=L(1,i,s);const u=At(i,s);u>0&&(n[l].stanceChange+=u),i==="spear"&&w(i,s)&&(n[l].stanceChange+=1);const p=nt(i,s,o.SLASH,null);n.distancePush+=p,n.log.push(`${c}劈砍命中(对手闪避失败)：对手受${r}伤+架势`);break}case o.THRUST:{const r=j(o.THRUST,i,s);n[l].hpChange-=r,n[l].stanceChange+=L(1,i,s),n.log.push(`${c}点刺命中(对手闪避失败)：对手受${r}伤`);break}case o.FEINT:{const r=se(i,s),u=L(r,i,s);n[l].stanceChange+=u,n.log.push(`${c}虚晃命中(对手闪避失败)：对手+${u}架势`);break}case o.DEFLECT:case o.BLOCK:n.log.push(`${c}防守落空(无攻击可防)`);break}return n}function re(t,a,e){const n=Qe(t,a,e);return n.phase=bt.INFO_SYNC,n}function Pe(t,a,e){let n=JSON.parse(JSON.stringify(t));return n.round+=1,n.log=[],n.log.push(`══════ 第 ${n.round} 回合 ══════`),n.player.staggered=!1,n.ai.staggered=!1,n._lastPDist=a.distanceCard,n._lastADist=e.distanceCard,n=ia(n,a.distanceCard,e.distanceCard),n=oa(n,a.combatCard,e.combatCard),n=la(n),n=ca(n),n.history.push({round:n.round,playerDistance:a.distanceCard,playerCombat:a.combatCard,aiDistance:e.distanceCard,aiCombat:e.combatCard,pMoveInterrupted:n._pInterrupted||!1,aMoveInterrupted:n._aInterrupted||!1}),delete n._pInterrupted,delete n._aInterrupted,n}function ia(t,a,e){var l,c;const n=t.distance;t._pDodging=a===b.DODGE,t._aDodging=e===b.DODGE,t._pMoveDelta=H[a].delta,t._aMoveDelta=H[e].delta,t.distance=We(n,a,e);const s=((l=H[a])==null?void 0:l.cost)??0,i=((c=H[e])==null?void 0:c.cost)??0;return t.player.stamina=Math.max(0,t.player.stamina-s),t.ai.stamina=Math.max(0,t.ai.stamina-i),s>0&&t.log.push(`玩家身法消耗：-${s}体力`),i>0&&t.log.push(`AI身法消耗：-${i}体力`),t.log.push(`间距变化：${n} → ${t.distance}`),t}function oa(t,a,e){const n=t._pDodging,s=t._aDodging;let i=!1,l=!1,c=!1,r=!1,u=0,p=0;if(n)if(e&&Mt[e]===V.ATTACK)if(e==="thrust"&&De(t.ai.weapon,t.distance))c=!0,t.log.push("⚡ 玩家闪避被AI点刺打断(优势区)！攻防卡取消");else{i=!0,t.log.push("💨 玩家闪避成功！AI攻击无效");const f=Se(t.player.weapon,t.distance);f>0&&(t.ai.hp-=f,p-=f,t.log.push(`🗡️ 闪避反击！AI受${f}伤`)),t.player.weapon==="dual_stab"&&(t.ai.stance+=2,t.log.push("🥢 双刺闪避成功：AI+2架势"))}else t.log.push("💨 玩家闪避落空(对手无攻击)");if(s)if(a&&Mt[a]===V.ATTACK)if(a==="thrust"&&De(t.player.weapon,t.distance))r=!0,t.log.push("⚡ AI闪避被玩家点刺打断(优势区)！攻防卡取消");else{l=!0,t.log.push("💨 AI闪避成功！玩家攻击无效");const f=Se(t.ai.weapon,t.distance);f>0&&(t.player.hp-=f,u-=f,t.log.push(`🗡️ 闪避反击！玩家受${f}伤`)),t.ai.weapon==="dual_stab"&&(t.player.stance+=2,t.log.push("🥢 双刺闪避成功：玩家+2架势"))}else t.log.push("💨 AI闪避落空(对手无攻击)");let m=c?null:a,d=r?null:e;i&&(d=null),l&&(m=null);let h;if(m&&d?h=aa(t,m,d):m&&!d?h=Ie(t,"player",m):!m&&d?h=Ie(t,"ai",d):h={player:{hpChange:0,stanceChange:0,staggered:!1},ai:{hpChange:0,stanceChange:0,staggered:!1},distancePush:0,log:["双方攻防均被取消"]},t.player.hp+=h.player.hpChange,t.ai.hp+=h.ai.hpChange,t.player.stance+=h.player.stanceChange,t.ai.stance+=h.ai.stanceChange,h.player.staggered&&(t.player.staggered=!0),h.ai.staggered&&(t.ai.staggered=!0),t.distance===0&&(t.player.weapon==="dual_stab"&&(h.ai.hpChange<0||h.ai.stanceChange>0||h.ai.staggered)&&(t.ai.stance+=1,t.log.push("🥢 双刺贴身命中：AI额外+1架势")),t.ai.weapon==="dual_stab"&&(h.player.hpChange<0||h.player.stanceChange>0||h.player.staggered)&&(t.player.stance+=1,t.log.push("🥢 双刺贴身命中：玩家额外+1架势"))),t.distance===0&&(t.player.weapon==="dual_stab"&&m==="thrust"&&h.ai.hpChange<0&&(t.ai.hp-=1,t.log.push("🥢 双刺追击：贴身点刺二连，AI额外受1伤")),t.ai.weapon==="dual_stab"&&d==="thrust"&&h.player.hpChange<0&&(t.player.hp-=1,t.log.push("🥢 双刺追击：贴身点刺二连，玩家额外受1伤"))),h.distancePush!==0){const f=t.distance;t.distance=Math.max(Ot,Math.min(Nt,t.distance+h.distancePush)),t.distance!==f&&t.log.push(`间距被推动：${f} → ${t.distance}`)}t.log.push(...h.log);const A=h.player.hpChange+(u??0),g=h.ai.hpChange+(p??0);return t._pInterrupted=!1,t._aInterrupted=!1,(t._pMoveDelta??0)!==0&&A<0&&(t.distance=Math.max(Ot,Math.min(Nt,t.distance-t._pMoveDelta)),t._pInterrupted=!0,t.log.push("⚡ 玩家身法被打断！攻击命中，移动未完成")),(t._aMoveDelta??0)!==0&&g<0&&(t.distance=Math.max(Ot,Math.min(Nt,t.distance-t._aMoveDelta)),t._aInterrupted=!0,t.log.push("⚡ AI身法被打断！攻击命中，移动未完成")),delete t._pMoveDelta,delete t._aMoveDelta,delete t._pDodging,delete t._aDodging,t}function la(t){const a=D.MAX_STANCE,e=D.EXECUTION_DAMAGE;return t.player.stance=Math.max(0,t.player.stance),t.ai.stance=Math.max(0,t.ai.stance),t.player.stance>=a&&(t.player.hp-=e,t.player.stance=0,t.log.push(`⚔ 玩家被处决！-${e}气血`)),t.ai.stance>=a&&(t.ai.hp-=e,t.ai.stance=0,t.log.push(`⚔ AI被处决！-${e}气血`)),t.player.hp=Math.max(0,t.player.hp),t.ai.hp=Math.max(0,t.ai.hp),t}function ca(t){const a=D.MAX_STAMINA,e=D.STAMINA_RECOVERY;t.history.length>0&&t.history[t.history.length-1].playerDistance,t.history.length>0&&t.history[t.history.length-1].aiDistance;const n=t._lastPDist==="hold",s=t._lastADist==="hold",i=n?e+1:e,l=s?e+1:e;t.player.stamina=Math.min(a,t.player.stamina+i),t.ai.stamina=Math.min(a,t.ai.stamina+l),delete t._lastPDist,delete t._lastADist;const c=t.player.hp<=0,r=t.ai.hp<=0;return c&&r?(t.gameOver=!0,t.winner="draw",t.phase=bt.GAME_OVER,t.log.push("双方同时倒下——平局！")):c?(t.gameOver=!0,t.winner="ai",t.phase=bt.GAME_OVER,t.log.push("玩家气血归零——AI胜利！")):r?(t.gameOver=!0,t.winner="player",t.phase=bt.GAME_OVER,t.log.push("AI气血归零——玩家胜利！")):t.phase=bt.INFO_SYNC,t}function Bt(t,a,e=0){const{weapon:n,staggered:s,stamina:i}=t;return Object.values(o).filter(c=>!(s&&Mt[c]===V.ATTACK))}function Jt(t,a){const{stamina:e}=t;return Object.values(b).filter(s=>{var l;if(s===b.HOLD)return!0;if(s===b.ADVANCE&&a<=Ot||s===b.RETREAT&&a>=Nt)return!1;const i=((l=H[s])==null?void 0:l.cost)??0;return!(e<i)})}function ra(t,a,e,n){var c;if(!Jt(e,n).includes(t))return{valid:!1,reason:"身法卡不可用"};const i=((c=H[t])==null?void 0:c.cost)??0;return Bt(e,n,i).includes(a)?{valid:!0}:{valid:!1,reason:"攻防卡不可用（体力不足）"}}function ie(t){const a=t.aiLevel;let e;switch(a){case 1:e=Oe(t);break;case 2:e=pa(t);break;case 3:e=ma(t);break;case 4:e=fa(t);break;case 5:e=ga(t);break;case 6:e=ha(t);break;default:e=Oe(t);break}return da(t,e)}function da(t,a){var s;const e=((s=H[a.distanceCard])==null?void 0:s.cost)??0,n=Bt(t.ai,t.distance,e);return n.includes(a.combatCard)||(a.combatCard=I(n)),a}function I(t){if(!(!t||t.length===0))return t[Math.floor(Math.random()*t.length)]}function dt(t,a){const e=a.reduce((s,i)=>s+i,0);let n=Math.random()*e;for(let s=0;s<t.length;s++)if(n-=a[s],n<=0)return t[s];return t[t.length-1]}function $t(t){const a=t.distance,e=t.ai,n=Jt(e,a),s=Bt(e);return{distCards:n,combatCards:s}}function ua(t){return O[t].advantage}function x(t,a){const e=ua(t);if(e.includes(a))return b.HOLD;const n=e.reduce((s,i)=>s+i,0)/e.length;return a>n?b.ADVANCE:b.RETREAT}function de(t,a,e=.3){var c;if(!a.includes(b.DODGE))return!1;const n=t.ai.stance,s=t.player.weapon,i=t.distance,l=(c=O[s])==null?void 0:c.advantage.includes(i);return!!(n>=3&&Math.random()<e+.2||l&&Math.random()<e)}function Oe(t){const{distCards:a,combatCards:e}=$t(t);return{distanceCard:I(a),combatCard:I(e)}}function pa(t){const{distCards:a,combatCards:e}=$t(t),n=t.ai.weapon,s=t.distance;let i=x(n,s);a.includes(i)||(i=I(a));const l=e.filter(u=>u!==o.FEINT&&u!==o.DEFLECT),c=l.length>0?l:e;let r;return w(n,s)?r=c.reduce((u,p)=>{const m=rt[p].damage,d=rt[u].damage;return m>d?p:u},c[0]):r=c.reduce((u,p)=>{const m=rt[p].cost,d=rt[u].cost;return m<d?p:u},c[0]),{distanceCard:i,combatCard:r}}function ma(t){const{distCards:a,combatCards:e}=$t(t),n=t.ai.weapon,s=t.player.weapon,i=t.distance,l=t.history;let c;if(O[s].advantage.includes(i)&&Math.random()<.5){const d=i<2?b.RETREAT:b.ADVANCE;c=a.includes(d)?d:x(n,i)}else c=x(n,i);a.includes(c)||(c=I(a));let p;const m=l.length>0?l[l.length-1]:null;if(m){const d=oe(m.playerCombat,e);d&&Math.random()<.55&&(p=d)}if(!p)if(t.player.stance>=4&&e.includes(o.THRUST))p=o.THRUST;else if(w(n,i)){const d=e.filter(h=>Mt[h]===V.ATTACK);p=d.length?dt(d,d.map(()=>1)):I(e)}else{const d=e.filter(h=>h===o.BLOCK);p=d.length&&Math.random()<.6?I(d):I(e)}return{distanceCard:c,combatCard:p}}function oe(t,a){const n={[o.SLASH]:o.DEFLECT,[o.THRUST]:o.BLOCK,[o.FEINT]:o.THRUST,[o.BLOCK]:o.FEINT,[o.DEFLECT]:o.FEINT}[t];return n&&a.includes(n)?n:null}function fa(t){const{distCards:a,combatCards:e}=$t(t),n=t.ai.weapon,s=t.player.weapon,i=t.distance,l=t.history;let c;const r=O[n].advantage,u=O[s].advantage,p=r.includes(i),m=u.includes(i);if(m&&!p){const g=x(n,i),f=i<2?b.RETREAT:b.ADVANCE;g!==b.HOLD&&g!==f?c=Math.random()<.6?g:f:c=f}else p?c=b.HOLD:c=x(n,i);a.includes(c)||(c=I(a)),t.ai.stamina<=1&&!m&&(c=b.HOLD),de(t,a,.25)&&(c=b.DODGE);let d;const h=t.ai.stance,A=t.player.stance;if(h>=3){const g=e.filter(f=>f===o.BLOCK);g.length&&(d=I(g))}if(!d&&A>=3){const g=[o.THRUST,o.FEINT,o.SLASH].filter(f=>e.includes(f));g.length&&(d=I(g))}if(!d&&l.length>=2){const f=l.slice(-2).map(E=>E.playerCombat);if(f[0]===f[1]){const E=oe(f[1],e);E&&Math.random()<.7&&(d=E)}if(!d){const E=oe(f[1],e);E&&Math.random()<.5&&(d=E)}}if(!d)if(p){const g=[o.SLASH,o.THRUST,o.FEINT].filter(f=>e.includes(f));d=g.length?dt(g,[3,2,2]):I(e)}else{const g=[o.BLOCK,o.THRUST,o.DEFLECT].filter(f=>e.includes(f));d=g.length?dt(g,[3,2,1]):I(e)}return{distanceCard:c,combatCard:d}}function ga(t){const{distCards:a,combatCards:e}=$t(t),n=t.ai.weapon,s=t.player.weapon,i=t.distance,l=t.history;let c;const r=O[n].advantage,u=O[s].advantage,p=r.includes(i),m=u.includes(i);if(m&&!p){const y=x(n,i),S=i<2?b.RETREAT:b.ADVANCE;y!==b.HOLD&&y!==S?c=Math.random()<.65?y:S:c=S}else if(p&&!m)c=b.HOLD,a.includes(c)||(c=x(n,i));else if(p&&m){const y=i<2?b.RETREAT:b.ADVANCE;c=a.includes(y)?y:b.HOLD}else c=x(n,i);a.includes(c)||(c=I(a)),de(t,a,.3)&&(c=b.DODGE);let d;const h=t.ai.stance,A=t.player.stance,g=l.slice(-5),f={};for(const y of Object.values(o))f[y]=0;g.forEach(y=>f[y.playerCombat]++);const E=Object.entries(f).sort((y,S)=>S[1]-y[1]),F=E[0]?E[0][0]:null,$=E[0]?E[0][1]:0,P=l.length>0?l[l.length-1]:null;if(h>=4){const y=[o.BLOCK].filter(S=>e.includes(S));y.length&&(d=I(y))}if(!d&&A>=3){const y=[o.THRUST,o.FEINT,o.SLASH].filter(S=>e.includes(S));y.length&&(d=y[0])}if(!d&&P&&(P.aiCombat===o.FEINT&&(P.playerCombat===o.BLOCK||P.playerCombat===o.DEFLECT)&&e.includes(o.SLASH)&&(d=o.SLASH),!d&&t.player.staggered&&e.includes(o.SLASH)&&(d=o.SLASH)),!d&&$>=2){const y=Ht(F,e);y&&Math.random()<.8&&(d=y)}if(!d&&P){const y=Ht(P.playerCombat,e);y&&Math.random()<.6&&(d=y)}if(!d)if(p){const y=[o.SLASH,o.THRUST,o.FEINT].filter(S=>e.includes(S));d=y.length?dt(y,[3,3,2]):I(e)}else{const y=[o.BLOCK,o.THRUST,o.DEFLECT].filter(S=>e.includes(S));d=y.length?dt(y,[3,2,1]):I(e)}return{distanceCard:c,combatCard:d}}function Ht(t,a,e,n){const i={[o.SLASH]:[o.DEFLECT,o.BLOCK],[o.THRUST]:[o.BLOCK,o.DEFLECT],[o.FEINT]:[o.THRUST,o.SLASH],[o.BLOCK]:[o.FEINT,o.SLASH],[o.DEFLECT]:[o.THRUST,o.FEINT]}[t]||[];for(const l of i)if(a.includes(l))return l;return null}function ha(t){const{distCards:a,combatCards:e}=$t(t),n=t.ai.weapon,s=t.player.weapon,i=t.distance,l=t.history;let c;const r=O[n].advantage,u=O[s].advantage,p=r.includes(i),m=u.includes(i);if(l.length>=2){const f=l.slice(-3),E=f.filter($=>$.playerDistance===b.ADVANCE).length,F=f.filter($=>$.playerDistance===b.RETREAT).length;E>F?b.ADVANCE:F>E&&b.RETREAT}if(m&&!p){const f=x(n,i),E=i<2?b.RETREAT:b.ADVANCE;f!==b.HOLD&&f!==E?c=Math.random()<.7?f:E:c=E}else if(p&&!m)c=b.HOLD,a.includes(c)||(c=x(n,i));else if(p&&m){const f=r.filter(E=>!u.includes(E));if(f.length){const E=f[0];c=E<i?b.ADVANCE:E>i?b.RETREAT:b.HOLD}else c=b.HOLD}else c=x(n,i);a.includes(c)||(c=I(a)),de(t,a,.35)&&(c=b.DODGE);let d;const h=t.ai.stance,A=t.player.stance,g=l.length>0?l[l.length-1]:null;if(h>=3){const f=[o.BLOCK].filter(E=>e.includes(E));f.length&&(d=I(f))}if(!d&&A>=3){const f=[o.THRUST,o.FEINT].filter(E=>e.includes(E));f.length&&(d=f[0])}if(!d&&t.player.staggered){const f=[o.SLASH,o.FEINT].filter(E=>e.includes(E));f.length&&(d=f[0])}if(!d&&g&&g.aiCombat===o.FEINT&&(g.playerCombat===o.BLOCK||g.playerCombat===o.DEFLECT)&&e.includes(o.SLASH)&&(d=o.SLASH),!d&&l.length>=3){const f=l.slice(-6),E={};for(const y of Object.values(o))E[y]=0;f.forEach(y=>E[y.playerCombat]++);const F=Object.entries(E).sort((y,S)=>S[1]-y[1]),$=F[0],P=F[1];if($[1]>=2){const y=Ht($[0],e);y&&(d=y)}if(!d&&g&&$[0]!==g.playerCombat&&P&&P[1]>=1){const y=Ht(P[0],e);y&&Math.random()<.5&&(d=y)}}if(!d&&g){const f=Ht(g.playerCombat,e);f&&(d=f)}if(!d)if(p){const f=[o.SLASH,o.THRUST,o.FEINT,o.BLOCK].filter(E=>e.includes(E));d=f.length?dt(f,[3,2,2,1]):I(e)}else{const f=[o.BLOCK,o.THRUST,o.DEFLECT].filter(E=>e.includes(E));d=f.length?dt(f,[3,2,1]):I(e)}return{distanceCard:c,combatCard:d}}function va(t,a){const e=w(t,a),n=ce(t,a),s=[];switch(e&&s.push({icon:"★",text:"优势区",cls:"trait-buff"}),n&&s.push({icon:"✗",text:"劣势区",cls:"trait-nerf"}),t){case v.SHORT_BLADE:e&&(s.push({icon:"🎯",text:"点刺破闪避",cls:"trait-buff"}),s.push({icon:"🗡️",text:"闪避时反击1伤",cls:"trait-buff"})),a>=3&&s.push({icon:"⚠",text:"劈砍几乎无效",cls:"trait-nerf"});break;case v.SPEAR:e&&(s.push({icon:"🔱",text:"劈砍+2伤+额外架势",cls:"trait-buff"}),s.push({icon:"🛡️",text:"格挡弹枪推1距",cls:"trait-buff"})),a===0&&s.push({icon:"⚠",text:"劈砍几乎无效",cls:"trait-nerf"});break;case v.SWORD:e&&(s.push({icon:"⚔️",text:"卸力不造成僵直",cls:"trait-buff"}),s.push({icon:"🛡️",text:"完美格挡(劈砍免伤)",cls:"trait-buff"})),a===0&&s.push({icon:"⚠",text:"劈砍大幅削弱",cls:"trait-nerf"}),a===3&&s.push({icon:"⚠",text:"劈砍大幅削弱",cls:"trait-nerf"});break;case v.STAFF:e&&(s.push({icon:"🏑",text:"虚晃+3架势",cls:"trait-buff"}),s.push({icon:"↗",text:"虚晃破格挡→推距",cls:"trait-buff"}),s.push({icon:"⚡",text:"劈砍额外+2架势",cls:"trait-buff"}),s.push({icon:"🛡️",text:"格挡震退+1架势",cls:"trait-buff"})),a===0&&s.push({icon:"⚠",text:"劈砍几乎无效",cls:"trait-nerf"});break;case v.GREAT_BLADE:e&&(s.push({icon:"🪓",text:"劈砍+3伤(共6)",cls:"trait-buff"}),s.push({icon:"↗",text:"劈砍命中→推距+1",cls:"trait-buff"}),s.push({icon:"🛡️",text:"格挡额外减1伤",cls:"trait-buff"})),a===0&&s.push({icon:"⚠",text:"劈砍几乎无效",cls:"trait-nerf"});break;case v.DUAL_STAB:e&&(s.push({icon:"🥢",text:"点刺追击+1伤",cls:"trait-buff"}),s.push({icon:"💨",text:"闪避→对手+2架势",cls:"trait-buff"}),s.push({icon:"✦",text:"命中额外+1架势",cls:"trait-buff"})),n&&s.push({icon:"⚠",text:"劈砍几乎无效",cls:"trait-nerf"});break}return s}function ba(t,a,e,n,s){const i=[],l=G[t],c=G[a];if(i.push(`玩家出 <strong>${l}</strong> vs AI出 <strong>${c}</strong>`),t===a){switch(t){case o.BLOCK:case o.FEINT:i.push("双方出了相同的牌 → <strong>空过</strong>，无事发生");break;case o.DEFLECT:i.push("卸力对碰 → <strong>双方各+2架势</strong>");break;case o.SLASH:i.push("互砍 → <strong>双方各受劈砍伤害+1架势</strong>");break;case o.THRUST:i.push("互刺 → <strong>双方各受点刺伤害+1架势</strong>");break}return i}if(Ne(i,t,a,e,n,s,"玩家"),i.length===1&&Ne(i,a,t,n,e,s,"AI"),w(e,s)){const r=zt(e,s,t);r>0&&i.push(`📈 玩家 ${_[e]} 优势区加成：${l}伤害+${r}`)}if(w(n,s)){const r=zt(n,s,a);r>0&&i.push(`📈 AI ${_[n]} 优势区加成：${c}伤害+${r}`)}return i}function Ne(t,a,e,n,s,i,l){a===o.DEFLECT?e===o.SLASH?(t.push(`${l}卸力 vs 劈砍 → <strong>卸力反制成功！</strong>劈砍方受2伤+2架势+僵直`),n==="sword"&&t.push("（⚔️ 剑的卸力：不造成僵直，改为自身-2架势）")):e===o.THRUST?t.push(`${l}卸力 vs 点刺 → <strong>卸力失败</strong>（点刺穿透卸力），卸力方受点刺伤害+1架势`):e===o.FEINT?t.push(`${l}卸力 vs 虚晃 → <strong>卸力被骗</strong>，卸力方+2架势`):e===o.BLOCK&&t.push(`${l}卸力 vs 格挡 → <strong>卸力落空</strong>，卸力方+1架势`):a===o.SLASH?e===o.THRUST?t.push(`${l}劈砍 vs 点刺 → <strong>劈砍克制点刺！</strong>点刺方受劈砍全伤+1架势，劈砍方不受伤`):e===o.BLOCK?t.push(`${l}劈砍 vs 格挡 → <strong>劈砍破格挡</strong>，格挡方减免1伤后仍受伤+1架势`):e===o.FEINT&&t.push(`${l}劈砍 vs 虚晃 → <strong>劈砍命中！</strong>虚晃方受劈砍全伤+1架势`):a===o.THRUST?e===o.BLOCK?t.push(`${l}点刺 vs 格挡 → <strong>格挡完全抵消</strong>点刺，无伤害`):e===o.FEINT&&t.push(`${l}点刺 vs 虚晃 → <strong>点刺命中！</strong>虚晃方受点刺伤+1架势`):a===o.BLOCK&&e===o.FEINT&&t.push(`${l}格挡 vs 虚晃 → <strong>格挡被虚晃骗</strong>，格挡方+2架势`)}function je(){return`
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
  `}function Ue(){return`
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
    ${ya()}

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
    ${Aa()}

    <h4>📉 距离对伤害的影响</h4>
    <ul>
      <li>在<strong>劣势区</strong>攻击会受到伤害惩罚，卡牌显示为"虚线框" + "⚠ 距离不佳"</li>
      <li>伤害惩罚严重时（-3），基础伤害会降为0，等于空招</li>
      <li>所有卡牌始终可用，但要注意距离对效果的影响</li>
    </ul>
  `}function ya(){return`
    <table class="rules-matrix">
      <tr><th>我方＼对手</th><th>🤺卸力</th><th>⚡劈砍</th><th>🎯点刺</th><th>🛡️格挡</th><th>🌀虚晃</th></tr>
      <tr><td><strong>🤺卸力</strong></td><td>各+2架势</td><td class="rule-win">反制！对手受2伤+2架势+僵直</td><td class="rule-lose">被刺穿：受点刺伤+1架势</td><td class="rule-lose">浪费：自身+1架势</td><td class="rule-lose">被骗：自身+2架势</td></tr>
      <tr><td><strong>⚡劈砍</strong></td><td class="rule-lose">被反制！受2伤+2架势+僵直</td><td>互砍各受伤</td><td class="rule-win">命中！对手受3伤+1架势</td><td class="rule-win">破防！减1伤后命中</td><td class="rule-win">命中！对手受3伤+1架势</td></tr>
      <tr><td><strong>🎯点刺</strong></td><td class="rule-win">穿透！对手受1伤+1架势</td><td class="rule-lose">被克：受3伤+1架势</td><td>互刺各受伤</td><td class="rule-lose">被挡：完全抵消</td><td class="rule-win">命中！对手受1伤+1架势</td></tr>
      <tr><td><strong>🛡️格挡</strong></td><td>空过(对手+1架势)</td><td class="rule-lose">被破：受减伤后伤害+1架势</td><td class="rule-win">格挡：完全抵消</td><td>空过</td><td class="rule-lose">被骗：自身+2架势</td></tr>
      <tr><td><strong>🌀虚晃</strong></td><td class="rule-win">骗到：对手+2架势</td><td class="rule-lose">被砍：受3伤+1架势</td><td class="rule-lose">被刺：受1伤+1架势</td><td class="rule-win">骗到：对手+2架势</td><td>空过</td></tr>
    </table>
  `}function Aa(){return`
    <table class="rules-matrix">
      <tr><th>兵器</th><th>优势区</th><th>劣势区</th><th>核心特点</th></tr>
      <tr><td>🗡️ 短刀</td><td>0, 1</td><td>2, 3</td><td>优势区点刺破闪避、闪避反击1伤、远距劈砍几乎无伤</td></tr>
      <tr><td>🔱 长枪</td><td>2, 3</td><td>0</td><td>劈砍+2伤、劈砍额外+1架势、格挡弹枪推1距、贴身劈砍几乎无伤</td></tr>
      <tr><td>⚔️ 剑</td><td>1, 2</td><td>0, 3</td><td>卸力不僵直/自身-2架势、完美格挡(劈砍免伤)、贴身远距劈砍削弱</td></tr>
      <tr><td>🏏 棍</td><td>1, 2, 3</td><td>0</td><td>虚晃+3架势+推距、劈砍额外+2架势、格挡震退+1架势、贴身劈砍几乎无伤</td></tr>
      <tr><td>🪓 大刀</td><td>2</td><td>0</td><td>劈砍+3伤(全场最高)+推1距、格挡额外减伤、贴身劈砍几乎无伤</td></tr>
      <tr><td>🥢 双刺</td><td>0</td><td>2, 3</td><td>贴身点刺追击+1伤、闪避+2架势、贴身命中+1架势</td></tr>
    </table>
  `}const B={[o.DEFLECT]:{emoji:"🤺",type:"防",desc:"反制劈砍，成功2伤+2架势+僵直"},[o.SLASH]:{emoji:"⚡",type:"攻",desc:"3伤+1架势，高威力"},[o.THRUST]:{emoji:"🎯",type:"攻",desc:"1伤+1架势，快速打击"},[o.BLOCK]:{emoji:"🛡️",type:"防",desc:"减免攻击伤害"},[o.FEINT]:{emoji:"🌀",type:"攻",desc:"0伤+2架势，克格挡/卸力"}},Vt={[b.ADVANCE]:{emoji:"⬆️",desc:"冲步：间距-1"},[b.RETREAT]:{emoji:"⬇️",desc:"撤步：间距+1"},[b.HOLD]:{emoji:"⏸️",desc:"不变"},[b.DODGE]:{emoji:"💨",desc:"闪避(耗2体力)：闪开攻击+出攻防卡"}},at={0:{player:42,ai:58},1:{player:35,ai:65},2:{player:24,ai:76},3:{player:12,ai:88}},Ke={[v.SHORT_BLADE]:{style:"近身刺客",traits:["优势区点刺破闪避","优势区闪避反击1伤","远距劈砍几乎无效"]},[v.SPEAR]:{style:"中远控距",traits:["优势区劈砍+2伤","劈砍额外+1架势","优势区格挡弹枪推1距","贴身劈砍几乎无力"]},[v.SWORD]:{style:"均衡防反",traits:["卸力不僵直/自身-2架势","优势区完美格挡(劈砍免伤)","贴身远距劈砍削弱"]},[v.STAFF]:{style:"广域压制",traits:["虚晃+3架势+推距","优势区劈砍额外+2架势","优势区格挡震退+1架势","贴身劈砍几乎无力"]},[v.GREAT_BLADE]:{style:"重击爆发",traits:["优势区劈砍+3伤(共6)","劈砍命中→推距+1","格挡额外减1伤","贴身劈砍几乎无力"]},[v.DUAL_STAB]:{style:"贴身缠斗",traits:["贴身点刺追击+1伤","闪避成功→对手+2架势","贴身命中额外+1架势"]}},Ea={[v.SHORT_BLADE]:[{name:"贴身步",emoji:"👣",desc:"间距-1，贴身区额外减体力消耗"}],[v.SPEAR]:[{name:"撑杆退",emoji:"🔱",desc:"间距+1，阻止对手下回合靠近超过1格"}],[v.SWORD]:[{name:"游身换位",emoji:"🌊",desc:"间距不变，获得下回合优先结算权"}],[v.STAFF]:[{name:"拨草寻蛇",emoji:"🐍",desc:"间距+1，并给对手+1架势"}],[v.GREAT_BLADE]:[{name:"沉肩带步",emoji:"🏋️",desc:"间距-1，下回合劈砍消耗-1"}],[v.DUAL_STAB]:[{name:"蛇行缠步",emoji:"🥢",desc:"间距-2，消耗2体力"}]};function $a(t){return(Ea[t]||[]).map(e=>`
    <div class="dist-card disabled weapon-skill-card" title="${e.desc}（未开发）">
      <span class="dc-emoji">${e.emoji}</span>
      <span class="dc-name">${e.name}</span>
      <span class="dc-cost">🔒</span>
    </div>
  `).join("")}function tt(t,a=null){const e=O[t],n=Ke[t],s=[0,1,2,3].map(l=>{const c=e.advantage.includes(l),r=e.disadvantage.includes(l),u=l===a;let p="wz-cell";c?p+=" wz-adv":r?p+=" wz-dis":p+=" wz-neutral",u&&(p+=" wz-current");const m=c?"★":r?"✗":"·";return`<div class="${p}">
      <div class="wz-dist-name">${Z[l]}</div>
      <div class="wz-marker">${m}</div>
      ${u?'<div class="wz-here">▲</div>':""}
    </div>`}).join(""),i=n?n.traits.map(l=>`<span class="wz-trait">${l}</span>`).join(""):"";return`
    <div class="wz-strip">
      <div class="wz-header">${R[t]} ${_[t]} · ${(n==null?void 0:n.style)||""}</div>
      <div class="wz-bar">${s}</div>
      ${i?`<div class="wz-traits">${i}</div>`:""}
    </div>
  `}function Ta(t,a=!1){const e=Ke[t];return`
    <div class="weapon-pick-btn ${a?"selected":""}" data-weapon="${t}">
      <span class="wpb-emoji">${R[t]}</span>
      <span class="wpb-name">${_[t]}</span>
      <span class="wpb-style">${(e==null?void 0:e.style)||""}</span>
    </div>
  `}function Ca(t,a,e,n,s){const i=`
    <div class="game-wrapper">
      ${Sa(a,n)}
      <div class="game-layout">
        ${La(a,e)}
        ${Oa(a,n)}
        ${ka(a)}
      </div>
      ${Pa()}
    </div>
    ${ja()}
    ${Ua()}
  `;t.innerHTML=i,Ga(a,e,n,s)}function Sa(t,a){return`
    <div class="top-bar">
      <div class="game-title">⚔️ 冷刃博弈</div>
      <div class="top-controls">
        <button class="ctrl-btn" data-action="tutorial">📚 引导</button>
        <select class="diff-select" data-action="difficulty">
          ${[1,2,3,4,5,6].map(e=>`<option value="${e}" ${e===t.aiLevel?"selected":""}>难度${e}</option>`).join("")}
        </select>
        <button class="ctrl-btn" data-action="newgame">🎮 新对局</button>
        <button class="ctrl-btn" data-action="reset">🔄 重置</button>
        <button class="ctrl-btn" data-action="pause">${a.isPaused?"▶️ 继续":"⏸️ 暂停"}</button>
        <button class="ctrl-btn" data-action="undo" ${a.canUndo?"":"disabled"}>⏪ 回退</button>
        <span class="round-badge">第 ${t.round+1} 回合</span>
      </div>
    </div>
  `}function La(t,a){var r;const e=t.player,n=t.distance,s=e.staggered?'<span class="stagger-badge">⚠ 僵直</span>':"",i=Jt(e,n),l=a.distanceCard?((r=H[a.distanceCard])==null?void 0:r.cost)??0:0,c=Bt(e,n,l);return`
    <div class="side-panel player-side">
      <div class="panel-header">
        <span class="panel-icon">👤</span>
        <span class="panel-name">玩家 ${s}</span>
        <span class="weapon-badge">${R[e.weapon]||""} ${_[e.weapon]}</span>
      </div>
      ${Ge(e)}
      ${tt(e.weapon,t.distance)}
      <div class="divider"></div>
      <div class="card-sel-title">🃏 选择出牌</div>
      <div class="card-group-label">身法卡（必选）</div>
      <div class="cards-row">
        ${Da(t,a,e,i)}
      </div>
      <div class="card-group-label weapon-skill-label">🔒 兵器专属身法 <span class="dev-tag">未开发</span></div>
      <div class="cards-row weapon-skills-row">
        ${$a(t.player.weapon)}
      </div>
      <div class="card-group-label">攻防卡（必选）</div>
      <div class="cards-grid compact">
        ${Ia(t,a,e,c)}
      </div>
      <button class="btn-confirm" id="btn-confirm"
        ${!a.distanceCard||!a.combatCard?"disabled":""}>
        确认出牌
      </button>
    </div>
  `}function Ge(t,a){const e=D.MAX_HP,n=D.MAX_STANCE,s=D.MAX_STAMINA;return`
    ${ee("❤️ 气血","hp",t.hp,e)}
    ${ee("💨 体力","stamina",t.stamina,s,!1)}
    ${ee("⚡ 架势","stance",t.stance,n,t.stance>=4)}
  `}function ee(t,a,e,n,s){const i=Math.max(0,e/n*100);return`
    <div class="stat-row" data-stat="${a}">
      <span class="stat-label">${t}</span>
      <div class="stat-bar-wrap">
        <div class="stat-bar ${a}${s?" danger":""}" data-max="${n}" style="width: ${i}%"></div>
      </div>
      <span class="stat-value">${e}/${n}</span>
    </div>
  `}function Da(t,a,e,n){const s=t.player;return t.distance,Object.values(b).map(i=>{var d;const l=n.includes(i),c=a.distanceCard===i,r=Vt[i],u=((d=H[i])==null?void 0:d.cost)??0,p=[r.desc];u>0&&p.push(`耗${u}体力`),!l&&u>0&&s.stamina<u&&p.push(`⛔ 体力不足（需要${u}）`);const m=p.join(`
`);return`
      <div class="dist-card ${c?"selected":""} ${l?"":"disabled"}"
           data-type="distance" data-card="${i}" title="${m}">
        <span class="dc-emoji">${r.emoji}</span>
        <span class="dc-name">${J[i]}</span>
        ${u>0?`<span class="dc-cost">${u}体</span>`:""}
      </div>
    `}).join("")}function wa(t,a,e,n,s,i){return n&&Mt[t]===V.ATTACK?"⛔ 僵直中，无法使用攻击":""}function Ia(t,a,e,n){var l;const s=t.player,i=t.distance;return a.distanceCard&&((l=H[a.distanceCard])==null||l.cost),Object.values(o).map(c=>{const r=n.includes(c),u=a.combatCard===c,p=B[c],m=rt[c],d=p.type==="攻"?"atk":"def",h=[p.desc],A=zt(s.weapon,i,c);A>0&&h.push(`📈 优势区加成：伤害+${A}`),A<0&&A>=-2&&h.push(`📉 劣势区减益：伤害${A}`),A<=-3&&h.push(`⚠️ 距离不佳：伤害${A}，几乎无效`),r||h.push(wa(c,s.weapon,i,s.staggered,s.stamina));const g=h.join(`
`),f=A<=-3&&m.damage>0?"cc-weak":"";return`
      <div class="combat-card ${u?"selected":""} ${r?"":"disabled"} ${f}"
           data-type="combat" data-card="${c}" title="${g}">
        <div class="cc-top">
          <span class="cc-emoji">${p.emoji}</span>
          <span class="cc-name">${G[c]}</span>
          <span class="cc-type ${d}">${p.type}</span>
        </div>
        <div class="cc-desc">${p.desc}</div>
        <div class="cc-footer">
          <span>伤${m.damage}</span>
          <span>P${m.priority}</span>
          ${A!==0?`<span class="cc-mod ${A>0?"buff":"nerf"}">${A>0?"+":""}${A}伤</span>`:""}
        </div>
        ${f?'<div class="cc-weak-tag">⚠ 距离不佳</div>':""}
      </div>
    `}).join("")}function Oa(t,a){return`
    <div class="center-area">
      ${a.isPaused?'<div class="paused-banner">⏸ 游戏已暂停 — 点击「继续」恢复</div>':""}
      ${Na(t)}
      <div class="arena-wrapper">
        ${_a(t)}
        ${Ra(t)}
      </div>
      ${Ha(t)}
      ${Ma(t)}
    </div>
  `}function Na(t){const a=t.player,e=t.ai,n=t.distance,s=O[a.weapon],i=O[e.weapon],l=s.advantage.includes(n),c=i.advantage.includes(n),r=s.disadvantage.includes(n),u=[];l&&!c?u.push("✅ 你在优势间距！攻击伤害加成"):c&&!l?u.push("⚠️ 对手在优势间距！考虑用身法调整间距"):l&&c?u.push("⚔️ 双方都在优势区，正面较量！"):r&&u.push("❌ 你在劣势区，攻击受削弱！"),a.stance>=4?u.push("🔴 你架势快满了！被攻击可能触发处决(-5血)"):e.stance>=4&&u.push("🟢 对手架势快满了！攻击/虚晃可触发处决"),a.stamina<=1?u.push("🔋 体力不足！只能扎马，无法进退"):e.stamina<=1&&u.push("🎯 对手体力不足！无法移动，趁机调整间距"),a.staggered&&u.push("😵 僵直中！本回合无法使用攻击卡"),e.staggered&&u.push("💥 对手僵直！无法使用攻击卡，进攻好时机"),u.length===0&&u.push("💡 选择1张身法卡 + 1张攻防卡，点确认出牌");const p=va(a.weapon,n),m=p.length>0?`<div class="trait-tags">${p.map(d=>`<span class="trait-tag ${d.cls}">${d.icon} ${d.text}</span>`).join("")}</div>`:"";return`<div class="situation-hint">${u.join('<span class="hint-sep">|</span>')}</div>${m}`}function Ha(t){const a=O[t.player.weapon],e=O[t.ai.weapon],n=t.distance,s=(i,l)=>{const c=[0,1,2,3].map(r=>{const u=l.advantage.includes(r),p=l.disadvantage.includes(r),m=r===n;let d="azr-cell";return u?d+=" azr-adv":p&&(d+=" azr-dis"),m&&(d+=" azr-current"),`<span class="${d}">${u?"★":p?"✗":""}${Z[r]}</span>`}).join("");return`<div class="azr-row"><span class="azr-label">${i}</span>${c}</div>`};return`
    <div class="arena-zone-ribbon">
      ${s("👤",a)}
      ${s("🤖",e)}
    </div>
  `}function _a(t){const a=D.MAX_HP,e=D.MAX_STANCE,n=at[t.distance]||at[2],s=(t.player.hp/a*100).toFixed(0),i=(t.ai.hp/a*100).toFixed(0),l=(t.player.stance/e*100).toFixed(0),c=(t.ai.stance/e*100).toFixed(0),r=n.player,u=n.ai-n.player;return`
    <div class="battle-arena">
      <div class="arena-title">⚔️ 战斗场景</div>
      <div class="arena-stage dist-${t.distance}" id="arena-stage" style="--arena-cam:${t.distance}">
        <div class="arena-parallax-far"></div>
        <div class="arena-parallax-mid"></div>
        <div class="arena-dist-label">${Z[t.distance]}</div>
        <div class="arena-dist-line" style="left:${r}%;width:${u}%"></div>
        <div class="fighter player-fighter" id="player-fighter" style="left:${n.player}%">
          <div class="fighter-weapon-icon">${R[t.player.weapon]||"🗡️"}</div>
          <div class="fighter-body">${t.player.staggered?"😵":"🧑"}</div>
          <div class="fighter-label">玩家</div>
          <div class="mini-bars">
            <div class="mini-bar"><div class="mini-bar-fill hp-p" style="width:${s}%"></div></div>
            <div class="mini-bar"><div class="mini-bar-fill stance-f" style="width:${l}%"></div></div>
          </div>
        </div>
        <div class="fighter ai-fighter" id="ai-fighter" style="left:${n.ai}%">
          <div class="fighter-weapon-icon">${R[t.ai.weapon]||"🔱"}</div>
          <div class="fighter-body">${t.ai.staggered?"😵":t.aiName?"👤":"🤖"}</div>
          <div class="fighter-label">${t.aiName||"AI"}</div>
          <div class="mini-bars">
            <div class="mini-bar"><div class="mini-bar-fill hp-a" style="width:${i}%"></div></div>
            <div class="mini-bar"><div class="mini-bar-fill stance-f" style="width:${c}%"></div></div>
          </div>
        </div>
      </div>
    </div>
  `}function Ra(t){if(t.history.length===0)return'<div class="round-result-banner">等待出牌...</div>';const a=t.history[t.history.length-1],e=J[a.playerDistance],n=G[a.playerCombat],s=J[a.aiDistance],i=G[a.aiCombat],l=B[a.playerCombat]?B[a.playerCombat].emoji:"",c=B[a.aiCombat]?B[a.aiCombat].emoji:"";return`
    <div class="round-result-banner">
      <span class="rrb-label">第${t.round}回合</span>
      <span class="rrb-player">👤 ${e}+${l}${n}</span>
      <span class="rrb-vs">VS</span>
      <span class="rrb-ai">🤖 ${s}+${c}${i}</span>
    </div>
  `}function Ma(t){return`
    <div class="battle-log" id="battle-log">
      <div class="log-title">📜 战斗日志</div>
      ${t.log.map(e=>{let n="log-line";return(e.includes("处决")||e.includes("伤"))&&(n+=" damage"),e.includes("══")&&(n+=" highlight"),(e.includes("闪避成功")||e.includes("格挡"))&&(n+=" good"),`<div class="${n}">${e}</div>`}).join("")||'<div class="log-line">等待对局开始...</div>'}
    </div>
  `}function ka(t){const a=t.ai,e=a.staggered?'<span class="stagger-badge">⚠ 僵直</span>':"";return`
    <div class="side-panel ai-side">
      <div class="panel-header">
        <span class="panel-icon">${t.aiName?"👤":"🤖"}</span>
        <span class="panel-name">${t.aiName||"AI"} ${e}</span>
        <span class="weapon-badge">${R[a.weapon]||""} ${_[a.weapon]}</span>
      </div>
      ${Ge(a)}
      ${tt(a.weapon,t.distance)}
      <div class="divider"></div>
      ${Ba(t)}
      <div class="divider"></div>
      ${Fa(t)}
    </div>
  `}function Ba(t){if(t.history.length===0)return`
      <div class="ai-last-action">
        <div class="ala-title">🎴 AI上回合出牌</div>
        <div class="ala-waiting">等待第一回合...</div>
      </div>
    `;const a=t.history[t.history.length-1],e=Vt[a.aiDistance],n=B[a.aiCombat];return`
    <div class="ai-last-action">
      <div class="ala-title">🎴 AI上回合出牌</div>
      <div class="ala-cards">
        <div class="ala-card">${e.emoji} ${J[a.aiDistance]}</div>
        <div class="ala-card">${n.emoji} ${G[a.aiCombat]} <span class="cc-type ${n.type==="攻"?"atk":"def"}">${n.type}</span></div>
      </div>
    </div>
  `}function Fa(t){return`
    <div class="history-section">
      <div class="history-title">📜 历史记录 <span class="history-hint">点击回合查看详情</span></div>
      <div class="history-list" id="history-list">
        ${t.history.map((e,n)=>{const s=J[e.playerDistance],i=G[e.playerCombat],l=J[e.aiDistance],c=G[e.aiCombat],r=B[e.playerCombat]?B[e.playerCombat].emoji:"",u=B[e.aiCombat]?B[e.aiCombat].emoji:"",p=e.pMoveInterrupted?" 🔙":"",m=e.aMoveInterrupted?" 🔙":"";return`
      <div class="history-item history-clickable" data-round-idx="${n}" title="点击查看本回合详细解释">
        <div class="h-round">回合 ${n+1} <span class="h-explain-hint">🔍</span></div>
        <div class="h-player">👤 ${s} + ${r} ${i}${p}</div>
        <div class="h-ai">🤖 ${l} + ${u} ${c}${m}</div>
      </div>
    `}).reverse().join("")||'<div class="history-item"><div class="h-detail">暂无记录</div></div>'}
      </div>
    </div>
  `}function Pa(){return`
    <div class="bottom-bar">
      <div class="rule-summary">
        <span>身法控距</span>为第一核心 |
        <span>双向架势</span>为胜负根基 |
        <span>攻防预判</span>为博弈循环
      </div>
      <button class="btn-rules" data-action="rules">📖 完整规则</button>
    </div>
  `}function ja(){return`
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
          ${je()}
        </div>

        <!-- Tab: 完整规则 -->
        <div class="modal-content-text tab-content" id="tab-rules">
          ${Ue()}
        </div>
      </div>
    </div>
  `}function Ua(){return`
    <div class="modal-overlay" id="modal-round-detail">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title" id="round-detail-title">🔍 回合详情</div>
          <button class="modal-close" data-close="round-detail">关闭</button>
        </div>
        <div class="modal-content-text" id="round-detail-content"></div>
      </div>
    </div>
  `}function Ka(t,a){var st,Ct,Ft,St,X,Lt,it,Dt;const e=t.history[a];if(!e)return;const n=J[e.playerDistance],s=G[e.playerCombat],i=J[e.aiDistance],l=G[e.aiCombat],c=((st=B[e.playerCombat])==null?void 0:st.emoji)||"",r=((Ct=B[e.aiCombat])==null?void 0:Ct.emoji)||"",u=t.player.weapon,p=t.ai.weapon;let m=D.INITIAL_DISTANCE??2;for(let M=0;M<a;M++){const W=t.history[M],ft=((Ft=H[W.playerDistance])==null?void 0:Ft.delta)??0,gt=((St=H[W.aiDistance])==null?void 0:St.delta)??0;m=Math.max(0,Math.min(3,m+ft+gt)),W.pMoveInterrupted&&(m=Math.max(0,Math.min(3,m-ft))),W.aMoveInterrupted&&(m=Math.max(0,Math.min(3,m-gt)))}const d=m,h=((X=H[e.playerDistance])==null?void 0:X.delta)??0,A=((Lt=H[e.aiDistance])==null?void 0:Lt.delta)??0,g=Math.max(0,Math.min(3,d+h+A));let f=g;e.pMoveInterrupted&&(f=Math.max(0,Math.min(3,f-h))),e.aMoveInterrupted&&(f=Math.max(0,Math.min(3,f-A)));const E=(it=O[u])==null?void 0:it.advantage.includes(g),F=(Dt=O[p])==null?void 0:Dt.advantage.includes(g),$=[];if($.push(`<h4>📋 第 ${a+1} 回合概要</h4>`),$.push('<div class="rd-cards">'),$.push(`<div class="rd-card-row"><span class="rd-p">👤 玩家：</span>${n} + ${c} ${s}（${R[u]} ${_[u]}）</div>`),$.push(`<div class="rd-card-row"><span class="rd-a">🤖 AI：</span>${i} + ${r} ${l}（${R[p]} ${_[p]}）</div>`),$.push("</div>"),$.push("<h4>① 身法结算</h4>"),$.push("<ul>"),$.push(`<li>回合前间距：<strong>${Z[d]}(${d})</strong></li>`),h!==0||A!==0)$.push(`<li>玩家${n}(${h>0?"+":""}${h}) + AI${i}(${A>0?"+":""}${A})</li>`),$.push(`<li>移动后间距：<strong>${Z[g]}(${g})</strong></li>`);else if(e.playerDistance==="dodge"||e.aiDistance==="dodge"){const M=e.playerDistance==="dodge"?"闪避":"扎马",W=e.aiDistance==="dodge"?"闪避":"扎马";$.push(`<li>玩家${M} + AI${W}，间距不变</li>`)}else $.push("<li>双方扎马，间距不变</li>");E&&$.push(`<li>✅ 玩家 ${_[u]} 在优势区</li>`),F&&$.push(`<li>⚠️ AI ${_[p]} 在优势区</li>`),$.push("</ul>"),$.push("<h4>② 攻防结算</h4>"),$.push("<ul>"),ba(e.playerCombat,e.aiCombat,u,p,g).forEach(M=>$.push(`<li>${M}</li>`)),$.push("</ul>"),(e.pMoveInterrupted||e.aMoveInterrupted)&&($.push("<h4>③ ⚡ 身法打断</h4>"),$.push("<ul>"),e.pMoveInterrupted&&$.push(`<li>玩家在移动中（${n}）受到HP伤害 → <strong>移动被取消</strong>，间距回退</li>`),e.aMoveInterrupted&&$.push(`<li>AI在移动中（${i}）受到HP伤害 → <strong>移动被取消</strong>，间距回退</li>`),$.push(`<li>最终间距：<strong>${Z[f]}(${f})</strong></li>`),$.push("</ul>")),$.push("<h4>📍 最终间距</h4>"),$.push(`<p><strong>${Z[f]}(${f})</strong></p>`);const y=document.getElementById("round-detail-title"),S=document.getElementById("round-detail-content");y&&(y.textContent=`🔍 第 ${a+1} 回合详解`),S&&(S.innerHTML=$.join(`
`)),xt("modal-round-detail",!0)}function Ga(t,a,e,n){document.querySelectorAll(".dist-card:not(.disabled), .combat-card:not(.disabled)").forEach(i=>{i.addEventListener("click",()=>{n.onSelect(i.dataset.type,i.dataset.card)})});const s=document.getElementById("btn-confirm");s&&!s.disabled&&s.addEventListener("click",()=>n.onConfirm()),document.querySelectorAll("[data-action]").forEach(i=>{const l=i.dataset.action;i.addEventListener(i.tagName==="SELECT"?"change":"click",()=>{switch(l){case"tutorial":xt("modal-tutorial",!0),ae("guide");break;case"rules":xt("modal-tutorial",!0),ae("rules");break;case"newgame":n.onNewGame();break;case"reset":n.onReset();break;case"pause":n.onTogglePause();break;case"undo":n.onUndo();break;case"difficulty":n.onDifficultyChange(parseInt(i.value));break}})}),document.querySelectorAll("[data-close]").forEach(i=>{i.addEventListener("click",()=>{xt("modal-"+i.dataset.close,!1)})}),document.querySelectorAll(".modal-overlay").forEach(i=>{i.addEventListener("click",l=>{l.target===i&&i.classList.remove("active")})}),document.querySelectorAll("#modal-tutorial .modal-tab").forEach(i=>{i.addEventListener("click",()=>ae(i.dataset.tab))}),document.querySelectorAll(".history-clickable").forEach(i=>{i.addEventListener("click",()=>{const l=parseInt(i.dataset.roundIdx);Ka(t,l)})})}function xt(t,a){const e=document.getElementById(t);e&&(a?e.classList.add("active"):e.classList.remove("active"))}function ae(t){document.querySelectorAll("#modal-tutorial .modal-tab").forEach(a=>{a.classList.toggle("active",a.dataset.tab===t)}),document.querySelectorAll("#modal-tutorial .tab-content").forEach(a=>{a.classList.toggle("active",a.id==="tab-"+t)})}function Xa(t,a,e,n){const s=D.MAX_HP;let i,l;a.winner==="player"?(i="🏆 胜利！",l="win"):a.winner==="ai"?(i="💀 败北",l="lose"):(i="🤝 平局",l="draw");const c=document.querySelector(".center-area");if(!c)return;const r=document.createElement("div");r.className="game-over-banner "+l,r.innerHTML=`
    <div class="gob-title">${i}</div>
    <div class="gob-stats">
      回合${a.round} ｜ 
      👤 HP ${a.player.hp}/${s} ｜ 
      ${a.aiName?"👤":"🤖"} ${a.aiName||"AI"} HP ${a.ai.hp}/${s}
    </div>
    <div class="gob-btns">
      <button class="gob-btn restart" id="btn-restart-same">🔄 再来一局</button>
      <button class="gob-btn back" id="btn-back-setup">🏠 返回选择</button>
    </div>
  `,c.insertBefore(r,c.firstChild),document.getElementById("btn-restart-same").addEventListener("click",()=>{e()}),document.getElementById("btn-back-setup").addEventListener("click",()=>{n()})}function qa(){const t=document.getElementById("battle-log");t&&(t.scrollTop=t.scrollHeight)}const xa=50;function za(t,a){const e=JSON.parse(JSON.stringify(t)),n=e.player;return e.player=e.ai,e.ai=n,e.aiLevel=a,e.history=e.history.map(s=>({round:s.round,playerDistance:s.aiDistance,playerCombat:s.aiCombat,aiDistance:s.playerDistance,aiCombat:s.playerCombat})),e}function He(t,a,e){const n=Bt(a),s=Jt(a,e);let i=t.combatCard,l=t.distanceCard;return(!i||!n.includes(i))&&(i=n.length>0?n[Math.floor(Math.random()*n.length)]:o.BLOCK),(!l||!s.includes(l))&&(l=s.length>0?s[Math.floor(Math.random()*s.length)]:b.HOLD),{combatCard:i,distanceCard:l}}function Va(t,a,e,n){let s=re(t,a,n),i=0;for(;!s.gameOver&&i<xa;){const l=ie(s),c=za(s,e),r=ie(c),u=He(r,s.player,s.distance),p=He(l,s.ai,s.distance);s=Pe(s,u,p),i++}return s.winner||"draw"}function Za(t,a,e,n){const s={};for(const i of t){s[i]={};for(const l of t){let c=0,r=0,u=0;for(let p=0;p<n;p++){const m=Va(i,l,a,e);m==="player"?c++:m==="ai"?r++:u++}s[i][l]={wins:c,losses:r,draws:u}}}return s}const Xe=Object.values(v);function Ja(){const t=document.getElementById("sim-modal");t&&t.remove();const a=document.createElement("div");a.id="sim-modal",a.className="sim-modal-overlay",a.innerHTML=`
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
  `,document.body.appendChild(a),document.getElementById("sim-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",e=>{e.target===a&&a.remove()}),document.getElementById("sim-run").addEventListener("click",()=>{const e=parseInt(document.getElementById("sim-player-level").value),n=parseInt(document.getElementById("sim-ai-level").value),s=parseInt(document.getElementById("sim-num-games").value),i=document.getElementById("sim-results");i.innerHTML='<p class="sim-loading">⏳ 模拟运行中…</p>',setTimeout(()=>{const l=Za(Xe,e,n,s);Ya(i,l,s,e,n)},50)})}function Ya(t,a,e,n,s){const i=Xe,l=R||{},c=_;let r=0,u=0;for(const h of i)for(const A of i)r+=a[h][A].wins,u+=e;const p=(r/u*100).toFixed(1);let m=`<div class="sim-summary">L${n} vs L${s} · 每组${e}局 · 左侧总胜率 <strong>${p}%</strong></div>`;m+='<table class="sim-table"><thead><tr><th>左↓ \\ 右→</th>';for(const h of i)m+=`<th>${l[h]||""} ${c[h].slice(0,2)}</th>`;m+="</tr></thead><tbody>";for(const h of i){m+=`<tr><td class="sim-row-header">${l[h]||""} ${c[h]}</td>`;for(const A of i){const g=a[h][A],f=Math.round(g.wins/e*100),E=Qa(f),F=`胜${g.wins} 负${g.losses} 平${g.draws}`;m+=`<td class="sim-cell ${E}" title="${F}">${f}%</td>`}m+="</tr>"}m+="</tbody></table>",m+='<div class="sim-ranking"><strong>武器综合胜率排名：</strong>';const d=i.map(h=>{let A=0,g=0;for(const f of i)A+=a[h][f].wins,g+=e;return{weapon:h,rate:Math.round(A/g*100)}}).sort((h,A)=>A.rate-h.rate);m+=d.map((h,A)=>`<span class="sim-rank-item">${A+1}. ${l[h.weapon]||""} ${c[h.weapon]} ${h.rate}%</span>`).join(" "),m+="</div>",t.innerHTML=m}function Qa(t){return t>=65?"sim-hot":t>=55?"sim-warm":t>=45?"sim-neutral":t>=35?"sim-cool":"sim-cold"}const ue="lbq2_config";function Wa(){const t={};for(const[a,e]of Object.entries(O))t[a]={advantage:[...e.advantage],disadvantage:[...e.disadvantage]};return{...D,WEAPON_ZONES:t}}const Et=Wa(),ut={MAX_HP:{label:"最大气血",min:5,max:30,step:1},MAX_STANCE:{label:"处决架势阈值",min:3,max:10,step:1},EXECUTION_DAMAGE:{label:"处决伤害",min:2,max:15,step:1},INITIAL_DISTANCE:{label:"初始间距",min:0,max:3,step:1},MAX_STAMINA:{label:"最大体力",min:2,max:8,step:1},STAMINA_RECOVERY:{label:"体力回复/回合",min:1,max:3,step:1}},_e=Et;function _t(t){return JSON.parse(JSON.stringify(t))}function qe(){try{const t=localStorage.getItem(ue);return t?JSON.parse(t):null}catch{return null}}function tn(t){try{return localStorage.setItem(ue,JSON.stringify(t)),!0}catch{return!1}}function pe(t){if(t){for(const a of Object.keys(ut))t[a]!==void 0&&(D[a]=t[a]);if(t.WEAPON_ZONES)for(const[a,e]of Object.entries(t.WEAPON_ZONES))O[a]&&(O[a]=_t(e))}}function en(){localStorage.removeItem(ue),pe(_t(Et))}function Re(t){if(!t)return[];const a=[];for(const e of Object.keys(ut)){const n=Et[e],s=t[e];s!==void 0&&s!==n&&a.push({key:e,label:ut[e].label,default:n,current:s})}if(t.WEAPON_ZONES)for(const[e,n]of Object.entries(t.WEAPON_ZONES)){const s=Et.WEAPON_ZONES[e];if(!s)continue;const i=JSON.stringify(n.advantage)!==JSON.stringify(s.advantage),l=JSON.stringify(n.disadvantage)!==JSON.stringify(s.disadvantage);if(i||l){const c=_[e]||e;i&&a.push({key:e+"_adv",label:c+" 优势区",default:s.advantage.join(","),current:n.advantage.join(",")}),l&&a.push({key:e+"_disadv",label:c+" 劣势区",default:s.disadvantage.join(","),current:n.disadvantage.join(",")})}}return a}function xe(){const t=qe();if(!t)return _t(Et);const a=_t(Et);for(const e of Object.keys(ut))t[e]!==void 0&&(a[e]=t[e]);if(t.WEAPON_ZONES)for(const[e,n]of Object.entries(t.WEAPON_ZONES))a.WEAPON_ZONES[e]&&(a.WEAPON_ZONES[e]=_t(n));return a}function an(){const t=qe();t&&pe(t)}function le(t,a="info"){let e=document.getElementById("toast-container");e||(e=document.createElement("div"),e.id="toast-container",document.body.appendChild(e));const n=document.createElement("div");n.className=`game-toast toast-${a}`,n.textContent=t,e.appendChild(n),n.offsetWidth,n.classList.add("toast-show"),setTimeout(()=>{n.classList.add("toast-hide"),n.addEventListener("animationend",()=>n.remove())},2200)}function nn(){const t=document.getElementById("cfg-modal");t&&t.remove();const a=xe(),e=["0-贴身","1-近战","2-中距","3-远距"],n=document.createElement("div");n.id="cfg-modal",n.className="sim-modal-overlay";let s="";for(const[r,u]of Object.entries(ut)){const p=a[r],m=_e[r],d=p!==m;s+=`
      <div class="cfg-row">
        <label>${u.label}</label>
        <input type="number" id="cfg-${r}" value="${p}" min="${u.min}" max="${u.max}" step="${u.step}" />
        <span class="cfg-default${d?" cfg-changed":""}">(默认: ${m})</span>
      </div>`}let i="";for(const[r,u]of Object.entries(a.WEAPON_ZONES)){const p=(R[r]||"")+" "+(_[r]||r),m=_e.WEAPON_ZONES[r],d=m&&JSON.stringify(u.advantage)!==JSON.stringify(m.advantage),h=m&&JSON.stringify(u.disadvantage)!==JSON.stringify(m.disadvantage);i+=`
      <div class="cfg-weapon-block">
        <div class="cfg-weapon-name">${p}</div>
        <div class="cfg-zone-row">
          <label>优势区</label>
          <div class="cfg-checkboxes" data-weapon="${r}" data-type="advantage">
            ${e.map((A,g)=>`<label class="cfg-cb"><input type="checkbox" value="${g}" ${u.advantage.includes(g)?"checked":""} /> ${A}</label>`).join("")}
          </div>
          ${d?'<span class="cfg-changed-dot">●</span>':""}
        </div>
        <div class="cfg-zone-row">
          <label>劣势区</label>
          <div class="cfg-checkboxes" data-weapon="${r}" data-type="disadvantage">
            ${e.map((A,g)=>`<label class="cfg-cb"><input type="checkbox" value="${g}" ${u.disadvantage.includes(g)?"checked":""} /> ${A}</label>`).join("")}
          </div>
          ${h?'<span class="cfg-changed-dot">●</span>':""}
        </div>
      </div>`}const l=Re(a);let c="";l.length>0&&(c='<div class="cfg-diff"><strong>与默认值差异：</strong>'+l.map(r=>`<div class="cfg-diff-item"><span class="cfg-diff-label">${r.label}</span> <span class="cfg-diff-old">${r.default}</span> → <span class="cfg-diff-new">${r.current}</span></div>`).join("")+"</div>"),n.innerHTML=`
    <div class="sim-modal-box cfg-modal-box">
      <div class="sim-header">
        <h2>⚙️ 参数配置</h2>
        <button class="sim-close" id="cfg-close">✕</button>
      </div>
      <div class="cfg-section">
        <h3>基础数值</h3>
        ${s}
      </div>
      <div class="cfg-section">
        <h3>兵器区间</h3>
        ${i}
      </div>
      <div id="cfg-diff-area">${c}</div>
      <div class="cfg-actions">
        <button class="cfg-btn cfg-save" id="cfg-save">💾 保存</button>
        <button class="cfg-btn cfg-reset" id="cfg-reset">↩ 恢复默认</button>
        <button class="cfg-btn cfg-cancel" id="cfg-cancel">取消</button>
      </div>
    </div>
  `,document.body.appendChild(n),n.addEventListener("click",r=>{r.target===n&&n.remove()}),document.getElementById("cfg-close").addEventListener("click",()=>n.remove()),document.getElementById("cfg-cancel").addEventListener("click",()=>n.remove()),document.getElementById("cfg-save").addEventListener("click",()=>{const r=Me();tn(r),pe(r),n.remove(),le("✅ 配置已保存！下次对局生效。","success")}),document.getElementById("cfg-reset").addEventListener("click",()=>{en(),n.remove(),le("↩ 已恢复默认配置！","info")}),n.querySelectorAll("input").forEach(r=>{r.addEventListener("change",()=>{const u=Me(),p=Re(u),m=document.getElementById("cfg-diff-area");p.length>0?m.innerHTML='<div class="cfg-diff"><strong>与默认值差异：</strong>'+p.map(d=>`<div class="cfg-diff-item"><span class="cfg-diff-label">${d.label}</span> <span class="cfg-diff-old">${d.default}</span> → <span class="cfg-diff-new">${d.current}</span></div>`).join("")+"</div>":m.innerHTML='<div class="cfg-diff"><em>无差异（全部为默认值）</em></div>'})})}function Me(){const t=xe();for(const a of Object.keys(ut)){const e=document.getElementById(`cfg-${a}`);e&&(t[a]=parseInt(e.value)||ut[a].min)}return document.querySelectorAll(".cfg-checkboxes").forEach(a=>{const e=a.dataset.weapon,n=a.dataset.type,s=[];a.querySelectorAll('input[type="checkbox"]:checked').forEach(i=>{s.push(parseInt(i.value))}),t.WEAPON_ZONES[e]||(t.WEAPON_ZONES[e]={advantage:[],disadvantage:[]}),t.WEAPON_ZONES[e][n]=s.sort()}),t}function sn(t,a){t.innerHTML=`
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
      </div>
      <div class="title-btns">
        <button id="btn-title-tutorial">📖 新手引导</button>
        <button id="btn-title-sim">📊 对战模拟</button>
        <button id="btn-title-config">⚙️ 参数配置</button>
      </div>
    </div>
  `,document.getElementById("mode-tower").addEventListener("click",a.onTower),document.getElementById("mode-battle").addEventListener("click",a.onBattle),document.getElementById("btn-title-tutorial").addEventListener("click",()=>cn()),document.getElementById("btn-title-sim").addEventListener("click",()=>Ja()),document.getElementById("btn-title-config").addEventListener("click",()=>nn())}function on(t,a,e){const n=v.SHORT_BLADE,s=v.SPEAR;t.innerHTML=`
    <div class="mode-setup">
      <button class="back-link" id="btn-back">← 返回</button>
      <h2>⚔ 自由对战</h2>
      <div class="battle-setup-cols">
        <div class="setup-weapon-col">
          <div class="setup-col-title">👤 你的兵器</div>
          <select id="sel-player" class="setup-select">
            ${Object.entries(_).map(([i,l])=>`<option value="${i}">${R[i]||""} ${l}</option>`).join("")}
          </select>
          <div id="player-wz">${tt(n)}</div>
        </div>
        <div class="setup-vs">VS</div>
        <div class="setup-weapon-col">
          <div class="setup-col-title">🤖 对手兵器</div>
          <select id="sel-ai" class="setup-select">
            ${Object.entries(_).map(([i,l])=>`<option value="${i}">${R[i]||""} ${l}</option>`).join("")}
          </select>
          <div id="ai-wz">${tt(s)}</div>
        </div>
      </div>
      <div class="setup-row-center">
        <label>AI 难度</label>
        <select id="sel-level" class="setup-select">
          <option value="1">1 - 纯随机</option>
          <option value="2">2 - 基础规则</option>
          <option value="3" selected>3 - 简单策略</option>
          <option value="4">4 - 普通策略</option>
          <option value="5">5 - 高级策略</option>
          <option value="6">6 - 顶级高手</option>
        </select>
      </div>
      <button class="primary-btn" id="btn-start">开始对局</button>
    </div>
  `,document.getElementById("sel-ai").value=s,document.getElementById("sel-player").addEventListener("change",i=>{document.getElementById("player-wz").innerHTML=tt(i.target.value)}),document.getElementById("sel-ai").addEventListener("change",i=>{document.getElementById("ai-wz").innerHTML=tt(i.target.value)}),document.getElementById("btn-start").addEventListener("click",()=>{a(document.getElementById("sel-player").value,document.getElementById("sel-ai").value,parseInt(document.getElementById("sel-level").value))}),document.getElementById("btn-back").addEventListener("click",e)}function ln(t,a,e){let n=v.SHORT_BLADE;function s(){t.innerHTML=`
      <div class="mode-setup">
        <button class="back-link" id="btn-back">← 返回</button>
        <h2>🗼 江湖行 — 选择你的兵器</h2>
        <p class="setup-hint">兵器将伴随你走完全部十关</p>
        <div class="weapon-pick-grid">
          ${Object.values(v).map(i=>Ta(i,i===n)).join("")}
        </div>
        <div id="weapon-preview">${tt(n)}</div>
        <button class="primary-btn" id="btn-start">⚔ 启程</button>
      </div>
    `,document.querySelectorAll(".weapon-pick-btn").forEach(i=>{i.addEventListener("click",()=>{n=i.dataset.weapon,s()})}),document.getElementById("btn-start").addEventListener("click",()=>a(n)),document.getElementById("btn-back").addEventListener("click",e)}s()}function cn(t="guide"){const a=document.getElementById("standalone-tutorial");a&&a.remove();const e=document.createElement("div");e.id="standalone-tutorial",e.className="modal-overlay active",e.innerHTML=`
    <div class="modal-box modal-box-wide">
      <div class="modal-header">
        <div class="modal-tabs">
          <button class="modal-tab ${t==="guide"?"active":""}" data-tab="guide">📚 新手入门</button>
          <button class="modal-tab ${t==="rules"?"active":""}" data-tab="rules">📖 完整规则</button>
        </div>
        <button class="modal-close" id="tut-close">✕</button>
      </div>

      <!-- Tab: 新手入门 -->
      <div class="modal-content-text tab-content ${t==="guide"?"active":""}" id="setup-tab-guide">
        ${je()}
      </div>

      <!-- Tab: 完整规则 -->
      <div class="modal-content-text tab-content ${t==="rules"?"active":""}" id="setup-tab-rules">
        ${Ue()}
      </div>
    </div>
  `,document.body.appendChild(e),e.addEventListener("click",n=>{n.target===e&&e.remove()}),document.getElementById("tut-close").addEventListener("click",()=>e.remove()),e.querySelectorAll(".modal-tab").forEach(n=>{n.addEventListener("click",()=>{e.querySelectorAll(".modal-tab").forEach(s=>s.classList.toggle("active",s===n)),e.querySelectorAll(".tab-content").forEach(s=>s.classList.toggle("active",s.id==="setup-tab-"+n.dataset.tab))})})}const rn={[`${o.DEFLECT}_${o.SLASH}`]:{pAnim:"anim-deflect",aAnim:"anim-recoil",spark:"🤺",desc:"卸力反制!"},[`${o.SLASH}_${o.DEFLECT}`]:{pAnim:"anim-recoil",aAnim:"anim-deflect",spark:"🤺",desc:"被卸力反制!"},[`${o.DEFLECT}_${o.THRUST}`]:{pAnim:"anim-deflect-fail",aAnim:"anim-thrust-p",spark:"🎯",desc:"卸力失败"},[`${o.THRUST}_${o.DEFLECT}`]:{pAnim:"anim-thrust-p",aAnim:"anim-deflect-fail",spark:"🎯",desc:"穿透卸力"},[`${o.DEFLECT}_${o.FEINT}`]:{pAnim:"anim-deflect-fail",aAnim:"anim-feint-a",spark:"🌀",desc:"虚晃骗卸力"},[`${o.FEINT}_${o.DEFLECT}`]:{pAnim:"anim-feint-p",aAnim:"anim-deflect-fail",spark:"🌀",desc:"虚晃骗卸力"},[`${o.SLASH}_${o.SLASH}`]:{pAnim:"anim-clash-p",aAnim:"anim-clash-a",spark:"⚡",desc:"互砍!"},[`${o.SLASH}_${o.THRUST}`]:{pAnim:"anim-slash-p",aAnim:"anim-hit",spark:"⚡",desc:"劈砍命中"},[`${o.THRUST}_${o.SLASH}`]:{pAnim:"anim-hit",aAnim:"anim-slash-a",spark:"⚡",desc:"被劈中"},[`${o.SLASH}_${o.BLOCK}`]:{pAnim:"anim-slash-p",aAnim:"anim-block-hit",spark:"🛡️",desc:"劈砍破格挡"},[`${o.BLOCK}_${o.SLASH}`]:{pAnim:"anim-block-hit",aAnim:"anim-slash-a",spark:"🛡️",desc:"格挡被破"},[`${o.SLASH}_${o.FEINT}`]:{pAnim:"anim-slash-p",aAnim:"anim-hit",spark:"⚡",desc:"劈砍命中"},[`${o.FEINT}_${o.SLASH}`]:{pAnim:"anim-hit",aAnim:"anim-slash-a",spark:"⚡",desc:"被劈中"},[`${o.THRUST}_${o.THRUST}`]:{pAnim:"anim-thrust-p",aAnim:"anim-thrust-a",spark:"🎯",desc:"互刺!"},[`${o.THRUST}_${o.BLOCK}`]:{pAnim:"anim-thrust-miss",aAnim:"anim-block",spark:"🛡️",desc:"被格挡"},[`${o.BLOCK}_${o.THRUST}`]:{pAnim:"anim-block",aAnim:"anim-thrust-miss",spark:"🛡️",desc:"格挡成功"},[`${o.THRUST}_${o.FEINT}`]:{pAnim:"anim-thrust-p",aAnim:"anim-hit",spark:"🎯",desc:"点刺命中"},[`${o.FEINT}_${o.THRUST}`]:{pAnim:"anim-hit",aAnim:"anim-thrust-a",spark:"🎯",desc:"被点刺"},[`${o.BLOCK}_${o.FEINT}`]:{pAnim:"anim-block-tricked",aAnim:"anim-feint-a",spark:"🌀",desc:"虚晃骗格挡"},[`${o.FEINT}_${o.BLOCK}`]:{pAnim:"anim-feint-p",aAnim:"anim-block-tricked",spark:"🌀",desc:"虚晃骗格挡"},[`${o.BLOCK}_${o.BLOCK}`]:{pAnim:"anim-block",aAnim:"anim-block",spark:null,desc:"双挡空过"},[`${o.FEINT}_${o.FEINT}`]:{pAnim:"anim-idle",aAnim:"anim-idle",spark:null,desc:"双晃空过"},[`${o.DEFLECT}_${o.DEFLECT}`]:{pAnim:"anim-clash-p",aAnim:"anim-clash-a",spark:"⚡",desc:"卸力对碰"},[`${o.DEFLECT}_${o.BLOCK}`]:{pAnim:"anim-deflect-fail",aAnim:"anim-block",spark:"🛡️",desc:"卸力被挡"},[`${o.BLOCK}_${o.DEFLECT}`]:{pAnim:"anim-block",aAnim:"anim-deflect-fail",spark:"🛡️",desc:"格挡卸力"}};function dn(t,a){const e=`${t}_${a}`;return rn[e]||{pAnim:"anim-idle",aAnim:"anim-idle",spark:null,desc:""}}function C(t){return new Promise(a=>setTimeout(a,t))}function ht(t,a,e,n){const s=document.createElement("div"),i=n==="stance"?" stance-dmg":n==="heal"?" heal":"";s.className="float-dmg"+i,s.textContent=e,s.style.left=a.style.left,s.style.top="30%",t.appendChild(s),setTimeout(()=>s.remove(),1300)}function vt(t,a,e,n){const s=document.querySelector(t);if(!s)return;const i=s.querySelector(`.stat-row[data-stat="${a}"]`);if(!i)return;const l=i.querySelector(".stat-bar"),c=i.querySelector(".stat-value");l&&(l.style.transition="none",l.style.width=Math.max(0,e/n*100)+"%",l.offsetWidth),c&&(c.textContent=`${Math.max(0,e)}/${n}`)}function U(t,a,e,n,s=500){const i=document.querySelector(t);if(!i)return;const l=i.querySelector(`.stat-row[data-stat="${a}"]`);if(!l)return;const c=l.querySelector(".stat-bar"),r=l.querySelector(".stat-value");c&&(c.style.transition=`width ${s}ms ease`,c.style.width=Math.max(0,e/n*100)+"%"),r&&(r.textContent=`${Math.max(0,Math.round(e))}/${n}`)}function K(t,a,e,n="cost"){const s=document.querySelector(t);if(!s)return;const i=s.querySelector(`.stat-row[data-stat="${a}"]`);if(!i)return;i.style.position="relative";const l=document.createElement("div");l.className=`stat-pop stat-pop-${n}`,l.textContent=e,i.appendChild(l),l.offsetWidth,l.classList.add("stat-pop-show"),setTimeout(()=>{l.classList.add("stat-pop-hide"),l.addEventListener("animationend",()=>l.remove())},1500)}function et(t,a,e){const n=document.querySelector(t);if(!n)return;const s=n.querySelector(`.stat-row[data-stat="${a}"]`);if(!s)return;const i=s.querySelector(".stat-bar");i&&(i.classList.add(e),setTimeout(()=>i.classList.remove(e),800))}function ke(t,a,e){const n=document.createElement("div");n.className="clash-spark",n.innerHTML=`<span class="spark-emoji">${a}</span><span class="spark-desc">${e}</span>`,t.appendChild(n),setTimeout(()=>n.remove(),1200)}function qt(t,a,e,n,s){const i=document.createElement("div");return i.className=`action-tag action-tag-${s}`,i.innerHTML=`<span class="at-emoji">${e}</span><span class="at-text">${n}</span>`,i.style.left=a.style.left,t.appendChild(i),i}function Be(t,a){const e=document.createElement("div");e.className="float-dmg interrupt-dmg",e.textContent="⚡ 身法被打断",e.style.left=a.style.left,e.style.top="12%",t.appendChild(e),setTimeout(()=>e.remove(),1400)}function un(t,a){const e=t.querySelector(".round-banner");e&&e.remove();const n=document.createElement("div");n.className="round-banner",n.textContent=a,t.appendChild(n),setTimeout(()=>{n.classList.add("rb-fade"),setTimeout(()=>n.remove(),500)},1e3)}function ne(t,a){t.style.setProperty("--arena-cam",a),t.classList.remove("dist-0","dist-1","dist-2","dist-3"),t.classList.add("dist-"+a)}async function pn(t,a){var ye,Ae,Ee,$e;const e=document.getElementById("arena-stage"),n=document.getElementById("player-fighter"),s=document.getElementById("ai-fighter");if(!e||!n||!s)return;const i=a.history[a.history.length-1],l=i.playerCombat,c=i.aiCombat,r=i.playerDistance,u=i.aiDistance,p=D.MAX_HP,m=D.MAX_STANCE,d=D.MAX_STAMINA,h=at[t.distance]||at[2],A=at[a.distance]||at[2];n.style.transition="none",s.style.transition="none",n.style.left=h.player+"%",s.style.left=h.ai+"%";const g=e.querySelector(".arena-dist-line"),f=e.querySelector(".arena-dist-label");g&&(g.style.transition="none",g.style.left=h.player+"%",g.style.width=h.ai-h.player+"%"),f&&(f.textContent=Z[t.distance]),ne(e,t.distance),n.offsetWidth,vt(".player-side","hp",t.player.hp,p),vt(".player-side","stamina",t.player.stamina,d),vt(".player-side","stance",t.player.stance,m),vt(".ai-side","hp",t.ai.hp,p),vt(".ai-side","stamina",t.ai.stamina,d),vt(".ai-side","stance",t.ai.stance,m);const E=Vt[r],F=Vt[u],$=B[l],P=B[c];un(e,`⚔️  第 ${a.round} 回合`),await C(1200);const y=((ye=H[r])==null?void 0:ye.delta)??0,S=((Ae=H[u])==null?void 0:Ae.delta)??0,st=Math.max(0,Math.min(3,t.distance+y+S)),Ct=at[st]||at[2],Ft=i.pMoveInterrupted||i.aMoveInterrupted,St=qt(e,n,E.emoji,J[r],"player"),X=Ct.player,Lt=parseFloat(n.style.left),it=parseFloat(s.style.left);y!==0?(n.classList.add(y<0?"anim-dash-in":"anim-dash-out"),Math.abs(X-Lt)>.5&&(n.style.transition="left 0.5s ease",n.style.left=X+"%",g&&(g.style.transition="left 0.5s ease, width 0.5s ease",g.style.left=X+"%",g.style.width=it-X+"%")),await C(600),n.classList.remove("anim-dash-in","anim-dash-out")):r===b.DODGE?(n.classList.add("anim-dodge"),await C(550),n.classList.remove("anim-dodge")):(n.classList.add("anim-brace"),Math.abs(X-Lt)>.5&&(n.style.transition="left 0.5s ease",n.style.left=X+"%",g&&(g.style.transition="left 0.5s ease, width 0.5s ease",g.style.left=X+"%",g.style.width=it-X+"%")),await C(550),n.classList.remove("anim-brace"));const Dt=qt(e,s,F.emoji,J[u],"ai"),M=Ct.ai,W=parseFloat(n.style.left);S!==0?(s.classList.add(S<0?"anim-dash-in":"anim-dash-out"),Math.abs(M-it)>.5&&(s.style.transition="left 0.5s ease",s.style.left=M+"%",g&&(g.style.transition="width 0.5s ease",g.style.width=M-W+"%")),await C(600),s.classList.remove("anim-dash-in","anim-dash-out")):u===b.DODGE?(s.classList.add("anim-dodge"),await C(550),s.classList.remove("anim-dodge")):(s.classList.add("anim-brace"),Math.abs(M-it)>.5&&(s.style.transition="left 0.5s ease",s.style.left=M+"%",g&&(g.style.transition="width 0.5s ease",g.style.width=M-W+"%")),await C(550),s.classList.remove("anim-brace")),f&&(f.textContent=Z[st]),ne(e,st),n.style.transition="",s.style.transition="",g&&(g.style.transition="");const ft=Math.max(0,t.player.stamina-(((Ee=H[r])==null?void 0:Ee.cost)??0)),gt=Math.max(0,t.ai.stamina-((($e=H[u])==null?void 0:$e.cost)??0)),Yt=t.player.stamina-ft,Qt=t.ai.stamina-gt;Yt>0&&(U(".player-side","stamina",ft,d,400),K(".player-side","stamina",`-${Yt} 体力`,"cost"),et(".player-side","stamina","bar-flash-cost")),Qt>0&&(U(".ai-side","stamina",gt,d,400),K(".ai-side","stamina",`-${Qt} 体力`,"cost"),et(".ai-side","stamina","bar-flash-cost")),(Yt>0||Qt>0)&&await C(400),St.classList.add("at-fade"),Dt.classList.add("at-fade"),setTimeout(()=>{St.remove(),Dt.remove()},350),await C(350);const ge=qt(e,n,$.emoji,G[l],"player");await C(350);const he=qt(e,s,P.emoji,G[c],"ai");await C(400);const ot=dn(l,c);ot.pAnim&&n.classList.add(ot.pAnim),ot.aAnim&&s.classList.add(ot.aAnim),ot.spark&&ke(e,ot.spark,ot.desc),await C(900),ge.classList.add("at-fade"),he.classList.add("at-fade"),setTimeout(()=>{ge.remove(),he.remove()},350),await C(300),st!==a.distance&&(Ft?(i.pMoveInterrupted&&(n.classList.add("anim-shake"),Be(e,n)),i.aMoveInterrupted&&(s.classList.add("anim-shake"),Be(e,s)),await C(400)):(ke(e,"💥","击退!"),await C(300)),n.style.transition="left 0.4s ease-out",s.style.transition="left 0.4s ease-out",g&&(g.style.transition="left 0.4s ease-out, width 0.4s ease-out"),n.style.left=A.player+"%",s.style.left=A.ai+"%",g&&(g.style.left=A.player+"%",g.style.width=A.ai-A.player+"%"),f&&(f.textContent=Z[a.distance]),ne(e,a.distance),await C(500),n.classList.remove("anim-shake"),s.classList.remove("anim-shake"),n.style.transition="",s.style.transition="",g&&(g.style.transition=""));const wt=t.player.hp-a.player.hp,It=t.ai.hp-a.ai.hp,lt=a.player.stance-t.player.stance,ct=a.ai.stance-t.ai.stance,ve=D.EXECUTION_DAMAGE,Pt=t.player.stance<m&&a.player.stance===0&&wt>=ve,jt=t.ai.stance<m&&a.ai.stance===0&&It>=ve;wt>0&&(n.classList.add("anim-hit"),ht(e,n,`-${wt}`,"damage"),U(".player-side","hp",a.player.hp,p,500),K(".player-side","hp",`-${wt} 气血`,"cost"),et(".player-side","hp","bar-flash-cost"),await C(600)),It>0&&(s.classList.add("anim-hit"),ht(e,s,`-${It}`,"damage"),U(".ai-side","hp",a.ai.hp,p,500),K(".ai-side","hp",`-${It} 气血`,"cost"),et(".ai-side","hp","bar-flash-cost"),await C(600)),wt===0&&It===0&&await C(300),Pt?(U(".player-side","stance",0,m,400),K(".player-side","stance","⚔ 处决!","exec")):lt>0?(ht(e,n,`+${lt} 架势`,"stance"),U(".player-side","stance",a.player.stance,m,400),K(".player-side","stance",`+${lt} 架势`,"warn"),et(".player-side","stance","bar-flash-warn")):lt<0&&(ht(e,n,`${lt} 架势`,"heal"),U(".player-side","stance",a.player.stance,m,400),K(".player-side","stance",`${lt} 架势`,"buff")),(Pt||lt!==0)&&await C(450),jt?(U(".ai-side","stance",0,m,400),K(".ai-side","stance","⚔ 处决!","exec")):ct>0?(ht(e,s,`+${ct} 架势`,"stance"),U(".ai-side","stance",a.ai.stance,m,400),K(".ai-side","stance",`+${ct} 架势`,"warn"),et(".ai-side","stance","bar-flash-warn")):ct<0&&(ht(e,s,`${ct} 架势`,"heal"),U(".ai-side","stance",a.ai.stance,m,400),K(".ai-side","stance",`${ct} 架势`,"buff")),(jt||ct!==0)&&await C(450),(Pt||jt)&&(e.classList.add("execution-flash"),await C(500)),await C(Pt||jt?500:600);const Wt=a.player.stamina-ft,te=a.ai.stamina-gt;Wt>0&&(U(".player-side","stamina",a.player.stamina,d,400),K(".player-side","stamina",`+${Wt} 体力`,"buff"),et(".player-side","stamina","bar-flash-buff")),te>0&&(U(".ai-side","stamina",a.ai.stamina,d,400),K(".ai-side","stamina",`+${te} 体力`,"buff"),et(".ai-side","stamina","bar-flash-buff")),(Wt>0||te>0)&&await C(500);const be=["anim-attack-p","anim-attack-a","anim-dodge","anim-hit","anim-shake","anim-slash-p","anim-slash-a","anim-slash-miss","anim-thrust-p","anim-thrust-a","anim-thrust-miss","anim-deflect","anim-deflect-fail","anim-recoil","anim-block","anim-block-hit","anim-block-tricked","anim-feint-p","anim-feint-a","anim-clash-p","anim-clash-a","anim-idle","anim-dash-in","anim-dash-out","anim-brace"];n.classList.remove(...be),s.classList.remove(...be),e.classList.remove("execution-flash")}const pt=[{floor:1,npc:"李大壮",title:"村口恶霸",weapon:v.STAFF,aiLevel:1,intro:"路经偏僻村落，一名壮汉持棍拦路。",taunt:"此路是我开！留下买路钱！"},{floor:2,npc:"赵三",title:"山贼喽啰",weapon:v.SHORT_BLADE,aiLevel:2,intro:"山间小道，草丛中窜出一名手持短刀的毛贼。",taunt:"识相的把包袱留下！"},{floor:3,npc:"钱小六",title:"镖局镖师",weapon:v.SPEAR,aiLevel:2,intro:"误入镖队行进路线，一名镖师持枪喝止。",taunt:"何方人物？报上名来！"},{floor:4,npc:"孙铁柱",title:"武馆弟子",weapon:v.SWORD,aiLevel:3,intro:"途经武馆，一名弟子欣然邀战。",taunt:"久闻大名，请赐教！"},{floor:5,npc:"周大锤",title:"铁匠侠客",weapon:v.GREAT_BLADE,aiLevel:3,intro:"铁匠铺旁，一名大汉扛着长柄大刀拦住去路。",taunt:"我这把大刀早已饥渴难耐！"},{floor:6,npc:"吴影",title:"暗巷刺客",weapon:v.DUAL_STAB,aiLevel:4,intro:"夜入小巷，身后传来阴冷的脚步声……",taunt:"…………"},{floor:7,npc:"郑云飞",title:"青衫剑客",weapon:v.SWORD,aiLevel:4,intro:"客栈饮酒，邻桌青衫剑客放下酒杯，缓缓起身。",taunt:"以剑会友，不醉不归。"},{floor:8,npc:"王长风",title:"枪法名家",weapon:v.SPEAR,aiLevel:5,intro:"擂台之上，白发老者持枪而立，气势如渊。",taunt:"老夫征战三十年，尚未一败。"},{floor:9,npc:"陈残雪",title:"独臂刀客",weapon:v.GREAT_BLADE,aiLevel:5,intro:"古道尽头，独臂刀客横刀冷立，杀意凛然。",taunt:"这条路的尽头，只能有一个人。"},{floor:10,npc:"萧无名",title:"绝世高手",weapon:null,aiLevel:6,intro:"山巅之上，一个看不清面容的身影背对着你。",taunt:"你终于来了。"}],ze=3;function mn(t){return{playerWeapon:t,currentFloor:0,playerHp:D.MAX_HP,completed:!1,gameOver:!1}}function fn(t){const a=pt[t.currentFloor];if(!a)return null;if(!a.weapon){const e=Object.values(v);return{...a,weapon:e[Math.floor(Math.random()*e.length)]}}return a}function gn(t,a){const e={...t};return e.playerHp=Math.min(D.MAX_HP,a+ze),e.currentFloor+=1,e.currentFloor>=pt.length&&(e.completed=!0),e}function hn(t){return t.completed}function vn(t,a,e,n,s){const i=D.MAX_HP,l=a.currentFloor+1,c=R[e.weapon]||"❓",r=_[e.weapon]||"???",u=R[a.playerWeapon]||"🗡️",p=_[a.playerWeapon]||"???";t.innerHTML=`
    <div class="tower-screen">
      <div class="tower-floor-header">🗼 江湖行 · 第 ${l} / ${pt.length} 关</div>
      <div class="tower-progress">
        ${pt.map((m,d)=>`<span class="tp-dot ${d<a.currentFloor?"tp-done":d===a.currentFloor?"tp-cur":""}">${d+1}</span>`).join("")}
      </div>
      <div class="tower-npc-display">
        <div class="tower-npc-weapon">${c}</div>
        <div class="tower-npc-name">${e.npc}</div>
        <div class="tower-npc-title">「${e.title}」</div>
        <div class="tower-npc-wp">持 ${c} ${r}</div>
      </div>
      <div class="tower-quote">❝ ${e.taunt} ❞</div>
      <div class="tower-story">${e.intro}</div>
      <div class="tower-player-info">
        <div class="tower-hp">❤️ 你的气血: <strong>${a.playerHp}</strong> / ${i}</div>
        <div class="tower-your-weapon">${u} ${p}</div>
      </div>
      <div class="tower-matchup">
        ${tt(a.playerWeapon)}
        <div class="tower-matchup-vs">VS</div>
        ${tt(e.weapon)}
      </div>
      <button class="primary-btn" id="btn-fight">⚔ 应战</button>
      <button class="link-btn" id="btn-back">放弃 · 返回</button>
    </div>
  `,document.getElementById("btn-fight").addEventListener("click",n),document.getElementById("btn-back").addEventListener("click",s)}function bn(t,a,e,n){const s=D.MAX_HP,i=a.currentFloor,l=pt[i-1],c=Math.min(ze,s-e),r=pt[i];let u="";if(r){const p=R[r.weapon]||"❓",m=_[r.weapon]||"???";u=`
      <div class="tower-next-preview">
        <div class="tower-next-label">下一关: 第 ${i+1} 关</div>
        <div class="tower-next-npc">${r.npc} 「${r.title}」</div>
        <div class="tower-next-wp">${p} ${m}</div>
      </div>
    `}t.innerHTML=`
    <div class="tower-screen">
      <div class="tower-floor-header">✅ 第 ${i} 关 — 胜利!</div>
      <div class="tower-between-msg">${l.npc} 已被击败</div>
      <div class="tower-between-hp">
        ❤️ 恢复气血 <span class="heal">+${c}</span>
        <br/>
        ❤️ 当前气血: ${e} → <strong>${a.playerHp}</strong> / ${s}
      </div>
      ${u}
      <button class="primary-btn" id="btn-continue">继续前进 →</button>
    </div>
  `,document.getElementById("btn-continue").addEventListener("click",n)}function Ve(t,a,e){const n=_[a.playerWeapon],s=R[a.playerWeapon];t.innerHTML=`
    <div class="tower-screen tower-victory">
      <h1>🏆 武林至尊</h1>
      <p class="tower-result-sub">击败全部 ${pt.length} 位强敌!</p>
      <div class="tower-result-stats">
        ❤️ 最终气血: ${a.playerHp} / ${D.MAX_HP}<br/>
        ${s} 使用兵器: ${n}
      </div>
      <p class="tower-victory-msg">
        自此，江湖中流传着一个新的传说——<br/>
        一位持${n}的无名侠客，从乡野一路打到山巅，<br/>
        击败了天下第一高手萧无名。
      </p>
      <button class="primary-btn" id="btn-back">🏠 返回</button>
    </div>
  `,document.getElementById("btn-back").addEventListener("click",e)}function yn(t,a,e,n,s){t.innerHTML=`
    <div class="tower-screen tower-gameover">
      <h1>💀 败北</h1>
      <p class="tower-result-sub">止步于第 ${a.currentFloor+1} 关</p>
      <div class="tower-result-npc">
        败于 ${e.npc}「${e.title}」之手
      </div>
      <button class="primary-btn" id="btn-retry">🔄 重新挑战</button>
      <button class="link-btn" id="btn-back">🏠 返回</button>
    </div>
  `,document.getElementById("btn-retry").addEventListener("click",n),document.getElementById("btn-back").addEventListener("click",s)}an();const z=document.getElementById("app");let T=null,Zt=null,k={distanceCard:null,combatCard:null},kt=[],mt=!1,q=null,Rt=!1,N=null,yt=null;function An(){return{isPaused:mt,canUndo:kt.length>0}}function En(){return{onSelect:Tn,onConfirm:Cn,onUndo:Sn,onReset:Ln,onNewGame:Dn,onTogglePause:In,onDifficultyChange:On}}function Y(){me(),N=null,yt=null,sn(z,{onTower:()=>ln(z,Ze,Y),onBattle:()=>on(z,fe,Y)})}function me(){T=null,Zt=null,k={distanceCard:null,combatCard:null},kt=[],mt=!1,Rt=!1}function fe(t,a,e){N=null,q={playerWeapon:t,aiWeapon:a,aiLevel:e},me(),T=re(t,a,e),Tt()}function Ze(t){N=mn(t),q=null,Je()}function Je(){if(yt=fn(N),!yt){Ve(z,N,Y);return}vn(z,N,yt,Ye,Y)}function Ye(){const t=yt;me(),T=re(N.playerWeapon,t.weapon,t.aiLevel),T.aiName=t.npc,T.aiTitle=t.title,T.player.hp=N.playerHp,q=null,Tt()}function $n(){if(N)if(T.winner==="player"){const t=N.playerHp;N=gn(N,T.player.hp),hn(N)?Ve(z,N,Y):bn(z,N,t,Je)}else N.gameOver=!0,yn(z,N,yt,()=>Ze(N.playerWeapon),Y)}function Tt(){Ca(z,T,k,An(),En()),qa()}function Tn(t,a){Rt||mt||T.gameOver||(t==="distance"?k.distanceCard=k.distanceCard===a?null:a:k.combatCard=k.combatCard===a?null:a,Tt())}async function Cn(){if(Rt||mt||T.gameOver||!k.distanceCard||!k.combatCard)return;const t=ra(k.distanceCard,k.combatCard,T.player,T.distance);if(!t.valid){le(t.reason,"warn");return}kt.push(JSON.parse(JSON.stringify(T))),Zt=JSON.parse(JSON.stringify(T));const a=ie(T),e={distanceCard:k.distanceCard,combatCard:k.combatCard};T=Pe(T,e,a),k={distanceCard:null,combatCard:null},Rt=!0;const n=z.querySelector(".game-wrapper");n&&n.classList.add("animating"),Tt(),await pn(Zt,T),Rt=!1,n&&n.classList.remove("animating"),T.gameOver&&(N?$n():Xa(z,T,wn,Y))}function Sn(){kt.length!==0&&(T=kt.pop(),Zt=null,k={distanceCard:null,combatCard:null},mt=!1,Tt())}function Ln(){N?Ye():q&&fe(q.playerWeapon,q.aiWeapon,q.aiLevel)}function Dn(){Y()}function wn(){q?fe(q.playerWeapon,q.aiWeapon,q.aiLevel):Y()}function In(){T.gameOver||(mt=!mt,Tt())}function On(t){T&&(T.aiLevel=t)}Y();
