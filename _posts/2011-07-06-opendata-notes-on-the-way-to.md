---
id: 688
title: '#Opendata: notes on the way to (I)'
date: 2011-07-06T23:45:24+00:00
author: jaume
layout: post
guid: http://nualart.cat/?p=688
permalink: /2011/07/opendata-notes-on-the-way-to/
categories:
  - code
  - drets/rights
  - english
  - visualizations
  - writings
---
### Opendata world is here!

After the age of hardware, came the age of software. From now on the age of data is here.

Why Now?

> <a href="http://www.nytimes.com/2011/07/03/business/global/03world.html?_r=1&ref=worldbank" onclick="_gaq.push(['_trackEvent', 'outbound-article', 'http://www.nytimes.com/2011/07/03/business/global/03world.html?_r=1&ref=worldbank', 'World Bank Is Opening Its Treasure Chest of Data']);" title="world bank opendata">World Bank Is Opening Its Treasure Chest of Data</a>
> 
> At least, this is a funny reason for a ephemeral

As a visualization tools and interface fan, since sometime ago I took notes talking with several people and finding out what are the main problems when you try to work with the new opendata repos.

<div id="magicdomid12">
  First the name: opendata: open? Sounds very curious that USA, UK, AU, NZ use the simple name of &#8220;data&#8221;. Because these governments are publishing public data. The rest of the countries, that have started the data projects right now, are taking the name Open Data to refer to the same project. For me, coming from latin-mediterranean culture, this &#8220;open&#8221; means that there is and there will be a lot of &#8220;close&#8221;. I will suggest to name it: public data,
</div>

Second, the formats. I suggest to the public institutions to publish their datasets in several formats at the same time. Of course I&#8217;m talking about free formats like the stantards: CSV. ODS, XML/RDF, KML, JSON, &#8230; We can open a public discussion on which free formats we prefer. With a standarization of the published formats we can achieve at least two goals: in one hand lots of people will not be wasting any more time in order to convert files. The conversion is far  from being an easy reproducible process; the software versions of the file editors and the converters can mess around.

<div>
  In the other hand, a fixed list of formats coming directly from the source of the data will make easier the references to a concrete dataset -for example: &#8221; I took the dataset from July, 4th in CSV from data.gov.xx&#8221;.
</div>

&nbsp;

<h3 style="text-align: center;">
  <a href="http://nualart.cat/wp-content/uploads/2011/07/Data-streamcircle.gif" onclick="_gaq.push(['_trackEvent', 'outbound-article', 'http://nualart.cat/wp-content/uploads/2011/07/Data-streamcircle.gif', '']);" ><img class="size-full wp-image-693  " title="Data-stream(circle)" src="http://nualart.cat/wp-content/uploads/2011/07/Data-streamcircle.gif" alt="" width="100" height="100" srcset="http://nualart.cat/wp-content/uploads/2011/07/Data-streamcircle.gif 100w, http://nualart.cat/wp-content/uploads/2011/07/Data-streamcircle-36x36.gif 36w" sizes="(max-width: 100px) 100vw, 100px" /></a>
</h3>

<p style="text-align: center;">
  <span style="color: #808080;"><em>ei, people, data is loading!</em></span>
</p>

##  Data life

I see every public dataset as a work-in-progress. Most of the public datasets can be improved. Quite often the data is not accurate, contains errors or can be either updated and extended. All the improvements will create a real life of every dataset, a timeline of the history of the dataset. For example: the <a href="http://dadesobertes.gencat.cat/ca/dades-obertes/dataset_000026.html" onclick="_gaq.push(['_trackEvent', 'outbound-article', 'http://dadesobertes.gencat.cat/ca/dades-obertes/dataset_000026.html', 'list of all the public buildings in Catalonia']);" title="dades obertes generalitat de catalunya"  target="_blank">list of all the public buildings in Catalonia</a> (Catalan Government) I dived into this dataset. It is great to have it, but we need to improve a lot more the geo location of the buildings. the ones who can better improve this dataset are the citizens and specially the data workers. All the efforts to clean and improve a dataset must be put together, so we do not lose them.

<div id="magicdomid79">
  Data needs to be considered in time, with versions and changes. This is why I propose to use version control softwares in order  to follow the evolution of the datasets. To be more specific, I will start to store my data in a <a href="http://en.wikipedia.org/wiki/Git_(software)" onclick="_gaq.push(['_trackEvent', 'outbound-article', 'http://en.wikipedia.org/wiki/Git_(software)', 'GIT']);" title="Git (wikipedia)"  target="_blank">GIT</a> server. probably <a href="http://github.com" onclick="_gaq.push(['_trackEvent', 'outbound-article', 'http://github.com', 'Github']);" title="Github"  target="_blank">Github</a> at the beginning.
</div>

<div id="magicdomid97">
  An advanced control system like GIT allows:
</div>

<div id="magicdomid28">
  <ul>
    <li>
      to follow the evolution of the datasets (contributors, contributions, time)
    </li>
    <li>
      to be sure that two or more are using exactly the same dataset
    </li>
    <li>
      to improve the dataset with a simple <a href="http://www.kernel.org/pub/software/scm/git/docs/user-manual.html#sharing-development" onclick="_gaq.push(['_trackEvent', 'outbound-article', 'http://www.kernel.org/pub/software/scm/git/docs/user-manual.html#sharing-development', 'git pull request']);" title="Git manual">git pull request</a>
    </li>
  </ul>
</div>

  * to publish a dataset as a software release
  * changing thedataset with a simple <a href="http://help.github.com/fork-a-repo/" onclick="_gaq.push(['_trackEvent', 'outbound-article', 'http://help.github.com/fork-a-repo/', 'git fork']);" title="github manual">git fork</a>
  * to use live & dynamic data reading directly  from the repository.
  * &#8230; and a lot of new ideas that will come out&#8230;

<div>
  <div id="magicdomid107">
    The data time is here and the people needs public data to control the power. Whereas information is power, public data is the power of the multitude.
  </div>
</div>

&nbsp;

<div class="addtoany_share_save_container addtoany_content_bottom">
  <div class="a2a_kit a2a_kit_size_32 addtoany_list a2a_target" id="wpa2a_65">
    <a href="https://www.addtoany.com/share" onclick="_gaq.push(['_trackEvent', 'outbound-article', 'https://www.addtoany.com/share', 'Share/Comparteix']);" class="a2a_dd addtoany_share_save"  style="background:url(http://nualart.cat/wp-content/plugins/add-to-any/share_16_16.png) no-repeat scroll 4px 0px;padding:0 0 0 25px;display:inline-block;height:16px;vertical-align:middle"><span>Share/Comparteix</span></a>
  </div>
</div>