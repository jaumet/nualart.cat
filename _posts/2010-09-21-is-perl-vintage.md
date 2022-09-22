---
id: 526
title: Is Perl vintage?
date: 2010-09-21T17:05:08+00:00
author: jaume
layout: post
guid: http://nualart.cat/?p=526
permalink: /2010/09/is-perl-vintage/
categories:
  - català
  - code
  - english
---
<p style="text-align: center;">
  <a href="http://nualart.cat/wp-content/uploads/2010/09/camel_head.png" onclick="_gaq.push(['_trackEvent', 'outbound-article', 'http://nualart.cat/wp-content/uploads/2010/09/camel_head.png', '']);" ><img class="aligncenter size-full wp-image-530" title="camel_head" src="http://nualart.cat/wp-content/uploads/2010/09/camel_head.png" alt="" width="60" height="65" /></a>
</p>

<p style="text-align: center;">
  &nbsp;
</p>

<p style="text-align: center;">
  <strong>*     *     *</strong>
</p>

<p style="text-align: center;">
  &nbsp;
</p>

> <pre>Can't call method "prepare" on an undefined value at /usr/local/share/perl/5.10.0/WDBI.pm line 425.

Trace begun at /usr/share/perl5/HTML/Mason/Exceptions.pm line 129
HTML::Mason::Exceptions::rethrow_exception('Can\'t call method "prepare" on an undefined value at /usr/local/share/perl/5.10.0/WDBI.pm line 425.^J') called at /usr/local/share/perl/5.10.0/WDBI.pm line 425
WDBI::query0('SELECT *,wdbi.acl_mask(acl,?) as mask FROM kiki_explorer WHERE path=?', 'public ', '/about/') called at /usr/local/share/perl/5.10.0/WDBI.pm line 387
WDBI::queryH('SELECT *,wdbi.acl_mask(acl,?) as mask FROM kiki_explorer WHERE path=?', 'public ', '/about/') called at /usr/local/share/perl/5.10.0/WDBI.pm line 363
WDBI::query_h('SELECT *,wdbi.acl_mask(acl,?) as mask FROM kiki_explorer WHERE path=?', 'public ', '/about/') called at /home/slix/htdocs/sl/autohandler line 138
HTML::Mason::Commands::__ANON__ at /usr/share/perl5/HTML/Mason/Component.pm line 135
HTML::Mason::Component::run('HTML::Mason::Component::FileBased=HASH(0x99ec468)') called at /usr/share/perl5/HTML/Mason/Request.pm line 1273
eval {...} at /usr/share/perl5/HTML/Mason/Request.pm line 1268
HTML::Mason::Request::comp(undef, undef, undef) called at /usr/share/perl5/HTML/Mason/Request.pm line 467
eval {...} at /usr/share/perl5/HTML/Mason/Request.pm line 467
eval {...} at /usr/share/perl5/HTML/Mason/Request.pm line 419
HTML::Mason::Request::exec('HTML::Mason::Request::ApacheHandler=HASH(0x93f1860)') called at /usr/share/perl5/HTML/Mason/ApacheHandler.pm line 165
HTML::Mason::Request::ApacheHandler::exec('HTML::Mason::Request::ApacheHandler=HASH(0x93f1860)') called at /usr/share/perl5/HTML/Mason/ApacheHandler.pm line 831
HTML::Mason::ApacheHandler::handle_request('HTML::Mason::ApacheHandler=HASH(0x98172f8)', 'Apache2::RequestRec=SCALAR(0x99e0c90)') called at (eval 34) line 8
HTML::Mason::ApacheHandler::handler('HTML::Mason::ApacheHandler', 'Apache2::RequestRec=SCALAR(0x99e0c90)') called at -e line 0
eval {...} at -e line 0</pre>

perdoneu la fricada 😛

_sobre <a href="http://www.perl.org/" onclick="_gaq.push(['_trackEvent', 'outbound-article', 'http://www.perl.org/', 'Perl']);" >Perl</a>_ >>

<div class="addtoany_share_save_container addtoany_content_bottom">
  <div class="a2a_kit a2a_kit_size_32 addtoany_list a2a_target" id="wpa2a_49">
    <a href="https://www.addtoany.com/share" onclick="_gaq.push(['_trackEvent', 'outbound-article', 'https://www.addtoany.com/share', 'Share/Comparteix']);" class="a2a_dd addtoany_share_save"  style="background:url(http://nualart.cat/wp-content/plugins/add-to-any/share_16_16.png) no-repeat scroll 4px 0px;padding:0 0 0 25px;display:inline-block;height:16px;vertical-align:middle"><span>Share/Comparteix</span></a>
  </div>
</div>