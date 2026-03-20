(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function a(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=a(i);fetch(i.href,o)}})();const h=Object.freeze({SHORT_BLADE:"short_blade",SPEAR:"spear",SWORD:"sword",STAFF:"staff",GREAT_BLADE:"great_blade",DUAL_STAB:"dual_stab"}),E=Object.freeze({ADVANCE:"advance",RETREAT:"retreat",HOLD:"hold"}),n=Object.freeze({DODGE:"dodge",DEFLECT:"deflect",SLASH:"slash",THRUST:"thrust",BLOCK:"block",FEINT:"feint"}),F=Object.freeze({ATTACK:"attack",DEFENSE:"defense"}),ee=Object.freeze({SETUP:"setup",INFO_SYNC:"info_sync",PLAYER_PICK:"player_pick",AI_PICK:"ai_pick",DISTANCE_RESOLVE:"distance_resolve",COMBAT_RESOLVE:"combat_resolve",STATUS_RESOLVE:"status_resolve",ROUND_END:"round_end",GAME_OVER:"game_over"});function Ve(e){return{weapon:e,hp:10,stamina:8,stance:0,staggered:!1,distanceCardStreak:{card:null,count:0},combatCardStreak:{card:null,count:0}}}function ga(e,t,a){return{distance:2,round:0,phase:ee.SETUP,player:Ve(e),ai:Ve(t),aiLevel:a,history:[],log:[],gameOver:!1,winner:null}}const L={MAX_HP:10,MAX_STAMINA:8,STAMINA_RECOVERY:4,MAX_STANCE:5,EXECUTION_DAMAGE:5,INITIAL_DISTANCE:2},_e=0,He=3,ne=["贴身区","近战区","中距区","远距区"],Re={[n.DODGE]:F.DEFENSE,[n.DEFLECT]:F.DEFENSE,[n.SLASH]:F.ATTACK,[n.THRUST]:F.ATTACK,[n.BLOCK]:F.DEFENSE,[n.FEINT]:F.ATTACK},w={[n.DODGE]:{cost:2,damage:0,stanceToOpponent:1,priority:1},[n.DEFLECT]:{cost:3,damage:2,stanceToOpponent:2,priority:2},[n.SLASH]:{cost:3,damage:3,stanceToOpponent:1,priority:3},[n.THRUST]:{cost:1,damage:1,stanceToOpponent:1,priority:4},[n.BLOCK]:{cost:2,damage:0,stanceToOpponent:0,priority:5},[n.FEINT]:{cost:1,damage:0,stanceToOpponent:2,priority:6}},Le={[E.ADVANCE]:{cost:1,delta:-1},[E.RETREAT]:{cost:1,delta:1},[E.HOLD]:{cost:0,delta:0}},K={[n.DODGE]:"闪避",[n.DEFLECT]:"卸力",[n.SLASH]:"劈砍",[n.THRUST]:"点刺",[n.BLOCK]:"格挡",[n.FEINT]:"虚晃"},X={[E.ADVANCE]:"靠近",[E.RETREAT]:"远离",[E.HOLD]:"站稳"},P={[h.SHORT_BLADE]:"短刀",[h.SPEAR]:"长枪",[h.SWORD]:"剑",[h.STAFF]:"棍",[h.GREAT_BLADE]:"大刀",[h.DUAL_STAB]:"双刺"},j={[h.SHORT_BLADE]:"🗡️",[h.SPEAR]:"🔱",[h.SWORD]:"⚔️",[h.STAFF]:"🏑",[h.GREAT_BLADE]:"🪓",[h.DUAL_STAB]:"🥢"},C={[h.SHORT_BLADE]:{advantage:[0,1],disadvantage:[2,3]},[h.SPEAR]:{advantage:[2,3],disadvantage:[0]},[h.SWORD]:{advantage:[1,2],disadvantage:[0,3]},[h.STAFF]:{advantage:[1,2,3],disadvantage:[0]},[h.GREAT_BLADE]:{advantage:[2],disadvantage:[0]},[h.DUAL_STAB]:{advantage:[0],disadvantage:[2,3]}};function va(e,t,a){const s=Le[t].delta,i=Le[a].delta,o=e+s+i;return Math.max(_e,Math.min(He,o))}function de(e,t,a,s,i){const o=Le[e].cost;if(o===0)return 0;const l=i[a].advantage.includes(s);return l&&(a==="short_blade"&&e===E.ADVANCE||(a==="spear"||a==="staff"||a==="great_blade")&&e===E.RETREAT)||a==="short_blade"&&!l&&e===E.ADVANCE||a==="dual_stab"&&e===E.ADVANCE?Math.max(0,Math.floor((o+t)/2)):o+t}function O(e,t){return C[e].advantage.includes(t)}function ha(e,t){return C[e].disadvantage.includes(t)}function ta(e,t){const a=[];switch(e){case h.SHORT_BLADE:t>=3&&a.push(n.SLASH);break;case h.SPEAR:t===0&&a.push(n.SLASH,n.DEFLECT);break;case h.SWORD:t===0&&a.push(n.SLASH),t===3&&a.push(n.THRUST,n.SLASH);break;case h.STAFF:t===0&&a.push(n.SLASH);break;case h.GREAT_BLADE:t===0&&a.push(n.SLASH,n.DEFLECT);break;case h.DUAL_STAB:t>=2&&a.push(n.SLASH,n.DEFLECT);break}return a}function na(e,t,a){const s=O(e,t),i=ha(e,t);switch(e){case h.SHORT_BLADE:if(s&&a===n.THRUST||s&&a===n.SLASH)return 1;if(t>=3)return-1;break;case h.SPEAR:if(s&&a===n.SLASH)return 2;if(i&&a===n.THRUST)return-1;break;case h.SWORD:if(i&&t===0)return-1;break;case h.STAFF:if(s&&a===n.SLASH||i)return-1;break;case h.GREAT_BLADE:if(s&&a===n.SLASH)return 3;if(i&&a===n.THRUST)return-1;break;case h.DUAL_STAB:if(s&&a===n.THRUST)return 1;if(i)return-1;break}return 0}function sa(e,t,a){if(!O(e,t))return 0;switch(e){case h.SHORT_BLADE:if(a===n.DODGE||a===n.THRUST)return-1;break;case h.SPEAR:if(a===n.BLOCK)return-1;break;case h.SWORD:if(a===n.DEFLECT||a===n.BLOCK)return-1;break;case h.STAFF:if(a===n.BLOCK)return-1;break;case h.GREAT_BLADE:break;case h.DUAL_STAB:if(a===n.THRUST||a===n.DODGE)return-1;break}return 0}function Ze(e,t){return e===h.GREAT_BLADE&&O(e,t)?2:1}function qe(e,t){return O(e,t)}function Aa(e){return e!==h.SWORD}function ze(e,t){return e===h.STAFF&&O(e,t)||e===h.SHORT_BLADE&&O(e,t)||e===h.DUAL_STAB&&O(e,t)?3:2}function q(e,t,a,s){return e===h.GREAT_BLADE&&O(e,t)&&a===n.SLASH||e===h.STAFF&&O(e,t)&&a===n.FEINT&&s===n.BLOCK?1:0}function ue(e,t,a,s){const i=w[e].cost,o=a==="dual_stab"&&e===n.THRUST?0:t;let c=i+o;return c+=sa(a,s,e),Math.max(0,c)}function Se(e,t){const{weapon:a,stamina:s,staggered:i,combatCardStreak:o}=e,c=ta(a,t);return Object.values(n).filter(r=>{if(c.includes(r)||i&&Re[r]===F.ATTACK)return!1;const u=o.card===r?o.count:0;return!(ue(r,u,a,t)>s)})}function be(e,t){const{weapon:a,stamina:s,distanceCardStreak:i}=e;return Object.values(E).filter(c=>{if(c===E.HOLD)return!0;if(c===E.ADVANCE&&t<=_e||c===E.RETREAT&&t>=He)return!1;const l=i.card===c?i.count:0;return!(de(c,l,a,t,C)>s)})}function ia(e,t,a,s){const{weapon:i,distanceCardStreak:o,combatCardStreak:c}=a,l=o.card===e?o.count:0,r=c.card===t?c.count:0,u=de(e,l,i,s,C),f=ue(t,r,i,s);return u+f}function Ea(e,t,a,s){return be(a,s).includes(e)?Se(a,s).includes(t)?ia(e,t,a,s)>a.stamina?{valid:!1,reason:"体力不足"}:{valid:!0}:{valid:!1,reason:"攻防卡不可用"}:{valid:!1,reason:"距离卡不可用"}}function ya(){return{player:{hpChange:0,stanceChange:0,staggered:!1},ai:{hpChange:0,stanceChange:0,staggered:!1},distancePush:0,log:[]}}function H(e,t,a){const s=w[e].damage,i=na(t,a,e);return Math.max(0,s+i)}function Sa(e,t,a){const s=ya(),i=e.distance,o=e.player.weapon,c=e.ai.weapon;return t===a?ba(s,t,o,c,i):(Ta(s,t,a,o,c,i),s)}function ba(e,t,a,s,i){switch(t){case n.DODGE:case n.BLOCK:e.log.push("双方空过");break;case n.DEFLECT:e.player.stanceChange+=2,e.ai.stanceChange+=2,e.log.push("卸力对碰，双方各+2架势");break;case n.SLASH:{const o=H(n.SLASH,a,i),c=H(n.SLASH,s,i);e.player.hpChange-=c,e.ai.hpChange-=o,e.player.stanceChange+=1,e.ai.stanceChange+=1,a==="spear"&&O(a,i)&&(e.ai.stanceChange+=1),s==="spear"&&O(s,i)&&(e.player.stanceChange+=1);const l=q(a,i,n.SLASH,n.SLASH),r=q(s,i,n.SLASH,n.SLASH);e.distancePush+=l+r,e.log.push(`互砍：玩家受${c}伤，AI受${o}伤`);break}case n.THRUST:{const o=H(n.THRUST,a,i),c=H(n.THRUST,s,i);e.player.hpChange-=c,e.ai.hpChange-=o,e.player.stanceChange+=1,e.ai.stanceChange+=1,e.log.push(`互刺：玩家受${c}伤，AI受${o}伤`);break}case n.FEINT:e.log.push("双方虚晃，空过");break}return e}function Ta(e,t,a,s,i,o){if(t===n.DODGE&&a===n.SLASH){e.ai.stanceChange+=1,s==="dual_stab"?(e.ai.stanceChange+=1,e.log.push("玩家(双刺)闪避了AI的劈砍，AI+2架势")):e.log.push("玩家闪避了AI的劈砍，AI+1架势");return}if(a===n.DODGE&&t===n.SLASH){e.player.stanceChange+=1,i==="dual_stab"?(e.player.stanceChange+=1,e.log.push("AI(双刺)闪避了玩家的劈砍，玩家+2架势")):e.log.push("AI闪避了玩家的劈砍，玩家+1架势");return}if(t===n.DODGE&&a===n.THRUST){if(qe(i,o)){const c=H(n.THRUST,i,o);e.player.hpChange-=c,e.player.stanceChange+=1,e.log.push(`AI点刺打断闪避(优势区)：玩家受${c}伤+1架势`)}else e.ai.stanceChange+=1,s==="dual_stab"?(e.ai.stanceChange+=1,e.log.push("玩家(双刺)闪避了AI的点刺，AI+2架势")):e.log.push("玩家闪避了AI的点刺，AI+1架势");return}if(a===n.DODGE&&t===n.THRUST){if(qe(s,o)){const c=H(n.THRUST,s,o);e.ai.hpChange-=c,e.ai.stanceChange+=1,e.log.push(`玩家点刺打断闪避(优势区)：AI受${c}伤+1架势`)}else e.player.stanceChange+=1,i==="dual_stab"?(e.player.stanceChange+=1,e.log.push("AI(双刺)闪避了玩家的点刺，玩家+2架势")):e.log.push("AI闪避了玩家的点刺，玩家+1架势");return}if(t===n.DODGE&&(a===n.DEFLECT||a===n.BLOCK||a===n.FEINT)){e.log.push("双方空过");return}if(a===n.DODGE&&(t===n.DEFLECT||t===n.BLOCK||t===n.FEINT)){e.log.push("双方空过");return}if(t===n.DEFLECT&&a===n.SLASH){Je(e,"player","ai",s);return}if(a===n.DEFLECT&&t===n.SLASH){Je(e,"ai","player",i);return}if(t===n.DEFLECT&&a===n.THRUST){const c=H(n.THRUST,i,o);e.player.hpChange-=c,e.player.stanceChange+=1,e.log.push(`玩家卸力失败遇点刺：受${c}伤+1架势`);return}if(a===n.DEFLECT&&t===n.THRUST){const c=H(n.THRUST,s,o);e.ai.hpChange-=c,e.ai.stanceChange+=1,e.log.push(`AI卸力失败遇点刺：受${c}伤+1架势`);return}if(t===n.DEFLECT&&a===n.FEINT){e.player.stanceChange+=2,e.log.push("玩家卸力被虚晃骗：+2架势");return}if(a===n.DEFLECT&&t===n.FEINT){e.ai.stanceChange+=2,e.log.push("AI卸力被虚晃骗：+2架势");return}if(t===n.DEFLECT&&a===n.BLOCK){e.player.stanceChange+=1,e.log.push("玩家卸力失败(遇格挡)：+1架势");return}if(a===n.DEFLECT&&t===n.BLOCK){e.ai.stanceChange+=1,e.log.push("AI卸力失败(遇格挡)：+1架势");return}if(t===n.SLASH&&a===n.THRUST){ve(e,"player","ai",s,i,o,n.THRUST);return}if(a===n.SLASH&&t===n.THRUST){ve(e,"ai","player",i,s,o,n.THRUST);return}if(t===n.SLASH&&a===n.BLOCK){const c=H(n.SLASH,s,o),l=Ze(i,o),r=Math.max(0,c-l);e.ai.hpChange-=r,e.ai.stanceChange+=1,s==="spear"&&O(s,o)&&(e.ai.stanceChange+=1);const u=q(s,o,n.SLASH,n.BLOCK);e.distancePush+=u,e.log.push(`玩家劈砍破格挡：AI受${r}伤(减免${l})+架势`);return}if(a===n.SLASH&&t===n.BLOCK){const c=H(n.SLASH,i,o),l=Ze(s,o),r=Math.max(0,c-l);e.player.hpChange-=r,e.player.stanceChange+=1,i==="spear"&&O(i,o)&&(e.player.stanceChange+=1);const u=q(i,o,n.SLASH,n.BLOCK);e.distancePush+=u,e.log.push(`AI劈砍破格挡：玩家受${r}伤(减免${l})+架势`);return}if(t===n.SLASH&&a===n.FEINT){ve(e,"player","ai",s,i,o,n.FEINT);return}if(a===n.SLASH&&t===n.FEINT){ve(e,"ai","player",i,s,o,n.FEINT);return}if(t===n.THRUST&&a===n.BLOCK){e.log.push("玩家点刺被格挡完全抵消");return}if(a===n.THRUST&&t===n.BLOCK){e.log.push("AI点刺被格挡完全抵消");return}if(t===n.THRUST&&a===n.FEINT){const c=H(n.THRUST,s,o);e.ai.hpChange-=c,e.ai.stanceChange+=1,e.log.push(`玩家点刺命中：AI受${c}伤+1架势`);return}if(a===n.THRUST&&t===n.FEINT){const c=H(n.THRUST,i,o);e.player.hpChange-=c,e.player.stanceChange+=1,e.log.push(`AI点刺命中：玩家受${c}伤+1架势`);return}if(t===n.BLOCK&&a===n.FEINT){const c=ze(i,o);e.player.stanceChange+=c;const l=q(i,o,n.FEINT,n.BLOCK);e.distancePush+=l,e.log.push(`AI虚晃命中格挡：玩家+${c}架势${l?"，距离+"+l:""}`);return}if(a===n.BLOCK&&t===n.FEINT){const c=ze(s,o);e.ai.stanceChange+=c;const l=q(s,o,n.FEINT,n.BLOCK);e.distancePush+=l,e.log.push(`玩家虚晃命中格挡：AI+${c}架势${l?"，距离+"+l:""}`);return}e.log.push("双方空过")}function Je(e,t,a,s){const i=w[n.DEFLECT].damage;e[a].hpChange-=i,e[a].stanceChange+=2;const o=t==="player"?"玩家":"AI";Aa(s)?(e[a].staggered=!0,e.log.push(`${o}卸力反制成功：对手受${i}伤+2架势+僵直`)):(e[t].stanceChange-=2,e.log.push(`${o}(剑)卸力反制成功：对手受${i}伤+2架势，自身-2架势`))}function ve(e,t,a,s,i,o,c){const l=H(n.SLASH,s,o);e[a].hpChange-=l,e[a].stanceChange+=1;const r=t==="player"?"玩家":"AI";s==="spear"&&O(s,o)&&(e[a].stanceChange+=1);const u=q(s,o,n.SLASH,c);e.distancePush+=u,e.log.push(`${r}劈砍命中：对手受${l}伤+架势${u?"，距离+"+u:""}`)}function oa(e,t,a){const s=ga(e,t,a);return s.phase=ee.INFO_SYNC,s}function ca(e,t,a){let s=JSON.parse(JSON.stringify(e));s.round+=1,s.log=[],s.log.push(`══════ 第 ${s.round} 回合 ══════`),s.player.staggered=!1,s.ai.staggered=!1,s=$a(s,t.distanceCard,a.distanceCard),s=La(s,t.combatCard,a.combatCard),s=Da(s);const i=s.player.stamina,o=s.ai.stamina;return s=Ca(s),s=Oa(s),s.history.push({round:s.round,playerDistance:t.distanceCard,playerCombat:t.combatCard,aiDistance:a.distanceCard,aiCombat:a.combatCard,pStaminaAfterCost:i,aStaminaAfterCost:o}),s}function Ca(e){const t=L.MAX_STAMINA,a=L.STAMINA_RECOVERY,s=e.player.stamina,i=e.ai.stamina;return e.player.stamina=Math.min(t,e.player.stamina+a),e.ai.stamina=Math.min(t,e.ai.stamina+a),e.player.stamina!==s&&e.log.push(`玩家体力恢复：${s} → ${e.player.stamina}`),e.ai.stamina!==i&&e.log.push(`AI体力恢复：${i} → ${e.ai.stamina}`),e}function $a(e,t,a){const s=e.distance;e.distance=va(s,t,a);const i=e.player.distanceCardStreak.card===t?e.player.distanceCardStreak.count:0,o=e.ai.distanceCardStreak.card===a?e.ai.distanceCardStreak.count:0,c=de(t,i,e.player.weapon,s,C),l=de(a,o,e.ai.weapon,s,C);return e.player.stamina-=c,e.ai.stamina-=l,e.player.distanceCardStreak.card===t?e.player.distanceCardStreak.count+=1:e.player.distanceCardStreak={card:t,count:1},e.ai.distanceCardStreak.card===a?e.ai.distanceCardStreak.count+=1:e.ai.distanceCardStreak={card:a,count:1},e.log.push(`距离变化：${s} → ${e.distance}`),e}function La(e,t,a){const s=e.player.combatCardStreak.card===t?e.player.combatCardStreak.count:0,i=e.ai.combatCardStreak.card===a?e.ai.combatCardStreak.count:0,o=ue(t,s,e.player.weapon,e.distance),c=ue(a,i,e.ai.weapon,e.distance);e.player.stamina-=o,e.ai.stamina-=c,e.player.combatCardStreak.card===t?e.player.combatCardStreak.count+=1:e.player.combatCardStreak={card:t,count:1},e.ai.combatCardStreak.card===a?e.ai.combatCardStreak.count+=1:e.ai.combatCardStreak={card:a,count:1};const l=Sa(e,t,a);if(e.player.hp+=l.player.hpChange,e.ai.hp+=l.ai.hpChange,e.player.stance+=l.player.stanceChange,e.ai.stance+=l.ai.stanceChange,l.player.staggered&&(e.player.staggered=!0),l.ai.staggered&&(e.ai.staggered=!0),e.distance===0&&(e.player.weapon==="dual_stab"&&(l.ai.hpChange<0||l.ai.stanceChange>0||l.ai.staggered)&&(e.ai.stance+=1,e.log.push("🥢 双刺贴身命中：AI额外+1架势")),e.ai.weapon==="dual_stab"&&(l.player.hpChange<0||l.player.stanceChange>0||l.player.staggered)&&(e.player.stance+=1,e.log.push("🥢 双刺贴身命中：玩家额外+1架势"))),l.distancePush!==0){const r=e.distance;e.distance=Math.max(_e,Math.min(He,e.distance+l.distancePush)),e.distance!==r&&e.log.push(`距离被推动：${r} → ${e.distance}`)}return e.log.push(...l.log),e}function Da(e){const t=L.MAX_STANCE,a=L.EXECUTION_DAMAGE;return e.player.stance=Math.max(0,e.player.stance),e.ai.stance=Math.max(0,e.ai.stance),e.player.stamina=Math.max(0,e.player.stamina),e.ai.stamina=Math.max(0,e.ai.stamina),e.player.stance>=t&&(e.player.hp-=a,e.player.stance=0,e.log.push(`⚔ 玩家被处决！-${a}气血`)),e.ai.stance>=t&&(e.ai.hp-=a,e.ai.stance=0,e.log.push(`⚔ AI被处决！-${a}气血`)),e.player.hp=Math.max(0,e.player.hp),e.ai.hp=Math.max(0,e.ai.hp),e}function Oa(e){const t=e.player.hp<=0,a=e.ai.hp<=0;return t&&a?(e.gameOver=!0,e.winner="draw",e.phase=ee.GAME_OVER,e.log.push("双方同时倒下——平局！")):t?(e.gameOver=!0,e.winner="ai",e.phase=ee.GAME_OVER,e.log.push("玩家气血归零——AI胜利！")):a?(e.gameOver=!0,e.winner="player",e.phase=ee.GAME_OVER,e.log.push("AI气血归零——玩家胜利！")):e.phase=ee.INFO_SYNC,e}function De(e){switch(e.aiLevel){case 1:return Ye(e);case 2:return Na(e);case 3:return _a(e);case 4:return Ha(e);case 5:return Ra(e);case 6:return ka(e);default:return Ye(e)}}function b(e){if(!(!e||e.length===0))return e[Math.floor(Math.random()*e.length)]}function z(e,t){const a=t.reduce((i,o)=>i+o,0);let s=Math.random()*a;for(let i=0;i<e.length;i++)if(s-=t[i],s<=0)return e[i];return e[e.length-1]}function oe(e){const t=e.distance,a=e.ai,s=be(a,t),i=Se(a,t);return{distCards:s,combatCards:i}}function Ia(e){return C[e].advantage}function B(e,t){const a=Ia(e);if(a.includes(t))return E.HOLD;const s=a.reduce((i,o)=>i+o,0)/a.length;return t>s?E.ADVANCE:E.RETREAT}function Ye(e){const{distCards:t,combatCards:a}=oe(e);return{distanceCard:b(t),combatCard:b(a)}}function Na(e){const{distCards:t,combatCards:a}=oe(e),s=e.ai.weapon,i=e.distance;let o=B(s,i);t.includes(o)||(o=b(t));const c=a.filter(u=>u!==n.FEINT&&u!==n.DEFLECT),l=c.length>0?c:a;let r;return O(s,i)?r=l.reduce((u,f)=>{const v=w[f].damage,d=w[u].damage;return v>d?f:u},l[0]):r=l.reduce((u,f)=>{const v=w[f].cost,d=w[u].cost;return v<d?f:u},l[0]),{distanceCard:o,combatCard:r}}function _a(e){const{distCards:t,combatCards:a}=oe(e),s=e.ai.weapon,i=e.player.weapon,o=e.distance,c=e.history;let l;if(C[i].advantage.includes(o)&&Math.random()<.5){const d=o<2?E.RETREAT:E.ADVANCE;l=t.includes(d)?d:B(s,o)}else l=B(s,o);t.includes(l)||(l=b(t));let f;const v=c.length>0?c[c.length-1]:null;if(v){const d=Oe(v.playerCombat,a);d&&Math.random()<.55&&(f=d)}if(!f)if(e.player.stance>=4&&a.includes(n.THRUST))f=n.THRUST;else if(O(s,o)){const d=a.filter(y=>Re[y]===F.ATTACK);f=d.length?z(d,d.map(()=>1)):b(a)}else{const d=a.filter(y=>y===n.DODGE||y===n.BLOCK);f=d.length&&Math.random()<.6?b(d):b(a)}return{distanceCard:l,combatCard:f}}function Oe(e,t){const s={[n.SLASH]:n.DEFLECT,[n.THRUST]:n.BLOCK,[n.FEINT]:n.THRUST,[n.BLOCK]:n.FEINT,[n.DODGE]:n.SLASH,[n.DEFLECT]:n.FEINT}[e];return s&&t.includes(s)?s:null}function Ha(e){const{distCards:t,combatCards:a}=oe(e),s=e.ai.weapon,i=e.player.weapon,o=e.distance,c=e.history;let l;const r=C[s].advantage,u=C[i].advantage,f=r.includes(o);if(u.includes(o)&&!f){const g=B(s,o),p=o<2?E.RETREAT:E.ADVANCE;g!==E.HOLD&&g!==p?l=Math.random()<.6?g:p:l=p}else f?l=E.HOLD:l=B(s,o);t.includes(l)||(l=b(t));let d;const y=e.ai.stance,S=e.player.stance;if(y>=3){const g=a.filter(p=>p===n.DODGE||p===n.BLOCK);g.length&&(d=b(g))}if(!d&&S>=3){const g=[n.THRUST,n.FEINT,n.SLASH].filter(p=>a.includes(p));g.length&&(d=b(g))}if(!d&&c.length>=2){const p=c.slice(-2).map(A=>A.playerCombat);if(p[0]===p[1]){const A=Oe(p[1],a);A&&Math.random()<.7&&(d=A)}if(!d){const A=Oe(p[1],a);A&&Math.random()<.5&&(d=A)}}if(!d&&e.ai.stamina<=2){const g=a.filter(p=>w[p].cost<=1);g.length&&(d=b(g))}if(!d)if(f){const g=[n.SLASH,n.THRUST,n.FEINT].filter(p=>a.includes(p));d=g.length?z(g,[3,2,2]):b(a)}else{const g=[n.BLOCK,n.DODGE,n.THRUST].filter(p=>a.includes(p));d=g.length?z(g,[3,2,1]):b(a)}return{distanceCard:l,combatCard:d}}function Ra(e){const{distCards:t,combatCards:a}=oe(e),s=e.ai.weapon,i=e.player.weapon,o=e.distance,c=e.history;let l;const r=C[s].advantage,u=C[i].advantage,f=r.includes(o),v=u.includes(o);if(v&&!f){const m=B(s,o),T=o<2?E.RETREAT:E.ADVANCE;m!==E.HOLD&&m!==T?l=Math.random()<.65?m:T:l=T}else if(f&&!v)l=E.HOLD,t.includes(l)||(l=B(s,o));else if(f&&v){const m=o<2?E.RETREAT:E.ADVANCE;l=t.includes(m)?m:E.HOLD}else l=B(s,o);t.includes(l)||(l=b(t));let d;const y=e.ai.stance,S=e.player.stance,g=c.slice(-5),p={};for(const m of Object.values(n))p[m]=0;g.forEach(m=>p[m.playerCombat]++);const A=Object.entries(p).sort((m,T)=>T[1]-m[1]),_=A[0]?A[0][0]:null,I=A[0]?A[0][1]:0,D=c.length>0?c[c.length-1]:null;if(y>=4){const m=[n.DODGE,n.BLOCK].filter(T=>a.includes(T));m.length&&(d=b(m))}if(!d&&S>=3){const m=[n.THRUST,n.FEINT,n.SLASH].filter(T=>a.includes(T));m.length&&(d=m[0])}if(!d&&D&&(D.aiCombat===n.FEINT&&(D.playerCombat===n.BLOCK||D.playerCombat===n.DEFLECT)&&a.includes(n.SLASH)&&(d=n.SLASH),!d&&e.player.staggered&&a.includes(n.SLASH)&&(d=n.SLASH)),!d&&I>=2){const m=le(_,a);m&&Math.random()<.8&&(d=m)}if(!d&&D){const m=le(D.playerCombat,a);m&&Math.random()<.6&&(d=m)}if(!d&&e.ai.stamina<=2){const m=a.filter(T=>w[T].cost<=1);m.length&&(d=b(m))}if(!d)if(f){const m=[n.SLASH,n.THRUST,n.FEINT].filter(T=>a.includes(T));d=m.length?z(m,[3,3,2]):b(a)}else{const m=[n.BLOCK,n.DODGE,n.THRUST].filter(T=>a.includes(T));d=m.length?z(m,[3,3,1]):b(a)}return{distanceCard:l,combatCard:d}}function le(e,t,a,s){const o={[n.SLASH]:[n.DEFLECT,n.DODGE],[n.THRUST]:[n.BLOCK,n.DODGE],[n.FEINT]:[n.THRUST,n.SLASH],[n.BLOCK]:[n.FEINT,n.SLASH],[n.DODGE]:[n.SLASH,n.FEINT],[n.DEFLECT]:[n.THRUST,n.FEINT]}[e]||[];for(const c of o)if(t.includes(c))return c;return null}function ka(e){const{distCards:t,combatCards:a}=oe(e),s=e.ai.weapon,i=e.player.weapon,o=e.distance,c=e.history;let l;const r=C[s].advantage,u=C[i].advantage,f=r.includes(o),v=u.includes(o);if(c.length>=2){const p=c.slice(-3),A=p.filter(I=>I.playerDistance===E.ADVANCE).length,_=p.filter(I=>I.playerDistance===E.RETREAT).length;A>_?E.ADVANCE:_>A&&E.RETREAT}if(v&&!f){const p=B(s,o),A=o<2?E.RETREAT:E.ADVANCE;p!==E.HOLD&&p!==A?l=Math.random()<.7?p:A:l=A}else if(f&&!v)l=E.HOLD,t.includes(l)||(l=B(s,o));else if(f&&v){const p=r.filter(A=>!u.includes(A));if(p.length){const A=p[0];l=A<o?E.ADVANCE:A>o?E.RETREAT:E.HOLD}else l=E.HOLD}else l=B(s,o);t.includes(l)||(l=b(t));let d;const y=e.ai.stance,S=e.player.stance,g=c.length>0?c[c.length-1]:null;if(y>=3){const p=[n.DODGE,n.BLOCK].filter(A=>a.includes(A));p.length&&(d=b(p))}if(!d&&S>=3){const p=[n.THRUST,n.FEINT].filter(A=>a.includes(A));p.length&&(d=p[0])}if(!d&&e.player.staggered){const p=[n.SLASH,n.FEINT].filter(A=>a.includes(A));p.length&&(d=p[0])}if(!d&&g&&g.aiCombat===n.FEINT&&(g.playerCombat===n.BLOCK||g.playerCombat===n.DEFLECT)&&a.includes(n.SLASH)&&(d=n.SLASH),!d&&c.length>=3){const p=c.slice(-6),A={};for(const m of Object.values(n))A[m]=0;p.forEach(m=>A[m.playerCombat]++);const _=Object.entries(A).sort((m,T)=>T[1]-m[1]),I=_[0],D=_[1];if(I[1]>=2){const m=le(I[0],a);m&&(d=m)}if(!d&&g&&I[0]!==g.playerCombat&&D&&D[1]>=1){const m=le(D[0],a);m&&Math.random()<.5&&(d=m)}}if(!d&&g){const p=le(g.playerCombat,a);p&&(d=p)}if(!d&&e.ai.stamina<=2){const p=a.filter(A=>w[A].cost<=1);p.length&&(d=b(p))}if(!d)if(f){const p=[n.SLASH,n.THRUST,n.FEINT,n.BLOCK].filter(A=>a.includes(A));d=p.length?z(p,[3,2,2,1]):b(a)}else{const p=[n.BLOCK,n.DODGE,n.THRUST,n.DEFLECT].filter(A=>a.includes(A));d=p.length?z(p,[3,3,1,1]):b(a)}return{distanceCard:l,combatCard:d}}const Ie=Object.values(h),Ma=50;function wa(e,t){const a=JSON.parse(JSON.stringify(e)),s=a.player;return a.player=a.ai,a.ai=s,a.aiLevel=t,a.history=a.history.map(i=>({round:i.round,playerDistance:i.aiDistance,playerCombat:i.aiCombat,aiDistance:i.playerDistance,aiCombat:i.playerCombat})),a}function We(e,t,a){const s=L.MAX_STAMINA,i=L.STAMINA_RECOVERY,o={...t,stamina:Math.min(s,t.stamina+i)},c=Se(o,a),l=be(o,a);let r=e.combatCard,u=e.distanceCard;return(!r||!c.includes(r))&&(r=c.length>0?c[Math.floor(Math.random()*c.length)]:n.BLOCK),(!u||!l.includes(u))&&(u=l.length>0?l[Math.floor(Math.random()*l.length)]:E.HOLD),{combatCard:r,distanceCard:u}}function Ba(e,t,a,s){let i=oa(e,t,s),o=0;for(;!i.gameOver&&o<Ma;){const c=De(i),l=wa(i,a),r=De(l),u=We(r,i.player,i.distance),f=We(c,i.ai,i.distance);i=ca(i,u,f),o++}return i.winner||"draw"}function Fa(e,t,a){const s={};for(const i of Ie){s[i]={};for(const o of Ie){let c=0,l=0,r=0;for(let u=0;u<a;u++){const f=Ba(i,o,e,t);f==="player"?c++:f==="ai"?l++:r++}s[i][o]={wins:c,losses:l,draws:r}}}return s}function Ua(){const e=document.getElementById("sim-modal");e&&e.remove();const t=document.createElement("div");t.id="sim-modal",t.className="sim-modal-overlay",t.innerHTML=`
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
  `,document.body.appendChild(t),document.getElementById("sim-close").addEventListener("click",()=>t.remove()),t.addEventListener("click",a=>{a.target===t&&t.remove()}),document.getElementById("sim-run").addEventListener("click",()=>{const a=parseInt(document.getElementById("sim-player-level").value),s=parseInt(document.getElementById("sim-ai-level").value),i=parseInt(document.getElementById("sim-num-games").value),o=document.getElementById("sim-results");o.innerHTML='<p class="sim-loading">⏳ 模拟运行中…</p>',setTimeout(()=>{const c=Fa(a,s,i);Pa(o,c,i,a,s)},50)})}function Pa(e,t,a,s,i){const o=Ie,c=j||{},l=P;let r=0,u=0;for(const y of o)for(const S of o)r+=t[y][S].wins,u+=a;const f=(r/u*100).toFixed(1);let v=`<div class="sim-summary">L${s} vs L${i} · 每组${a}局 · 左侧总胜率 <strong>${f}%</strong></div>`;v+='<table class="sim-table"><thead><tr><th>左↓ \\ 右→</th>';for(const y of o)v+=`<th>${c[y]||""} ${l[y].slice(0,2)}</th>`;v+="</tr></thead><tbody>";for(const y of o){v+=`<tr><td class="sim-row-header">${c[y]||""} ${l[y]}</td>`;for(const S of o){const g=t[y][S],p=Math.round(g.wins/a*100),A=ja(p),_=`胜${g.wins} 负${g.losses} 平${g.draws}`;v+=`<td class="sim-cell ${A}" title="${_}">${p}%</td>`}v+="</tr>"}v+="</tbody></table>",v+='<div class="sim-ranking"><strong>武器综合胜率排名：</strong>';const d=o.map(y=>{let S=0,g=0;for(const p of o)S+=t[y][p].wins,g+=a;return{weapon:y,rate:Math.round(S/g*100)}}).sort((y,S)=>S.rate-y.rate);v+=d.map((y,S)=>`<span class="sim-rank-item">${S+1}. ${c[y.weapon]||""} ${l[y.weapon]} ${y.rate}%</span>`).join(" "),v+="</div>",e.innerHTML=v}function ja(e){return e>=65?"sim-hot":e>=55?"sim-warm":e>=45?"sim-neutral":e>=35?"sim-cool":"sim-cold"}const ke="lbq2_config",se={MAX_HP:10,MAX_STAMINA:8,STAMINA_RECOVERY:3,MAX_STANCE:5,EXECUTION_DAMAGE:5,INITIAL_DISTANCE:2,WEAPON_ZONES:{short_blade:{advantage:[0,1],disadvantage:[2,3]},spear:{advantage:[2,3],disadvantage:[0]},sword:{advantage:[1,2],disadvantage:[0,3]},staff:{advantage:[1,2,3],disadvantage:[0]},great_blade:{advantage:[2],disadvantage:[0]},dual_stab:{advantage:[0],disadvantage:[2,3]}}},J={MAX_HP:{label:"最大气血",min:5,max:30,step:1},MAX_STAMINA:{label:"最大体力",min:4,max:16,step:1},STAMINA_RECOVERY:{label:"回合恢复体力",min:1,max:8,step:1},MAX_STANCE:{label:"处决架势阈值",min:3,max:10,step:1},EXECUTION_DAMAGE:{label:"处决伤害",min:2,max:15,step:1},INITIAL_DISTANCE:{label:"初始距离",min:0,max:3,step:1}},Qe=se;function re(e){return JSON.parse(JSON.stringify(e))}function la(){try{const e=localStorage.getItem(ke);return e?JSON.parse(e):null}catch{return null}}function Ga(e){try{return localStorage.setItem(ke,JSON.stringify(e)),!0}catch{return!1}}function Me(e){if(e){for(const t of Object.keys(J))e[t]!==void 0&&(L[t]=e[t]);if(e.WEAPON_ZONES)for(const[t,a]of Object.entries(e.WEAPON_ZONES))C[t]&&(C[t]=re(a))}}function Ka(){localStorage.removeItem(ke),Me(re(se))}function xe(e){if(!e)return[];const t=[];for(const a of Object.keys(J)){const s=se[a],i=e[a];i!==void 0&&i!==s&&t.push({key:a,label:J[a].label,default:s,current:i})}if(e.WEAPON_ZONES)for(const[a,s]of Object.entries(e.WEAPON_ZONES)){const i=se.WEAPON_ZONES[a];if(!i)continue;const o=JSON.stringify(s.advantage)!==JSON.stringify(i.advantage),c=JSON.stringify(s.disadvantage)!==JSON.stringify(i.disadvantage);if(o||c){const l=P[a]||a;o&&t.push({key:a+"_adv",label:l+" 优势区",default:i.advantage.join(","),current:s.advantage.join(",")}),c&&t.push({key:a+"_disadv",label:l+" 劣势区",default:i.disadvantage.join(","),current:s.disadvantage.join(",")})}}return t}function ra(){const e=la();if(!e)return re(se);const t=re(se);for(const a of Object.keys(J))e[a]!==void 0&&(t[a]=e[a]);if(e.WEAPON_ZONES)for(const[a,s]of Object.entries(e.WEAPON_ZONES))t.WEAPON_ZONES[a]&&(t.WEAPON_ZONES[a]=re(s));return t}const ea=la();ea&&Me(ea);function Ne(e,t="info"){let a=document.getElementById("toast-container");a||(a=document.createElement("div"),a.id="toast-container",document.body.appendChild(a));const s=document.createElement("div");s.className=`game-toast toast-${t}`,s.textContent=e,a.appendChild(s),s.offsetWidth,s.classList.add("toast-show"),setTimeout(()=>{s.classList.add("toast-hide"),s.addEventListener("animationend",()=>s.remove())},2200)}function Xa(){const e=document.getElementById("cfg-modal");e&&e.remove();const t=ra(),a=["0-贴身","1-近战","2-中距","3-远距"],s=document.createElement("div");s.id="cfg-modal",s.className="sim-modal-overlay";let i="";for(const[r,u]of Object.entries(J)){const f=t[r],v=Qe[r],d=f!==v;i+=`
      <div class="cfg-row">
        <label>${u.label}</label>
        <input type="number" id="cfg-${r}" value="${f}" min="${u.min}" max="${u.max}" step="${u.step}" />
        <span class="cfg-default${d?" cfg-changed":""}">(默认: ${v})</span>
      </div>`}let o="";for(const[r,u]of Object.entries(t.WEAPON_ZONES)){const f=(j[r]||"")+" "+(P[r]||r),v=Qe.WEAPON_ZONES[r],d=v&&JSON.stringify(u.advantage)!==JSON.stringify(v.advantage),y=v&&JSON.stringify(u.disadvantage)!==JSON.stringify(v.disadvantage);o+=`
      <div class="cfg-weapon-block">
        <div class="cfg-weapon-name">${f}</div>
        <div class="cfg-zone-row">
          <label>优势区</label>
          <div class="cfg-checkboxes" data-weapon="${r}" data-type="advantage">
            ${a.map((S,g)=>`<label class="cfg-cb"><input type="checkbox" value="${g}" ${u.advantage.includes(g)?"checked":""} /> ${S}</label>`).join("")}
          </div>
          ${d?'<span class="cfg-changed-dot">●</span>':""}
        </div>
        <div class="cfg-zone-row">
          <label>劣势区</label>
          <div class="cfg-checkboxes" data-weapon="${r}" data-type="disadvantage">
            ${a.map((S,g)=>`<label class="cfg-cb"><input type="checkbox" value="${g}" ${u.disadvantage.includes(g)?"checked":""} /> ${S}</label>`).join("")}
          </div>
          ${y?'<span class="cfg-changed-dot">●</span>':""}
        </div>
      </div>`}const c=xe(t);let l="";c.length>0&&(l='<div class="cfg-diff"><strong>与默认值差异：</strong>'+c.map(r=>`<div class="cfg-diff-item"><span class="cfg-diff-label">${r.label}</span> <span class="cfg-diff-old">${r.default}</span> → <span class="cfg-diff-new">${r.current}</span></div>`).join("")+"</div>"),s.innerHTML=`
    <div class="sim-modal-box cfg-modal-box">
      <div class="sim-header">
        <h2>⚙️ 参数配置</h2>
        <button class="sim-close" id="cfg-close">✕</button>
      </div>
      <div class="cfg-section">
        <h3>基础数值</h3>
        ${i}
      </div>
      <div class="cfg-section">
        <h3>兵器区间</h3>
        ${o}
      </div>
      <div id="cfg-diff-area">${l}</div>
      <div class="cfg-actions">
        <button class="cfg-btn cfg-save" id="cfg-save">💾 保存</button>
        <button class="cfg-btn cfg-reset" id="cfg-reset">↩ 恢复默认</button>
        <button class="cfg-btn cfg-cancel" id="cfg-cancel">取消</button>
      </div>
    </div>
  `,document.body.appendChild(s),s.addEventListener("click",r=>{r.target===s&&s.remove()}),document.getElementById("cfg-close").addEventListener("click",()=>s.remove()),document.getElementById("cfg-cancel").addEventListener("click",()=>s.remove()),document.getElementById("cfg-save").addEventListener("click",()=>{const r=aa();Ga(r),Me(r),s.remove(),Ne("✅ 配置已保存！下次对局生效。","success")}),document.getElementById("cfg-reset").addEventListener("click",()=>{Ka(),s.remove(),Ne("↩ 已恢复默认配置！","info")}),s.querySelectorAll("input").forEach(r=>{r.addEventListener("change",()=>{const u=aa(),f=xe(u),v=document.getElementById("cfg-diff-area");f.length>0?v.innerHTML='<div class="cfg-diff"><strong>与默认值差异：</strong>'+f.map(d=>`<div class="cfg-diff-item"><span class="cfg-diff-label">${d.label}</span> <span class="cfg-diff-old">${d.default}</span> → <span class="cfg-diff-new">${d.current}</span></div>`).join("")+"</div>":v.innerHTML='<div class="cfg-diff"><em>无差异（全部为默认值）</em></div>'})})}function aa(){const e=ra();for(const t of Object.keys(J)){const a=document.getElementById(`cfg-${t}`);a&&(e[t]=parseInt(a.value)||J[t].min)}return document.querySelectorAll(".cfg-checkboxes").forEach(t=>{const a=t.dataset.weapon,s=t.dataset.type,i=[];t.querySelectorAll('input[type="checkbox"]:checked').forEach(o=>{i.push(parseInt(o.value))}),e.WEAPON_ZONES[a]||(e.WEAPON_ZONES[a]={advantage:[],disadvantage:[]}),e.WEAPON_ZONES[a][s]=i.sort()}),e}const M={[n.DODGE]:{emoji:"💨",type:"防",desc:"回避攻击，成功时对手+1架势"},[n.DEFLECT]:{emoji:"🤺",type:"防",desc:"反制劈砍/点刺，伤害+僵直"},[n.SLASH]:{emoji:"⚡",type:"攻",desc:"3伤害+1架势，高威力"},[n.THRUST]:{emoji:"🎯",type:"攻",desc:"1伤害+1架势，低消耗"},[n.BLOCK]:{emoji:"🛡️",type:"防",desc:"减免攻击伤害"},[n.FEINT]:{emoji:"🌀",type:"攻",desc:"0伤害+2架势，克格挡"}},Ee={[E.ADVANCE]:{emoji:"⬆️",desc:"距离-1"},[E.RETREAT]:{emoji:"⬇️",desc:"距离+1"},[E.HOLD]:{emoji:"⏸️",desc:"不变"}},Va={[h.SHORT_BLADE]:{style:"近身突袭",traits:["优势区点刺/劈砍+1伤","优势区闪避/点刺-1体力","优势区虚晃+1架势","远距劈砍不可用，远距-1伤","靠近费用减半"]},[h.SPEAR]:{style:"中远控距",traits:["优势区劈砍+2伤","优势区格挡-1体力","贴身禁劈砍/卸力","贴身点刺-1伤","远离费用减半"]},[h.SWORD]:{style:"均衡防反",traits:["卸力成功不僵直，自身-2架势","优势区卸力/格挡-1体力","贴身禁劈砍，远距禁点刺/劈砍","贴身伤害-1"]},[h.STAFF]:{style:"广域压制",traits:["优势区虚晃+1架势","优势区格挡-1体力","优势区劈砍-1伤(轻击)","贴身禁劈砍，贴身-1伤","优势区覆盖近/中/远"]},[h.GREAT_BLADE]:{style:"重击破防",traits:["优势区劈砍+3伤(重斩)","优势区劈砍命中推1距离","优势区格挡额外减2伤","贴身禁劈砍/卸力","劣势区点刺-1伤"]},[h.DUAL_STAB]:{style:"贴身缠斗",traits:["贴身命中任何卡额外+1架势","优势区点刺+1伤","优势区点刺/闪避-1体力","优势区虚晃+1架势","中距+禁劈砍/卸力，劣势-1伤"]}};function ae(e){const t=Va[e];if(!t)return"";const a=C[e],s=a.advantage.map(o=>ne[o]).join("、"),i=a.disadvantage.map(o=>ne[o]).join("、");return`
    <div class="weapon-info-box">
      <div class="info-title">${j[e]} ${P[e]} · ${t.style}</div>
      <div class="info-adv">✦ 优势区: ${s}</div>
      <div class="info-dis">✧ 劣势区: ${i}</div>
      <div class="info-traits">
        ${t.traits.map(o=>`<div class="info-trait">• ${o}</div>`).join("")}
      </div>
    </div>
  `}const te={0:{player:42,ai:58},1:{player:35,ai:65},2:{player:24,ai:76},3:{player:12,ai:88}};function Za(e,t){const a=h.SHORT_BLADE,s=h.SPEAR;e.innerHTML=`
    <div class="setup-screen">
      <h1>⚔️ 冷刃博弈</h1>
      <p class="subtitle">以「距离管控」为核心的回合制冷兵器对战</p>
      <div class="setup-form">
        <div class="setup-weapons">
          <div class="setup-weapon-col">
            <div class="setup-col-title">👤 你的兵器</div>
            <select id="sel-player">
              ${Object.entries(P).map(([i,o])=>`<option value="${i}">${j[i]||""} ${o}</option>`).join("")}
            </select>
            <div id="player-traits">${ae(a)}</div>
          </div>
          <div class="setup-vs">⚔</div>
          <div class="setup-weapon-col">
            <div class="setup-col-title">🤖 对手兵器</div>
            <select id="sel-ai">
              ${Object.entries(P).map(([i,o])=>`<option value="${i}">${j[i]||""} ${o}</option>`).join("")}
            </select>
            <div id="ai-traits">${ae(s)}</div>
          </div>
        </div>
        <div class="setup-row setup-row-center">
          <label>AI 难度</label>
          <select id="sel-level">
            <option value="1">1 - 纯随机</option>
            <option value="2">2 - 基础规则</option>
            <option value="3" selected>3 - 简单策略</option>
            <option value="4">4 - 普通策略</option>
            <option value="5">5 - 高级策略</option>
            <option value="6">6 - 顶级高手</option>
          </select>
        </div>
        <button class="btn-start" id="btn-start">开始对局</button>
        <div class="setup-btns-row">
          <button class="btn-sim" id="btn-sim">📊 对战模拟</button>
          <button class="btn-sim" id="btn-config">⚙️ 参数配置</button>
        </div>
      </div>
    </div>
  `,document.getElementById("sel-ai").value=s,document.getElementById("sel-player").addEventListener("change",i=>{document.getElementById("player-traits").innerHTML=ae(i.target.value)}),document.getElementById("sel-ai").addEventListener("change",i=>{document.getElementById("ai-traits").innerHTML=ae(i.target.value)}),document.getElementById("btn-start").addEventListener("click",()=>{t(document.getElementById("sel-player").value,document.getElementById("sel-ai").value,parseInt(document.getElementById("sel-level").value))}),document.getElementById("btn-sim").addEventListener("click",()=>{Ua()}),document.getElementById("btn-config").addEventListener("click",()=>{Xa()})}function qa(e,t,a,s,i){const o=`
    <div class="game-wrapper">
      ${za(t,s)}
      <div class="game-layout">
        ${Ja(t,a)}
        ${xa(t,s)}
        ${it(t)}
      </div>
      ${lt()}
    </div>
    ${rt()}
    ${dt()}
  `;e.innerHTML=o,ut(t,a,s,i)}function za(e,t){return`
    <div class="top-bar">
      <div class="game-title">⚔️ 冷刃博弈</div>
      <div class="top-controls">
        <button class="ctrl-btn" data-action="tutorial">📚 引导</button>
        <select class="diff-select" data-action="difficulty">
          ${[1,2,3,4,5,6].map(a=>`<option value="${a}" ${a===e.aiLevel?"selected":""}>难度${a}</option>`).join("")}
        </select>
        <button class="ctrl-btn" data-action="newgame">🎮 新对局</button>
        <button class="ctrl-btn" data-action="reset">🔄 重置</button>
        <button class="ctrl-btn" data-action="pause">${t.isPaused?"▶️ 继续":"⏸️ 暂停"}</button>
        <button class="ctrl-btn" data-action="undo" ${t.canUndo?"":"disabled"}>⏪ 回退</button>
        <span class="round-badge">第 ${e.round+1} 回合</span>
      </div>
    </div>
  `}function Ja(e,t){const a=e.player,s=e.distance,i=a.staggered?'<span class="stagger-badge">⚠ 僵直</span>':"",o=be(a,s),c=Se(a,s);let l=0,r=!0;return t.distanceCard&&t.combatCard&&(l=ia(t.distanceCard,t.combatCard,a,s),r=l<=a.stamina),`
    <div class="side-panel player-side">
      <div class="panel-header">
        <span class="panel-icon">👤</span>
        <span class="panel-name">玩家 ${i}</span>
        <span class="weapon-badge">${j[a.weapon]||""} ${P[a.weapon]}</span>
      </div>
      ${da(a)}
      ${ae(a.weapon)}
      <div class="divider"></div>
      <div class="card-sel-title">🃏 选择出牌</div>
      <div class="cost-preview">
        <span>消耗: <span class="${r?"cost-val":"cost-warn"}">${l}</span></span>
        <span>可用: <span class="cost-val">${a.stamina}</span> 体力</span>
      </div>
      <div class="card-group-label">距离卡（必选）</div>
      <div class="cards-row">
        ${Ya(e,t,a,o)}
      </div>
      <div class="card-group-label">攻防卡（必选）</div>
      <div class="cards-grid compact">
        ${Qa(e,t,a,c)}
      </div>
      <button class="btn-confirm" id="btn-confirm"
        ${!t.distanceCard||!t.combatCard?"disabled":""}>
        ${t.distanceCard&&t.combatCard&&!r?"⚠ 体力不足":"确认出牌"}
      </button>
    </div>
  `}function da(e,t){const a=L.MAX_HP,s=L.MAX_STAMINA,i=L.MAX_STANCE,c=`<span class="stamina-recovery">回合结束+${L.STAMINA_RECOVERY}</span>`;return`
    ${Ce("❤️ 气血","hp",e.hp,a)}
    ${Ce("💪 体力","stamina",e.stamina,s)}
    ${c}
    ${Ce("⚡ 架势","stance",e.stance,i,e.stance>=4)}
  `}function Ce(e,t,a,s,i){const o=Math.max(0,a/s*100);return`
    <div class="stat-row" data-stat="${t}">
      <span class="stat-label">${e}</span>
      <div class="stat-bar-wrap">
        <div class="stat-bar ${t}${i?" danger":""}" data-max="${s}" style="width: ${o}%"></div>
      </div>
      <span class="stat-value">${a}/${s}</span>
    </div>
  `}function Ya(e,t,a,s){const i=e.player,o=e.distance;return Object.values(E).map(c=>{const l=s.includes(c),r=t.distanceCard===c,u=Ee[c],f=i.distanceCardStreak.card===c?i.distanceCardStreak.count:0,v=de(c,f,i.weapon,o,C),d=[u.desc];f>0&&d.push(`连续${f+1}次，费用+${f}`),!l&&v>i.stamina&&d.push(`⚠ 体力不足(需${v}，剩${i.stamina})`);const y=d.join(`
`);return`
      <div class="dist-card ${r?"selected":""} ${l?"":"disabled"}"
           data-type="distance" data-card="${c}" title="${y}">
        <span class="dc-emoji">${u.emoji}</span>
        <span class="dc-name">${X[c]}</span>
        <span class="dc-cost">${v}体</span>
      </div>
    `}).join("")}function Wa(e,t,a,s,i,o){return ta(t,a).includes(e)?`⛔ ${P[t]}在距离${a}不可用`:o&&Re[e]===F.ATTACK?"⛔ 僵直中，无法使用攻击":i>s?`⚠ 体力不足(需${i}，剩${s})`:""}function Qa(e,t,a,s){const i=e.player,o=e.distance;return Object.values(n).map(c=>{const l=s.includes(c),r=t.combatCard===c,u=M[c],f=w[c],v=i.combatCardStreak.card===c?i.combatCardStreak.count:0,d=ue(c,v,i.weapon,o),y=u.type==="攻"?"atk":"def",S=[u.desc],g=na(i.weapon,o,c),p=sa(i.weapon,o,c);g>0&&S.push(`📈 优势区加成：伤害+${g}`),g<0&&S.push(`📉 劣势区减益：伤害${g}`),p<0&&S.push(`💰 优势区减费：费用${p}`),v>0&&S.push(`🔄 连续${v+1}次，费用+${v}`),l||S.push(Wa(c,i.weapon,o,i.stamina,d,i.staggered));const A=S.join(`
`);return`
      <div class="combat-card ${r?"selected":""} ${l?"":"disabled"}"
           data-type="combat" data-card="${c}" title="${A}">
        <div class="cc-top">
          <span class="cc-emoji">${u.emoji}</span>
          <span class="cc-name">${K[c]}</span>
          <span class="cc-type ${y}">${u.type}</span>
        </div>
        <div class="cc-desc">${u.desc}</div>
        <div class="cc-footer">
          <span>${d}体</span>
          <span>P${f.priority}</span>
          ${g!==0?`<span class="cc-mod ${g>0?"buff":"nerf"}">${g>0?"+":""}${g}伤</span>`:""}
        </div>
      </div>
    `}).join("")}function xa(e,t){return`
    <div class="center-area">
      ${t.isPaused?'<div class="paused-banner">⏸ 游戏已暂停 — 点击「继续」恢复</div>':""}
      ${et(e)}
      ${at(e)}
      <div class="arena-wrapper">
        ${tt(e)}
        ${nt(e)}
      </div>
      ${st(e)}
    </div>
  `}function et(e){const t=e.player,a=e.ai,s=e.distance,i=C[t.weapon],o=C[a.weapon],c=i.advantage.includes(s),l=o.advantage.includes(s),r=i.disadvantage.includes(s),u=[];return c&&!l?u.push("✅ 你在优势距离！攻击伤害加成、消耗减免"):l&&!c?u.push("⚠️ 对手在优势距离！考虑拉开/靠近改变距离"):c&&l?u.push("⚔️ 双方都在优势区，正面较量！"):r&&u.push("❌ 你在劣势区，快调整距离！"),t.stance>=4?u.push("🔴 你架势快满了！被攻击可能触发处决(-5血)"):a.stance>=4&&u.push("🟢 对手架势快满了！攻击/虚晃可触发处决"),t.stamina<=2&&u.push("💤 体力不足，考虑用低消耗牌"),t.staggered&&u.push("😵 僵直中！本回合无法使用攻击卡"),a.staggered&&u.push("💥 对手僵直！无法使用攻击卡，进攻好时机"),u.length===0&&u.push("💡 选择1张距离卡 + 1张攻防卡，点确认出牌"),`<div class="situation-hint">${u.join('<span class="hint-sep">|</span>')}</div>`}function at(e){const t=C[e.player.weapon],a=C[e.ai.weapon];return`
    <div class="distance-zones">
      <div class="zone-header">📍 距离管控区</div>
      <div class="zone-bar">${[0,1,2,3].map(i=>{const o=i===e.distance,c=t.advantage.includes(i),l=a.advantage.includes(i);let r="zone-cell";return o&&(r+=" current"),c&&!l&&(r+=" player-adv"),l&&!c&&(r+=" ai-adv"),`
      <div class="${r}">
        <div class="zone-name">${ne[i]}</div>
        ${o?'<div class="zone-marker">⚔</div>':""}
        <div class="zone-tags">
          ${c?'<span class="zone-tag ptag">★玩家</span>':""}
          ${l?'<span class="zone-tag atag">★AI</span>':""}
        </div>
      </div>
    `}).join("")}</div>
    </div>
  `}function tt(e){const t=L.MAX_HP,a=L.MAX_STANCE,s=te[e.distance]||te[2],i=(e.player.hp/t*100).toFixed(0),o=(e.ai.hp/t*100).toFixed(0),c=(e.player.stance/a*100).toFixed(0),l=(e.ai.stance/a*100).toFixed(0),r=s.player,u=s.ai-s.player;return`
    <div class="battle-arena">
      <div class="arena-title">⚔️ 战斗场景</div>
      <div class="arena-stage" id="arena-stage">
        <div class="arena-dist-label">${ne[e.distance]}</div>
        <div class="arena-dist-line" style="left:${r}%;width:${u}%"></div>
        <div class="fighter player-fighter" id="player-fighter" style="left:${s.player}%">
          <div class="fighter-weapon-icon">${j[e.player.weapon]||"🗡️"}</div>
          <div class="fighter-body">${e.player.staggered?"😵":"🧑"}</div>
          <div class="fighter-label">玩家</div>
          <div class="mini-bars">
            <div class="mini-bar"><div class="mini-bar-fill hp-p" style="width:${i}%"></div></div>
            <div class="mini-bar"><div class="mini-bar-fill stance-f" style="width:${c}%"></div></div>
          </div>
        </div>
        <div class="fighter ai-fighter" id="ai-fighter" style="left:${s.ai}%">
          <div class="fighter-weapon-icon">${j[e.ai.weapon]||"🔱"}</div>
          <div class="fighter-body">${e.ai.staggered?"😵":"🤖"}</div>
          <div class="fighter-label">AI</div>
          <div class="mini-bars">
            <div class="mini-bar"><div class="mini-bar-fill hp-a" style="width:${o}%"></div></div>
            <div class="mini-bar"><div class="mini-bar-fill stance-f" style="width:${l}%"></div></div>
          </div>
        </div>
      </div>
    </div>
  `}function nt(e){if(e.history.length===0)return'<div class="round-result-banner">等待出牌...</div>';const t=e.history[e.history.length-1],a=X[t.playerDistance],s=K[t.playerCombat],i=X[t.aiDistance],o=K[t.aiCombat],c=M[t.playerCombat]?M[t.playerCombat].emoji:"",l=M[t.aiCombat]?M[t.aiCombat].emoji:"";return`
    <div class="round-result-banner">
      <span class="rrb-label">第${e.round}回合</span>
      <span class="rrb-player">👤 ${a}+${c}${s}</span>
      <span class="rrb-vs">VS</span>
      <span class="rrb-ai">🤖 ${i}+${l}${o}</span>
    </div>
  `}function st(e){return`
    <div class="battle-log" id="battle-log">
      <div class="log-title">📜 战斗日志</div>
      ${e.log.map(a=>{let s="log-line";return(a.includes("处决")||a.includes("伤"))&&(s+=" damage"),a.includes("══")&&(s+=" highlight"),(a.includes("闪避成功")||a.includes("格挡"))&&(s+=" good"),`<div class="${s}">${a}</div>`}).join("")||'<div class="log-line">等待对局开始...</div>'}
    </div>
  `}function it(e){const t=e.ai;return`
    <div class="side-panel ai-side">
      <div class="panel-header">
        <span class="panel-icon">🤖</span>
        <span class="panel-name">AI ${t.staggered?'<span class="stagger-badge">⚠ 僵直</span>':""}</span>
        <span class="weapon-badge">${j[t.weapon]||""} ${P[t.weapon]}</span>
      </div>
      ${da(t)}
      ${ae(t.weapon)}
      <div class="divider"></div>
      ${ot(e)}
      <div class="divider"></div>
      ${ct(e)}
    </div>
  `}function ot(e){if(e.history.length===0)return`
      <div class="ai-last-action">
        <div class="ala-title">🎴 AI上回合出牌</div>
        <div class="ala-waiting">等待第一回合...</div>
      </div>
    `;const t=e.history[e.history.length-1],a=Ee[t.aiDistance],s=M[t.aiCombat];return`
    <div class="ai-last-action">
      <div class="ala-title">🎴 AI上回合出牌</div>
      <div class="ala-cards">
        <div class="ala-card">${a.emoji} ${X[t.aiDistance]}</div>
        <div class="ala-card">${s.emoji} ${K[t.aiCombat]} <span class="cc-type ${s.type==="攻"?"atk":"def"}">${s.type}</span></div>
      </div>
    </div>
  `}function ct(e){return`
    <div class="history-section">
      <div class="history-title">📜 历史记录</div>
      <div class="history-list" id="history-list">
        ${e.history.map((a,s)=>{const i=X[a.playerDistance],o=K[a.playerCombat],c=X[a.aiDistance],l=K[a.aiCombat],r=M[a.playerCombat]?M[a.playerCombat].emoji:"",u=M[a.aiCombat]?M[a.aiCombat].emoji:"";return`
      <div class="history-item">
        <div class="h-round">回合 ${s+1}</div>
        <div class="h-player">👤 ${i} + ${r} ${o}</div>
        <div class="h-ai">🤖 ${c} + ${u} ${l}</div>
      </div>
    `}).reverse().join("")||'<div class="history-item"><div class="h-detail">暂无记录</div></div>'}
      </div>
    </div>
  `}function lt(){return`
    <div class="bottom-bar">
      <div class="rule-summary">
        <span>距离管控</span>为第一核心 |
        <span>双向架势</span>为胜负根基 |
        <span>攻防预判</span>为博弈循环
      </div>
      <button class="btn-rules" data-action="rules">📖 完整规则</button>
    </div>
  `}function rt(){return`
    <div class="modal-overlay" id="modal-tutorial">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title">📚 新手引导</div>
          <button class="modal-close" data-close="tutorial">关闭</button>
        </div>
        <div class="modal-content-text">
          <h4>🎯 游戏目标</h4>
          <p>将对手的气血值归零即可获胜！控制架势条，避免被处决（-5血）。</p>

          <h4>⚔️ 核心机制</h4>
          <ul>
            <li><strong>距离管控</strong>：不同兵器在不同距离有优势/劣势，距离控制是胜负的关键</li>
            <li><strong>架势系统</strong>：被攻击/虚晃命中会增加架势值，满5触发处决扣5血</li>
            <li><strong>体力系统</strong>：每回合恢复3体力，操作消耗体力，连续使用同一卡牌消耗递增</li>
          </ul>

          <h4>🃏 出牌流程</h4>
          <ol>
            <li>选择 <strong>1张距离调整卡</strong>：靠近 / 远离 / 站稳</li>
            <li>选择 <strong>1张攻防操作卡</strong>：闪避 / 卸力 / 劈砍 / 点刺 / 格挡 / 虚晃</li>
            <li>点击 <strong>确认出牌</strong></li>
            <li>系统自动结算：先距离，再攻防（按优先级）</li>
          </ol>

          <h4>🎴 卡牌说明</h4>
          <ul>
            <li><strong>💨 闪避</strong>（优先级1）：防守卡，回避攻击成功时对手+1架势</li>
            <li><strong>🤺 卸力</strong>（优先级2）：防守卡，反制劈砍/点刺，造成2伤+僵直</li>
            <li><strong>⚡ 劈砍</strong>（优先级3）：攻击卡，3伤害+1架势，高消耗</li>
            <li><strong>🎯 点刺</strong>（优先级4）：攻击卡，1伤害+1架势，低消耗快出</li>
            <li><strong>🛡️ 格挡</strong>（优先级5）：防守卡，减免劈砍/点刺伤害</li>
            <li><strong>🌀 虚晃</strong>（优先级6）：攻击卡，0伤害但+2架势，克制格挡</li>
          </ul>

          <h4>🏹 兵器特性</h4>
          <ul>
            <li><strong>🗡️ 短刀</strong>：贴身+近战优势，闪避减免，点刺加伤</li>
            <li><strong>🔱 长枪</strong>：中距+远距优势，劈砍加伤大，格挡减免</li>
            <li><strong>⚔️ 剑</strong>：近战+中距优势，卸力不造成僵直改为减自身架势</li>
            <li><strong>🏏 棍</strong>：近战+中距+远距优势（最宽），虚晃加成，但劈砍伤害-1</li>
            <li><strong>🪓 大刀</strong>：仅中距优势，劈砍超高伤害+推距离</li>
          </ul>

          <h4>💡 操作技巧</h4>
          <ul>
            <li>再次点击已选卡牌可取消选择</li>
            <li>灰色卡牌表示不可用（距离/体力/僵直限制）</li>
            <li>⏪ 回退按钮可撤销上一回合</li>
            <li>关注架势值！ 架势满5会被处决扣5血</li>
          </ul>
        </div>
      </div>
    </div>
  `}function dt(){return`
    <div class="modal-overlay" id="modal-rules">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title">📖 完整规则</div>
          <button class="modal-close" data-close="rules">关闭</button>
        </div>
        <div class="modal-content-text">
          <h4>📐 距离系统</h4>
          <ul>
            <li>4个距离区间：贴身区(0) → 近战区(1) → 中距区(2) → 远距区(3)</li>
            <li>初始距离：中距区(2)</li>
            <li>双方距离效果叠加：如玩家靠近(-1) + AI远离(+1) = 距离不变</li>
          </ul>

          <h4>⚡ 体力系统</h4>
          <ul>
            <li>体力上限8，每回合恢复3（不超上限）</li>
            <li>所有操作消耗体力，先扣体力再结算</li>
            <li>连续使用同一卡牌，消耗逐回合+1</li>
            <li>兵器在优势区有特定卡牌消耗减免</li>
          </ul>

          <h4>⚔️ 攻防结算（按优先级）</h4>
          <ul>
            <li>优先级：闪避(1) > 卸力(2) > 劈砍(3) > 点刺(4) > 格挡(5) > 虚晃(6)</li>
            <li>卸力成功反制劈砍/点刺：造成反伤+僵直</li>
            <li>格挡减免劈砍/点刺伤害</li>
            <li>虚晃骗出格挡：+架势值</li>
          </ul>

          <h4>🎭 架势与处决</h4>
          <ul>
            <li>被攻击/虚晃命中会增加架势值</li>
            <li>架势值达到5触发「处决」：扣5血 + 架势清零</li>
            <li>架势管理是游戏核心策略之一</li>
          </ul>

          <h4>💫 僵直状态</h4>
          <ul>
            <li>被卸力成功反制后进入僵直</li>
            <li>僵直状态持续1回合，期间所有攻击卡禁用</li>
          </ul>
        </div>
      </div>
    </div>
  `}function ut(e,t,a,s){document.querySelectorAll(".dist-card:not(.disabled), .combat-card:not(.disabled)").forEach(o=>{o.addEventListener("click",()=>{s.onSelect(o.dataset.type,o.dataset.card)})});const i=document.getElementById("btn-confirm");i&&!i.disabled&&i.addEventListener("click",()=>s.onConfirm()),document.querySelectorAll("[data-action]").forEach(o=>{const c=o.dataset.action;o.addEventListener(o.tagName==="SELECT"?"change":"click",()=>{switch(c){case"tutorial":$e("modal-tutorial",!0);break;case"rules":$e("modal-rules",!0);break;case"newgame":s.onNewGame();break;case"reset":s.onReset();break;case"pause":s.onTogglePause();break;case"undo":s.onUndo();break;case"difficulty":s.onDifficultyChange(parseInt(o.value));break}})}),document.querySelectorAll("[data-close]").forEach(o=>{o.addEventListener("click",()=>{$e("modal-"+o.dataset.close,!1)})}),document.querySelectorAll(".modal-overlay").forEach(o=>{o.addEventListener("click",c=>{c.target===o&&o.classList.remove("active")})})}function $e(e,t){const a=document.getElementById(e);a&&(t?a.classList.add("active"):a.classList.remove("active"))}function pt(e,t,a,s){const i=L.MAX_HP;let o,c;t.winner==="player"?(o="🏆 胜利！",c="win"):t.winner==="ai"?(o="💀 败北",c="lose"):(o="🤝 平局",c="draw");const l=document.querySelector(".center-area");if(!l)return;const r=document.createElement("div");r.className="game-over-banner "+c,r.innerHTML=`
    <div class="gob-title">${o}</div>
    <div class="gob-stats">
      回合${t.round} ｜ 
      👤 HP ${t.player.hp}/${i} ｜ 
      🤖 HP ${t.ai.hp}/${i}
    </div>
    <div class="gob-btns">
      <button class="gob-btn restart" id="btn-restart-same">🔄 再来一局</button>
      <button class="gob-btn back" id="btn-back-setup">🏠 返回选择</button>
    </div>
  `,l.insertBefore(r,l.firstChild),document.getElementById("btn-restart-same").addEventListener("click",()=>{a()}),document.getElementById("btn-back-setup").addEventListener("click",()=>{s()})}function mt(){const e=document.getElementById("battle-log");e&&(e.scrollTop=e.scrollHeight)}const ft={[`${n.DODGE}_${n.SLASH}`]:{pAnim:"anim-dodge",aAnim:"anim-slash-miss",spark:"💨",desc:"闪避劈砍"},[`${n.SLASH}_${n.DODGE}`]:{pAnim:"anim-slash-miss",aAnim:"anim-dodge",spark:"💨",desc:"劈砍被闪"},[`${n.DODGE}_${n.THRUST}`]:{pAnim:"anim-dodge",aAnim:"anim-thrust-miss",spark:"💨",desc:"闪避点刺"},[`${n.THRUST}_${n.DODGE}`]:{pAnim:"anim-thrust-miss",aAnim:"anim-dodge",spark:"💨",desc:"点刺被闪"},[`${n.DEFLECT}_${n.SLASH}`]:{pAnim:"anim-deflect",aAnim:"anim-recoil",spark:"🤺",desc:"卸力反制!"},[`${n.SLASH}_${n.DEFLECT}`]:{pAnim:"anim-recoil",aAnim:"anim-deflect",spark:"🤺",desc:"被卸力反制!"},[`${n.DEFLECT}_${n.THRUST}`]:{pAnim:"anim-deflect-fail",aAnim:"anim-thrust-p",spark:"🎯",desc:"卸力失败"},[`${n.THRUST}_${n.DEFLECT}`]:{pAnim:"anim-thrust-p",aAnim:"anim-deflect-fail",spark:"🎯",desc:"穿透卸力"},[`${n.DEFLECT}_${n.FEINT}`]:{pAnim:"anim-deflect-fail",aAnim:"anim-feint-a",spark:"🌀",desc:"虚晃骗卸力"},[`${n.FEINT}_${n.DEFLECT}`]:{pAnim:"anim-feint-p",aAnim:"anim-deflect-fail",spark:"🌀",desc:"虚晃骗卸力"},[`${n.SLASH}_${n.SLASH}`]:{pAnim:"anim-clash-p",aAnim:"anim-clash-a",spark:"⚡",desc:"互砍!"},[`${n.SLASH}_${n.THRUST}`]:{pAnim:"anim-slash-p",aAnim:"anim-hit",spark:"⚡",desc:"劈砍命中"},[`${n.THRUST}_${n.SLASH}`]:{pAnim:"anim-hit",aAnim:"anim-slash-a",spark:"⚡",desc:"被劈中"},[`${n.SLASH}_${n.BLOCK}`]:{pAnim:"anim-slash-p",aAnim:"anim-block-hit",spark:"🛡️",desc:"劈砍破格挡"},[`${n.BLOCK}_${n.SLASH}`]:{pAnim:"anim-block-hit",aAnim:"anim-slash-a",spark:"🛡️",desc:"格挡被破"},[`${n.SLASH}_${n.FEINT}`]:{pAnim:"anim-slash-p",aAnim:"anim-hit",spark:"⚡",desc:"劈砍命中"},[`${n.FEINT}_${n.SLASH}`]:{pAnim:"anim-hit",aAnim:"anim-slash-a",spark:"⚡",desc:"被劈中"},[`${n.THRUST}_${n.THRUST}`]:{pAnim:"anim-thrust-p",aAnim:"anim-thrust-a",spark:"🎯",desc:"互刺!"},[`${n.THRUST}_${n.BLOCK}`]:{pAnim:"anim-thrust-miss",aAnim:"anim-block",spark:"🛡️",desc:"被格挡"},[`${n.BLOCK}_${n.THRUST}`]:{pAnim:"anim-block",aAnim:"anim-thrust-miss",spark:"🛡️",desc:"格挡成功"},[`${n.THRUST}_${n.FEINT}`]:{pAnim:"anim-thrust-p",aAnim:"anim-hit",spark:"🎯",desc:"点刺命中"},[`${n.FEINT}_${n.THRUST}`]:{pAnim:"anim-hit",aAnim:"anim-thrust-a",spark:"🎯",desc:"被点刺"},[`${n.BLOCK}_${n.FEINT}`]:{pAnim:"anim-block-tricked",aAnim:"anim-feint-a",spark:"🌀",desc:"虚晃骗格挡"},[`${n.FEINT}_${n.BLOCK}`]:{pAnim:"anim-feint-p",aAnim:"anim-block-tricked",spark:"🌀",desc:"虚晃骗格挡"},[`${n.DODGE}_${n.DODGE}`]:{pAnim:"anim-dodge",aAnim:"anim-dodge",spark:null,desc:"双闪空过"},[`${n.BLOCK}_${n.BLOCK}`]:{pAnim:"anim-block",aAnim:"anim-block",spark:null,desc:"双挡空过"},[`${n.FEINT}_${n.FEINT}`]:{pAnim:"anim-idle",aAnim:"anim-idle",spark:null,desc:"双晃空过"},[`${n.DEFLECT}_${n.DEFLECT}`]:{pAnim:"anim-clash-p",aAnim:"anim-clash-a",spark:"⚡",desc:"卸力对碰"}};function gt(e,t){const a=`${e}_${t}`;return ft[a]||{pAnim:"anim-idle",aAnim:"anim-idle",spark:null,desc:""}}function ce(e){return new Promise(t=>setTimeout(t,e))}function Q(e,t,a,s){const i=document.createElement("div"),o=s==="stance"?" stance-dmg":s==="heal"?" heal":"";i.className="float-dmg"+o,i.textContent=a,i.style.left=t.style.left,i.style.top="30%",e.appendChild(i),setTimeout(()=>i.remove(),1300)}function x(e,t,a,s){const i=document.querySelector(e);if(!i)return;const o=i.querySelector(`.stat-row[data-stat="${t}"]`);if(!o)return;const c=o.querySelector(".stat-bar"),l=o.querySelector(".stat-value");c&&(c.style.transition="none",c.style.width=Math.max(0,a/s*100)+"%",c.offsetWidth),l&&(l.textContent=`${Math.max(0,a)}/${s}`)}function R(e,t,a,s,i=500){const o=document.querySelector(e);if(!o)return;const c=o.querySelector(`.stat-row[data-stat="${t}"]`);if(!c)return;const l=c.querySelector(".stat-bar"),r=c.querySelector(".stat-value");l&&(l.style.transition=`width ${i}ms ease`,l.style.width=Math.max(0,a/s*100)+"%"),r&&(r.textContent=`${Math.max(0,Math.round(a))}/${s}`)}function k(e,t,a,s="cost"){const i=document.querySelector(e);if(!i)return;const o=i.querySelector(`.stat-row[data-stat="${t}"]`);if(!o)return;o.style.position="relative";const c=document.createElement("div");c.className=`stat-pop stat-pop-${s}`,c.textContent=a,o.appendChild(c),c.offsetWidth,c.classList.add("stat-pop-show"),setTimeout(()=>{c.classList.add("stat-pop-hide"),c.addEventListener("animationend",()=>c.remove())},1500)}function G(e,t,a){const s=document.querySelector(e);if(!s)return;const i=s.querySelector(`.stat-row[data-stat="${t}"]`);if(!i)return;const o=i.querySelector(".stat-bar");o&&(o.classList.add(a),setTimeout(()=>o.classList.remove(a),800))}function vt(e,t,a){const s=document.createElement("div");s.className="clash-spark",s.innerHTML=`<span class="spark-emoji">${t}</span><span class="spark-desc">${a}</span>`,e.appendChild(s),setTimeout(()=>s.remove(),1200)}function he(e,t,a,s,i){const o=document.createElement("div");return o.className=`action-tag action-tag-${i}`,o.innerHTML=`<span class="at-emoji">${a}</span><span class="at-text">${s}</span>`,o.style.left=t.style.left,e.appendChild(o),o}async function ht(e,t){const a=document.getElementById("arena-stage"),s=document.getElementById("player-fighter"),i=document.getElementById("ai-fighter");if(!a||!s||!i)return;const o=t.history[t.history.length-1],c=o.playerCombat,l=o.aiCombat,r=o.playerDistance,u=o.aiDistance,f=L.MAX_HP,v=L.MAX_STAMINA,d=L.MAX_STANCE,y=o.pStaminaAfterCost,S=o.aStaminaAfterCost,g=e.player.stamina-y,p=e.ai.stamina-S,A=t.player.stamina-y,_=t.ai.stamina-S,I=te[e.distance]||te[2],D=te[t.distance]||te[2];s.style.transition="none",i.style.transition="none",s.style.left=I.player+"%",i.style.left=I.ai+"%";const m=a.querySelector(".arena-dist-line"),T=a.querySelector(".arena-dist-label");m&&(m.style.transition="none",m.style.left=I.player+"%",m.style.width=I.ai-I.player+"%"),T&&(T.textContent=ne[e.distance]),s.offsetWidth,x(".player-side","hp",e.player.hp,f),x(".player-side","stamina",e.player.stamina,v),x(".player-side","stance",e.player.stance,d),x(".ai-side","hp",e.ai.hp,f),x(".ai-side","stamina",e.ai.stamina,v),x(".ai-side","stance",e.ai.stance,d);const ua=Ee[r],pa=Ee[u],ma=M[c],fa=M[l],Be=he(a,s,ua.emoji,X[r],"player"),Fe=he(a,i,pa.emoji,X[u],"ai");t.distance!==e.distance&&(s.style.transition="left 0.6s ease",i.style.transition="left 0.6s ease",m&&(m.style.transition="left 0.6s ease, width 0.6s ease"),s.style.left=D.player+"%",i.style.left=D.ai+"%",m&&(m.style.left=D.player+"%",m.style.width=D.ai-D.player+"%"),T&&(T.textContent=ne[t.distance])),await ce(800),s.style.transition="",i.style.transition="",m&&(m.style.transition=""),Be.classList.add("at-fade"),Fe.classList.add("at-fade"),setTimeout(()=>{Be.remove(),Fe.remove()},350);const Ue=he(a,s,ma.emoji,K[c],"player"),Pe=he(a,i,fa.emoji,K[l],"ai"),Z=gt(c,l);Z.pAnim&&s.classList.add(Z.pAnim),Z.aAnim&&i.classList.add(Z.aAnim),Z.spark&&vt(a,Z.spark,Z.desc),g>0&&(R(".player-side","stamina",y,v,500),k(".player-side","stamina",`-${g} 体力`,"cost"),G(".player-side","stamina","bar-flash-cost")),p>0&&(R(".ai-side","stamina",S,v,500),k(".ai-side","stamina",`-${p} 体力`,"cost"),G(".ai-side","stamina","bar-flash-cost")),await ce(700),Ue.classList.add("at-fade"),Pe.classList.add("at-fade"),setTimeout(()=>{Ue.remove(),Pe.remove()},350);const fe=e.player.hp-t.player.hp,ge=e.ai.hp-t.ai.hp,Y=t.player.stance-e.player.stance,W=t.ai.stance-e.ai.stance,je=L.EXECUTION_DAMAGE,Ge=e.player.stance<d&&t.player.stance===0&&fe>=je,Ke=e.ai.stance<d&&t.ai.stance===0&&ge>=je;fe>0&&(s.classList.add("anim-hit"),Q(a,s,`-${fe}`,"damage"),R(".player-side","hp",t.player.hp,f,500),k(".player-side","hp",`-${fe} 气血`,"cost"),G(".player-side","hp","bar-flash-cost")),ge>0&&(i.classList.add("anim-hit"),Q(a,i,`-${ge}`,"damage"),R(".ai-side","hp",t.ai.hp,f,500),k(".ai-side","hp",`-${ge} 气血`,"cost"),G(".ai-side","hp","bar-flash-cost")),await ce(350),Ge?(R(".player-side","stance",0,d,400),k(".player-side","stance","⚔ 处决!","exec")):Y>0?(Q(a,s,`+${Y} 架势`,"stance"),R(".player-side","stance",t.player.stance,d,400),k(".player-side","stance",`+${Y} 架势`,"warn"),G(".player-side","stance","bar-flash-warn")):Y<0&&(Q(a,s,`${Y} 架势`,"heal"),R(".player-side","stance",t.player.stance,d,400),k(".player-side","stance",`${Y} 架势`,"buff")),Ke?(R(".ai-side","stance",0,d,400),k(".ai-side","stance","⚔ 处决!","exec")):W>0?(Q(a,i,`+${W} 架势`,"stance"),R(".ai-side","stance",t.ai.stance,d,400),k(".ai-side","stance",`+${W} 架势`,"warn"),G(".ai-side","stance","bar-flash-warn")):W<0&&(Q(a,i,`${W} 架势`,"heal"),R(".ai-side","stance",t.ai.stance,d,400),k(".ai-side","stance",`${W} 架势`,"buff")),(Ge||Ke)&&a.classList.add("execution-flash"),await ce(650),A>0&&(R(".player-side","stamina",t.player.stamina,v,400),k(".player-side","stamina",`+${A} 恢复`,"buff"),G(".player-side","stamina","bar-flash-buff")),_>0&&(R(".ai-side","stamina",t.ai.stamina,v,400),k(".ai-side","stamina",`+${_} 恢复`,"buff"),G(".ai-side","stamina","bar-flash-buff")),(A>0||_>0)&&await ce(700);const Xe=["anim-attack-p","anim-attack-a","anim-dodge","anim-hit","anim-shake","anim-slash-p","anim-slash-a","anim-slash-miss","anim-thrust-p","anim-thrust-a","anim-thrust-miss","anim-deflect","anim-deflect-fail","anim-recoil","anim-block","anim-block-hit","anim-block-tricked","anim-feint-p","anim-feint-a","anim-clash-p","anim-clash-a","anim-idle"];s.classList.remove(...Xe),i.classList.remove(...Xe),a.classList.remove("execution-flash")}const ye=document.getElementById("app");let $=null,pe=null,N={distanceCard:null,combatCard:null},ie=[],V=!1,U=null,Ae=!1;function At(){return{isPaused:V,canUndo:ie.length>0}}function Et(){return{onSelect:yt,onConfirm:St,onUndo:bt,onReset:Tt,onNewGame:Ct,onTogglePause:Lt,onDifficultyChange:Dt}}function Te(){$=null,pe=null,N={distanceCard:null,combatCard:null},ie=[],V=!1,Za(ye,we)}function we(e,t,a){U={playerWeapon:e,aiWeapon:t,aiLevel:a},$=oa(e,t,a),pe=null,N={distanceCard:null,combatCard:null},ie=[],V=!1,me()}function me(){qa(ye,$,N,At(),Et()),mt()}function yt(e,t){Ae||V||$.gameOver||(e==="distance"?N.distanceCard=N.distanceCard===t?null:t:N.combatCard=N.combatCard===t?null:t,me())}async function St(){if(Ae||V||$.gameOver||!N.distanceCard||!N.combatCard)return;const e=Ea(N.distanceCard,N.combatCard,$.player,$.distance);if(!e.valid){Ne(e.reason,"warn");return}ie.push(JSON.parse(JSON.stringify($))),pe=JSON.parse(JSON.stringify($));const t=De($),a={distanceCard:N.distanceCard,combatCard:N.combatCard};$=ca($,a,t),N={distanceCard:null,combatCard:null},Ae=!0;const s=ye.querySelector(".game-wrapper");s&&s.classList.add("animating"),me(),await ht(pe,$),Ae=!1,s&&s.classList.remove("animating"),$.gameOver&&pt(ye,$,$t,Te)}function bt(){ie.length!==0&&($=ie.pop(),pe=null,N={distanceCard:null,combatCard:null},V=!1,me())}function Tt(){U&&we(U.playerWeapon,U.aiWeapon,U.aiLevel)}function Ct(){Te()}function $t(){U?we(U.playerWeapon,U.aiWeapon,U.aiLevel):Te()}function Lt(){$.gameOver||(V=!V,me())}function Dt(e){$&&($.aiLevel=e)}Te();
