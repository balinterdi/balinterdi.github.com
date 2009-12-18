--- 
wordpress_id: 32
title: A ruby-style currency converter
wordpress_url: http://bucionrails.com/?p=32
layout: post
---
Though it is said that we live in a highly-globalized world, all countries still have their own proper currency (with one exception that I know of, the euro) so we still need to convert between them. If one is used to shop online (and one is) the need to get the price in the <a href="http://en.wikipedia.org/wiki/Hungarian_forint" target="_blank">national currency</a> occurs quite often. Going to a currency converter page is not much of a hassle but it still takes too much time and it seemed an overshoot to use a browser for this task. Inspired by Rails's date calculations extensions (where you could write 3.days.ago), I decided to create something similar and see how much flying to <a href="http://euruko2009.org/">Barcelona</a> or buying a <a href="http://pragprog.com/">PragProg</a> book costs from the command line.

<pre lang="ruby">

require "net/http"
require "open-uri"
require "hpricot"

# makes 1284.eur.to.usd types of queries possible
class CurrencyConverter
 
  Currencies = { :huf => "HUF", :eur => "EUR", :usd => "USD", :gbp => "GBP", :chf => "CHF" }
 
  # these methods "close" the quote.
  # when they are called, it means all data is ready
  # the quote can be sent.
  class_eval do
    Currencies.each_key do |curr|
      define_method curr do
        @to = curr
        calculate
      end
    end
  end
 
  def initialize(amount, from=nil, to=nil)
    @amount = amount
    @from = from
    @to = to
  end
 
  def send_request_for_quote
   from_as_param = @from.to_s.upcase
   to_as_param = @to.to_s.upcase
   url = "http://xurrency.com/#{[@amount, @from, @to].join('/')}/feed"
   doc = Hpricot(open(url).read)
   (doc/'dc:value').inner_html
  end
 
  def calculate
    send_request_for_quote
  end

  def to
    self
  end
 
end

class Fixnum 
  def method_missing(name)
    CurrencyConverter.new(self, name)   
  end
end
</pre>

Thanks to ruby's open classes, the code is quite terse (you can also see and download the raw script from <a href="http://www.pastie.org/362737">here</a>). Now you can fire up irb and do all the conversions you want:

<pre lang="shell">
$ irb -r currency_converter.rb 
irb(main):001:0> 23.eur.to.huf
=> "6473.3500"
irb(main):002:0> 1.usd.to.eur
=> "0.7642"
</pre>

Or do it through the ruby interpreter:

<pre lang="shell">
$ ruby -r rubygems -r currency_converter.rb -e "puts 1.eur.to.usd"
1.3085
</pre>


I find it very pleasing to be able to write "10.eur.to.usd" since it is so close to our spoken, human language. One of ruby's numerous charms. 

My friend, <a href="http://www.rubyrailways.com/">Peter</a> sent a more general solution that uses html scraping with <a href="http://scrubyt.org/">Scrubyt</a> and the conversion capabilities of Google search:

<pre lang="ruby">
require 'rubygems'
require 'cgi'
require 'scrubyt'

begin
google_converter = Scrubyt::Extractor.define do
  fetch "http://www.google.com/search?q=#{CGI::escape(ARGV[0])}+#{CGI::escape(ARGV[1])}+to+#{CGI::escape(ARGV[2])}"
  
  google_result "//td[@dir='ltr']" do
    final_result(/= (.+) /)
  end
end
  puts google_converter.to_hash[0][:final_result]
rescue
  puts "Sorry, even *google* can't translate that!"
end
</pre>

Using this you can convert amounts between any two currencies (distances, weights, etc., everything that Google search can handle):

<pre lang="shell">
$ ruby conv.rb 30 EUR HUF
</pre>

It may be swimming against the current but I like solutions that do not need the browser for simple problems like this one. I scratched my itch and hopefully scratched yours, too.
