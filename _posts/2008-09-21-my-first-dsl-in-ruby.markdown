--- 
wordpress_id: 16
title: My first DSL in Ruby
wordpress_url: http://bucionrails.com/?p=16
layout: post
---
I read a <a href="http://www.artima.com/rubycs/articles/ruby_as_dsl.html">few</a> <a href="http://www.artima.com/rubycs/articles/ruby_as_dsl.html">posts</a> about how good fit Ruby is for building DSLs, Domain Specific Languages. Ever the curious I have been waiting for the opportunity to build a very simple one for a particular problem.

Well, I did not have to wait very long (when you have a hammer everything looks like a nail). I needed a quick method which generates nice html graphs for <a href="http://bucionrails.com/2008/09/17/v8-javascript-engine-benchmarks/">my post about browser javascript engine benchmarking</a>. After spending a few minutes searching for a free tool (I did not want anything fluffy, just something very basic) I hit the nail in the head with my hammer. Only the nail was the generated HTML charts for my post and the hammer, (my desire to build) a DSL in Ruby.

I would like to say it was difficult but in fact it was a piece of cake with Ruby (and armed with the knowledge of previous DSL builders). The solution is composed of the following three parts:

<ol>
	<li>The DSL file which defines the charts</li>
	<li>The interpreter which understands the definitions in the DSL file</li>
	<li>The "controller" which just passes the data contained in the DSL file to the interpreter</li>
</ol>

So let's see each part separately:

<strong>browser_js_benchmarks.dsl (the DSL)</strong>
<pre lang="ruby">
chart "Score" do |c|
	c.add "Safari 3.1.2" => 164
	c.add "Firefox 3.0.1" => 156
	c.add "Shiretoko" => 145
	c.add "Google Chrome" => 1589
end
</pre>

<strong>chart.rb (the interpreter)</strong>
<pre lang="ruby">
require "math_aux"

class ChartDSL
	
	Template = %(<table border="0" cellspacing="5" cellpadding="5"><caption>%%CAPTION%%</caption>%%ITEMS%%</table>)
	Background_colors = %w(red blue green yellow grey)
	
	attr_reader :values
	def initialize
		@charts = Array.new
		@values = Hash.new
	end
	
	def chart(name)		
		@name = name
		yield self
		@charts.push(make_html)
	end
	
	def add(name_and_value)
		@values ||= Hash.new
 		@values.merge!(name_and_value)
	end
	
	def load(filename)
		# c = new
		instance_eval(File.read(filename), filename)
		write_output
	end

	def make_html
		sorted_pairs = @values.sort_by { |v| - v[1] }
		vals = sorted_pairs.map { |p| p[1] }
		norm_values = MathAux::normalize(vals, 100.0)
		html = Array.new
		sorted_pairs.each_with_index do |pair, i|
			name, value = pair
			html.push(%Q(<tr><td>#{name}</td><td><div style="width:#{norm_values[i]}px;background-color:#{ChartDSL::Background_colors[i]}">&nbsp;</div></td><td>#{value}</td></tr>))
		end
		filled_chart = ChartDSL::Template.sub("%%CAPTION%%", @name)		
		filled_chart.sub("%%ITEMS%%", html.join)
	end
	
	def write_output
		File.open("generated_charts.html", "w") do |f|
			f.write(@charts)
		end
	end
end

</pre>
<strong>chart_loader.rb (the controller)</strong>
<pre lang="ruby">
require "chart"
class ChartLoader
	def self.load_chart(dsl_filename)
		c = ChartDSL.new
		c.load(dsl_filename)
	end
end

if __FILE__ == $0
	ChartLoader.load_chart(ARGV[0])
end
</pre>

For the sake of completeness here is <strong>math_aux.rb</strong>:
<pre lang="ruby">
module MathAux
	def self.normalize(numbers, to=1.0)
		norm_rat = to / numbers.max
		numbers.map { |n| n * norm_rat }
	end
end
</pre>

To generate the charts, one only has to run "the interpreter" with a dsl file as the first parameter:

<pre lang="ruby">
ruby chart_loader.rb browser_js_benchmarks.dsl
</pre>

The output is called generated_charts.html and contains the following:
<pre lang="xml">
<table border="0" cellspacing="5" cellpadding="5">
<caption>Score</caption>
 <tr>
  <td>Google Chrome</td>
  <td><div style="width:100.0px;background-color:red">&nbsp;</div></td>
  <td>1589</td>
 </tr>
 <tr>
  <td>Safari 3.1.2</td>
  <td><div style="width:10.3209565764632px;background-color:blue">&nbsp;</div</td>  <td>164</td></tr>
 <tr>
  <td>Firefox 3.0.1</td>
  <td><div style="width:9.81749528005034px;background-color:green">&nbsp;</div</td> <td>156</td>
</tr>
<tr>
 <td>Shiretoko</td>
 <td><div style="width:9.12523599748269px;background-color:yellow">&nbsp;</div</td><td>145</td>
</tr>
</table>
</pre>

Note that in ~30-40 code lines we have a "language interpreter", one that understands the chart DSL and spits out some HTML code that represents the charts. Of course there is plenty of room for improvement, like having the same color denote the same actor between charts (Firefox 3.0.1 should always be the blue bar, for example, unlike in <a href="http://bucionrails.com/2008/09/17/v8-javascript-engine-benchmarks/">my post</a>), using a better solution for the template strings, adding the possibility of pie charts (although "standard" HTML is not very flexible on different chart forms, one would probably have to use a <a href="http://developer.mozilla.org/en/Canvas_tutorial">&lt;canvas&gt; </a>), and so on.

The essential thing is that it works and it does what the particular situation demanded. It took me a couple of interrupted hours plus the time to read through two related posts which is not that much given that I now have a "tool" (once again, I feel a bit conceited to call it that) which I can use for my future posts whenever the need arises. A custom hammer for my custom nail.

(If you care, feel free to download, use and modify the source code located <a href="http://github.com/balinterdi/chart-maker-dsl/tree/master">here</a>)
